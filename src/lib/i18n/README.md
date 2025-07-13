# Internationalization (i18n) Setup for Next.js App Router

This directory contains the i18n configuration adapted for Next.js App Router, migrated from the original Gambarie Summer Events project.

## Structure

```
src/lib/i18n/
├── index.ts              # Main i18n configuration
├── client.ts             # Client-side utilities
├── provider.tsx          # React context provider
├── server.ts             # Server-side utilities
├── types.ts              # TypeScript types and utilities
├── index.client.ts       # Client-side barrel exports
├── example-usage.tsx     # Usage examples
└── resources/
    ├── en.json           # English translations
    └── it.json           # Italian translations
```

## Usage

### Client Components

```tsx
'use client';

import { useTranslation } from '@/lib/i18n/client';

export function MyClientComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('header.events')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
      <button onClick={() => i18n.changeLanguage('it')}>
        Italiano
      </button>
    </div>
  );
}
```

### Server Components

```tsx
import { createServerI18n, getServerTranslations } from '@/lib/i18n/server';

export async function MyServerComponent({ locale = 'it' }: { locale?: string }) {
  // Option 1: Use i18n instance
  const i18n = await createServerI18n(locale);
  const t = i18n.getFixedT(locale);
  
  // Option 2: Use direct translations
  const translations = getServerTranslations(locale);
  
  return (
    <div>
      <h1>{t('header.events')}</h1>
      <p>{translations.footer.description}</p>
    </div>
  );
}
```

### Language Detection

The configuration automatically detects the user's language preference using:
1. Local storage (`i18nextLng` key)
2. Browser navigator language
3. HTML lang attribute

### Supported Languages

- Italian (`it`) - Default
- English (`en`)

### Adding New Translations

1. Add new keys to both `resources/it.json` and `resources/en.json`
2. Use nested objects for organization
3. Follow the existing structure for consistency

### Integration with Next.js App Router

The i18n provider is already integrated in the root layout (`src/app/layout.tsx`). The configuration handles both client-side and server-side rendering automatically.

### Dependencies

- `i18next` - Core internationalization framework
- `react-i18next` - React integration
- `i18next-browser-languagedetector` - Automatic language detection

All dependencies are already installed in the project.