'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ALL_PROPERTIES } from '@/data/properties';
import { useI18n } from '@/components/providers/I18nProvider';

export interface FilterValues {
  location: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType: string;
  beds: number;
  baths: number;
  amenities: string[];
}

interface SearchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: FilterValues;
  onApply: (filters: FilterValues) => void;
}

const AMENITIES_CONFIG = [
  { key: 'Swimming Pool', icon: 'pool' },
  { key: 'Gym', icon: 'fitness_center' },
  { key: 'Parking', icon: 'local_parking' },
  { key: 'Air Conditioning', icon: 'ac_unit' },
  { key: 'High-speed Wifi', icon: 'wifi' },
  { key: 'Patio / Terrace', icon: 'deck' },
];

const PROPERTY_TYPES_KEYS = ['All', 'House', 'Apartment', 'Condo', 'Townhouse', 'Villa', 'Penthouse'];

const MAX_SLIDER_PRICE = 10000000;
const SLIDER_STEP = 50000;

function formatCurrencyCompact(val: number): string {
  if (val >= 1000000) {
    const millions = val / 1000000;
    return `$${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }
  if (val >= 1000) {
    const thousands = Math.round(val / 1000);
    return `$${thousands}K`;
  }
  return `$${val.toLocaleString('en-US')}`;
}

export default function SearchFilterModal({
  isOpen,
  onClose,
  initialFilters,
  onApply,
}: SearchFilterModalProps) {
  const { t } = useI18n();

  const [location, setLocation] = useState<string>(initialFilters.location || '');
  const [minPrice, setMinPrice] = useState<number>(initialFilters.minPrice ?? 0);
  const [maxPrice, setMaxPrice] = useState<number>(initialFilters.maxPrice ?? 10000000);
  const [minPriceInput, setMinPriceInput] = useState<string>(
    (initialFilters.minPrice ?? 1200000).toLocaleString('en-US')
  );
  const [maxPriceInput, setMaxPriceInput] = useState<string>(
    (initialFilters.maxPrice ?? 4500000).toLocaleString('en-US')
  );
  const [propertyType, setPropertyType] = useState<string>(
    initialFilters.propertyType || 'All'
  );
  const [beds, setBeds] = useState<number>(initialFilters.beds ?? 3);
  const [baths, setBaths] = useState<number>(initialFilters.baths ?? 2);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialFilters.amenities?.length ? initialFilters.amenities : []
  );

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Price input formatting handlers
  const handleMinPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = raw ? parseInt(raw, 10) : 0;
    setMinPriceInput(num ? num.toLocaleString('en-US') : '');
    setMinPrice(num);
  };

  const handleMaxPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = raw ? parseInt(raw, 10) : 0;
    setMaxPriceInput(num ? num.toLocaleString('en-US') : '');
    setMaxPrice(num);
  };

  // Slider change handlers
  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxPrice - SLIDER_STEP);
    setMinPrice(val);
    setMinPriceInput(val.toLocaleString('en-US'));
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minPrice + SLIDER_STEP);
    setMaxPrice(val);
    setMaxPriceInput(val.toLocaleString('en-US'));
  };

  const toggleAmenity = (amenityKey: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityKey) ? prev.filter((a) => a !== amenityKey) : [...prev, amenityKey]
    );
  };

  const handleClearAll = () => {
    setLocation('');
    setMinPrice(0);
    setMaxPrice(MAX_SLIDER_PRICE);
    setMinPriceInput('0');
    setMaxPriceInput(MAX_SLIDER_PRICE.toLocaleString('en-US'));
    setPropertyType('All');
    setBeds(0);
    setBaths(0);
    setSelectedAmenities([]);
  };

  // Real-time matching properties counter
  const matchingHomesCount = useMemo(() => {
    return ALL_PROPERTIES.filter((p) => {
      // Location search
      if (location.trim()) {
        const q = location.toLowerCase().trim();
        const matchesLoc =
          p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
        if (!matchesLoc) return false;
      }

      // Property type
      if (propertyType && propertyType !== 'All') {
        const normalized =
          propertyType === 'Condo'
            ? 'Apartment'
            : propertyType === 'Townhouse'
              ? 'House'
              : propertyType;
        if (p.category !== normalized) return false;
      }

      // Price range
      if (minPrice > 0 && p.price < minPrice) return false;
      if (maxPrice > 0 && maxPrice < MAX_SLIDER_PRICE && p.price > maxPrice) return false;

      // Rooms
      if (beds > 0 && p.beds < beds) return false;
      if (baths > 0 && p.baths < baths) return false;

      // Amenities
      if (selectedAmenities.length > 0) {
        const pAmenities = p.amenities || [];
        const matchesAll = selectedAmenities.every((a) => pAmenities.includes(a));
        if (!matchesAll) return false;
      }

      return true;
    }).length;
  }, [location, propertyType, minPrice, maxPrice, beds, baths, selectedAmenities]);

  const handleApply = () => {
    onApply({
      location,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice < MAX_SLIDER_PRICE ? maxPrice : undefined,
      propertyType,
      beds,
      baths,
      amenities: selectedAmenities,
    });
    onClose();
  };

  if (!isOpen) return null;

  const minPercent = Math.min(100, Math.max(0, (minPrice / MAX_SLIDER_PRICE) * 100));
  const maxPercent = Math.min(100, Math.max(0, (maxPrice / MAX_SLIDER_PRICE) * 100));

  const priceRangeDisplay =
    minPrice === 0 && maxPrice >= MAX_SLIDER_PRICE
      ? t.filters.anyPrice
      : `${formatCurrencyCompact(minPrice)} – ${maxPrice >= MAX_SLIDER_PRICE ? '$10M+' : formatCurrencyCompact(maxPrice)
      }`;

  const showButtonText =
    matchingHomesCount === 1
      ? t.filters.showSingle.replace('{count}', String(matchingHomesCount))
      : t.filters.showMultiple.replace('{count}', String(matchingHomesCount));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Image Layer */}
      <div
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoSh7bCIKgaMhgJnEWdRkH3_ZuDeg09ALe8WS9dD7gtkzKBf7CBqgpivJDNX8El0EYOWPKs4NS5QaEBHIkK-iuDlOX5WnEiUmUonb4qrsXXXB61Qd0zzUm4V7hcQnQd9-CdydTKt8_AtyEsW-wAdOh-oGpp2sl4g4c_gRocCsh__C8LfxXqjSY_2ZzS2zNluerhVwTNouiD4RTxwLFFLFgOW1zhJr2VoYULE6gl8X2Jy2r70A64l7u9QwknqtTd_rQ0OflanZyJBk')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Modal Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-10 transition-opacity"
      />

      {/* Main Modal Container */}
      <main className="relative z-20 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-30">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {t.filters.title}
          </h1>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close filters"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 cursor-pointer"
          >
            <span className="material-icons">close</span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
          {/* Section 1: Location */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {t.filters.location}
            </label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#006611] transition-colors">
                location_on
              </span>
              <input
                className="w-full pl-12 pr-4 py-3 bg-[#f5f8f6] dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#006611] focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm focus:outline-none"
                placeholder={t.filters.locationPlaceholder}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </section>

          {/* Section 2: Price Range */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t.filters.priceRange}
              </label>
              <span className="text-sm font-medium text-[#006611]">
                {priceRangeDisplay}
              </span>
            </div>

            {/* Custom Interactive Range Slider Visual */}
            <div className="relative h-12 flex items-center mb-6 px-2 select-none">
              {/* Background Gray Track */}
              <div className="absolute w-[calc(100%-1rem)] left-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden pointer-events-none">
                <div
                  className="h-full bg-[#006611] transition-all"
                  style={{
                    marginLeft: `${minPercent}%`,
                    width: `${Math.max(0, maxPercent - minPercent)}%`,
                  }}
                />
              </div>

              {/* Native range sliders for interaction */}
              <input
                type="range"
                min={0}
                max={MAX_SLIDER_PRICE}
                step={SLIDER_STEP}
                value={minPrice}
                onChange={handleMinSliderChange}
                aria-label={t.filters.minPrice}
                className="absolute inset-x-2 w-[calc(100%-1rem)] appearance-none bg-transparent pointer-events-none z-20 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#006611] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#006611] [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:scale-110"
              />
              <input
                type="range"
                min={0}
                max={MAX_SLIDER_PRICE}
                step={SLIDER_STEP}
                value={maxPrice}
                onChange={handleMaxSliderChange}
                aria-label={t.filters.maxPrice}
                className="absolute inset-x-2 w-[calc(100%-1rem)] appearance-none bg-transparent pointer-events-none z-20 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#006611] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#006611] [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:scale-110"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f5f8f6] dark:bg-gray-800 p-3 rounded-lg border border-transparent focus-within:border-[#006611]/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">
                  {t.filters.minPrice}
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    className="w-full bg-transparent border-0 p-0 text-gray-900 dark:text-white font-medium focus:ring-0 text-sm focus:outline-none"
                    type="text"
                    value={minPriceInput}
                    onChange={handleMinPriceInputChange}
                  />
                </div>
              </div>
              <div className="bg-[#f5f8f6] dark:bg-gray-800 p-3 rounded-lg border border-transparent focus-within:border-[#006611]/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">
                  {t.filters.maxPrice}
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    className="w-full bg-transparent border-0 p-0 text-gray-900 dark:text-white font-medium focus:ring-0 text-sm focus:outline-none"
                    type="text"
                    value={maxPriceInput}
                    onChange={handleMaxPriceInputChange}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Property Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Property Type */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t.filters.propertyType}
              </label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-[#f5f8f6] dark:bg-gray-800 border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-[#006611] cursor-pointer focus:outline-none"
                >
                  {PROPERTY_TYPES_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {t.filters.propertyTypeOptions[key] || key}
                    </option>
                  ))}
                </select>
                <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Rooms */}
            <div className="space-y-4">
              {/* Beds */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t.filters.bedrooms}
                </span>
                <div className="flex items-center space-x-3 bg-[#f5f8f6] dark:bg-gray-800 rounded-full p-1">
                  <button
                    type="button"
                    disabled={beds <= 0}
                    onClick={() => setBeds(Math.max(0, beds - 1))}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 hover:text-[#006611] disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-6 text-center text-gray-900 dark:text-white">
                    {beds === 0 ? t.filters.any : `${beds}+`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBeds(beds + 1)}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-[#006611] hover:bg-[#006611] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>

              {/* Baths */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t.filters.bathrooms}
                </span>
                <div className="flex items-center space-x-3 bg-[#f5f8f6] dark:bg-gray-800 rounded-full p-1">
                  <button
                    type="button"
                    disabled={baths <= 0}
                    onClick={() => setBaths(Math.max(0, baths - 1))}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 hover:text-[#006611] disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-6 text-center text-gray-900 dark:text-white">
                    {baths === 0 ? t.filters.any : `${baths}+`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBaths(baths + 1)}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-[#006611] hover:bg-[#006611] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Amenities */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              {t.filters.amenities}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITIES_CONFIG.map((item) => {
                const isChecked = selectedAmenities.includes(item.key);
                const localizedLabel = t.filters.amenityNames[item.key] || item.key;
                return (
                  <label key={item.key} className="cursor-pointer group relative">
                    <input
                      checked={isChecked}
                      onChange={() => toggleAmenity(item.key)}
                      className="peer sr-only"
                      type="checkbox"
                    />
                    <div
                      className={`h-full px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all select-none ${isChecked
                        ? 'border-[#006611] bg-[#006611]/10 text-[#006611] font-medium'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    >
                      <span
                        className={`material-icons text-lg ${isChecked
                          ? 'text-[#006611]'
                          : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                      >
                        {item.icon}
                      </span>
                      {localizedLabel}
                    </div>
                    {isChecked && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-[#006611] rounded-full opacity-100 transition-opacity"></div>
                    )}
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors underline decoration-gray-300 underline-offset-4 cursor-pointer"
          >
            {t.filters.clearAll}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="bg-[#006611] hover:bg-[#006611]/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-[#006611]/30 transition-all hover:shadow-[#006611]/40 flex items-center gap-2 transform active:scale-95 cursor-pointer"
          >
            {showButtonText}
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
