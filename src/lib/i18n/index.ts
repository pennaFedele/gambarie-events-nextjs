import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import itTranslations from './resources/it.json';
import enTranslations from './resources/en.json';

const resources = {
  it: {
    translation: itTranslations
  },
  en: {
    translation: enTranslations
  }
};

// Default configuration for i18next
const defaultOptions = {
  resources,
  fallbackLng: 'it',
  debug: false,
  
  interpolation: {
    escapeValue: false
  }
};

// Check if we're on the client side
const isClient = typeof window !== 'undefined';

if (isClient) {
  // Client-side configuration with language detector
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      ...defaultOptions,
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        lookupLocalStorage: 'i18nextLng',
        caches: ['localStorage']
      }
    });
} else {
  // Server-side configuration without language detector
  i18n
    .use(initReactI18next)
    .init(defaultOptions);
}

export default i18n;