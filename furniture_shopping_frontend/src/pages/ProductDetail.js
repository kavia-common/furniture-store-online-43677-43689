import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../data/fetchProducts';
import { useCart } from '../context/CartContext';

// PUBLIC_INTERFACE
export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    let active = true;
    fetchProductById(id).then(res => { if (active) setProduct(res); });
    return () => { active = false }
  }, [id]);

  if (!product) {
    return <div className="ocean-main-container"><div className="ocean-card ocean-skeleton" style={{height:350}} /></div>;
  }

  return (
    <div className="ocean-main-container" style={{display:'flex', justifyContent:'center', paddingTop:'2rem', minHeight:'56vh'}}>
      <div className="ocean-card ocean-shadow ocean-rounded" style={{maxWidth:'570px', width:'100%', display:'flex', flexDirection:'column', gap:'2rem'}}>
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
    </div>
  );
}
