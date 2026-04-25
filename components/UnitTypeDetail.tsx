'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { UnitType } from '@/lib/types';

interface UnitTypeDetailProps {
  unit: UnitType;
}

export default function UnitTypeDetail({ unit }: UnitTypeDetailProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const slides = unit.blueprintUrls.map((url) => ({ src: url, alt: `${unit.name} floor plan` }));

  return (
    <div className="space-y-12">
      <div className="overflow-hidden border border-luxury-stone/10 bg-luxury-black shadow-2xl">
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          className="w-full block relative group"
        >
          <img
            src={unit.blueprintUrls[0]}
            alt={`${unit.name} blueprint`}
            className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
          />
          <div className="absolute inset-0 bg-luxury-black/30 group-hover:bg-luxury-black/10 transition-colors duration-500" />
        </button>

        {unit.blueprintUrls.length > 1 && (
          <div className="grid grid-cols-3 gap-2 p-4 bg-luxury-charcoal border-t border-luxury-stone/5">
            {unit.blueprintUrls.map((url, idx) => (
              <button
                key={`${url}-${idx}`}
                type="button"
                onClick={() => {
                  setIndex(idx);
                  setOpen(true);
                }}
                className="overflow-hidden border border-luxury-stone/10 bg-luxury-black relative group"
              >
                <img
                  src={url}
                  alt={`${unit.name} blueprint ${idx + 1}`}
                  className="w-full h-24 object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                />
                <div className="absolute inset-0 bg-luxury-black/40 group-hover:bg-luxury-black/0 transition-colors duration-300" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border border-luxury-stone/10 bg-luxury-charcoal p-8 md:p-12 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-luxury-gold/20 via-luxury-gold to-luxury-gold/20" />
        <h3 className="font-serif text-2xl font-light text-luxury-stone mb-8 tracking-wide text-center">Quick Unit Details</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="border border-luxury-stone/5 bg-luxury-black p-6 text-center">
            <p className="text-luxury-stone/60 text-xs uppercase tracking-[0.2em]">Bedrooms</p>
            <p className="mt-3 text-luxury-gold font-light text-xl">{unit.bedrooms}</p>
          </div>
          <div className="border border-luxury-stone/5 bg-luxury-black p-6 text-center">
            <p className="text-luxury-stone/60 text-xs uppercase tracking-[0.2em]">Bathrooms</p>
            <p className="mt-3 text-luxury-gold font-light text-xl">{unit.bathrooms}</p>
          </div>
          <div className="border border-luxury-stone/5 bg-luxury-black p-6 text-center">
            <p className="text-luxury-stone/60 text-xs uppercase tracking-[0.2em]">Carpet area</p>
            <p className="mt-3 text-luxury-gold font-light text-xl">{unit.carpetArea}</p>
          </div>
          <div className="border border-luxury-stone/5 bg-luxury-black p-6 text-center">
            <p className="text-luxury-stone/60 text-xs uppercase tracking-[0.2em]">Built-up area</p>
            <p className="mt-3 text-luxury-gold font-light text-xl">{unit.builtUpArea ?? '—'}</p>
          </div>
        </div>

        <div className="mt-6 border border-luxury-stone/5 bg-luxury-black p-6 text-center">
          <p className="text-luxury-stone/60 text-xs uppercase tracking-[0.2em]">Balcony</p>
          <p className="mt-3 text-luxury-gold font-light text-xl">{unit.balcony ?? 'Not specified'}</p>
        </div>

        <p className="mt-10 text-luxury-stone/40 leading-loose text-xs uppercase tracking-widest text-center max-w-2xl mx-auto">
          Tap any image to open the full blueprint gallery. This page includes all floor plan details, project photos, and a quick enquiry form below.
        </p>
      </div>

      <Lightbox 
        open={open} 
        close={() => setOpen(false)} 
        index={index} 
        slides={slides} 
        styles={{ container: { backgroundColor: 'rgba(10, 10, 10, 0.95)' } }}
      />
    </div>
  );
}
