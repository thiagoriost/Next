import { Suspense } from 'react';
import HomeScreen from '@/components/home/HomeScreen';
import { getFeaturedProperties, getMarketProperties } from '@/lib/properties';
import { PropertyCategory } from '@/types/property';

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    marketType?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    beds?: string;
    baths?: string;
    amenities?: string;
  }>;
}

async function HomeContent({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    marketType?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    beds?: string;
    baths?: string;
    amenities?: string;
  }>;
}) {
  const params = await searchParams;

  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const category = (params.category ?? 'All') as PropertyCategory;
  const marketType = (params.marketType ?? 'All') as 'All' | 'Buy' | 'Rent';
  const searchQuery = params.q ?? '';
  const minPrice = params.minPrice ? parseInt(params.minPrice, 10) : undefined;
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice, 10) : undefined;
  const beds = params.beds ? parseInt(params.beds, 10) : undefined;
  const baths = params.baths ? parseFloat(params.baths) : undefined;
  const amenities = params.amenities ? params.amenities.split(',').filter(Boolean) : undefined;

  // Parallel server fetches
  const [featuredProperties, marketResult] = await Promise.all([
    getFeaturedProperties(),
    getMarketProperties({
      page,
      category,
      marketType,
      searchQuery,
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
      marketProperties={marketResult.properties}
      totalPages={marketResult.totalPages}
      currentPage={marketResult.currentPage}
      totalCount={marketResult.totalCount}
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

export default function Home({ searchParams }: HomePageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EEF6F6] flex flex-col items-center justify-center text-[#006655]">
          <span className="material-icons animate-spin text-3xl mb-2">refresh</span>
          <span className="text-sm font-medium text-[#19322F]">Loading LuxeEstate...</span>
        </div>
      }
    >
      <HomeContent searchParams={searchParams} />
    </Suspense>
  );
}
