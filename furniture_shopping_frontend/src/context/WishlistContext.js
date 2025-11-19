import React, { createContext, useContext, useState, useMemo, useEffect } from "react";

// PUBLIC_INTERFACE
const WishlistContext = createContext();

/**
 * PUBLIC_INTERFACE
 * Returns wishlist context value (wishlist and operations). Use via useContext(WishlistContext).
 */
export function useWishlist() {
  return useContext(WishlistContext);
}

// Utility: key for localStorage
const STORAGE_KEY = "wishlist-items-v1";

/**
 * PUBLIC_INTERFACE
 * WishlistProvider manages wishlist state, providing add/remove/toggle,
 * inWishlist, and list. Persists wishlist to localStorage for session retention.
 */
export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  // Save to localStorage when wishlist changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {}
  }, [wishlistIds]);

  // PUBLIC_INTERFACE
  function addToWishlist(productId) {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev : [...prev, productId]
    );
  }

  // PUBLIC_INTERFACE
  function removeFromWishlist(productId) {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  }

  // PUBLIC_INTERFACE
  function toggleWishlist(productId) {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }

  // PUBLIC_INTERFACE
  function isWishlisted(productId) {
    return wishlistIds.includes(productId);
  }

  // PUBLIC_INTERFACE
  function clearWishlist() {
    setWishlistIds([]);
  }

  // PUBLIC_INTERFACE
  function getWishlistCount() {
    return wishlistIds.length;
  }

  // PUBLIC_INTERFACE
  function getWishlistIds() {
    return wishlistIds;
  }

  // For easier access: value is memoized
  const value = useMemo(
    () => ({
      wishlistIds,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
      clearWishlist,
      getWishlistCount,
      getWishlistIds,
    }),
    [wishlistIds]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}
