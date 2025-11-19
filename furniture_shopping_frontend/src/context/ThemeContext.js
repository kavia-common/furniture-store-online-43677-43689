import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

/**
 * PUBLIC_INTERFACE
 * ThemeContext provides theme state ("light" | "dark") and a method to toggle.
 */
const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

// PUBLIC_INTERFACE
/**
 * Returns the current theme and actions for switching theme.
 */
export const useTheme = () => useContext(ThemeContext);

// Utility: get system preference, fallback to light
function getPreferredTheme() {
  if (typeof window !== "undefined" && window.matchMedia) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  }
  return "light";
}

// Util: get theme from localStorage if exists
function loadStoredTheme() {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return null;
  } catch {
    return null;
  }
}

// Set data-theme on html element for CSS
function applyThemeAttribute(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

// PUBLIC_INTERFACE
/**
 * ThemeProvider injects and manages the theme context, persisting to localStorage;
 * applies data-theme attribute to <html> for CSS variable switching.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const ls = loadStoredTheme();
    if (ls) return ls;
    return getPreferredTheme();
  });

  // Whenever theme changes, update <html> attr and localStorage
  useEffect(() => {
    applyThemeAttribute(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  // Listen to system pref change and update if not overridden
  useEffect(() => {
    // If user set explicitly, don't react to system
    const ls = loadStoredTheme();
    if (ls) return;
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e) => setTheme(e.matches ? "dark" : "light");
    matchMedia.addEventListener("change", listener);
    return () => matchMedia.removeEventListener("change", listener);
    // eslint-disable-next-line
  }, []);

  // Toggle handler
  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
