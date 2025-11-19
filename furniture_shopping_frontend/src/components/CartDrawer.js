import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

function CartDrawer() {
  const [open, setOpen] = useState(false);
  const {
    items,
    incrementQty,
    decrementQty,
    updateQty,
    removeFromCart,
    clearCart,
    getSubtotal,
    getTotal
  } = useCart();
  const prevOpenRef = useRef(false);

  // Open drawer when a new item is added (but not on mount)
  useEffect(() => {
    if (!prevOpenRef.current && items.length > 0) setOpen(true);
    prevOpenRef.current = items.length > 0;
  }, [items.length]);

  // Listen for custom toggleCartDrawer event for opening via FAB, header, etc.
  useEffect(() => {
    const handler = (e) => {
      if (e && e.detail && typeof e.detail.open !== 'undefined') setOpen(!!e.detail.open);
      else setOpen(v => !v);
    };
    window.addEventListener('toggleCartDrawer', handler);
    return () => window.removeEventListener('toggleCartDrawer', handler);
  }, []);

  // Close handler accessible via keyboard
  function handleKeyDown(e) {
    if (e.key === "Escape" && open) setOpen(false);
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open]);

  // Styling helpers
  const qtyBtnStyle = {
    fontSize: "1.22em",
    fontWeight: 700,
    padding: "0.18em 0.7em",
    borderRadius: 9
  };

  return (
    <>
      <aside
        className="ocean-surface ocean-shadow ocean-hide-scroll"
        aria-label="Cart drawer"
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: 370,
          maxWidth: '95vw',
          zIndex: 1099,
          boxShadow: '0 4px 32px #2563eb33',
          borderRadius: '1.2em 0 0 1.2em',
          transform: open ? 'translateX(0)' : 'translateX(110%)',
          transition: 'transform 0.35s cubic-bezier(.66,-0.18,.32,1.2)',
          padding: '2.1em 1.2em 2.5em',
          overflowY: 'auto',
          background: 'var(--surface)'
        }}
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
        data-cart-drawer
      >
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.4em'}}>
          <h2 id="cart-title" style={{fontWeight:800, fontSize:'1.2em'}}>Your Cart</h2>
          <button aria-label="Close cart" className="ocean-btn secondary" style={{fontSize:'1em', padding:'0.3em 1em'}} onClick={()=>setOpen(false)}>×</button>
        </div>
        {items.length === 0 ? (
          <div style={{color:'#8898aa', fontWeight:600}}>
            No items in cart yet.
          </div>
        ) : (
          <div role="list" aria-labelledby="cart-title">
            {items.map(item => (
              <div key={item.id} className="ocean-card ocean-rounded-md" style={{
                display:'flex',
                alignItems:'center',
                gap:'0.8em',
                marginBottom:'0.65em',
                boxShadow:'none',
                border:'1px solid #f5f5fa',
                background:'var(--surface)'
              }}>
                <img src={item.image} alt={item.name} style={{width:54,height:54,borderRadius:'12px',objectFit:'cover'}}/>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:700, fontSize:"1.08em", color:'var(--text)', whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden'}}>{item.name}</div>
                  <div style={{fontSize:'0.98em',margin:'0.11em 0', color:'var(--secondary)'}}>${item.price.toFixed(2)} x {item.qty} <span style={{color:'#444',fontWeight:400}}>= ${(item.price * item.qty).toFixed(2)}</span></div>
                  <div style={{display:'flex',alignItems:'center',gap:'0.21em',marginTop:"0.18em"}}>
                    <span style={{marginRight: '0.23em'}}>Qty:</span>
                    <button
                      className="ocean-btn secondary"
                      style={qtyBtnStyle}
                      aria-label={`Decrease quantity of ${item.name}`}
                      tabIndex={0}
                      onClick={() => decrementQty(item.id)}
                      disabled={item.qty <= 1}
                    >–</button>
                    <input
                      min={1}
                      type="number"
                      value={item.qty}
                      aria-label={`Set quantity for ${item.name}`}
                      style={{width:38, margin:'0 0.13em', border:'1.5px solid #dbeafe', padding:'0.13em 0.28em',borderRadius:8,textAlign:'center',fontWeight:700, fontSize:'1.02em'}}
                      onChange={e=>updateQty(item.id, parseInt(e.target.value,10) || 1)}
                    />
                    <button
                      className="ocean-btn secondary"
                      style={qtyBtnStyle}
                      aria-label={`Increase quantity of ${item.name}`}
                      tabIndex={0}
                      onClick={() => incrementQty(item.id)}
                      disabled={item.qty >= 99}
                    >+</button>
                    <button
                      className="ocean-btn"
                      style={{
                        marginLeft: '0.44em',
                        fontSize: "0.92em",
                        padding: "0.18em 0.8em",
                        fontWeight: 700,
                        background: "var(--error)",
                        color: "#fff",
                        borderRadius: 8
                      }}
                      aria-label={`Remove ${item.name} from cart`}
                      tabIndex={0}
                      onClick={() => removeFromCart(item.id)}
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))}
            <div style={{
              fontWeight: 700,
              marginTop: '1.25em',
              fontSize: '1.18em',
              display: 'flex',
              justifyContent: "space-between",
              alignItems: 'center'
            }}>
              <span>Subtotal:</span>
              <span style={{color:'var(--primary)'}}>${getSubtotal().toFixed(2)}</span>
            </div>
            <div style={{
              fontWeight: 700,
              marginTop: '0.47em',
              fontSize: '1.13em',
              display: 'flex',
              justifyContent: "space-between",
              alignItems: 'center'
            }}>
              <span>Total:</span>
              <span style={{color:'var(--primary)'}}>${getTotal().toFixed(2)}</span>
            </div>
            <button className="ocean-btn" style={{width:'100%',marginTop:'1.2em'}} aria-label="Checkout" onClick={()=>{alert('Checkout is a demo only!')}}>Checkout</button>
            <button className="ocean-btn secondary" style={{width:'100%',marginTop:'0.5em'}} onClick={clearCart}>Clear Cart</button>
          </div>
        )}
      </aside>
      {/* Overlay */}
      {open && (
        <div
          style={{
            background: 'rgba(33, 40, 46, .24)',
            position: 'fixed',left:0,top:0,right:0,bottom:0,zIndex:1098
          }}
          tabIndex={-1}
          aria-hidden="true"
          onClick={()=>setOpen(false)}
        />
      )}
    </>
  );
}
export default CartDrawer;
