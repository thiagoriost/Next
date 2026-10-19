'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react';
import {
  Locale,
  Translations,
  DEFAULT_LOCALE,
  getDictionary,
  changeLanguage as setLanguageAndReload,
  getClientLocale,
} from '@/lib/i18n';

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  changeLanguage: (newLocale: Locale) => void;
}

const subscribeToLocale = () => () => {};

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  t: getDictionary(DEFAULT_LOCALE),
  changeLanguage: () => {},
});

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getClientLocale,
    () => initialLocale,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const handleLanguageChange = (newLocale: Locale) => {
    setLanguageAndReload(newLocale);
  };

  const value: I18nContextValue = {
    locale,
    t: getDictionary(locale),
    changeLanguage: handleLanguageChange,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
