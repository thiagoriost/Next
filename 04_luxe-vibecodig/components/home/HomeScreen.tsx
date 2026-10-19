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
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialBeds?: number;
  initialBaths?: number;
  initialAmenities?: string[];
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
  initialMinPrice,
  initialMaxPrice,
  initialBeds,
  initialBaths,
  initialAmenities,
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
  const [minPrice, setMinPrice] = useState<number | undefined>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialMaxPrice);
  const [beds, setBeds] = useState<number | undefined>(initialBeds);
  const [baths, setBaths] = useState<number | undefined>(initialBaths);
  const [amenities, setAmenities] = useState<string[] | undefined>(initialAmenities);

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

  const handleApplyFilters = (filters: {
    location: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    amenities?: string[];
  }) => {
    setSearchQuery(filters.location);
    if (filters.propertyType) {
      setSelectedCategory(filters.propertyType as PropertyCategory);
    }
    setMinPrice(filters.minPrice);
    setMaxPrice(filters.maxPrice);
    setBeds(filters.beds);
    setBaths(filters.baths);
    setAmenities(filters.amenities);

    updateUrl({
      q: filters.location,
      category: filters.propertyType,
      minPrice: filters.minPrice ? String(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? String(filters.maxPrice) : undefined,
      beds: filters.beds ? String(filters.beds) : undefined,
      baths: filters.baths ? String(filters.baths) : undefined,
      amenities: filters.amenities?.length ? filters.amenities.join(',') : undefined,
    });
  };

  // Filter featured properties client-side (small dataset, no need to paginate)
  const filteredFeatured = featuredProperties.filter((prop) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || prop.category === selectedCategory;

    const matchesMinPrice = !minPrice || prop.price >= minPrice;
    const matchesMaxPrice = !maxPrice || prop.price <= maxPrice;
    const matchesBeds = !beds || prop.beds >= beds;
    const matchesBaths = !baths || prop.baths >= baths;
    const matchesAmenities =
      !amenities ||
      amenities.length === 0 ||
      amenities.every((a) => prop.amenities?.includes(a));

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesBeds &&
      matchesBaths &&
      matchesAmenities
    );
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
          filterValues={{
            minPrice,
            maxPrice,
            beds,
            baths,
            amenities,
          }}
          onApplyFilters={handleApplyFilters}
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
