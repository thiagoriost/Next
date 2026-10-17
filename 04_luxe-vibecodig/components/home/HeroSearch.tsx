'use client';

import React, { FormEvent } from 'react';
import { PropertyCategory } from '@/types/property';
import { PROPERTY_CATEGORIES } from '@/data/properties';

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: PropertyCategory;
  onSelectCategory: (category: PropertyCategory) => void;
  onFilterClick?: () => void;
}

export default function HeroSearch({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onFilterClick,
}: HeroSearchProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#19322F] leading-tight">
          Find your{' '}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">sanctuary</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-[#006655]/20 -rotate-1 z-0"></span>
          </span>
          .
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-icons text-[#5C706D] text-2xl group-focus-within:text-[#006655] transition-colors">
              search
            </span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-12 pr-28 py-4 rounded-xl border-none bg-white text-[#19322F] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] placeholder-[#5C706D]/60 focus:ring-2 focus:ring-[#006655] focus:outline-none focus:bg-white transition-all text-lg"
            placeholder="Search by city, neighborhood, or address..."
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 px-6 bg-[#006655] hover:bg-[#006655]/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-[#006655]/20 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Category Pills & Filters */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {PROPERTY_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={
                  isSelected
                    ? 'whitespace-nowrap px-5 py-2 rounded-full bg-[#19322F] text-white text-sm font-medium shadow-lg shadow-[#19322F]/10 transition-transform hover:-translate-y-0.5 cursor-pointer'
                    : 'whitespace-nowrap px-5 py-2 rounded-full bg-white border border-[#19322F]/5 text-[#5C706D] hover:text-[#19322F] hover:border-[#006655]/50 text-sm font-medium transition-all hover:bg-[#006655]/5 cursor-pointer'
                }
              >
                {category}
              </button>
            );
          })}

          <div className="w-px h-6 bg-[#19322F]/10 mx-2"></div>

          <button
            type="button"
            onClick={onFilterClick}
            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-[#19322F] font-medium text-sm hover:bg-black/5 transition-colors cursor-pointer"
          >
            <span className="material-icons text-base">tune</span> Filters
          </button>
        </div>
      </div>
    </section>
  );
}
