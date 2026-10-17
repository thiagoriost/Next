export type PropertyType = 'sale' | 'rent';

export type PropertyCategory = 'All' | 'House' | 'Apartment' | 'Villa' | 'Penthouse';

export interface Property {
  id: string;
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
}

export interface FilterState {
  searchQuery: string;
  category: PropertyCategory;
  marketType: 'All' | 'Buy' | 'Rent';
}
