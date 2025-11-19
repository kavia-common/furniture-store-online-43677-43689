import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// PUBLIC_INTERFACE
function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div className="ocean-card ocean-transition ocean-rounded-md" tabIndex={0}
      aria-label={product.name}
      style={{
        cursor: 'pointer',
        display:'flex',
        flexDirection:'column',
      }}
      onClick={() => navigate(`/product/${product.id}`)}
      onKeyDown={e => e.key==='Enter' && navigate(`/product/${product.id}`)}
    >
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
      <button
        className="ocean-btn"
        style={{ marginTop: '0.6em', alignSelf:'flex-start' }}
        tabIndex={0}
        onClick={e => { e.stopPropagation(); addToCart(product, 1); }}
        aria-label={`Add ${product.name} to cart`}
      >
        Add to Cart
      </button>
    </div>
  );
}
export default ProductCard;
