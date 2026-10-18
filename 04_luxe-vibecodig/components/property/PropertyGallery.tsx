'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PropertyImage } from '@/types/property';

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
  badge?: string;
}

export default function PropertyGallery({
  images,
  title,
  badge = 'Premium',
}: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Guarantee at least one valid image
  const displayImages: PropertyImage[] =
    images.length > 0
      ? images
      : [
          {
            id: 'fallback-0',
            propertyId: 'default',
            url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
            alt: title,
            displayOrder: 0,
          },
        ];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  }, [displayImages.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handleNext, handlePrev]);

  return (
    <div className="space-y-4">
      {/* Main Hero Image */}
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group cursor-pointer bg-slate-900"
        onClick={() => setIsLightboxOpen(true)}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.alt || title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <span className="bg-[#006655] text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            {badge || 'Premium'}
          </span>
          <span className="bg-white/90 backdrop-blur-sm text-[#19322F] text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            New
          </span>
        </div>

        {/* View All Photos Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-[#19322F] px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer z-10"
        >
          <span className="material-icons text-sm">grid_view</span>
          View All Photos ({displayImages.length})
        </button>
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
          {displayImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                className={`flex-none w-44 sm:w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer snap-start relative transition-all duration-200 text-left ${
                  isSelected
                    ? 'ring-2 ring-[#006655] ring-offset-2 ring-offset-[#EEF6F6] opacity-100 shadow-sm'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `Thumbnail ${idx + 1}`}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top bar with count & close */}
          <div
            className="flex justify-between items-center text-white/80 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-medium">
              Photo {selectedIndex + 1} of {displayImages.length}
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              aria-label="Close photo modal"
            >
              <span className="material-icons text-2xl">close</span>
            </button>
          </div>

          {/* Central Image container */}
          <div
            className="relative flex-1 w-full max-w-5xl mx-auto my-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-h-[75vh]">
              <Image
                src={currentImage.url}
                alt={currentImage.alt || title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Prev button */}
            {displayImages.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                aria-label="Previous photo"
              >
                <span className="material-icons text-2xl">chevron_left</span>
              </button>
            )}

            {/* Next button */}
            {displayImages.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                aria-label="Next photo"
              >
                <span className="material-icons text-2xl">chevron_right</span>
              </button>
            )}
          </div>

          {/* Bottom Thumbnails navigation in Lightbox */}
          <div
            className="flex gap-2 overflow-x-auto scrollbar-hide justify-center py-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {displayImages.map((img, idx) => (
              <button
                key={`lb-thumb-${img.id || idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`w-16 h-12 relative rounded overflow-hidden flex-shrink-0 transition-opacity ${
                  idx === selectedIndex
                    ? 'ring-2 ring-white opacity-100'
                    : 'opacity-40 hover:opacity-80'
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
