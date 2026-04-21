'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
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
    <section id="gallery" className="py-16 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy text-center mb-2">
            Project Gallery
          </h2>
          <p className="text-slate-500 text-center mb-10 text-sm uppercase tracking-widest">
            LODHA SADAHALLI — A Glimpse of Luxury
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo, idx) => (
              <button
                key={photo.id}
                onClick={() => { setIndex(idx); setOpen(true); }}
                className="relative aspect-square overflow-hidden rounded-lg group focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy min-h-[44px]"
                aria-label={`View photo ${idx + 1}: ${photo.alt || 'LODHA SADAHALLI'}`}
              >
                <img
                  src={photo.url}
                  alt={photo.alt || 'LODHA SADAHALLI'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/30 transition-colors duration-300" />
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
      />
    </section>
  );
}
