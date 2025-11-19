import React, { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { fetchAllProducts } from "../data/fetchProducts";
import { useNavigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * WishlistPage: shows products in wishlist and allows moving to cart or remove.
 */
export default function WishlistPage() {
  const { wishlistIds, removeFromWishlist, getWishlistIds, clearWishlist } = useWishlist();
  const { addToCart, items: cartItems } = useCart();
  const [products, setProducts] = useState(null); // all products for matching wishlist
  const navigate = useNavigate();

  // Load all products to filter by wishlistIds
  useEffect(() => {
    let active = true;
    fetchAllProducts().then((prods) => {
      if (active) setProducts(prods);
    });
    return () => (active = false);
  }, []);

  const wishIds = getWishlistIds();

  // Find products matching those in wishlist
  const wishlistedProducts =
    products && wishIds && wishIds.length > 0
      ? products.filter((p) => wishIds.includes(p.id))
      : [];

  // Utilities
  function isInCart(productId) {
    return cartItems.find((i) => i.id === productId);
  }

  // Accessibility: handle enter/space for move-to-cart/remove
  function handleKeyAction(fn) {
    return (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fn();
      }
    };
  }

  return (
    <div className="ocean-main-container" style={{minHeight:"66vh", maxWidth: 900, margin: "0 auto"}}>
      <h1 style={{
        fontWeight: 800,
        fontSize:"2.1em",
        color: "var(--primary)",
        marginBottom: ".7em",
        letterSpacing: "-0.016em"
      }}>
        Your Wishlist
      </h1>
      {(!wishIds || wishIds.length === 0) && (
        <div style={{ color: "#8898aa", fontWeight: 600, marginTop: "2.5em", fontSize: "1.18em" }}>
          Your wishlist is empty. Browse products and add items!
        </div>
      )}
      {!!wishIds.length && (
        <div style={{marginTop: "0.2em", marginBottom:"1.05em", display:'flex', gap:'0.8em', alignItems:'flex-end'}}>
          <button
            className="ocean-btn"
            style={{fontWeight:700, minWidth:120}}
            onClick={clearWishlist}
            aria-label="Clear all items from wishlist"
          >Clear Wishlist</button>
        </div>
      )}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "1.45em",
          margin: "1.2em 0",
        }}
        aria-label="Wishlisted products"
      >
        {wishlistedProducts && wishlistedProducts.length > 0 ? (
          wishlistedProducts.map((p) => {
            const inCart = isInCart(p.id);
            return (
              <div
                key={p.id}
                className="ocean-card ocean-rounded-md ocean-shadow"
                role="group"
                aria-label={p.name}
                style={{
                  display: "flex",
                  gap: "1em",
                  alignItems: "center",
                  background: "var(--surface)",
                  border: "1.5px solid var(--border-color,#e6e3f7)",
                  position:"relative"
                }}
              >
                <button
                  aria-label="View detail"
                  title="View product detail"
                  className="ocean-card-media"
                  tabIndex={0}
                  style={{
                    border: "none",
                    background: "none",
                    minWidth: 112,
                    width: 112,
                    maxHeight: 105,
                    cursor: "pointer",
                    borderRadius: 13,
                  }}
                  onClick={() => navigate(`/product/${p.id}`)}
                  onKeyDown={handleKeyAction(()=>navigate(`/product/${p.id}`))}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: 87,
                      objectFit: "cover",
                      borderRadius: 13,
                      background: "var(--background)",
                      boxShadow: "0 1px 7px #af80fa16",
                    }}
                  />
                </button>
                <div style={{ flex: 1, minWidth:0, textAlign: "left" }}>
                  <div className="ocean-chip" style={{background:"var(--primary)"}}>{p.category}</div>
                  <div style={{ fontWeight:800, fontSize:"1.18em", color:"var(--text)", textOverflow:"ellipsis", overflow:"hidden", whiteSpace:"nowrap", maxWidth:210 }}>{p.name}</div>
                  <div style={{ fontWeight:600, color:"var(--secondary)", marginTop:"0.21em"}}>${p.price.toFixed(2)}</div>
                  <div style={{ margin:".19em 0 0.09em 0", color:"#777", fontSize:"1.01em" }}>{p.shortDesc}</div>
                  <div style={{ display:"flex", gap:".5em", marginTop:"0.4em" }}>
                    <button
                      className="ocean-btn"
                      style={{minWidth:110, fontWeight:660}}
                      aria-label={inCart ? "Already in cart" : `Move ${p.name} to cart`}
                      disabled={inCart}
                      tabIndex={0}
                      onClick={()=> addToCart(p, 1)}
                    >
                      {inCart ? "In Cart" : "Move to Cart"}
                    </button>
                    <button
                      className="ocean-btn secondary"
                      style={{background:"var(--error)", color:"#fff", fontWeight:700}}
                      aria-label={`Remove ${p.name} from wishlist`}
                      tabIndex={0}
                      onClick={()=>removeFromWishlist(p.id)}
                    >Remove</button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          wishIds.length > 0 && (
            <div style={{gridColumn:"1/-1", color:"#6c81a1", fontWeight:600, fontSize:"1.14em", marginTop:"2.5em"}}>
              No products found in your wishlist. (Product data may be missing)
            </div>
          )
        )}
      </section>
    </div>
  );
}
