/**
 * hook: useLanguage
 * proposito: acceder al contexto de idiomas desde cualquier componente
 */

import { useContext } from 'react';
import { LanguageContext } from './LanguageContextDef';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe usarse dentro de un LanguageProvider');
  }
  return context;
};
