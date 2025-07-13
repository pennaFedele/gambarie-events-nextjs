export const supportedLocales = ['it', 'en'] as const;
export type SupportedLocale = typeof supportedLocales[number];

export const defaultLocale: SupportedLocale = 'it';

export function isValidLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

export function getValidLocale(locale?: string): SupportedLocale {
  if (locale && isValidLocale(locale)) {
    return locale;
  }
  return defaultLocale;
}