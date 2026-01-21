// src/context/ThemeContext.jsx
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Crear el contexto de tema
export const ThemeContext = createContext();

// Hook personalizado para usar el contexto
export const useTheme = () => {
  const context = window.__themeContext__;
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};

// Proveedor de tema
export const ThemeProvider = ({ children }) => {
  // Determinar el tema inicial del localStorage o del sistema
  const getInitialTheme = () => {
    // Primero intentamos localStorage
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Si no hay guardado, usamos la preferencia del sistema
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Por defecto, modo oscuro
    return true;
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme());

  // Función para cambiar el tema
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Función para establecer el tema explícitamente
  const setTheme = (dark) => {
    setIsDarkMode(dark);
  };

  // Efecto para aplicar el tema al documento
  useEffect(() => {
    // Limpiar clases previas
    document.body.classList.remove('light-mode', 'dark-mode');
    
    // Aplicar la nueva clase
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.add('light-mode');
    }

    // Guardar la preferencia en localStorage
    localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light');

    // También podemos actualizar el color-scheme meta para mejor UX
    if (isDarkMode) {
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  const value = {
    isDarkMode,
    toggleTheme,
    setTheme,
  };

  // Guardar el contexto en window para evitar problemas con el hook
  // Comentado temporalmente para evitar error de immutability
  // window.__themeContext__ = value;

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
