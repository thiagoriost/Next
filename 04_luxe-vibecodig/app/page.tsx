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
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const category = (params.category ?? 'All') as PropertyCategory;
  const marketType = (params.marketType ?? 'All') as 'All' | 'Buy' | 'Rent';
  const searchQuery = params.q ?? '';

  // Both queries execute in parallel on the server
  const [featuredProperties, marketResult] = await Promise.all([
    getFeaturedProperties(),
    getMarketProperties({ page, category, marketType, searchQuery }),
  ]);

  return (
    <Suspense>
      <HomeScreen
        featuredProperties={featuredProperties}
        marketProperties={marketResult.properties}
        totalPages={marketResult.totalPages}
        currentPage={marketResult.currentPage}
        totalCount={marketResult.totalCount}
        initialCategory={category}
        initialMarketType={marketType}
        initialSearchQuery={searchQuery}
      />
    </Suspense>
  );
}
