'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Image from 'next/image';
import type { ProjectPhoto } from '@/lib/types';
import ScrollReveal from '@/components/ScrollReveal';

interface ProjectPhotosProps {
  photos: ProjectPhoto[];
}

export default function ProjectPhotos({ photos }: ProjectPhotosProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (photos.length === 0) return null;

  const slides = photos.map((p) => ({ src: p.url, alt: p.alt || 'LODHA SADAHALLI' }));

  return (
    <section id="gallery" className="py-24 px-4 bg-luxury-stone border-b border-luxury-charcoal/5">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal animation="fadeUp">
          <div className="flex flex-col items-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-luxury-charcoal text-center mb-4">
              Project Gallery
            </h2>
            <div className="w-16 h-[1px] bg-luxury-gold mb-6" />
            <p className="text-luxury-gold/80 text-center text-xs md:text-sm uppercase tracking-[0.2em]">
              LODHA SADAHALLI — A Glimpse of Luxury
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {photos.map((photo, idx) => (
              <button
                key={photo.id}
                onClick={() => { setIndex(idx); setOpen(true); }}
                className="relative aspect-square overflow-hidden group focus-visible:outline focus-visible:outline-2 focus-visible:outline-luxury-gold"
                aria-label={`View photo ${idx + 1}: ${photo.alt || 'LODHA SADAHALLI'}`}
              >
                <Image
                  src={photo.url}
                  alt={photo.alt || 'LODHA SADAHALLI'}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-luxury-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-luxury-stone border border-luxury-stone/30 px-6 py-2 text-xs uppercase tracking-[0.1em] backdrop-blur-sm">View</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        styles={{ container: { backgroundColor: 'rgba(10, 10, 10, 0.95)' } }}
      />
    </section>
  );
}
