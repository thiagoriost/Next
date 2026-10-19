'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Locale, SUPPORTED_LOCALES, localeDetails } from '@/lib/i18n';
import { useI18n } from '@/components/providers/I18nProvider';

interface LanguageDropdownProps {
  className?: string;
  variant?: 'minimal' | 'pill' | 'card';
  showLabel?: boolean;
}

export default function LanguageDropdown({
  className = '',
  variant = 'pill',
  showLabel = true,
}: LanguageDropdownProps) {
  const { locale, changeLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (newLocale: Locale) => {
    setIsOpen(false);
    if (newLocale !== locale) {
      changeLanguage(newLocale);
    }
  };

  const current = localeDetails[locale] || localeDetails.en;

  const buttonStyles = {
    pill: 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#19322F] text-xs font-semibold shadow-sm border border-[#006655]/15 transition-all hover:border-[#006655]/30 cursor-pointer',
    minimal: 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[#19322F] hover:text-[#006655] hover:bg-[#006655]/5 text-xs font-semibold transition-colors cursor-pointer',
    card: 'inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-white border border-[#19322F]/10 text-sm font-medium text-[#19322F] shadow-sm hover:border-[#006655]/40 transition-all cursor-pointer',
  }[variant];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select language"
        className={buttonStyles}
      >
        <span className="text-base leading-none select-none">{current.flag}</span>
        {showLabel && <span className="tracking-tight">{current.label}</span>}
        <span
          className={`material-icons text-sm text-[#5C706D] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#006655]' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white shadow-xl border border-[#006655]/15 py-1.5 z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5C706D] border-b border-gray-100 mb-1">
            {locale === 'es' ? 'Seleccionar idioma' : 'Select language'}
          </div>
          {SUPPORTED_LOCALES.map((langKey) => {
            const details = localeDetails[langKey];
            const isSelected = locale === langKey;
            return (
              <button
                key={langKey}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(langKey)}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#006655]/10 text-[#006655] font-semibold'
                    : 'text-[#19322F] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base select-none">{details.flag}</span>
                  <span>{details.name}</span>
                </div>
                {isSelected && (
                  <span className="material-icons text-sm text-[#006655]">check</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
