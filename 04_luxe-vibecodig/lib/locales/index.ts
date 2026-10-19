import { en } from './en';
import { es } from './es';
import { Locale, Translations } from './types';

export * from './types';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'es'];
export const DEFAULT_LOCALE: Locale = 'en';

export const dictionaries: Record<Locale, Translations> = {
  en,
  es,
};

export const localeDetails: Record<Locale, { name: string; flag: string; label: string }> = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    label: 'English',
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    label: 'Español',
  },
};

export function getDictionary(locale: Locale): Translations {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}
