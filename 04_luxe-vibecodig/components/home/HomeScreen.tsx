'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSearch from '@/components/home/HeroSearch';
import FeaturedSection from '@/components/home/FeaturedSection';
import NewInMarketSection from '@/components/home/NewInMarketSection';
import { Property, PropertyCategory } from '@/types/property';
import {
  FEATURED_PROPERTIES,
  INITIAL_MARKET_PROPERTIES,
  ADDITIONAL_MARKET_PROPERTIES,
} from '@/data/properties';

export default function HomeScreen() {
  const [activeNavTab, setActiveNavTab] = useState<string>('Buy');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] =
    useState<PropertyCategory>('All');
  const [marketFilter, setMarketFilter] = useState<'All' | 'Buy' | 'Rent'>('All');

  const [marketProperties, setMarketProperties] = useState<Property[]>(
    INITIAL_MARKET_PROPERTIES
  );
  const [hasLoadedMore, setHasLoadedMore] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Filter featured properties based on search and category
  const filteredFeatured = useMemo(() => {
    return FEATURED_PROPERTIES.filter((prop) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || prop.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Filter market properties based on search, category, and market type
  const filteredMarket = useMemo(() => {
    return marketProperties.filter((prop) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || prop.category === selectedCategory;

      const matchesMarketType =
        marketFilter === 'All' ||
        (marketFilter === 'Buy' && prop.type === 'sale') ||
        (marketFilter === 'Rent' && prop.type === 'rent');

      return matchesSearch && matchesCategory && matchesMarketType;
    });
  }, [marketProperties, searchQuery, selectedCategory, marketFilter]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setMarketProperties((prev) => [...prev, ...ADDITIONAL_MARKET_PROPERTIES]);
      setHasLoadedMore(true);
      setIsLoadingMore(false);
    }, 400);
  };

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === 'Buy') {
      setMarketFilter('Buy');
    } else if (tab === 'Rent') {
      setMarketFilter('Rent');
    } else {
      setMarketFilter('All');
    }
  };

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
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onFilterClick={() => {
            // Cycle through category or toggle all
            if (selectedCategory !== 'All') {
              setSelectedCategory('All');
            }
          }}
        />

        {/* Featured Collections Section */}
        <FeaturedSection properties={filteredFeatured} />

        {/* New in Market Section */}
        <NewInMarketSection
          properties={filteredMarket}
          marketFilter={marketFilter}
          onMarketFilterChange={setMarketFilter}
          onLoadMore={handleLoadMore}
          hasMore={!hasLoadedMore}
          isLoadingMore={isLoadingMore}
        />
      </main>
    </div>
  );
}
