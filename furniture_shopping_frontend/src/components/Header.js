import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useTheme } from '../context/ThemeContext';

/**
 * PUBLIC_INTERFACE
 * Header component with global SearchBar for quick access from every page.
 * Integrates with URL for sharing.
 */
function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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

  // Sun / Moon SVG (inline for no extra deps)
  const iconStyle = {
    fontSize: '1.3em',
    verticalAlign: 'middle',
    marginRight: '.12em'
  };
  function ThemeIcon() {
    // Pure SVG for sharp, accessible icons
    return theme === "dark" ? (
      <svg aria-hidden="true" width="21" height="21" fill="currentColor" viewBox="0 0 24 24" style={iconStyle}><path d="M12 3a1 1 0 0 1 1 1v1.04a7.001 7.001 0 0 1 6.96 6.15h1.04a1 1 0 0 1 0 2h-1.04A7.001 7.001 0 0 1 13 19.96V21a1 1 0 1 1-2 0v-1.04A7.001 7.001 0 0 1 5.04 13H4a1 1 0 1 1 0-2h1.04A7.001 7.001 0 0 1 11 4.04V3a1 1 0 0 1 1-1zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/></svg>
    ) : (
      <svg aria-hidden="true" width="21" height="21" fill="currentColor" viewBox="0 0 24 24" style={iconStyle}><path d="M12 2a1 1 0 0 1 1 1v1.4a8.002 8.002 0 0 1-.87 15.98A8.002 8.002 0 0 1 4.62 13.29a1 1 0 1 1 1.42-1.42A6.002 6.002 0 0 0 12 4a1 1 0 0 1 0-2z"/></svg>
    );
  }

  // Only show SearchBar on desktop (else moved to ProductList), or keep in header always. Let's show always for accessibility.
  return (
    <header className="ocean-surface ocean-shadow ocean-rounded" style={{ margin: '1rem 0.5rem 1.3rem', position: 'relative' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2em', position: 'relative' }}>
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
          {/* Theme toggle button for dark/light mode */}
          <button
            className="ocean-btn"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            style={{
              padding: '.47em 1em',
              background: theme === "dark" ? "var(--secondary)" : "var(--primary)",
              color: theme === "dark" ? "#202427" : "#fff",
              border: 0,
              marginLeft: "1.5em",
              minWidth: 0,
              display: "inline-flex",
              alignItems: "center",
              borderRadius: "2em",
              boxShadow: "var(--shadow)",
              transition: "background 0.3s,color 0.3s"
            }}
            tabIndex={0}
          >
            <ThemeIcon />
            <span style={{
                fontWeight: 600,
                fontSize: '1.01em',
                marginLeft: '.06em',
                letterSpacing: '.01em'
              }}
            >
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </button>
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
