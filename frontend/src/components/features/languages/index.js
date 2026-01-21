/**
 * index.js - Exportar todas las traducciones
 * Facilita el acceso a las traducciones desde cualquier parte de la aplicación
 */

import esTranslations from './es.json';
import enTranslations from './en.json';
import ptTranslations from './pt.json';
import ptBRTranslations from './pt_BR.json';
import ruTranslations from './ru.json';
import frTranslations from './fr.json';

export const LANGUAGE_CODES = {
  SPANISH: 'es',
  ENGLISH: 'en',
  PORTUGUESE: 'pt',
  BRAZILIAN_PORTUGUESE: 'pt_BR',
  RUSSIAN: 'ru',
  FRENCH: 'fr',
};

export const LANGUAGE_NAMES = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
  pt_BR: 'Português Brasileiro',
  ru: 'Русский',
  fr: 'Français',
};

export const LANGUAGE_FLAGS = {
  es: '🇪🇸',
  en: '🇺🇸',
  pt: '🇵🇹',
  pt_BR: '🇧🇷',
  ru: '🇷🇺',
  fr: '🇫🇷',
};

export const TRANSLATIONS = {
  [LANGUAGE_CODES.SPANISH]: esTranslations,
  [LANGUAGE_CODES.ENGLISH]: enTranslations,
  [LANGUAGE_CODES.PORTUGUESE]: ptTranslations,
  [LANGUAGE_CODES.BRAZILIAN_PORTUGUESE]: ptBRTranslations,
  [LANGUAGE_CODES.RUSSIAN]: ruTranslations,
  [LANGUAGE_CODES.FRENCH]: frTranslations,
};

export const AVAILABLE_LANGUAGES = Object.keys(LANGUAGE_CODES).map((key) => {
  const code = LANGUAGE_CODES[key];
  return {
    code,
    name: LANGUAGE_NAMES[code],
    flag: LANGUAGE_FLAGS[code],
  };
});

export default TRANSLATIONS;
