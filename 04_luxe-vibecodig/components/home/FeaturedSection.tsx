import React from 'react';
import { Property } from '@/types/property';
import FeaturedCard from './FeaturedCard';

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
  if (properties.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-[#19322F] dark:text-white">
            Featured Collections
          </h2>
          <p className="text-[#5C706D] mt-1 text-sm">
            Curated properties for the discerning eye.
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#006655] hover:opacity-70 transition-opacity cursor-pointer"
        >
          View all <span className="material-icons text-sm">arrow_forward</span>
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
