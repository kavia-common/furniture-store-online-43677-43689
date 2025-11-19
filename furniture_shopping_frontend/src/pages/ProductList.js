import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Filters from '../components/Filters';
import ProductGrid from '../components/ProductGrid';
import { fetchAllProducts } from '../data/fetchProducts';

/**
 * PUBLIC_INTERFACE
 * ProductList page. Filters product list using query in URL (?q=...).
 * Now features a top filter bar replacing the sidebar, responsive and styled per Ocean Professional.
 */
function ProductList() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // Parse query param from URL (?q, ?category, ?minPrice, ?maxPrice)
  const params = new URLSearchParams(location.search);
  const query = params.get('q') || '';
  const selectedCategory = params.get('category') || '';
  const minPrice = params.get('minPrice');
  const maxPrice = params.get('maxPrice');

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchAllProducts().then(res => {
      if (active) {
        setProducts(res);
        setLoading(false);
      }
    });
    return () => { active = false };
  }, []);

  // Filtering function
  const filteredProducts = useMemo(() => {
    if (!products) return null;
    let filtered = products;

    // Text query
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q)
        || p.category?.toLowerCase().includes(q)
        || (p.shortDesc ? p.shortDesc.toLowerCase().includes(q) : false)
      );
    }
    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    // Price filter
    let min = minPrice ? parseFloat(minPrice) : null;
    let max = maxPrice ? parseFloat(maxPrice) : null;
    if (min !== null) {
      filtered = filtered.filter(p => p.price >= min);
    }
    if (max !== null) {
      filtered = filtered.filter(p => p.price <= max);
    }
    return filtered;
  }, [products, query, selectedCategory, minPrice, maxPrice]);

  // Handlers for filter changes, sync with URL params
  function handleFilterChange({ category, minPrice, maxPrice }) {
    const newParams = new URLSearchParams(location.search);
    if (category) newParams.set('category', category);
    else newParams.delete('category');
    if (minPrice !== undefined && minPrice !== null && minPrice !== '') newParams.set('minPrice', minPrice);
    else newParams.delete('minPrice');
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') newParams.set('maxPrice', maxPrice);
    else newParams.delete('maxPrice');
    navigate({ pathname: '/products', search: newParams.toString() });
  }

  // (Search handled by SearchBar in header – function kept for reference)
  function handleSearchBarChange(val) {
    const newParams = new URLSearchParams(location.search);
    if (val) newParams.set('q', val);
    else newParams.delete('q');
    navigate({ pathname: '/products', search: newParams.toString() });
  }

  return (
    <div className="ocean-main-container" style={{
      minHeight: '68vh',
      width: '100%',
      maxWidth: '1232px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.6rem'
    }}>
      {/* Top filter bar */}
      <div
        className="ocean-surface ocean-shadow ocean-rounded-md"
        style={{
          marginBottom: '1.25em',
          padding: '1.1em 1.2em',
          boxShadow: '0 2px 12px #2563eb10',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5em 2.3em',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(91deg, var(--gradient-start), var(--gradient-end))'
        }}
        aria-label="Product Filters"
      >
        <Filters
          layout="horizontal"
          value={{
            category: selectedCategory,
            minPrice: minPrice ?? '',
            maxPrice: maxPrice ?? '',
          }}
          onChange={handleFilterChange}
        />
      </div>
      <section style={{ flex: 1, width: '100%' }}>
        {/* Product grid/full width */}
        {loading &&
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: '1.2em' }}>
            {[0, 1, 2, 3].map(idx => (
              <div className="ocean-card ocean-skeleton" style={{ height: 300 }} key={idx} />
            ))}
          </div>
        }
        {!loading && products &&
          (filteredProducts.length > 0
            ? <ProductGrid products={filteredProducts} />
            : <div style={{ color: '#6b7280', fontWeight: 600, fontSize: '1.19em', padding: '2em 0', textAlign: 'center' }}>
                No products found for
                {query ? <> "<span style={{ color: 'var(--primary)' }}>{query}</span>"</> : ''}
                {selectedCategory ? <> in "<span style={{ color: 'var(--primary)' }}>{selectedCategory}</span>"</> : ''}
              </div>
          )
        }
      </section>
    </div>
  );
}
export default ProductList;
