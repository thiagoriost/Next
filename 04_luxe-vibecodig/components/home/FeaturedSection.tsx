'use client';

import React from 'react';
import { Property } from '@/types/property';
import FeaturedCard from './FeaturedCard';
import { useI18n } from '@/components/providers/I18nProvider';

interface FeaturedSectionProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  onViewAll?: () => void;
}

export default function FeaturedSection({
  properties,
  onPropertySelect,
  onViewAll,
}: FeaturedSectionProps) {
  const { t } = useI18n();

  if (properties.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-[#19322F]">
            {t.home.featuredTitle}
          </h2>
          <p className="text-[#5C706D] mt-1 text-sm">
            {t.home.featuredSubtitle}
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#006655] hover:opacity-70 transition-opacity cursor-pointer"
        >
          {t.home.viewAll} <span className="material-icons text-sm">arrow_forward</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {properties.map((property) => (
          <FeaturedCard
            key={property.id}
            property={property}
            onSelect={onPropertySelect}
          />
        ))}
      </div>
    </section>
  );
}
