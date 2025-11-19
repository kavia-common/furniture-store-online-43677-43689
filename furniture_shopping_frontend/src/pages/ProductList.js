import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Filters from '../components/Filters';
import ProductGrid from '../components/ProductGrid';
import { fetchAllProducts } from '../data/fetchProducts';

/**
 * PUBLIC_INTERFACE
 * ProductList page. Filters product list using query in URL (?q=...).
 * Keeps filter in sync with SearchBar and allows sharing/bookmarking.
 */
function ProductList() {
  const [products, setProducts] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Parse query param from URL (?q)
  const params = new URLSearchParams(location.search);
  const query = params.get('q') || '';

  useEffect(() => {
    let active = true;
    fetchAllProducts().then(res => { if (active) setProducts(res); });
    return () => { active = false }
  }, []);

  // Filtering function (search by name, category, description - case-insensitive)
  const filteredProducts = useMemo(() => {
    if (!products) return null;
    if (!query.trim()) return products;
    const q = query.trim().toLowerCase();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(q)
        || p.category?.toLowerCase().includes(q)
        || (p.shortDesc ? p.shortDesc.toLowerCase().includes(q) : false)
    );
  }, [products, query]);

  // If the user types in a new search, update the URL query param
  function handleSearchBarChange(val) {
    const newParams = new URLSearchParams(location.search);
    if (val) newParams.set('q', val);
    else newParams.delete('q');
    navigate({ pathname: '/products', search: newParams.toString() });
  }

  return (
    <div className="ocean-main-container" style={{ display: 'flex', gap: '2rem', minHeight: '68vh' }}>
      {/* Desktop filters */}
      <aside
        className="ocean-surface ocean-shadow ocean-rounded-md"
        style={{
          minWidth: '215px',
          maxWidth: '235px',
          padding: '1.1rem 1rem',
          marginRight: '1.8rem',
          display: window.innerWidth > 900 ? 'block' : 'none'
        }}
      >
        <Filters />
      </aside>
      <section style={{ flex: 1 }}>
        {/* SearchBar is in Header, but for mobile/UX we also render it here if wanted.
            If so, uncomment below and ensure value/onChange are passed. */}
        {/* <SearchBar value={query} onChange={handleSearchBarChange} /> */}
        {!products &&
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: '1.2em' }}>
            {[0, 1, 2, 3].map(idx => (
              <div className="ocean-card ocean-skeleton" style={{ height: 300 }} key={idx} />
            ))}
          </div>
        }
        {products &&
          (filteredProducts.length > 0
            ? <ProductGrid products={filteredProducts} />
            : <div style={{ color: '#6b7280', fontWeight: 600, fontSize: '1.19em', padding: '2em 0', textAlign: 'center' }}>
                No products found for "<span style={{ color: 'var(--primary)' }}>{query}</span>"
              </div>
          )
        }
      </section>
    </div>
  );
}
export default ProductList;
