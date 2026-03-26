import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { darkColors, lightColors } from '../theme/colors';

const ThemeContext = createContext(null);

// Offline-friendly AsyncStorage shim (in-memory).
const memoryStore = globalThis.__SAFEHER_STORAGE__ || (globalThis.__SAFEHER_STORAGE__ = {});
const storage = {
  getItem: async (key) => (Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null),
  setItem: async (key, value) => {
    memoryStore[key] = value;
  },
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await storage.getItem('safeher_theme');
        if (!mounted) return;
        setIsDark(stored === 'true');
      } catch {
        // Default to system/light; still mark as ready.
      } finally {
        if (mounted) setReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await storage.setItem('safeher_theme', String(next));
    } catch {
      // If storage fails, still keep the UI updated.
    }
  };

  const colors = isDark ? darkColors : lightColors;

  const value = useMemo(
    () => ({
      colors,
      isDark,
      toggleTheme,
    }),
    [colors, isDark]
  );

  // Prevent flash by withholding children until AsyncStorage finishes loading.
  if (!ready) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

