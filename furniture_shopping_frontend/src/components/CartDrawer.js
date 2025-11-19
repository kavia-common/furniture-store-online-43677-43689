import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, removeFromCart, updateQty, clearCart, getTotal } = useCart();
  const prevOpenRef = useRef(false);

  // Open drawer when a new item is added (but not on mount)
  useEffect(() => {
    if (!prevOpenRef.current && items.length > 0) setOpen(true);
    prevOpenRef.current = items.length > 0;
  }, [items.length]);

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
          overflowY: 'auto'
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
              <div key={item.id} className="ocean-card ocean-rounded-md" style={{display:'flex',alignItems:'center',gap:'0.8em',marginBottom:'0.65em',boxShadow:'none',border:'1px solid #f5f5fa'}}>
                <img src={item.image} alt={item.name} style={{width:54,height:54,borderRadius:'12px',objectFit:'cover'}}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700}}>{item.name}</div>
                  <div style={{fontSize:'0.98em',color:'#2563EB'}}>${(item.price*item.qty).toFixed(2)} ({item.qty}x)</div>
                  <div style={{display:'flex',alignItems:'center',gap:'0.2em'}}>
                    <span>Qty:</span>
                    <input
                      min={1}
                      type="number"
                      value={item.qty}
                      aria-label={`Set quantity for ${item.name}`}
                      style={{width:50, marginLeft:'0.2em',border:'1px solid #dbeafe',padding:'0.2em 0.3em',borderRadius:8}}
                      onChange={e=>updateQty(item.id, parseInt(e.target.value,10))}
                    />
                  </div>
                </div>
                <button className="ocean-btn secondary" style={{padding: '0.15em 0.55em',fontSize:'1.4em',marginLeft:'0.3em'}} aria-label={`Remove ${item.name}`} onClick={()=>removeFromCart(item.id)}>–</button>
              </div>
            ))}
            <div style={{fontWeight:700,marginTop:'1.1em'}}>Total: <span style={{color:'var(--primary)'}}>${getTotal().toFixed(2)}</span></div>
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
