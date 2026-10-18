'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import HeroSearch from '@/components/home/HeroSearch';
import FeaturedSection from '@/components/home/FeaturedSection';
import NewInMarketSection from '@/components/home/NewInMarketSection';
import { Property, PropertyCategory } from '@/types/property';

interface HomeScreenProps {
  featuredProperties: Property[];
  marketProperties: Property[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  initialCategory: PropertyCategory;
  initialMarketType: 'All' | 'Buy' | 'Rent';
  initialSearchQuery: string;
}

export default function HomeScreen({
  featuredProperties,
  marketProperties,
  totalPages,
  currentPage,
  totalCount,
  initialCategory,
  initialMarketType,
  initialSearchQuery,
}: HomeScreenProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [activeNavTab, setActiveNavTab] = useState<string>(
    initialMarketType === 'Buy' ? 'Buy' : initialMarketType === 'Rent' ? 'Rent' : 'Buy'
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>(initialCategory);
  const [marketFilter, setMarketFilter] = useState<'All' | 'Buy' | 'Rent'>(initialMarketType);

  /** Update URL searchParams, resetting page to 1 on filter changes */
  const updateUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset page when filters change
    params.delete('page');

    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === 'All' || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateUrl({ q: value });
  };

  const handleCategoryChange = (cat: PropertyCategory) => {
    setSelectedCategory(cat);
    updateUrl({ category: cat });
  };

  const handleMarketFilterChange = (filter: 'All' | 'Buy' | 'Rent') => {
    setMarketFilter(filter);
    updateUrl({ marketType: filter });
  };

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === 'Buy') {
      handleMarketFilterChange('Buy');
    } else if (tab === 'Rent') {
      handleMarketFilterChange('Rent');
    } else {
      handleMarketFilterChange('All');
    }
  };

  // Filter featured properties client-side (small dataset, no need to paginate)
  const filteredFeatured = featuredProperties.filter((prop) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || prop.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#EEF6F6] text-[#19322F] font-sans antialiased selection:bg-[#006655] selection:text-white transition-colors">
      {/* Navigation */}
      <Navbar
        activeTab={activeNavTab}
        onTabChange={handleNavTabChange}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Hero & Search Section */}
        <HeroSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
          onFilterClick={() => {
            if (selectedCategory !== 'All') {
              handleCategoryChange('All');
            }
          }}
        />

        {/* Featured Collections Section */}
        <FeaturedSection properties={filteredFeatured} />

        {/* New in Market Section — server-paginated */}
        <NewInMarketSection
          properties={marketProperties}
          marketFilter={marketFilter}
          onMarketFilterChange={handleMarketFilterChange}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </main>
    </div>
  );
}
