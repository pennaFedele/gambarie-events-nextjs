import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';

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

export async function createServerI18n(locale: string = 'it') {
  const i18nInstance = createInstance();
  
  await i18nInstance
    .use(initReactI18next)
    .init({
      resources,
      lng: locale,
      fallbackLng: 'it',
      debug: false,
      interpolation: {
        escapeValue: false
      }
    });

  return i18nInstance;
}

export function getServerTranslations(locale: string = 'it') {
  const translations = resources[locale as keyof typeof resources] || resources.it;
  return translations.translation;
}