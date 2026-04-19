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
    <div className="space-y-8">
      <div className="rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          className="w-full block"
        >
          <img
            src={unit.blueprintUrls[0]}
            alt={`${unit.name} blueprint`}
            className="w-full h-[420px] object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
          />
        </button>

        <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50">
          {unit.blueprintUrls.map((url, idx) => (
            <button
              key={`${url}-${idx}`}
              type="button"
              onClick={() => {
                setIndex(idx);
                setOpen(true);
              }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <img
                src={url}
                alt={`${unit.name} blueprint ${idx + 1}`}
                className="w-full h-24 object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
        <p className="text-slate-900 font-semibold mb-4">Quick unit details</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Bedrooms</p>
            <p className="mt-2 text-navy font-semibold">{unit.bedrooms}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Bathrooms</p>
            <p className="mt-2 text-navy font-semibold">{unit.bathrooms}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Carpet area</p>
            <p className="mt-2 text-navy font-semibold">{unit.carpetArea}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Built-up area</p>
            <p className="mt-2 text-navy font-semibold">{unit.builtUpArea ?? '—'}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Balcony</p>
          <p className="mt-2 text-navy font-semibold">{unit.balcony ?? 'Not specified'}</p>
        </div>

        <p className="mt-6 text-slate-500 leading-relaxed text-sm">
          Tap any image to open the full blueprint gallery. This page includes all floor plan details, project photos, and a quick enquiry form below.
        </p>
      </div>

      <Lightbox open={open} close={() => setOpen(false)} index={index} slides={slides} />
    </div>
  );
}
