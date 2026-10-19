'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/components/providers/I18nProvider';
import LanguageDropdown from '@/components/common/LanguageDropdown';
import LanguageFlag from '@/components/common/LanguageFlag';
import { SUPPORTED_LOCALES, localeDetails, Locale } from '@/lib/i18n';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Navbar({
  activeTab = 'Buy',
  onTabChange,
}: NavbarProps) {
  const router = useRouter();
  const { locale, t, changeLanguage } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'Buy', label: t.navbar.buy },
    { key: 'Rent', label: t.navbar.rent },
    { key: 'Sell', label: t.navbar.sell },
    { key: 'Saved Homes', label: t.navbar.savedHomes },
  ];

  const handleNavClick = (key: string) => {
    if (onTabChange) {
      onTabChange(key);
    } else {
      if (key === 'Buy') {
        router.push('/?marketType=Buy');
      } else if (key === 'Rent') {
        router.push('/?marketType=Rent');
      } else {
        router.push('/');
      }
    }
  };

  const handleMobileLanguageChange = (lang: Locale) => {
    if (lang !== locale) {
      changeLanguage(lang);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#EEF6F6]/95 backdrop-blur-md border-b border-[#006655]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Company Icon - Returns to Home */}
          <Link
            href="/"
            aria-label="Return to LuxeEstate Home"
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[#006655] text-3xl font-bold transition-transform group-hover:scale-110">
              villa
            </span>
            <span className="font-bold text-xl tracking-tight text-[#19322F]">
              {t.common.brand}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`relative text-sm font-semibold transition-colors py-2 cursor-pointer ${
                    isActive
                      ? 'text-[#19322F]'
                      : 'text-[#19322F]/70 hover:text-[#006655]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#006655]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Icons & Language Selector */}
          <div className="flex items-center gap-2.5">
            {/* Desktop Language Selector */}
            <div className="hidden sm:block mr-1">
              <LanguageDropdown variant="pill" showLabel={true} />
            </div>

            <button
              aria-label={t.navbar.searchAria}
              onClick={() => router.push('/')}
              className="p-2 text-[#19322F] hover:text-[#006655] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <button
              aria-label={t.navbar.notificationsAria}
              className="p-2 text-[#19322F] hover:text-[#006655] transition-colors relative cursor-pointer"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#006655] rounded-full" />
            </button>

            {/* Profile Avatar */}
            <button
              aria-label={t.navbar.userProfileAria}
              className="ml-1 flex items-center gap-2 p-1 rounded-full hover:bg-[#006655]/5 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#006655]/10 overflow-hidden border border-[#006655]/20">
                <img
                  alt="User Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhLuM9qNltZNxgIWPtC3dVxQ_JLFKXYB9d_klGFux_2JVOGtRlbV4GvpvdT4wqpsueZnXFQhKJe9MGGvM6rXQX15iv80mbEKxjmy4X14AZRqvp573ZlKYDN9bAb0ka7B-g5mkOCP6nRuKC9QsO02JVq6gqZeAo3-7dUurVhhgPJGeuL0Gk2Cp3Wnu5mVlUtpajB2wtx8uMoytbh78i9RmHYtJg52ZELl9XdIC9f5Kix_lFMFoi6Ru61ARrEGIrvgvz4ViiKhufTns"
                />
              </div>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#19322F] hover:text-[#006655] p-1 cursor-pointer ml-1"
              aria-label={t.navbar.toggleMenuAria}
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden border-t border-[#006655]/10 bg-[#EEF6F6] overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-96 py-3' : 'max-h-0'
        }`}
      >
        <div className="px-4 space-y-2">
          {/* Navigation Links */}
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  handleNavClick(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'text-[#006655] bg-[#006655]/10 font-semibold'
                    : 'text-[#19322F] hover:bg-black/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Mobile Language Switcher */}
          <div className="pt-3 border-t border-[#006655]/10">
            <div className="px-3 text-xs font-semibold uppercase tracking-wider text-[#5C706D] mb-2">
              {t.footer.availableLanguages}
            </div>
            <div className="grid grid-cols-2 gap-2 px-1">
              {SUPPORTED_LOCALES.map((langKey) => {
                const details = localeDetails[langKey];
                const isActive = locale === langKey;
                return (
                  <button
                    key={langKey}
                    type="button"
                    onClick={() => handleMobileLanguageChange(langKey)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#006655] text-white'
                        : 'bg-white border border-[#006655]/10 text-[#19322F]'
                    }`}
                  >
                    <LanguageFlag locale={langKey} />
                    <span>{details.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
