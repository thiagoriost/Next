'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Navbar({
  activeTab = 'Buy',
  onTabChange,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = ['Buy', 'Rent', 'Sell', 'Saved Homes'];

  const handleNavClick = (item: string) => {
    if (onTabChange) {
      onTabChange(item);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#EEF6F6]/95 backdrop-blur-md border-b border-[#19322F]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#19322F] flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="material-icons text-white text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-[#19322F]">
              LuxeEstate
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = activeTab === item;
              return (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={
                    isActive
                      ? 'text-[#006655] font-medium text-sm border-b-2 border-[#006655] px-1 py-1 transition-all'
                      : 'text-[#19322F]/70 hover:text-[#19322F] font-medium text-sm hover:border-b-2 hover:border-[#19322F]/20 px-1 py-1 transition-all'
                  }
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              aria-label="Search"
              className="text-[#19322F] hover:text-[#006655] transition-colors"
            >
              <span className="material-icons">search</span>
            </button>
            <button
              aria-label="Notifications"
              className="text-[#19322F] hover:text-[#006655] transition-colors relative"
            >
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#EEF6F6]"></span>
            </button>

            {/* Profile Avatar */}
            <button
              aria-label="User Profile"
              className="flex items-center gap-2 pl-2 border-l border-[#19322F]/10 ml-2"
            >
              <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-[#006655] transition-all">
                <img
                  alt="Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAWhQZ663Bd08kmzjbOPmUk4UIxYooNONShMEFXLR-DtmVi6Oz-TiaY77SPwFk7g0OobkeZEOMvt6v29mSOD0Xm2g95WbBG3ZjWXmiABOUwGU0LOySRfVDo-JTXQ0-gtwjWxbmue0qDm91m-zEOEZwAW6iRFB1qC1bAU-wkjxm67Sbztq8w7srHkFT9bVEC86qG-FzhOBTomhAurNRmx9l8Yfqabk328NfdKuVLckgCdaPsNFE3yN65MeoRi05GA_gXIMwG4YDIeA"
                />
              </div>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#19322F] hover:text-[#006655] p-1"
              aria-label="Toggle menu"
            >
              <span className="material-icons">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden border-t border-[#19322F]/5 bg-[#EEF6F6] overflow-hidden transition-all duration-300 ${
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
