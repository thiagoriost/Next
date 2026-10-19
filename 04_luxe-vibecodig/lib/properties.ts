import { supabase } from '@/lib/supabase';
import { Property, PropertyCategory } from '@/types/property';
import { Database } from '@/types/database.types';

// Number of market properties per page
export const MARKET_PAGE_SIZE = 4;

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
  category?: PropertyCategory;
  marketType?: 'All' | 'Buy' | 'Rent';
  searchQuery?: string;
}

/**
 * Fetch paginated market properties (is_featured = false).
 * All filtering and pagination is performed server-side via Supabase.
 */
export async function getMarketProperties({
  page = 1,
  category = 'All',
  marketType = 'All',
  searchQuery = '',
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
  if (category !== 'All') {
    query = query.eq('category', category);
  }

  // Market type filter (Buy = sale, Rent = rent)
  if (marketType === 'Buy') {
    query = query.eq('type', 'sale');
  } else if (marketType === 'Rent') {
    query = query.eq('type', 'rent');
  }

  // Full-text search on title and location using ilike
  if (searchQuery.trim() !== '') {
    const term = `%${searchQuery.trim()}%`;
    query = query.or(`title.ilike.${term},location.ilike.${term}`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('[getMarketProperties] Supabase error:', error.message);
    return { properties: [], totalCount: 0, totalPages: 0, currentPage: page };
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
