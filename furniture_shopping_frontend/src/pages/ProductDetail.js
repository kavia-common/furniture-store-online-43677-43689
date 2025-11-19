import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../data/fetchProducts';
import { useCart } from '../context/CartContext';
import ReviewSummary from '../components/ReviewSummary';
import ReviewsList from '../components/ReviewsList';
import ReviewForm from '../components/ReviewForm';
import mockReviews from '../data/mockReviews';

function getHighResUrl(img, size = 1200) {
  // If backend exists, append ?w=SIZE for demo, else fallback to mock/standard URL.
  if (process.env.REACT_APP_API_BASE && img && typeof img === "string") {
    return `${img}?w=${size}`;
  }
  return img;
}

/**
 * PUBLIC_INTERFACE
 * ProductDetail page: Shows product detail and reviews section beneath.
 */
export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const {
    addToCart,
    items,
    incrementQty,
    decrementQty,
    removeFromCart,
    updateQty,
    getLineTotal
  } = useCart();

  // Reviews state and fetch logic
  const [reviews, setReviews] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const reviewsSectionRef = useRef(null);

  // GALLERY state: for hero/zoom and modal
  const [modal, setModal] = useState({ open: false, imgIdx: 0 });
  const [hoverZoom, setHoverZoom] = useState(false);

  // Helper to fetch reviews (api or mock)
  useEffect(() => {
    let isMounted = true;
    const apiBase = process.env.REACT_APP_API_BASE;
    setLoadingReviews(true);
    if (apiBase) {
      fetch(`${apiBase.replace(/\/$/, "")}/products/${id}/reviews`)
        .then(resp => {
          if (!resp.ok) throw new Error("Failed");
          return resp.json();
        })
        .then(data => { if (isMounted) setReviews(data); })
        .catch(() => {
          if (isMounted) setReviews(mockReviews[id] || []);
        })
        .finally(() => { if (isMounted) setLoadingReviews(false); });
    } else {
      setReviews(mockReviews[id] ? [...mockReviews[id]] : []);
      setLoadingReviews(false);
    }
    return () => { isMounted = false; };
  }, [id]);

  // Handle new review (locally in state if using mock)
  function addReviewLocal(newReviewInput) {
    // newReviewInput may be either:
    // - {name, rating, comment, images: [{url, name}] (local)}
    // - FormData if backend (API base set)
    const apiBase = process.env.REACT_APP_API_BASE;
    if (apiBase && newReviewInput instanceof FormData) {
      // PREP: API stub for backend integration (NOT invoked here)
      return;
    }
    const newReview = {
      id:
        "r" +
        Math.random().toString(36).substring(2, 9) +
        Date.now().toString().slice(-5),
      ...newReviewInput,
      date: new Date().toISOString().slice(0, 10)
    };
    setReviews(prev => [...(prev || []), newReview]);
  }

  // Smooth scroll for anchor link (#reviews)
  useEffect(() => {
    if (
      window.location.hash === "#reviews" &&
      reviewsSectionRef.current
    ) {
      setTimeout(() => {
        reviewsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchProductById(id).then(res => { if (active) setProduct(res); });
    return () => { active = false }
  }, [id]);

  // Keyboard navigation for modal
  useEffect(() => {
    if (!modal.open) return;
    function onKey(e) {
      if (!modal.open) return;
      if (e.key === "Escape") setModal({ open: false, imgIdx: 0 });
      // (extend to gallery/many images later)
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  if (!product) {
    return <div className="ocean-main-container"><div className="ocean-card ocean-skeleton" style={{height:350}} /></div>;
  }

  // For demo, only one image; prepare for gallery support
  const galleryImages = [
    {
      url: getHighResUrl(product.image, 1280),
      thumb: product.image,
      alt: product.name
    }
  ];

  const currentImg = galleryImages[modal.imgIdx];

  return (
    <div className="ocean-main-container" style={{display:'flex', flexDirection:"column", alignItems:'center', paddingTop:'2rem', minHeight:'56vh'}}>
      <div className="ocean-card ocean-shadow ocean-rounded" style={{
        maxWidth: '670px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* HERO product image / gallery */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/3",
            background: "var(--surface)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "1.5px solid var(--border-color,#e6e3f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img
            src={getHighResUrl(product.image, 880)}
            srcSet={
              process.env.REACT_APP_API_BASE
                ? `${getHighResUrl(product.image, 400)} 400w,${getHighResUrl(product.image, 680)} 680w,${getHighResUrl(product.image, 1000)} 1000w,${getHighResUrl(product.image, 1280)} 1280w`
                : `${product.image}`
            }
            sizes="(max-width:600px) 100vw, (max-width:1200px) 70vw, 670px"
            alt={product.name}
            loading="lazy"
            style={{
              objectFit: hoverZoom ? "cover" : "cover",
              width: "100%",
              height: "100%",
              borderRadius: "var(--radius-lg)",
              filter: hoverZoom ? "brightness(1.04) contrast(1.04)" : undefined,
              cursor: "zoom-in",
              transition: "box-shadow 0.21s,filter .18s",
              willChange: hoverZoom ? "transform" : undefined,
              transform: hoverZoom ? "scale(1.14)" : "scale(1)",
              aspectRatio: "4 / 3"
            }}
            tabIndex={0}
            aria-label={`View full size image of ${product.name}`}
            onMouseEnter={()=>setHoverZoom(true)}
            onMouseLeave={()=>setHoverZoom(false)}
            onClick={() => setModal({ open: true, imgIdx: 0 })}
            onKeyDown={e => (e.key === "Enter" || e.key === " ") && setModal({ open: true, imgIdx: 0 })}
          />
          <button
            aria-label="View full screen"
            style={{
              position: "absolute",
              bottom: 10, right: 12,
              zIndex: 2,
              background: "rgba(22,22,40,0.67)",
              color: "#fff",
              border: 0,
              borderRadius: 13,
              padding: "8px 10px",
              fontWeight: 700,
              fontSize: "1em",
              cursor: "pointer",
              boxShadow: "0 2px 8px #20284547",
              transition: "background .16s,color .17s"
            }}
            onClick={() => setModal({ open: true, imgIdx: 0 })}
          >
            <span style={{fontSize:"1.3em",verticalAlign:'middle'}}>🔍</span>
            <span aria-hidden="true" style={{marginLeft:5}}>Full Screen</span>
          </button>
        </div>

        {/* Modal lightbox for hero image */}
        {modal.open && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} - Full screen Image`}
            tabIndex={-1}
            style={{
              position: "fixed",
              zIndex: 11000,
              left: 0, top: 0, right: 0, bottom: 0,
              background: "rgba(18, 19, 27, 0.97)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background .2s"
            }}
            onClick={() => setModal({ open: false, imgIdx: 0 })}
          >
            <img
              src={getHighResUrl(product.image, 1800)}
              alt={product.name}
              style={{
                maxWidth: "96vw",
                maxHeight: "85vh",
                boxShadow: "0 12px 90px #230850d0",
                border: "7px solid var(--surface,#fff)",
                borderRadius: 20,
                objectFit: "contain",
                background: "var(--surface,#fff)",
                transition: "box-shadow 0.21s",
                display: "block"
              }}
              tabIndex={0}
              onClick={e => e.stopPropagation()}
              onKeyDown={e => {
                if (e.key === "Escape") setModal({ open: false, imgIdx: 0 });
              }}
            />
            <button
              aria-label="Close image"
              style={{
                position: "absolute",
                top: 26, right: 30,
                background: "var(--primary)",
                color: "#fff",
                borderRadius: "50%",
                border: "none",
                fontWeight: 900,
                width: 50, height: 50,
                fontSize: "2em",
                cursor: "pointer",
                boxShadow: "0 4px 44px #23233877"
              }}
              onClick={e => {
                e.stopPropagation();
                setModal({ open: false, imgIdx: 0 });
              }}
              tabIndex={0}
            >×</button>
          </div>
        )}

        {/* Thumbnail gallery (future: support more than one image) */}
        <div style={{display:"flex", gap:"1em", margin:"0.3em 0 0", alignItems:"center", justifyContent:"center"}}>
          {galleryImages.map((im, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Show ${im.alt}`}
              tabIndex={0}
              style={{
                aspectRatio: '4/3',
                width: 94,
                height: "auto",
                background: "var(--background)",
                border: idx === modal.imgIdx ? "2.6px solid var(--primary)" : "1.5px solid var(--border-color,#ffd)", 
                borderRadius: 10,
                boxShadow: idx === modal.imgIdx ? "0 0 0 2px var(--secondary,#f59e0b88)" : "0 2px 9px #3332",
                padding: 0,
                cursor: "pointer",
                outline: "none",
                overflow: "hidden"
              }}
              onClick={() => setModal({ open: false, imgIdx: idx })}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") setModal({ open: false, imgIdx: idx });
              }}
              tabIndex={0}
            >
              <img
                src={im.thumb}
                alt={im.alt}
                loading="lazy"
                style={{
                  width: "100%", height: 72, objectFit: "cover", borderRadius: 10,
                  display: "block", background: "#eee"
                }}
              />
            </button>
          ))}
        </div>

        <div style={{textAlign:'left'}}>
          <div className="ocean-chip" style={{background:'var(--primary)', fontWeight:600}}>{product.category}</div>
          <div style={{fontWeight:800, fontSize:'2.1em', color:'var(--text)'}}>{product.name}</div>
          <div style={{ fontWeight: 600, color: 'var(--secondary)', margin:'0.5em 0 0.1em'}}>${product.price.toFixed(2)}</div>
          <div style={{ margin:'0.25em 0', color: '#555', fontSize: '1.09em' }}>{product.shortDesc}</div>
          <ul style={{margin: '1.1em 0 0.7em', padding:0, listStyle:'none'}}>
            <li><strong>Material:</strong> {product.material}</li>
            <li><strong>Rating:</strong> {product.rating} ★</li>
            <li><strong>Dimensions:</strong> {product.specs?.width} x {product.specs?.depth} x {product.specs?.height}</li>
            <li><strong>Color:</strong> {product.specs?.color}</li>
          </ul>
          {/* Cart controls: stepper/qty/remove */}
          {(() => {
            const item = items.find(i => i.id === product.id);
            if (!item) {
              return (
                <button
                  className="ocean-btn"
                  aria-label={`Add ${product.name} to cart`}
                  style={{marginTop:'0.4em'}}
                  onClick={() => addToCart(product, 1)}
                >
                  Add to Cart
                </button>
              );
            }
            return (
              <div style={{
                marginTop: '0.5em',
                display: 'flex',
                gap: '0.36em',
                alignItems: 'center'
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
                  onClick={() => decrementQty(product.id)}
                  disabled={item.qty <= 1}
                >–</button>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={item.qty}
                  aria-label={`Set quantity for ${product.name}`}
                  style={{
                    width: 38,
                    textAlign: 'center',
                    fontWeight: 700,
                    border: '1.5px solid #dbeafe',
                    borderRadius: 8,
                    padding: '0.18em 0.13em',
                    fontSize: "1.07em",
                    background: "var(--surface)"
                  }}
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
                  onClick={() => incrementQty(product.id)}
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
                  onClick={() => removeFromCart(product.id)}
                >Remove</button>
                <span style={{
                  marginLeft: '1.1em',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  fontSize: '1.12em'
                }}>
                  ${(product.price * item.qty).toFixed(2)}
                </span>
              </div>
            );
          })()}
        </div>
      </div>
      {/* Reviews anchor/link and section */}
      <div style={{ width: "100%", maxWidth: 620, margin: "2.2em auto 0" }}>
        <a id="reviews" tabIndex={-1} ref={reviewsSectionRef} />
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1.2em",
          margin: "2.6em 0 1.2em 0"
        }}>
          <h2 style={{
            fontWeight: 700,
            fontSize: "1.65em",
            color: "var(--primary)",
            letterSpacing: ".01em",
            margin: 0
          }}>
            Reviews
          </h2>
          <a
            href="#reviews"
            className="ocean-btn secondary"
            style={{ fontSize: "1em", fontWeight: 600, padding: "0.2em 0.9em" }}
            aria-label="Jump to reviews"
            onClick={e => {
              e.preventDefault();
              if (reviewsSectionRef.current)
                reviewsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
              if(window.history.replaceState) window.history.replaceState(null,null,"#reviews"); // Update hash
            }}
          >Jump</a>
        </div>
        <div style={{background:'none'}}>
          <ReviewSummary reviews={reviews || []} />
          {loadingReviews ? (
            <div style={{
              minHeight: 90,
              opacity: 0.43,
              margin:"1.4em 0 2.6em"
            }}>
              <div className="ocean-card ocean-skeleton" style={{height:50}} />
              <div className="ocean-card ocean-skeleton" style={{height:32, width:"80%", marginTop:18}} />
            </div>
          ) : (
            <ReviewsList reviews={reviews || []} />
          )}
        </div>
        <ReviewForm
          onSubmit={addReviewLocal}
          submitting={false}
        />
      </div>
    </div>
  );
}
