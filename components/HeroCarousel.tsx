'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { CarouselImage } from '@/lib/types';

interface HeroCarouselProps {
  images: CarouselImage[];
}

export default function HeroCarousel({ images }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = images.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (total === 0) return;
    autoPlayRef.current = setInterval(next, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [next, total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  if (total === 0) {
    return (
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-navy flex items-center justify-center">
        <span className="text-white/40 text-lg">No images available</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-navy"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Property image carousel"
    >
      {/* Images */}
      {images.map((img, idx) => (
        <div
          key={img.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={idx !== current}
        >
          <img
            src={img.url}
            alt={img.alt || 'LODHA SADAHALLI property'}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg';
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/20 via-transparent to-navy/60" />
        </div>
      ))}

      {/* LODHA SADAHALLI title overlay */}
      <div className="absolute bottom-16 left-0 right-0 text-center z-10 px-4">
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-white tracking-widest drop-shadow-lg">
          LODHA SADAHALLI
        </h1>
        <p className="text-white/80 text-sm md:text-base mt-2 tracking-wider uppercase">
          Luxury Residences
        </p>
      </div>

      {/* Prev / Next arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Previous image"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Next image"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}

      {/* Navigation dots */}
      {total > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20" role="tablist" aria-label="Carousel navigation">
          {images.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={idx === current}
              aria-label={`Go to image ${idx + 1}`}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                idx === current
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
