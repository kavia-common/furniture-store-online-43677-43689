import React from 'react';

/**
 * PUBLIC_INTERFACE
 * SearchBar component for filtering products.
 * @param {string} value - The current search query string.
 * @param {function} onChange - Callback when input value changes.
 * @param {boolean} isLoading - Optional: indicate loading state.
 * @returns JSX element.
 */
function SearchBar({ value, onChange, isLoading }) {
  return (
    <form
      role="search"
      aria-label="Search products"
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.3em',
        width: '100%',
        gap: '.6em',
      }}
      onSubmit={e => { e.preventDefault(); }} // We handle as-you-type, not submit
    >
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search by name, category, or description"
        aria-label="Search for furniture"
        autoComplete="off"
        className="ocean-surface ocean-shadow"
        style={{
          flex: 1,
          padding: '0.7em 1.2em',
          borderRadius: '1.1em',
          border: '1px solid #cbd3da',
          fontSize: '1.06em',
          background: 'var(--background)',
          color: 'var(--text)',
          transition: 'border .2s',
          boxShadow: 'none',
          outline: 'none',
        }}
        disabled={!!isLoading}
      />
      <button
        type="submit"
        className="ocean-btn"
        tabIndex={-1}
        aria-label="Execute search"
        style={{
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: 'none',
          minWidth: 88,
        }}
        disabled
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
export default SearchBar;
