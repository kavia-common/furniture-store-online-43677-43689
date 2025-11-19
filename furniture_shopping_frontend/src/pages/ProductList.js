import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Filters from '../components/Filters';
import ProductGrid from '../components/ProductGrid';
import { fetchAllProducts } from '../data/fetchProducts';

/**
 * PUBLIC_INTERFACE
 * ProductList page. Filters and sorts products. Sorting is synced to URL (via `sort` query param).
 * Ocean Professional styled.
 */
function ProductList() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // --- Query params ---
  const params = new URLSearchParams(location.search);
  const query = params.get('q') || '';
  const selectedCategory = params.get('category') || '';
  const minPrice = params.get('minPrice');
  const maxPrice = params.get('maxPrice');
  const sortParam = params.get('sort') || 'relevance';

  // --- Sort options ---
  const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
  ];
  const sortValue = SORT_OPTIONS.find(o => o.value === sortParam) ? sortParam : 'relevance';

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchAllProducts().then(res => {
      if (active) {
        setProducts(res);
        setLoading(false);
      }
    });
    return () => { active = false }
  }, []);

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return null;
    let filtered = products;

    // Filter: search query
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q)
        || p.category?.toLowerCase().includes(q)
        || (p.shortDesc ? p.shortDesc.toLowerCase().includes(q) : false)
      );
    }
    // Filter: category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    // Filter: price
    let min = minPrice ? parseFloat(minPrice) : null;
    let max = maxPrice ? parseFloat(maxPrice) : null;
    if (min !== null) {
      filtered = filtered.filter(p => p.price >= min);
    }
    if (max !== null) {
      filtered = filtered.filter(p => p.price <= max);
    }

    // Sort (default: by sortValue, which is from params)
    let sorted = [...filtered];
    if (sortValue === 'price_asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price_desc') {
      sorted.sort((a, b) => b.price - a.price);
    } // else "relevance": do nothing (order same as filtered, which respects text search first)
    return sorted;
  }, [products, query, selectedCategory, minPrice, maxPrice, sortValue]);

  // --- URL sync for filters ---
  function handleFilterChange({ category, minPrice, maxPrice }) {
    const newParams = new URLSearchParams(location.search);
    if (category) newParams.set('category', category);
    else newParams.delete('category');
    if (minPrice !== undefined && minPrice !== null && minPrice !== '') newParams.set('minPrice', minPrice);
    else newParams.delete('minPrice');
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') newParams.set('maxPrice', maxPrice);
    else newParams.delete('maxPrice');
    // retain 'q' and 'sort'
    navigate({ pathname: '/products', search: newParams.toString() });
  }

  // --- Sorting: When sort changes, update URL sort param (preserve others) ---
  function handleSortChange(e) {
    const newSort = e.target.value;
    const newParams = new URLSearchParams(location.search);
    if (newSort && newSort !== 'relevance') newParams.set('sort', newSort);
    else newParams.delete('sort'); // Default doesn't need to be in URL
    navigate({ pathname: '/products', search: newParams.toString() });
  }

  // (Search handled by SearchBar in header; included for completeness.)
  function handleSearchBarChange(val) {
    const newParams = new URLSearchParams(location.search);
    if (val) newParams.set('q', val);
    else newParams.delete('q');
    navigate({ pathname: '/products', search: newParams.toString() });
  }

  // --- Topbar styles for Ocean Professional ---
  const topBarStyle = {
    marginBottom: '1.25em',
    padding: '1.1em 1.2em',
    boxShadow: '0 2px 12px #2563eb10',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5em 2.3em',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(91deg, var(--gradient-start), var(--gradient-end))',
    borderRadius: 'var(--radius-md)',
  };
  const sortControlStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55em',
    fontWeight: 600,
  };
  const selectStyle = {
    fontWeight: 500,
    padding: '0.45em 1.3em 0.45em 0.65em',
    borderRadius: 11,
    border: '1.5px solid #dbeafe',
    fontSize: '1em',
    background: 'white',
    color: 'var(--text)',
    boxShadow: '0 1px 6px #2563eb12',
    marginLeft: '0.45em',
    minWidth: 144,
    transition: 'background 0.22s, color 0.22s',
  };

  return (
    <div className="ocean-main-container" style={{
      minHeight: '68vh',
      width: '100%',
      maxWidth: '1232px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.6rem'
    }}>
      {/* Top filter + sort bar */}
      <div
        className="ocean-surface ocean-shadow ocean-rounded-md"
        style={topBarStyle}
        aria-label="Product Filters and Sorting Bar"
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
        {/* Sort dropdown */}
        <div style={sortControlStyle}>
          <label htmlFor="sort-products" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1em', letterSpacing: '.01em' }}>
            Sort&nbsp;by
          </label>
          <select
            id="sort-products"
            value={sortValue}
            onChange={handleSortChange}
            style={selectStyle}
            className="ocean-surface ocean-shadow"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
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
          (filteredAndSortedProducts.length > 0
            ? <ProductGrid products={filteredAndSortedProducts} />
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
