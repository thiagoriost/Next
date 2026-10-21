'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { formatPrice } from '@/data/properties';
import { useI18n } from '@/components/providers/I18nProvider';

interface FeaturedCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
}

export default function FeaturedCard({ property, onSelect }: FeaturedCardProps) {
  const { locale, t } = useI18n();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80';

  let badgeText = property.badge;
  if (badgeText === 'FEATURED') {
    badgeText = t.common.featuredBadge;
  } else if (badgeText === 'FOR RENT') {
    badgeText = t.common.forRent;
  } else if (badgeText === 'FOR SALE') {
    badgeText = t.common.forSale;
  }

  // Use localized period label for display (e.g. 'mo' -> 'mes' in Spanish)
  const periodDisplayText = property.pricePeriod ? t.common.perMonth : undefined;
  const formattedArea = new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US').format(
    property.areaSqM,
  );

  return (
    <Link
      href={`/properties/${property.slug}`}
      onClick={() => onSelect?.(property)}
      className="group relative rounded-xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] bg-white cursor-pointer transition-all duration-300 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] block"
    >
      {/* Property Image Container */}
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        {badgeText && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#19322F] shadow-sm">
            {badgeText}
          </div>
        )}

        {/* Favorite Button */}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#19322F] hover:bg-[#006655] hover:text-white transition-all cursor-pointer shadow-sm z-10"
        >
          <span className={`material-icons text-xl ${isFavorite ? 'text-red-500 fill-current' : ''}`}>
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>

        {/* Subtle Bottom Gradient */}
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Property Content */}
      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-medium text-[#19322F] group-hover:text-[#006655] transition-colors">
              {property.title}
            </h3>
            <p className="text-[#5C706D] text-sm flex items-center gap-1 mt-1">
              <span className="material-icons text-sm">place</span> {property.location}
            </p>
          </div>
          <span className="text-xl font-semibold text-[#006655]">
            {formatPrice(property.price)}{periodDisplayText ? `/${periodDisplayText}` : ''}
          </span>
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#19322F]/5">
          <div className="flex items-center gap-2 text-[#5C706D] text-sm">
            <span className="material-icons text-lg">king_bed</span> {property.beds} {t.common.beds}
          </div>
          <div className="flex items-center gap-2 text-[#5C706D] text-sm">
            <span className="material-icons text-lg">bathtub</span> {property.baths} {t.common.baths}
          </div>
          <div className="flex items-center gap-2 text-[#5C706D] text-sm">
            <span className="material-icons text-lg">square_foot</span>{' '}
            {formattedArea} m²
          </div>
        </div>
      </div>
    </Link>
  );
}
