'use client';

import { useState } from 'react';
import Link from 'next/link';
import Lightbox from 'yet-another-react-lightbox';
import type { Slide } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { UnitType } from '@/lib/types';
import { slugify } from '@/lib/slug';
import ScrollReveal from '@/components/ScrollReveal';

interface UnitTypesGridProps {
  unitTypes: UnitType[];
  detailPrefix?: string;
}

export default function UnitTypesGrid({ unitTypes, detailPrefix }: UnitTypesGridProps) {
  const [open, setOpen] = useState(false);
  const [currentSlides, setCurrentSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);

  return (
    <div>
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unitTypes.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Blueprint image */}
              {detailPrefix ? (
                <Link
                  href={`${detailPrefix}/${slugify(unit.name)}`}
                  className="w-full aspect-[4/3] overflow-hidden block focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
                  aria-label={`View floor plans for ${unit.name}`}
                >
                  <img
                    src={unit.blueprintUrls[0]}
                    alt={`${unit.name} floor plan`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                  />
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setCurrentSlides(unit.blueprintUrls.map((url) => ({ src: url, alt: `${unit.name} floor plan` })));
                    setIndex(0);
                    setOpen(true);
                  }}
                  className="w-full aspect-[4/3] overflow-hidden block focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
                  aria-label={`View floor plans for ${unit.name}`}
                >
                  <img
                    src={unit.blueprintUrls[0]}
                    alt={`${unit.name} floor plan`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                  />
                </button>
              )}
              {/* Details */}
              <div className="p-5">
                <h3 className="font-serif text-xl font-bold text-navy mb-3">{unit.name}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-navy font-semibold">{unit.bedrooms}</span>
                    <span>Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-navy font-semibold">{unit.bathrooms}</span>
                    <span>Bathrooms</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-slate-600">
                    <span className="text-navy font-semibold">Carpet:</span>
                    <span>{unit.carpetArea}</span>
                  </div>
                  {unit.builtUpArea && (
                    <div className="col-span-2 flex items-center gap-2 text-slate-600">
                      <span className="text-navy font-semibold">Built-up:</span>
                      <span>{unit.builtUpArea}</span>
                    </div>
                  )}
                  {unit.balcony && (
                    <div className="col-span-2 flex items-center gap-2 text-slate-600">
                      <span className="text-navy font-semibold">Balcony:</span>
                      <span>{unit.balcony}</span>
                    </div>
                  )}
                </div>
                {detailPrefix ? (
                  <Link
                    href={`${detailPrefix}/${slugify(unit.name)}`}
                    className="mt-4 inline-flex w-full min-h-[44px] items-center justify-center py-2 border border-navy text-navy text-sm font-medium rounded-lg hover:bg-navy hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
                  >
                    View Floor Plan{unit.blueprintUrls.length > 1 ? 's' : ''}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentSlides(unit.blueprintUrls.map((url) => ({ src: url, alt: `${unit.name} floor plan` })));
                      setIndex(0);
                      setOpen(true);
                    }}
                    className="mt-4 w-full min-h-[44px] py-2 border border-navy text-navy text-sm font-medium rounded-lg hover:bg-navy hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
                  >
                    View Floor Plan{unit.blueprintUrls.length > 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={currentSlides}
      />
    </div>
  );
}
