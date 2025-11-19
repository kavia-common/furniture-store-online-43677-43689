import React from 'react';
import { NavLink, useLocation, useNavigate, useHref } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/**
 * PUBLIC_INTERFACE
 * Header component with global SearchBar for quick access from every page.
 * Integrates with URL for sharing, shows cart item badge and drawer button.
 */
function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { getCount } = useCart();

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

  function openDrawer() {
    // Trigger cart drawer open
    const event = new CustomEvent('toggleCartDrawer', { detail: { open: true } });
    window.dispatchEvent(event);
    window.location.hash = "#cart"; // attention anchor (for accessibility)
  }

  const { getWishlistCount } = useWishlist();
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
          {/* Wishlist icon with badge */}
          <NavLink
            to="/wishlist"
            className="ocean-btn secondary"
            title={`Wishlist (${getWishlistCount()} items)`}
            aria-label={`View wishlist, ${getWishlistCount()} items`}
            style={{
              minWidth: 0,
              marginLeft: "1.2em",
              padding: "0.42em 0.6em 0.42em 0.8em",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              fontSize: "1.11em",
              borderRadius: "2em",
              gap: ".15em",
              position: "relative"
            }}
            tabIndex={0}
          >
            <span style={{ fontSize: "1.28em", marginRight: ".14em", color: "var(--primary)" }} aria-hidden="true">
              {/* SVG Heart Outline/Fill for wishlist */}
              <svg viewBox="0 0 26 26" aria-hidden="true" width="23" height="23" fill="none" style={{verticalAlign: 'middle', marginRight: 2}}>
                <path
                  d="M13 22c-.56-.41-5.7-4.23-8.18-7.19C2.13 12.63 1.5 10.95 1.5 9.29c0-3.41 2.6-5.79 5.29-5.79 1.84 0 3.6.99 4.49 2.5.89-1.51 2.65-2.5 4.49-2.5 2.69 0 5.29 2.38 5.29 5.79 0 1.66-.62 3.34-3.32 5.52C18.7 17.77 13.56 21.59 13 22Z"
                  stroke="var(--primary)" strokeWidth="2" fill={getWishlistCount() > 0 ? "var(--primary)" : "none"} />
              </svg>
            </span>
            <span style={{fontWeight:700, fontSize:"1.03em"}}>Wishlist</span>
            {getWishlistCount() > 0 && (
              <span className="ocean-badge" aria-label={`${getWishlistCount()} items in wishlist`} style={{
                position: "absolute",
                top: 7,
                right: 0,
                background: "var(--primary)",
                fontWeight: 700,
                fontSize:'0.91em',
                minWidth:24,
                borderRadius: "8px",
                left: "auto"
              }}>
                {getWishlistCount()}
              </span>
            )}
          </NavLink>
          {/* Cart icon with badge */}
          <button
            className="ocean-btn secondary"
            title={`Cart (${getCount()} items)`}
            aria-label={`View cart, ${getCount()} items`}
            style={{
              minWidth: 0,
              marginLeft: "1.2em",
              padding: "0.48em 1.04em 0.48em 1.15em",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              fontSize: "1.15em",
              borderRadius: "2em",
              gap: ".11em",
              position: "relative"
            }}
            onClick={openDrawer}
            tabIndex={0}
          >
            <span style={{ fontSize:"1.3em", marginRight: ".14em" }} aria-hidden="true">🛒</span>
            {getCount() > 0 && (
              <span className="ocean-badge" aria-label={`${getCount()} items in cart`} style={{
                position: "absolute",
                top: 7,
                right: 3,
                background: "var(--error)",
                fontWeight: 700,
                fontSize:'0.91em',
                minWidth:24, 
                borderRadius: "8px",
              }}>
                {getCount()}
              </span>
            )}
          </button>
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
