import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();
// PUBLIC_INTERFACE
export function useCart() {
  // Access the cart context in components.
  return useContext(CartContext);
}

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

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

  // PUBLIC_INTERFACE
  function clearCart() {
    setItems([]);
  }

  // PUBLIC_INTERFACE
  function getCount() {
    return items.reduce((total, item) => total + item.qty, 0);
  }
  // PUBLIC_INTERFACE
  function getTotal() {
    return items.reduce((total, item) => total + (item.price * item.qty), 0);
  }

  const value = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    getCount,
    getTotal
  }), [items]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
