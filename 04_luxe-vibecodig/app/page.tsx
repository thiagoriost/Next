import { Suspense } from 'react';
/* import { cookies } from 'next/headers';
import { LOCALE_COOKIE_NAME, DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES, getDictionary } from '@/lib/i18n'; */
import { getMarketProperties, getFeaturedProperties } from '@/lib/properties';
import { PropertyCategory } from '@/types/property';
import HomeScreen from '@/components/home/HomeScreen';

interface HomePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    marketType?: string;
    minPrice?: string;
    maxPrice?: string;
    beds?: string;
    baths?: string;
    amenities?: string;
    page?: string;
  }>;
}

async function HomePageInner({ searchParams }: HomePageProps) {
  const params = await searchParams;

  // Read locale from cookie for SEO metadata
  /* let locale: Locale = DEFAULT_LOCALE;
  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
    if (cookieVal && (SUPPORTED_LOCALES as readonly string[]).includes(cookieVal)) {
      locale = cookieVal as Locale;
    }
  } catch {
    // Fallback
  } */

  // const t = getDictionary(locale);

  const searchQuery = params.q ?? '';
  const category = (params.category as PropertyCategory) ?? 'All';
  const marketType = (params.marketType as 'All' | 'Buy' | 'Rent') ?? 'All';
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const beds = params.beds ? Number(params.beds) : undefined;
  const baths = params.baths ? Number(params.baths) : undefined;
  const amenities = params.amenities ? params.amenities.split(',') : undefined;
  const page = params.page ? Number(params.page) : 1;

  const [featuredProperties, { properties: marketProperties, totalCount, totalPages }] =
    await Promise.all([
      getFeaturedProperties(),
      getMarketProperties({
        page,
        searchQuery,
        category,
        marketType,
        minPrice,
        maxPrice,
        beds,
        baths,
        amenities,
      }),
    ]);

  return (
    <HomeScreen
      featuredProperties={featuredProperties}
      marketProperties={marketProperties}
      totalPages={totalPages}
      currentPage={page}
      totalCount={totalCount}
      initialCategory={category}
      initialMarketType={marketType}
      initialSearchQuery={searchQuery}
      initialMinPrice={minPrice}
      initialMaxPrice={maxPrice}
      initialBeds={beds}
      initialBaths={baths}
      initialAmenities={amenities}
    />
  );
}

export default function HomePage(props: HomePageProps) {
  return (
    <Suspense>
      <HomePageInner {...props} />
    </Suspense>
  );
}