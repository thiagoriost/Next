import { supabase } from '@/lib/supabase';
import { Property, PropertyCategory } from '@/types/property';
import { Database } from '@/types/database.types';

// Number of market properties per page
export const MARKET_PAGE_SIZE = 4;

type DbProperty = Database['public']['Tables']['properties']['Row'];

/** Map a Supabase DB row to the app's Property shape */
function mapDbToProperty(row: DbProperty): Property {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    price: row.price,
    pricePeriod: row.price_period ?? undefined,
    type: row.type,
    category: row.category,
    beds: row.beds,
    baths: row.baths,
    areaSqM: row.area_sq_m,
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    badge: row.badge ?? undefined,
    badgeType: row.badge_type ?? undefined,
    isFeatured: row.is_featured ?? false,
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
