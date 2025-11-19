import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();
// PUBLIC_INTERFACE
export function useCart() {
  // Access the cart context in components.
  return useContext(CartContext);
}

/**
 * PUBLIC_INTERFACE
 * CartProvider manages cart state, providing add, remove, increment, decrement, quantity update,
 * line totals, subtotal, and total. Persists cart to localStorage for session retention.
 */
export function CartProvider({ children }) {
  const STORAGE_KEY = "cart-items-v1";
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  // Persist cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  // PUBLIC_INTERFACE
  function addToCart(product, qty = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...product, qty }];
    });
  }

  // PUBLIC_INTERFACE
  function removeFromCart(productId) {
    setItems(prev => prev.filter(i => i.id !== productId));
  }

  // PUBLIC_INTERFACE
  function updateQty(productId, qty) {
    setItems(prev =>
      prev.map(i =>
        i.id === productId ? { ...i, qty: Math.max(qty, 1) } : i
      )
    );
  }

  // PUBLIC_INTERFACE: Increment item quantity by 1
  function incrementQty(productId) {
    setItems(prev =>
      prev.map(i =>
        i.id === productId ? { ...i, qty: i.qty + 1 } : i
      )
    );
  }
  // PUBLIC_INTERFACE: Decrement item quantity by 1 (remove if <=1)
  function decrementQty(productId) {
    setItems(prev =>
      prev
        .map(i => i.id === productId ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0)
    );
  }

  // PUBLIC_INTERFACE
  function clearCart() {
    setItems([]);
  }

  // PUBLIC_INTERFACE
  function getCount() {
    return items.reduce((total, item) => total + item.qty, 0);
  }

  // PUBLIC_INTERFACE
  function getLineTotal(productId) {
    const item = items.find(i => i.id === productId);
    return item ? item.price * item.qty : 0;
  }

  // PUBLIC_INTERFACE
  function getSubtotal() {
    // subtotal is sum of all line totals (no tax/shipping for demo)
    return items.reduce((total, item) => total + (item.price * item.qty), 0);
  }

  // PUBLIC_INTERFACE
  function getTotal() {
    // For extensibility (future: apply tax, shipping, discounts)
    // For now, total == subtotal
    return getSubtotal();
  }

  const value = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQty,
    incrementQty,
    decrementQty,
    clearCart,
    getCount,
    getLineTotal,
    getSubtotal,
    getTotal
  }), [items]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
