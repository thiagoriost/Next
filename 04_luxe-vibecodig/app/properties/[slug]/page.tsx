import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPropertyBySlug, getAllPropertySlugs } from '@/lib/properties';
import PropertyDetailScreen from '@/components/property/PropertyDetailScreen';

interface PropertyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80';

/**
 * Dynamic SEO metadata generator for each individual property.
 */
export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'Property Not Found — LuxeEstate',
      description: 'The requested luxury property could not be found.',
    };
  }

  const ogImages =
    property.images && property.images.length > 0
      ? property.images
      : [DEFAULT_OG_IMAGE];

  return {
    title: `${property.title} — ${property.location} | LuxeEstate`,
    description: (
      property.description ||
      `Luxury ${property.category} in ${property.location}. ${property.beds} beds, ${property.baths} baths.`
    ).slice(0, 160),
    openGraph: {
      title: `${property.title} | LuxeEstate Luxury Real Estate`,
      description: (
        property.description ||
        `Discover this luxury ${property.category} in ${property.location}.`
      ).slice(0, 160),
      images: ogImages,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: (property.description || '').slice(0, 160),
      images: ogImages.slice(0, 1),
    },
  };
}

/**
 * Pre-generate static slugs for faster loading & SEO.
 */
export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

async function PropertyDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // Schema.org RealEstateListing JSON-LD rich snippet
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description:
      property.description || `${property.category} in ${property.location}`,
    image: property.images && property.images.length > 0 ? property.images : [DEFAULT_OG_IMAGE],
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'USD',
      businessFunction:
        property.type === 'rent'
          ? 'http://purl.org/goodrelations/v1#LeaseOut'
          : 'http://purl.org/goodrelations/v1#Sell',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: property.price,
        priceCurrency: 'USD',
        unitText: property.pricePeriod === 'mo' ? 'MONTH' : undefined,
      },
    },
    geo:
      property.lat && property.lng
        ? {
            '@type': 'GeoCoordinates',
            latitude: property.lat,
            longitude: property.lng,
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetailScreen property={property} />
    </>
  );
}

export default function PropertyDetailPage({ params }: PropertyPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EEF6F6] flex flex-col items-center justify-center text-[#006655]">
          <span className="material-icons animate-spin text-3xl mb-2">refresh</span>
          <span className="text-sm font-medium text-[#19322F]">
            Loading property details...
          </span>
        </div>
      }
    >
      <PropertyDetailContent params={params} />
    </Suspense>
  );
}
