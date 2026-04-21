'use client';

import { useState } from 'react';
import type { Amenity } from '@/lib/types';
import ScrollReveal from '@/components/ScrollReveal';

interface AmenitiesSectionProps {
  amenities: Amenity[];
}

export default function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (amenities.length === 0) return null;

  return (
    <section id="amenities" className="py-16 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy text-center mb-2">
            World-Class Amenities
          </h2>
          <p className="text-slate-500 text-center mb-10 text-sm uppercase tracking-widest">
            LODHA SADAHALLI — Live the Life You Deserve
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {amenities.map((amenity) => (
              <div
                key={amenity.id}
                className="relative overflow-hidden rounded-xl cursor-pointer group"
                onMouseEnter={() => setActiveId(amenity.id)}
                onMouseLeave={() => setActiveId(null)}
                onTouchStart={() => setActiveId(amenity.id === activeId ? null : amenity.id)}
                role="article"
                aria-label={amenity.label}
              >
                <div className="aspect-square">
                  <img
                    src={amenity.imageUrl}
                    alt={amenity.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                  />
                </div>
                {/* Label bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-navy/80 px-3 py-2">
                  <p className="text-white text-sm font-semibold truncate">{amenity.label}</p>
                </div>
                {/* Description overlay */}
                <div
                  className={`absolute inset-0 bg-navy/90 flex flex-col items-center justify-center p-4 transition-opacity duration-300 ${
                    activeId === amenity.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  aria-hidden={activeId !== amenity.id}
                >
                  <p className="text-white font-semibold text-base mb-2 text-center">{amenity.label}</p>
                  <p className="text-white/80 text-sm text-center leading-relaxed">{amenity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
