import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LanguageContext } from './LanguageContextDef';
import languagesService from '../services/languagesService';
import TRANSLATIONS from '../components/features/languages';

// Import all language files
import esTranslations from '../components/features/languages/es.json';
import enTranslations from '../components/features/languages/en.json';
import ptTranslations from '../components/features/languages/pt.json';
import ptBRTranslations from '../components/features/languages/pt_BR.json';
import ruTranslations from '../components/features/languages/ru.json';
import frTranslations from '../components/features/languages/fr.json';

const LANGUAGE_TRANSLATIONS = {
  es: esTranslations,
  en: enTranslations,
  pt: ptTranslations,
  pt_BR: ptBRTranslations,
  ru: ruTranslations,
  fr: frTranslations,
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('es');
  const [translations, setTranslations] = useState(esTranslations);

  // Get initial language from localStorage or preferences
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Try to get language from localStorage first
        const savedLanguage = localStorage.getItem('app_language');
        if (savedLanguage && LANGUAGE_TRANSLATIONS[savedLanguage]) {
          setLanguageState(savedLanguage);
          setTranslations(LANGUAGE_TRANSLATIONS[savedLanguage]);
          return;
        }

        // Try to get from backend if user is logged in
        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            const prefs = await languagesService.getPreferences();
            const lang = prefs.language || 'es';
            if (LANGUAGE_TRANSLATIONS[lang]) {
              setLanguageState(lang);
              setTranslations(LANGUAGE_TRANSLATIONS[lang]);
              localStorage.setItem('app_language', lang);
              return;
            }
          } catch (err) {
            console.error('Error loading language from backend:', err);
          }
        }

        // Default to Spanish ('es')
        setLanguageState('es');
        setTranslations(LANGUAGE_TRANSLATIONS['es']);
        localStorage.setItem('app_language', 'es');
      } catch (err) {
        console.error('Error initializing language:', err);
        setLanguageState('es');
        setTranslations(esTranslations);
      }
    };

    initializeLanguage();
  }, []);

  // Translation function - safely navigate nested objects
  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    // prefer live translations state; fallback to static TRANSLATIONS for the current language
    let current = translations && Object.keys(translations).length ? translations : (TRANSLATIONS[language] || TRANSLATIONS.es);

    let resolved = null;
    let found = false;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Attempt fallbacks: english then spanish
        const english = TRANSLATIONS.en;
        const spanish = TRANSLATIONS.es;
        const resolveFrom = (obj) => {
          let cur = obj;
          for (const kk of keys) {
            if (cur && typeof cur === 'object' && kk in cur) cur = cur[kk];
            else return null;
          }
          return typeof cur === 'string' ? cur : null;
        };

        const fromEn = resolveFrom(english);
        if (fromEn) {
          resolved = fromEn;
          found = true;
          break;
        }
        const fromEs = resolveFrom(spanish);
        if (fromEs) {
          resolved = fromEs;
          found = true;
          break;
        }

        // Return the key if translation not found anywhere
        console.warn(`Missing translation for key '${key}' (current language: ${language})`);
        return key;
      }
    }

    if (!found) {
      resolved = typeof current === 'string' ? current : key;
    }

    // Handle interpolation if params are provided
    if (resolved && typeof resolved === 'string') {
      let interpolated = resolved;
      Object.entries(params).forEach(([k, v]) => {
        interpolated = interpolated.replace(new RegExp(`{{${k}}}`, 'g'), v);
      });
      return interpolated;
    }

    return resolved || key;
  }, [translations, language]);

  // Set language and save to localStorage and backend
  const setLanguage = useCallback(
    async (newLanguage) => {
      if (LANGUAGE_TRANSLATIONS[newLanguage]) {
        setLanguageState(newLanguage);
        setTranslations(LANGUAGE_TRANSLATIONS[newLanguage]);
        localStorage.setItem('app_language', newLanguage);

        // Try to save to backend if user is logged in
        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            await languagesService.updatePreferences({ language: newLanguage });
          } catch (err) {
            console.error('Error saving language to backend:', err);
            // Still succeed locally even if backend fails
          }
        }
      }
    },
    []
  );

  const value = {
    language,
    translations,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
