import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// PUBLIC_INTERFACE
function ProductCard({ product }) {
  const navigate = useNavigate();
  const {
    addToCart,
    items,
    incrementQty,
    decrementQty,
    removeFromCart,
    updateQty
  } = useCart();

  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist();

  // Find if this product is in cart already
  const item = items.find(i => i.id === product.id);

  // Wishlisted state
  const wished = isWishlisted(product.id);

  return (
    <div className="ocean-card ocean-transition ocean-rounded-md" tabIndex={0}
      aria-label={product.name}
      style={{
        cursor: 'pointer',
        display:'flex',
        flexDirection:'column',
        position: 'relative'
      }}
      onClick={() => navigate(`/product/${product.id}`)}
      onKeyDown={e => e.key==='Enter' && navigate(`/product/${product.id}`)}
    >
      {/* Wishlist Heart Button (top right, overlay) */}
      <button
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        title={wished ? "Remove from wishlist" : "Add to wishlist"}
        className="ocean-btn secondary"
        style={{
          position: "absolute",
          top: 13,
          right: 13,
          background: wished ? "var(--primary)" : "var(--secondary)",
          color: wished ? "#fff" : "#23182b",
          borderRadius: "50%",
          padding: "0.37em 0.42em",
          minWidth: 0,
          width: 36,
          height: 36,
          zIndex: 1,
          boxShadow: "0 1px 10px #bdcafe31",
          outline: wished ? "2px solid var(--primary)" : undefined,
          border: 0,
        }}
        tabIndex={0}
        onClick={e => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        onKeyDown={e => {
          // Support space/enter for accessibility
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }
        }}
        aria-pressed={wished}
      >
        {/* Accessible heart SVG, visually filled when active */}
        <svg viewBox="0 0 26 26" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M13 22c-.56-.41-5.7-4.23-8.18-7.19C2.13 12.63 1.5 10.95 1.5 9.29c0-3.41 2.6-5.79 5.29-5.79 1.84 0 3.6.99 4.49 2.5.89-1.51 2.65-2.5 4.49-2.5 2.69 0 5.29 2.38 5.29 5.79 0 1.66-.62 3.34-3.32 5.52C18.7 17.77 13.56 21.59 13 22Z"
            stroke={wished ? "#fff" : "var(--primary)"}
            strokeWidth="2"
            fill={wished ? "var(--primary)" : "none"}
          />
        </svg>
      </button>
      <img
        src={product.image}
        srcSet={
          process.env.REACT_APP_API_BASE
            ? `${product.image}?w=360 360w,${product.image}?w=600 600w,${product.image}?w=880 880w`
            : `${product.image}`
        }
        sizes="(max-width: 600px) 92vw, (max-width: 1000px) 44vw, 340px"
        alt={product.name}
        className="ocean-card-media"
        style={{
          aspectRatio: "4/3",
          objectFit: "cover",
          width: "100%",
          display: "block",
          background: "var(--surface)",
          borderRadius: "var(--radius-sm)",
          transition: "box-shadow 0.19s",
          minHeight: 0 // fallback if height auto
        }}
        loading="lazy"
      />
      <div style={{ flex:1, textAlign:'left', paddingBottom:'0.75em' }}>
        <div style={{ color: 'var(--secondary)', fontWeight:600, fontSize:'0.89em', marginBottom:'0.25em' }}>
          {product.category}
        </div>
        <div style={{ fontWeight:700, fontSize:'1.18em', color: 'var(--text)' }}>{product.name}</div>
        <div style={{ color: '#334155', fontSize:'0.98em', margin:'0.2em 0' }}>{product.shortDesc}</div>
        <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize:'1.04em', margin:'0.22em 0'}}> ${product.price.toFixed(2)} </div>
        <div style={{ display:'flex', gap:'.2em', alignItems:'center'}}>
          <span className="ocean-chip" style={{background:'var(--primary)', fontSize:'0.87em'}}>★ {product.rating}</span>
          <span className="ocean-chip" style={{background:'var(--secondary)', fontSize:'0.87em'}}>{product.material}</span>
        </div>
      </div>
      {!item ? (
        <button
          className="ocean-btn"
          style={{ marginTop: '0.6em', alignSelf:'flex-start' }}
          tabIndex={0}
          onClick={e => { e.stopPropagation(); addToCart(product, 1); }}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      ) : (
        <div style={{
          marginTop: '0.6em',
          alignSelf: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          gap: '0.26em'
        }}>
          <button
            className="ocean-btn secondary"
            aria-label={`Decrease quantity of ${product.name}`}
            style={{
              fontSize: "1.22em",
              fontWeight: 700,
              padding: "0.20em 0.72em",
              borderRadius: 10
            }}
            tabIndex={0}
            onClick={e => { e.stopPropagation(); decrementQty(product.id); }}
            disabled={item.qty <= 1}
          >–</button>
          <input
            type="number"
            min={1}
            max={99}
            value={item.qty}
            aria-label={`Set quantity for ${product.name}`}
            style={{
              width: 34,
              textAlign: 'center',
              fontWeight: 700,
              border: '1.5px solid #dbeafe',
              borderRadius: 8,
              padding: '0.18em 0.13em',
              fontSize: "1.04em",
              background: "var(--surface)"
            }}
            onClick={e => e.stopPropagation()}
            onChange={e => {
              let v = Math.max(parseInt(e.target.value || 1, 10), 1);
              updateQty(product.id, v);
            }}
          />
          <button
            className="ocean-btn secondary"
            aria-label={`Increase quantity of ${product.name}`}
            style={{
              fontSize: "1.22em",
              fontWeight: 700,
              padding: "0.20em 0.72em",
              borderRadius: 10
            }}
            tabIndex={0}
            onClick={e => { e.stopPropagation(); incrementQty(product.id); }}
            disabled={item.qty >= 99}
          >+</button>
          <button
            className="ocean-btn"
            style={{
              marginLeft: '0.55em',
              fontSize: "0.98em",
              padding: "0.29em 0.9em",
              fontWeight: 700,
              background: "var(--error)",
              color: "#fff",
              borderRadius: 8
            }}
            aria-label={`Remove ${product.name} from cart`}
            tabIndex={0}
            onClick={e => { e.stopPropagation(); removeFromCart(product.id); }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
export default ProductCard;
