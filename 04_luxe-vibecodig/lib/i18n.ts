import {
  Locale,
  Translations,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  getDictionary,
  localeDetails,
  dictionaries,
} from './locales';

export {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  getDictionary,
  localeDetails,
  dictionaries,
};
export type { Locale, Translations };

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
export const COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

/**
 * Retrieve a cookie value by name on the client.
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Save selected language in a cookie with 30 days expiration.
 */
export function setLanguageCookie(locale: Locale): void {
  if (typeof document === 'undefined') return;
  // 30 days cookie expiration
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

/**
 * Change the active language, save cookie for 30 days and reload the page.
 */
export function changeLanguage(locale: Locale): void {
  setLanguageCookie(locale);
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

/**
 * Detect client-side locale from cookie or fallback to DEFAULT_LOCALE.
 */
export function getClientLocale(): Locale {
  const cookieVal = getCookie(LOCALE_COOKIE_NAME);
  if (cookieVal && (SUPPORTED_LOCALES as readonly string[]).includes(cookieVal)) {
    return cookieVal as Locale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Get translations dictionary for a given locale (defaults to client locale or DEFAULT_LOCALE).
 */
export function getTranslations(locale?: Locale): Translations {
  const activeLocale = locale || (typeof window !== 'undefined' ? getClientLocale() : DEFAULT_LOCALE);
  return getDictionary(activeLocale);
}

/**
 * Alias for getTranslations.
 */
export const t = getTranslations;

/**
 * Server-side helper to read the locale from Next.js cookies.
 */
export async function getServerLocale(): Promise<Locale> {
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const val = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
      if (val && (SUPPORTED_LOCALES as readonly string[]).includes(val)) {
        return val as Locale;
      }
    } catch {
      // Fallback if invoked outside request context
    }
  }
  return DEFAULT_LOCALE;
}
