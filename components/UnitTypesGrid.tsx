'use client';

import { useState } from 'react';
import Link from 'next/link';
import Lightbox from 'yet-another-react-lightbox';
import type { Slide } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { UnitType } from '@/lib/types';
import { slugify } from '@/lib/slug';
import ScrollReveal from '@/components/ScrollReveal';
import LeadFormModal from '@/components/LeadFormModal';
import { motion } from 'framer-motion';

interface UnitTypesGridProps {
  unitTypes: UnitType[];
  detailPrefix?: string;
}

export default function UnitTypesGrid({ unitTypes, detailPrefix }: UnitTypesGridProps) {
  const [open, setOpen] = useState(false);
  const [currentSlides, setCurrentSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);
  
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [hasCapturedLead, setHasCapturedLead] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const handleView = (unit: UnitType) => {
    const action = () => {
      setCurrentSlides(unit.blueprintUrls.map((url) => ({ src: url, alt: `${unit.name} floor plan` })));
      setIndex(0);
      setOpen(true);
    };

    if (!hasCapturedLead && !detailPrefix) {
      setPendingAction(() => action);
      setLeadModalOpen(true);
    } else {
      action();
    }
  };

  const handleLeadSuccess = () => {
    setHasCapturedLead(true);
    setLeadModalOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  return (
    <div>
      <ScrollReveal animation="fadeUp">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {unitTypes.map((unit, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              key={unit.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-luxury-gold/50 hover:bg-white/10 transition-all duration-500 overflow-hidden group rounded-3xl shadow-2xl"
            >
              {/* Blueprint image */}
              {detailPrefix ? (
                <Link
                  href={`${detailPrefix}/${slugify(unit.name)}`}
                  className="w-full aspect-[4/3] overflow-hidden block relative"
                  aria-label={`View floor plans for ${unit.name}`}
                >
                  <img
                    src={unit.blueprintUrls[0]}
                    alt={`${unit.name} floor plan`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-luxury-black/30 group-hover:bg-luxury-black/0 transition-colors duration-500" />
                </Link>
              ) : (
                <button
                  onClick={() => handleView(unit)}
                  className="w-full aspect-[4/3] overflow-hidden block relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-luxury-gold"
                  aria-label={`View floor plans for ${unit.name}`}
                >
                  <img
                    src={unit.blueprintUrls[0]}
                    alt={`${unit.name} floor plan`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-luxury-black/30 group-hover:bg-luxury-black/0 transition-colors duration-500" />
                </button>
              )}
              {/* Details */}
              <div className="p-8">
                <h3 className="font-serif text-2xl font-light text-luxury-stone mb-6 tracking-wide">{unit.name}</h3>
                <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.1em]">
                  <div className="flex justify-between border-b border-luxury-stone/10 pb-2">
                    <span className="text-luxury-stone/60">Bedrooms</span>
                    <span className="text-luxury-gold">{unit.bedrooms}</span>
                  </div>
                  <div className="flex justify-between border-b border-luxury-stone/10 pb-2">
                    <span className="text-luxury-stone/60">Bathrooms</span>
                    <span className="text-luxury-gold">{unit.bathrooms}</span>
                  </div>
                  <div className="flex justify-between border-b border-luxury-stone/10 pb-2">
                    <span className="text-luxury-stone/60">Carpet Area</span>
                    <span className="text-luxury-gold">{unit.carpetArea}</span>
                  </div>
                  {unit.builtUpArea && (
                    <div className="flex justify-between border-b border-luxury-stone/10 pb-2">
                      <span className="text-luxury-stone/60">Built-up</span>
                      <span className="text-luxury-gold">{unit.builtUpArea}</span>
                    </div>
                  )}
                </div>
                {detailPrefix ? (
                  <Link
                    href={`${detailPrefix}/${slugify(unit.name)}`}
                    className="mt-8 inline-flex w-full items-center justify-center py-3 border border-luxury-gold text-luxury-gold text-xs uppercase tracking-[0.1em] hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 rounded-full"
                  >
                    View Details
                  </Link>
                ) : (
                  <button
                    onClick={() => handleView(unit)}
                    className="mt-8 w-full py-3 border border-luxury-gold text-luxury-gold text-xs uppercase tracking-[0.1em] hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-luxury-gold"
                  >
                    View Floor Plan{unit.blueprintUrls.length > 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={currentSlides}
        styles={{ container: { backgroundColor: 'rgba(10, 10, 10, 0.95)' } }}
      />
      
      {/* Lead Capture Modal */}
      {leadModalOpen && (
        <LeadFormModal
          isOpen={leadModalOpen}
          onClose={() => {
            setLeadModalOpen(false);
            setPendingAction(null);
          }}
          onSuccess={handleLeadSuccess}
          title="Unlock Floor Plans"
          context="Requested Floor Plan Details"
        />
      )}
    </div>
  );
}
