'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Navbar({
  activeTab = 'Buy',
  onTabChange,
}: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = ['Buy', 'Rent', 'Sell', 'Saved Homes'];

  const handleNavClick = (item: string) => {
    if (onTabChange) {
      onTabChange(item);
    } else {
      if (item === 'Buy') {
        router.push('/?marketType=Buy');
      } else if (item === 'Rent') {
        router.push('/?marketType=Rent');
      } else {
        router.push('/');
      }
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
              LuxeEstate
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => {
              const isActive = activeTab === item;
              return (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`relative text-sm font-semibold transition-colors py-2 cursor-pointer ${
                    isActive
                      ? 'text-[#19322F]'
                      : 'text-[#19322F]/70 hover:text-[#006655]'
                  }`}
                >
                  {item}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#006655]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              onClick={() => router.push('/')}
              className="p-2 text-[#19322F] hover:text-[#006655] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <button
              aria-label="Notifications"
              className="p-2 text-[#19322F] hover:text-[#006655] transition-colors relative cursor-pointer"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#006655] rounded-full" />
            </button>

            {/* Profile Avatar */}
            <button
              aria-label="User Profile"
              className="ml-2 flex items-center gap-2 p-1 rounded-full hover:bg-[#006655]/5 transition-colors cursor-pointer"
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
              className="md:hidden text-[#19322F] hover:text-[#006655] p-1 cursor-pointer"
              aria-label="Toggle menu"
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
          mobileMenuOpen ? 'max-h-60 py-2' : 'max-h-0'
        }`}
      >
        <div className="px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item;
            return (
              <button
                key={item}
                onClick={() => {
                  handleNavClick(item);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'text-[#006655] bg-[#006655]/10 font-semibold'
                    : 'text-[#19322F] hover:bg-black/5'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
