import React, { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const val = localStorage.getItem('theme-mode');
      return val === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light');
    } catch {}

    const body = document && document.body;
    if (body) {
      body.classList.remove(isDarkMode ? 'light-mode' : 'dark-mode');
      body.classList.add(isDarkMode ? 'dark-mode' : 'light-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((v) => !v);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;