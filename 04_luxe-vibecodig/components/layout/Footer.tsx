'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/components/providers/I18nProvider';
import { SUPPORTED_LOCALES, localeDetails, Locale } from '@/lib/i18n';

export default function Footer() {
  const { locale, t, changeLanguage } = useI18n();

  const handleLanguageSelect = (lang: Locale) => {
    if (lang !== locale) {
      changeLanguage(lang);
    }
  };

  return (
    <footer className="bg-white border-t border-[#19322F]/10 mt-20 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#19322F]/10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#006655] text-3xl font-bold transition-transform group-hover:scale-110">
                villa
              </span>
              <span className="font-bold text-2xl tracking-tight text-[#19322F]">
                LuxeEstate
              </span>
            </Link>
            <p className="text-sm text-[#5C706D] max-w-sm leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#19322F] mb-4">
              {t.footer.navigation}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/?marketType=Buy"
                  className="text-[#5C706D] hover:text-[#006655] transition-colors"
                >
                  {t.navbar.buy}
                </Link>
              </li>
              <li>
                <Link
                  href="/?marketType=Rent"
                  className="text-[#5C706D] hover:text-[#006655] transition-colors"
                >
                  {t.navbar.rent}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[#5C706D] hover:text-[#006655] transition-colors"
                >
                  {t.navbar.sell}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[#5C706D] hover:text-[#006655] transition-colors"
                >
                  {t.navbar.savedHomes}
                </Link>
              </li>
            </ul>
          </div>

          {/* Available Languages in Footer */}
          {/* <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#19322F] mb-4">
              {t.footer.availableLanguages}
            </h4>
            <div className="flex flex-col gap-2">
              {SUPPORTED_LOCALES.map((langKey) => {
                const details = localeDetails[langKey];
                const isActive = locale === langKey;
                return (
                  <button
                    key={langKey}
                    type="button"
                    onClick={() => handleLanguageSelect(langKey)}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-lg text-sm transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#006655] text-white font-medium shadow-sm'
                        : 'bg-[#EEF6F6] text-[#19322F] hover:bg-[#006655]/10 hover:text-[#006655]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{details.flag}</span>
                      <span>{details.name}</span>
                    </div>
                    {isActive && (
                      <span className="material-icons text-sm">check</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div> */}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C706D]">
          <div>{t.footer.rightsReserved}</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#006655] cursor-pointer">Privacy</span>
            <span className="hover:text-[#006655] cursor-pointer">Terms</span>
            <span className="hover:text-[#006655] cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
