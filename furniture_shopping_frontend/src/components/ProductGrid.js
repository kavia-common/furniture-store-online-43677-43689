import React from 'react';
import ProductCard from './ProductCard';

// PUBLIC_INTERFACE
function ProductGrid({ products }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1.3em'
    }}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
export default ProductGrid;
