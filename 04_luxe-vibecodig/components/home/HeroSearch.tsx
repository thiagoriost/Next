'use client';

import React, { FormEvent, useState } from 'react';
import { PropertyCategory } from '@/types/property';
import { PROPERTY_CATEGORIES } from '@/data/properties';
import SearchFilterModal, { FilterValues } from './SearchFilterModal';

export interface HeroSearchFilterValues {
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  amenities?: string[];
}

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: PropertyCategory;
  onSelectCategory: (category: PropertyCategory) => void;
  filterValues?: HeroSearchFilterValues;
  onApplyFilters?: (filters: FilterValues) => void;
  onFilterClick?: () => void;
}

export default function HeroSearch({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  filterValues,
  onApplyFilters,
  onFilterClick,
}: HeroSearchProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const handleOpenFilters = () => {
    setIsFilterModalOpen(true);
    onFilterClick?.();
  };

  const handleApplyModalFilters = (applied: FilterValues) => {
    if (applied.location !== searchQuery) {
      onSearchChange(applied.location);
    }
    if (applied.propertyType && applied.propertyType !== selectedCategory) {
      onSelectCategory(applied.propertyType as PropertyCategory);
    }
    onApplyFilters?.(applied);
  };

  const activeFiltersCount =
    (filterValues?.minPrice && filterValues.minPrice > 0 ? 1 : 0) +
    (filterValues?.maxPrice && filterValues.maxPrice < 10000000 ? 1 : 0) +
    (filterValues?.beds && filterValues.beds > 0 ? 1 : 0) +
    (filterValues?.baths && filterValues.baths > 0 ? 1 : 0) +
    (filterValues?.amenities && filterValues.amenities.length > 0 ? 1 : 0);

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
            onClick={handleOpenFilters}
            className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all cursor-pointer ${
              activeFiltersCount > 0
                ? 'bg-[#006611] text-white shadow-md shadow-[#006611]/20 hover:bg-[#006611]/90'
                : 'text-[#19322F] hover:bg-black/5'
            }`}
          >
            <span className="material-icons text-base">tune</span>
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-0.5 w-5 h-5 rounded-full bg-white text-[#006611] text-xs flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <SearchFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          initialFilters={{
            location: searchQuery,
            minPrice: filterValues?.minPrice,
            maxPrice: filterValues?.maxPrice,
            propertyType: selectedCategory,
            beds: filterValues?.beds ?? 0,
            baths: filterValues?.baths ?? 0,
            amenities: filterValues?.amenities ?? [],
          }}
          onApply={handleApplyModalFilters}
        />
      )}
    </section>
  );
}
