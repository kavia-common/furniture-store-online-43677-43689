import React, { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

function FloatingCartButton() {
  const { getCount } = useCart();
  const btnRef = useRef();

  // Focus visible ring via keyboard navigation
  useEffect(() => {
    const ref = btnRef.current;
    if (!ref) return;
    function handleKeydown(e) {
      if (e.key === 'Tab') ref.classList.add('ocean-focus');
    }
    ref.addEventListener('keydown', handleKeydown);
    return () => ref.removeEventListener('keydown', handleKeydown);
  }, []);

  function openDrawer() {
    // Toggle drawer (by custom event)
    const event = new CustomEvent('toggleCartDrawer', { detail: { open: true } });
    window.dispatchEvent(event);
    // Alternatively, hacky: find drawer by attribute and set open; handled above.
    // (in demo: CartDrawer opens on add, but for button: just reload page for demo)
    window.location.hash = '#cart'; // demo, focus attention
    // In real app: setOpen(true) via context.
  }

  return (
    <button
      className="ocean-btn ocean-shadow"
      style={{
        position: 'fixed',
        right: 24,
        bottom: 34,
        borderRadius: '50%',
        width: 62,
        height: 62,
        zIndex: 1200,
        fontSize: '1.7em',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--primary)',
        color: '#fff', boxShadow: '0 5px 24px #2563eb40'
      }}
      aria-label={`Open cart, ${getCount()} items`}
      tabIndex={0}
      ref={btnRef}
      onClick={openDrawer}
      id="ocean-cart-fab"
    >
      🛒
      {getCount() > 0 &&
        <span className="ocean-badge" aria-label={`${getCount()} items in cart`} style={{
          position: 'absolute',
          top: 8,
          right: 7,
          background: 'var(--error)',
          fontWeight: 700,
          fontSize:'0.91em'
        }}>
          {getCount()}
        </span>
      }
    </button>
  );
}
export default FloatingCartButton;
