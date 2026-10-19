'use client';

import React, { Suspense } from 'react';
import { Property } from '@/types/property';
import PropertyCard from './PropertyCard';
import Pagination from './Pagination';
import { useI18n } from '@/components/providers/I18nProvider';

interface NewInMarketSectionProps {
  properties: Property[];
  marketFilter: 'All' | 'Buy' | 'Rent';
  onMarketFilterChange: (filter: 'All' | 'Buy' | 'Rent') => void;
  onPropertySelect?: (property: Property) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export default function NewInMarketSection({
  properties,
  marketFilter,
  onMarketFilterChange,
  onPropertySelect,
  currentPage,
  totalPages,
  totalCount,
}: NewInMarketSectionProps) {
  const { t } = useI18n();
  const filterOptions: Array<'All' | 'Buy' | 'Rent'> = ['All', 'Buy', 'Rent'];

  return (
    <section id="market-section">
      {/* Header and Filter Buttons */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-[#19322F]">
            {t.home.marketTitle}
          </h2>
          <p className="text-[#5C706D] mt-1 text-sm">
            {t.home.marketSubtitle}
          </p>
        </div>

        {/* Filter Toggle Buttons (All, Buy, Rent) */}
        <div className="hidden md:flex bg-white p-1 rounded-lg border border-[#19322F]/5">
          {filterOptions.map((option) => {
            const isSelected = marketFilter === option;
            const label = t.home.marketTabs[option] || option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onMarketFilterChange(option)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#19322F] text-white shadow-sm'
                    : 'text-[#5C706D] hover:text-[#19322F]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#19322F]/15">
          <span className="material-icons text-4xl text-[#5C706D]/60 mb-2">
            search_off
          </span>
          <p className="text-lg font-medium text-[#19322F]">
            {t.home.noResults}
          </p>
          <p className="text-sm text-[#5C706D] mt-1">
            {t.home.noResultsDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onPropertySelect}
            />
          ))}
        </div>
      )}

      {/* Server-side Pagination with 'Showing' / 'Mostrando' */}
      <Suspense>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </Suspense>
    </section>
  );
}
