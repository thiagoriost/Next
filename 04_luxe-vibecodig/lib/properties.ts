import { supabase } from '@/lib/supabase';
import { Property, PropertyCategory } from '@/types/property';
import { Database } from '@/types/database.types';

// Number of market properties per page
export const MARKET_PAGE_SIZE = 10;

type DbProperty = Database['public']['Tables']['properties']['Row'];

/** Fallback placeholder images if none provided */
const DEFAULT_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80',
];

/** Map a Supabase DB row to the app's Property shape using images array exclusively */
function mapDbToProperty(row: DbProperty): Property {
  const images =
    row.images && Array.isArray(row.images) && row.images.length > 0
      ? row.images
      : DEFAULT_FALLBACK_IMAGES;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location,
    price: row.price,
    pricePeriod: row.price_period ?? undefined,
    type: row.type,
    category: row.category,
    beds: row.beds,
    baths: row.baths,
    areaSqM: row.area_sq_m,
    images,
    badge: row.badge ?? undefined,
    badgeType: row.badge_type ?? undefined,
    isFeatured: row.is_featured ?? false,
    description: row.description ?? undefined,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    parkingSpots: row.parking_spots ?? undefined,
    agentName: row.agent_name ?? undefined,
    agentImageUrl: row.agent_image_url ?? undefined,
    amenities: row.amenities ?? undefined,
  };
}

/** Fetch featured properties (is_featured = true) */
export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('id');

  if (error) {
    console.error('[getFeaturedProperties] Supabase error:', error.message);
    return [];
  }

  return (data ?? []).map(mapDbToProperty);
}

export interface MarketPropertiesResult {
  properties: Property[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface MarketPropertiesParams {
  page?: number;
  category?: PropertyCategory | string;
  marketType?: 'All' | 'Buy' | 'Rent';
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  amenities?: string[];
}

/**
 * Fetch paginated market properties (is_featured = false).
 * All filtering and pagination is performed server-side via Supabase,
 * with fallback to local static data if DB query fails.
 */
export async function getMarketProperties({
  page = 1,
  category = 'All',
  marketType = 'All',
  searchQuery = '',
  minPrice,
  maxPrice,
  beds,
  baths,
  amenities,
}: MarketPropertiesParams = {}): Promise<MarketPropertiesResult> {
  const from = (page - 1) * MARKET_PAGE_SIZE;
  const to = from + MARKET_PAGE_SIZE - 1;

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_featured', false)
    .order('id')
    .range(from, to);

  // Category filter
  if (category && category !== 'All') {
    let resolvedCategory = category;
    if (category === 'Condo') resolvedCategory = 'Apartment';
    if (category === 'Townhouse') resolvedCategory = 'House';

    if (['House', 'Apartment', 'Villa', 'Penthouse'].includes(resolvedCategory)) {
      query = query.eq('category', resolvedCategory as Database['public']['Enums']['property_category']);
    }
  }

  // Market type filter (Buy = sale, Rent = rent)
  if (marketType === 'Buy') {
    query = query.eq('type', 'sale');
  } else if (marketType === 'Rent') {
    query = query.eq('type', 'rent');
  }

  // Price range filters
  if (minPrice !== undefined && minPrice > 0) {
    query = query.gte('price', minPrice);
  }
  if (maxPrice !== undefined && maxPrice > 0 && maxPrice < 10000000) {
    query = query.lte('price', maxPrice);
  }

  // Beds and baths filters
  if (beds !== undefined && beds > 0) {
    query = query.gte('beds', beds);
  }
  if (baths !== undefined && baths > 0) {
    query = query.gte('baths', baths);
  }

  // Amenities filter
  if (amenities && amenities.length > 0) {
    query = query.contains('amenities', amenities);
  }

  // Full-text search on title and location using ilike
  if (searchQuery.trim() !== '') {
    const term = `%${searchQuery.trim()}%`;
    query = query.or(`title.ilike.${term},location.ilike.${term}`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('[getMarketProperties] Supabase error:', error.message);
    // Fallback to in-memory data
    const { ALL_MARKET_PROPERTIES } = await import('@/data/properties');
    let filtered = ALL_MARKET_PROPERTIES.filter((p) => {
      if (category && category !== 'All') {
        const target = category === 'Condo' ? 'Apartment' : category === 'Townhouse' ? 'House' : category;
        if (p.category !== target) return false;
      }
      if (marketType === 'Buy' && p.type !== 'sale') return false;
      if (marketType === 'Rent' && p.type !== 'rent') return false;
      if (minPrice !== undefined && minPrice > 0 && p.price < minPrice) return false;
      if (maxPrice !== undefined && maxPrice > 0 && maxPrice < 10000000 && p.price > maxPrice) return false;
      if (beds !== undefined && beds > 0 && p.beds < beds) return false;
      if (baths !== undefined && baths > 0 && p.baths < baths) return false;
      if (amenities && amenities.length > 0) {
        const propAmenities = p.amenities ?? [];
        const hasAll = amenities.every((a) => propAmenities.includes(a));
        if (!hasAll) return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches = p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / MARKET_PAGE_SIZE);
    const paginated = filtered.slice(from, to + 1);

    return {
      properties: paginated,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / MARKET_PAGE_SIZE);

  return {
    properties: (data ?? []).map(mapDbToProperty),
    totalCount,
    totalPages,
    currentPage: page,
  };
}

/**
 * Fetch a single property by its friendly slug using the images array column.
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data: propertyRow, error: propError } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single();

  if (propError || !propertyRow) {
    console.error('[getPropertyBySlug] Property not found or error:', propError?.message);
    return null;
  }

  return mapDbToProperty(propertyRow);
}

/**
 * Fetch all slugs for sitemap or dynamic generation.
 */
export async function getAllPropertySlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('slug');

  if (error || !data) {
    return [];
  }

  return data.map((p) => p.slug);
}
