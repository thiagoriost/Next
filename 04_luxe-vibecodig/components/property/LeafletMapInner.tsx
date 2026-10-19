'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapInnerProps {
  lat: number;
  lng: number;
  title: string;
  location: string;
}

// Custom Leaflet DivIcon perfectly reproducing the design pin
const customPinIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background-color: #006655;
      border: 3px solid #ffffff;
      border-radius: 9999px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-18px, -18px);
    ">
      <span class="material-icons" style="color: #ffffff; font-size: 18px; line-height: 1;">home</span>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
}

export default function LeafletMapInner({
  lat,
  lng,
  title,
  location,
}: LeafletMapInnerProps) {
  return (
    <div className="w-full h-full min-h-[220px] rounded-lg overflow-hidden relative">
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={false}
        attributionControl={false}
        className="w-full h-full min-h-[220px]"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[lat, lng]} icon={customPinIcon}>
          <Popup className="property-map-popup">
            <div className="p-1">
              <h4 className="font-semibold text-sm text-[#19322F] mb-0.5">{title}</h4>
              <p className="text-xs text-[#5C706D]">{location}</p>
            </div>
          </Popup>
        </Marker>
        <MapRecenter lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}
