export type PropertyType = 'sale' | 'rent';

export type PropertyCategory = 'All' | 'House' | 'Apartment' | 'Villa' | 'Penthouse';

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  alt: string;
  displayOrder: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: number;
  pricePeriod?: 'mo' | 'year';
  type: PropertyType;
  category: Exclude<PropertyCategory, 'All'>;
  beds: number;
  baths: number;
  areaSqM: number;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  badgeType?: 'exclusive' | 'new' | 'sale' | 'rent';
  isFeatured?: boolean;
  description?: string;
  lat?: number | null;
  lng?: number | null;
  parkingSpots?: number;
  agentName?: string;
  agentImageUrl?: string;
  amenities?: string[];
  images?: PropertyImage[];
}

export interface FilterState {
  searchQuery: string;
  category: PropertyCategory;
  marketType: 'All' | 'Buy' | 'Rent';
}
