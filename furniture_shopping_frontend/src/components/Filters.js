import React from 'react';

// Category and price filter bar (Ocean Professional styling, horizontal layout support)
const CATEGORY_OPTIONS = ['Chairs', 'Sofas', 'Tables'];
const PRICE_MIN = 0;
const PRICE_MAX = 1000;
const PRICE_STEP = 10;

// PUBLIC_INTERFACE
/**
 * Filters component for product listing.
 * Props:
 * - value: {category, minPrice, maxPrice} (controlled)
 * - onChange: function({category,minPrice,maxPrice})
 * - layout: "horizontal" | "vertical"
 */
function Filters({
  value = { category: '', minPrice: '', maxPrice: '' },
  onChange = () => {},
  layout = 'vertical'
}) {
  // Handlers for controlled filters
  function handleCategoryChange(e) {
    onChange({ ...value, category: e.target.value });
  }
  function handleMinPriceChange(e) {
    onChange({ ...value, minPrice: e.target.value });
  }
  function handleMaxPriceChange(e) {
    onChange({ ...value, maxPrice: e.target.value });
  }

  // Layout classes for horizontal/vertical
  const rootStyle = layout === "horizontal"
    ? {
        display: 'flex',
        gap: '2.4em',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '100%',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.1em',
        minWidth: 210
      };

  // Card style for filter groups
  const groupStyle = {
    display: 'flex',
    flexDirection: 'column',
    minWidth: layout === "horizontal" ? 112 : undefined,
    alignItems: layout === "horizontal" ? 'flex-start' : undefined,
    justifyContent: 'center',
    gap: layout === "horizontal" ? '0.21em' : '0.5em',
  };

  return (
    <form aria-label="Filter products"
      style={rootStyle}
      onSubmit={e => e.preventDefault()}
    >
      {/* Category Select */}
      <div style={groupStyle}>
        <label htmlFor="filter-category" style={{
          fontWeight: 600, marginBottom: '.15em', color: 'var(--primary)', letterSpacing: '.01em'
        }}>
          Category
        </label>
        <select
          id="filter-category"
          value={value.category || ''}
          onChange={handleCategoryChange}
          className="ocean-surface ocean-shadow"
          style={{
            minWidth: 100,
            padding: '0.45em 1.3em 0.45em 0.65em',
            borderRadius: 11,
            border: '1.5px solid #dbeafe',
            fontSize: '1em',
            boxShadow: '0 1px 6px #2563eb12',
            background: 'white',
            color: 'var(--text)',
            fontWeight: 500
          }}
        >
          <option value="">All</option>
          {CATEGORY_OPTIONS.map(opt =>
            <option key={opt} value={opt}>{opt}</option>
          )}
        </select>
      </div>
      {/* Price Range */}
      <div style={groupStyle}>
        <label style={{
          fontWeight: 600, marginBottom: '.13em', color: 'var(--primary)', letterSpacing: '.01em'
        }}>
          Price
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6em' }}>
          <input
            type="number"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            placeholder="Min"
            value={value.minPrice || ''}
            onChange={handleMinPriceChange}
            aria-label="Minimum price"
            style={{
              width: 77, padding: '0.3em 0.6em', borderRadius: 9,
              border: '1px solid #dbeafe', fontSize: '1em',
              outline: 'none', marginRight: '.16em'
            }}
          />
          <span style={{ color: '#7c98b5' }}>–</span>
          <input
            type="number"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            placeholder="Max"
            value={value.maxPrice || ''}
            onChange={handleMaxPriceChange}
            aria-label="Maximum price"
            style={{
              width: 77, padding: '0.3em 0.6em', borderRadius: 9,
              border: '1px solid #dbeafe', fontSize: '1em',
              outline: 'none'
            }}
          />
        </div>
      </div>
    </form>
  );
}

export default Filters;
