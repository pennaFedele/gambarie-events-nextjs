/**
 * Example usage of i18n in Next.js App Router components
 * 
 * This file demonstrates how to use the i18n configuration
 * in both client and server components.
 */

'use client';

import { useTranslation } from './client';

// Example Client Component
export function ExampleClientComponent() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (locale: string) => {
    i18n.changeLanguage(locale);
  };

  return (
    <div>
      <h1>{t('header.events')}</h1>
      <p>{t('footer.description')}</p>
      
      <div>
        <button onClick={() => handleLanguageChange('it')}>
          Italiano
        </button>
        <button onClick={() => handleLanguageChange('en')}>
          English
        </button>
      </div>
      
      <p>{t('common.loading')}</p>
    </div>
  );
}

// For Server Components, you would use the server utilities:
/*
import { createServerI18n, getServerTranslations } from './server';

export async function ExampleServerComponent({ locale = 'it' }: { locale?: string }) {
  const i18n = await createServerI18n(locale);
  const t = i18n.getFixedT(locale);
  
  // Or use direct translations
  const translations = getServerTranslations(locale);
  
  return (
    <div>
      <h1>{t('header.events')}</h1>
      <p>{translations.footer.description}</p>
    </div>
  );
}
*/