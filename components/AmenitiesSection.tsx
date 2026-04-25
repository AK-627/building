'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Amenity } from '@/lib/types';
import ScrollReveal from '@/components/ScrollReveal';

interface AmenitiesSectionProps {
  amenities: Amenity[];
}

export default function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (amenities.length === 0) return null;

  return (
    <section id="amenities" className="py-24 px-4 bg-luxury-black">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal animation="fadeUp">
          <div className="flex flex-col items-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-luxury-stone text-center mb-4">
              World-Class Amenities
            </h2>
            <div className="w-16 h-[1px] bg-luxury-gold mb-6" />
            <p className="text-luxury-gold/80 text-center text-xs md:text-sm uppercase tracking-[0.2em]">
              LODHA SADAHALLI — Live the Life You Deserve
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity, index) => (
              <motion.div
                key={amenity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden bg-luxury-charcoal border border-luxury-stone/5 hover:border-luxury-gold/30 transition-colors duration-500"
                onMouseEnter={() => setActiveId(amenity.id)}
                onMouseLeave={() => setActiveId(null)}
                onTouchStart={() => setActiveId(amenity.id === activeId ? null : amenity.id)}
                role="article"
                aria-label={amenity.label}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={amenity.imageUrl}
                    alt={amenity.label}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-luxury-black/40 group-hover:bg-luxury-black/10 transition-colors duration-500" />
                </div>
                
                {/* Default Label */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-luxury-black via-luxury-black/80 to-transparent">
                  <h3 className="text-luxury-stone font-serif text-2xl font-light">{amenity.label}</h3>
                </div>

                {/* Description Hover Overlay */}
                <div
                  className={`absolute inset-0 bg-luxury-black/95 flex flex-col justify-center p-8 transition-opacity duration-500 backdrop-blur-sm ${
                    activeId === amenity.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  aria-hidden={activeId !== amenity.id}
                >
                  <h3 className="text-luxury-gold font-serif text-2xl font-light mb-4">{amenity.label}</h3>
                  <div className="w-8 h-[1px] bg-luxury-stone/30 mb-4" />
                  <p className="text-luxury-stone/80 text-sm leading-relaxed font-light">{amenity.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
