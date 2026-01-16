import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import preferencesService from '../services/preferencesService';
import { PreferencesContext } from './PreferencesContextDef';

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    language: 'es',
    theme: 'light',
    favorite_station: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar preferencias del backend al montar
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        const data = await preferencesService.getPreferences();
        setPreferences({
          language: data.language || 'es',
          theme: data.theme || 'light',
          favorite_station: data.favorite_station || null,
        });
        setError(null);
      } catch (err) {
        // Silenciar errores de autenticación, usar valores por defecto
        if (!err.message?.includes('authentication') && !err.message?.includes('Unauthorized')) {
          console.error('Error loading preferences:', err);
        }
        setError(null); // No mostrar error al usuario
        // Usar valores por defecto si falla la carga
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('access_token');
    if (token) {
      loadPreferences();
    }
  }, []);

  const updatePreferences = useCallback(async (newPreferences) => {
    try {
      setLoading(true);
      const updated = await preferencesService.updatePreferences(newPreferences);
      setPreferences({
        language: updated.language || 'es',
        theme: updated.theme || 'light',
        favorite_station: updated.favorite_station || null,
      });
      setError(null);
      return updated;
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const setLanguage = useCallback((language) => {
    setPreferences((prev) => ({ ...prev, language }));
    updatePreferences({ ...preferences, language }).catch((err) => {
      console.error('Error updating language:', err);
    });
  }, [preferences, updatePreferences]);

  const setTheme = useCallback((theme) => {
    setPreferences((prev) => ({ ...prev, theme }));
    updatePreferences({ ...preferences, theme }).catch((err) => {
      console.error('Error updating theme:', err);
    });
  }, [preferences, updatePreferences]);

  const setFavoriteStation = useCallback((favorite_station) => {
    setPreferences((prev) => ({ ...prev, favorite_station }));
    updatePreferences({ ...preferences, favorite_station }).catch((err) => {
      console.error('Error updating favorite station:', err);
    });
  }, [preferences, updatePreferences]);

  const value = {
    preferences,
    loading,
    error,
    setLanguage,
    setTheme,
    setFavoriteStation,
    updatePreferences,
  };

  // Ensure the selected theme is applied globally on the document element so
  // fixed/modals and other top-level UI elements can style based on it.
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (!root) return;
      root.classList.remove('theme-dark', 'theme-light');
      const cls = preferences?.theme === 'dark' ? 'theme-dark' : 'theme-light';
      root.classList.add(cls);
    } catch {
      // defensive: document may not be available in some environments
      // swallow silently
    }
  }, [preferences.theme]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

PreferencesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
