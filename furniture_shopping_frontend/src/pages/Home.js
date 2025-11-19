import React, { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import { fetchAllProducts } from '../data/fetchProducts';

function Home() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let active = true;
    fetchAllProducts().then(res => {if(active) setProducts(res)});
    return () => { active = false }
  }, []);

  return (
    <div className="ocean-main-container" style={{display: 'flex', gap:'2rem', minHeight: '68vh'}}>
      {/* Desktop filters */}
      <aside className="ocean-surface ocean-shadow ocean-rounded-md" style={{
        minWidth: '215px', maxWidth:'235px', padding:'1.1rem 1rem', marginRight: '1.8rem', display: window.innerWidth > 900 ? 'block':'none'
      }}>
        <Filters />
      </aside>
      <section style={{flex: 1}}>
        {!products &&
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:'1.2em'}}>
            {[0,1,2,3].map(idx => (
              <div className="ocean-card ocean-skeleton" style={{height:300}} key={idx} />
            ))}
          </div>
        }
        {products &&
          <ProductGrid products={products} />
        }
      </section>
    </div>
  );
}
export default Home;
