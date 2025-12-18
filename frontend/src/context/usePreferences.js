/**
 * hook: usePreferences
 * proposito: acceder al contexto de preferencias desde cualquier componente
 */

import { useContext } from 'react';
import { PreferencesContext } from './PreferencesContextDef';

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences debe usarse dentro de un PreferencesProvider');
  }
  return context;
};
