'use client';

import React from 'react';
import { Property } from '@/types/property';
import PropertyCard from './PropertyCard';

interface NewInMarketSectionProps {
  properties: Property[];
  marketFilter: 'All' | 'Buy' | 'Rent';
  onMarketFilterChange: (filter: 'All' | 'Buy' | 'Rent') => void;
  onPropertySelect?: (property: Property) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export default function NewInMarketSection({
  properties,
  marketFilter,
  onMarketFilterChange,
  onPropertySelect,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: NewInMarketSectionProps) {
  const filterOptions: Array<'All' | 'Buy' | 'Rent'> = ['All', 'Buy', 'Rent'];

  return (
    <section>
      {/* Header and Filter Buttons */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-[#19322F] dark:text-white">
            New in Market
          </h2>
          <p className="text-[#5C706D] mt-1 text-sm">
            Fresh opportunities added this week.
          </p>
        </div>

        {/* Filter Toggle Buttons (All, Buy, Rent) */}
        <div className="hidden md:flex bg-white dark:bg-white/5 p-1 rounded-lg border border-[#19322F]/5">
          {filterOptions.map((option) => {
            const isSelected = marketFilter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onMarketFilterChange(option)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#19322F] text-white shadow-sm'
                    : 'text-[#5C706D] hover:text-[#19322F] dark:hover:text-white'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-[#19322F]/15">
          <span className="material-icons text-4xl text-[#5C706D]/60 mb-2">
            search_off
          </span>
          <p className="text-lg font-medium text-[#19322F] dark:text-white">
            No properties found
          </p>
          <p className="text-sm text-[#5C706D] mt-1">
            Try adjusting your search query or filters.
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

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3 bg-white dark:bg-white/5 border border-[#19322F]/10 dark:border-white/10 hover:border-[#006655] hover:text-[#006655] text-[#19322F] dark:text-white font-medium rounded-lg transition-all hover:shadow-md cursor-pointer disabled:opacity-50"
          >
            {isLoadingMore ? 'Loading...' : 'Load more properties'}
          </button>
        </div>
      )}
    </section>
  );
}
