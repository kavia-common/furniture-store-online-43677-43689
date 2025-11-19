import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../data/fetchProducts';
import { useCart } from '../context/CartContext';
import ReviewSummary from '../components/ReviewSummary';
import ReviewsList from '../components/ReviewsList';
import ReviewForm from '../components/ReviewForm';
import mockReviews from '../data/mockReviews';

/**
 * PUBLIC_INTERFACE
 * ProductDetail page: Shows product detail and reviews section beneath.
 */
export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  // Reviews state and fetch logic
  const [reviews, setReviews] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const reviewsSectionRef = useRef(null);

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

  if (!product) {
    return <div className="ocean-main-container"><div className="ocean-card ocean-skeleton" style={{height:350}} /></div>;
  }

  return (
    <div className="ocean-main-container" style={{display:'flex', flexDirection:"column", alignItems:'center', paddingTop:'2rem', minHeight:'56vh'}}>
      <div className="ocean-card ocean-shadow ocean-rounded" style={{
        maxWidth:'570px',
        width:'100%',
        display:'flex',
        flexDirection:'column',
        gap:'2rem'
      }}>
        <img
          src={product.image}
          alt={product.name}
          className="ocean-card-media"
          style={{maxWidth:'100%', objectFit:'cover'}}
          loading="lazy"
        />
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
          <button
            className="ocean-btn"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => addToCart(product, 1)}
          >
            Add to Cart
          </button>
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
