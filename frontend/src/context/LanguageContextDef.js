import { createContext } from 'react';

export const LanguageContext = createContext({
  language: 'es',
  translations: {},
  setLanguage: () => {},
  t: (key) => key,
});
