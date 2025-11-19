import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

/**
 * PUBLIC_INTERFACE
 * Header component with global SearchBar for quick access from every page.
 * Integrates with URL for sharing.
 */
function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse ?q=... from current location
  const params = new URLSearchParams(location.search);
  const q = params.get('q') || '';

  // Place search bar only on ProductList and Home (optional: everywhere - design decision)
  function onSearchBarChange(val) {
    // Only push if it changes, and replace q param (keep others for future extensibility)
    const newParams = new URLSearchParams(location.search);
    if (val) newParams.set('q', val);
    else newParams.delete('q');
    if (location.pathname === '/products') {
      navigate({ pathname: '/products', search: newParams.toString() });
    } else {
      // Optionally go to the products page on search from any page (for now stay on current page)
      navigate({ pathname: location.pathname, search: newParams.toString() });
    }
  }

  // Only show SearchBar on desktop (else moved to ProductList), or keep in header always. Let's show always for accessibility.
  return (
    <header className="ocean-surface ocean-shadow ocean-rounded" style={{ margin: '1rem 0.5rem 1.3rem' }}>
      <nav
        className="ocean-main-container"
        aria-label="Main site navigation"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45em',
          padding: '0.6rem 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2em' }}>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary)' }}>
            OceanShop
          </div>
          <div>
            <NavLink to="/" className="ocean-btn secondary" style={{marginRight: '0.8em'}} end>
              Home
            </NavLink>
            <NavLink to="/products" className="ocean-btn">
              Products
            </NavLink>
          </div>
        </div>
        {/* Show search bar in header - always visible for quick search */}
        <div style={{
          width: '100%',
          maxWidth: 470,
          alignSelf: 'flex-end',
          marginTop: '.35em',
        }}>
          <SearchBar value={q} onChange={onSearchBarChange} />
        </div>
      </nav>
    </header>
  );
}
export default Header;
