'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { formatPrice } from '@/data/properties';
import { useI18n } from '@/components/providers/I18nProvider';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
  className?: string;
}

export default function PropertyCard({
  property,
  onSelect,
  className = '',
}: PropertyCardProps) {
  const { t } = useI18n();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const isRent = property.type === 'rent';

  // Localize badge if standard
  let badgeText = property.badge;
  if (!badgeText) {
    badgeText = isRent ? t.common.forRent : t.common.forSale;
  } else if (badgeText === 'FOR RENT') {
    badgeText = t.common.forRent;
  } else if (badgeText === 'FOR SALE') {
    badgeText = t.common.forSale;
  } else if (badgeText === 'FEATURED') {
    badgeText = t.common.featuredBadge;
  }

  const badgeBg = isRent ? 'bg-[#006655]/90' : 'bg-[#19322F]/90';
  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80';

  // Use localized period label (e.g. 'mo' -> 'mes' in Spanish)
  const periodText = property.pricePeriod ? t.common.perMonth : undefined;

  return (
    <Link
      href={`/properties/${property.slug}`}
      onClick={() => onSelect?.(property)}
      className={`bg-white rounded-xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 group cursor-pointer h-full flex flex-col ${className}`}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Favorite button */}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-[#006655] hover:text-white transition-colors text-[#19322F] cursor-pointer shadow-sm"
        >
          <span className={`material-icons text-lg ${isFavorite ? 'text-red-500 fill-current' : ''}`}>
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>

        {/* Status Badge */}
        <div className={`absolute bottom-3 left-3 ${badgeBg} text-white text-xs font-bold px-2 py-1 rounded shadow-sm`}>
          {badgeText}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-[#19322F]">
            {formatPrice(property.price)}
            {periodText && (
              <span className="text-sm font-normal text-[#5C706D]">
                /{periodText}
              </span>
            )}
          </h3>
        </div>

        <h4 className="text-[#19322F] font-medium truncate mb-1">
          {property.title}
        </h4>
        <p className="text-[#5C706D] text-xs mb-4">{property.location}</p>

        {/* Specs footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-[#5C706D] text-xs">
            <span className="material-icons text-sm text-[#006655]/80">
              king_bed
            </span>{' '}
            {property.beds} {t.common.beds}
          </div>
          <div className="flex items-center gap-1 text-[#5C706D] text-xs">
            <span className="material-icons text-sm text-[#006655]/80">
              bathtub
            </span>{' '}
            {property.baths} {t.common.baths}
          </div>
          <div className="flex items-center gap-1 text-[#5C706D] text-xs">
            <span className="material-icons text-sm text-[#006655]/80">
              square_foot
            </span>{' '}
            {property.areaSqM}m²
          </div>
        </div>
      </div>
    </Link>
  );
}
