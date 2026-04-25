import type { LocationConfig } from '@/lib/types';
import LocationMap from '@/components/LocationMap';
import ScrollReveal from '@/components/ScrollReveal';

interface LocationSectionProps {
  location: LocationConfig | null;
}

export default function LocationSection({ location }: LocationSectionProps) {
  if (!location) return null;

  return (
    <section id="location" className="py-24 px-4 bg-luxury-black border-b border-luxury-stone/5">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal animation="fadeUp">
          <div className="flex flex-col items-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-luxury-stone text-center mb-4">
              Location
            </h2>
            <div className="w-16 h-[1px] bg-luxury-gold mb-6" />
            <p className="text-luxury-gold/80 text-center text-xs md:text-sm uppercase tracking-[0.2em]">
              LODHA SADAHALLI — Perfectly Connected
            </p>
          </div>
          <div className="border border-luxury-stone/10 p-2 bg-luxury-charcoal">
            <LocationMap embedUrl={location.embedUrl} address={location.address} />
          </div>
          <p className="text-center text-luxury-stone/60 font-light text-sm mt-6 uppercase tracking-wider">{location.address}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
