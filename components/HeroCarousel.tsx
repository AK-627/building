'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { CarouselImage } from '@/lib/types';

interface HeroCarouselProps {
  images: CarouselImage[];
}

export default function HeroCarousel({ images }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = images.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance every 6 seconds for a slower, more luxurious feel
  useEffect(() => {
    if (total === 0) return;
    autoPlayRef.current = setInterval(next, 6000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [next, total]);

  if (total === 0) {
    return (
      <div className="relative w-full h-[80vh] md:h-[90vh] bg-luxury-black flex items-center justify-center">
        <span className="text-luxury-stone/40 text-lg">No images available</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden bg-luxury-black"
      aria-label="Property image carousel"
    >
      {/* Images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={images[current].url}
            alt={images[current].alt || 'LODHA SADAHALLI property'}
            fill
            priority
            className="object-cover animate-slow-pan"
          />
          {/* Gradient overlay - very dark at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/40 via-luxury-black/20 to-luxury-black/90" />
        </motion.div>
      </AnimatePresence>

      {/* Title Overlay with Staggered Fade Up */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 mt-20 md:mt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-[1px] bg-luxury-gold mb-6" />
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-light text-luxury-stone tracking-[0.1em] drop-shadow-2xl px-2">
              LODHA SADAHALLI
            </h1>
            <p className="text-luxury-gold text-[10px] sm:text-xs md:text-sm mt-6 tracking-[0.2em] md:tracking-[0.3em] uppercase">
              The Epitome of Luxury
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Custom Minimalist Navigation */}
      {total > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-12 md:bottom-12 z-20 flex items-center gap-4">
          <button
            onClick={prev}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-luxury-stone/20 text-luxury-stone hover:bg-luxury-stone hover:text-luxury-black transition-all duration-300 backdrop-blur-sm bg-luxury-black/20"
            aria-label="Previous image"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-[2px] transition-all duration-500 ${
                  idx === current ? 'w-8 bg-luxury-gold' : 'w-4 bg-luxury-stone/30 hover:bg-luxury-stone/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-luxury-stone/20 text-luxury-stone hover:bg-luxury-stone hover:text-luxury-black transition-all duration-300 backdrop-blur-sm bg-luxury-black/20"
            aria-label="Next image"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
