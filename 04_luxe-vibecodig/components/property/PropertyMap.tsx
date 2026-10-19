'use client';

import React from 'react';
import dynamic from 'next/dynamic';

interface PropertyMapProps {
  lat?: number | null;
  lng?: number | null;
  title: string;
  location: string;
}

// Dynamically import Leaflet map with SSR turned off to prevent hydration mismatch
const DynamicLeafletMap = dynamic(
  () => import('./LeafletMapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-[#5C706D] text-xs">
        <span className="material-icons animate-spin text-2xl text-[#006655] mb-2">
          refresh
        </span>
        Loading interactive map...
      </div>
    ),
  }
);

export default function PropertyMap({
  lat = 37.4419,
  lng = -122.1430,
  title,
  location,
}: PropertyMapProps) {
  const actualLat = lat ?? 37.4419;
  const actualLng = lng ?? -122.1430;
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${actualLat},${actualLng}`;

  return (
    <div className="bg-white p-2 rounded-xl shadow-sm border border-[#006655]/5">
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
        <DynamicLeafletMap
          lat={actualLat}
          lng={actualLng}
          title={title}
          location={location}
        />

        {/* View on external Map link button */}
        <a
          href={externalMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm text-xs font-medium px-2.5 py-1.5 rounded shadow-sm text-[#19322F] hover:text-[#006655] transition-colors z-20 flex items-center gap-1"
          aria-label={`Open map for ${location} in Google Maps`}
        >
          <span className="material-icons text-xs">open_in_new</span>
          View on Map
        </a>
      </div>
    </div>
  );
}
