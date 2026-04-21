import type { LocationConfig } from '@/lib/types';
import LocationMap from '@/components/LocationMap';
import ScrollReveal from '@/components/ScrollReveal';

interface LocationSectionProps {
  location: LocationConfig | null;
}

export default function LocationSection({ location }: LocationSectionProps) {
  if (!location) return null;

  return (
    <section id="location" className="py-16 px-4 bg-transparent">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy text-center mb-2">
            Location
          </h2>
          <p className="text-slate-500 text-center mb-8 text-sm uppercase tracking-widest">
            LODHA SADAHALLI — Perfectly Connected
          </p>
          <LocationMap embedUrl={location.embedUrl} address={location.address} />
          <p className="text-center text-slate-500 text-sm mt-4">{location.address}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
