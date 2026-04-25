import type { GreenFeature } from '@/lib/types';
import ScrollReveal from '@/components/ScrollReveal';

interface GreenCampusSectionProps {
  features: GreenFeature[];
}

// Default eco features if none configured
const DEFAULT_FEATURES: Omit<GreenFeature, 'id' | 'order'>[] = [
  { icon: '💧', title: 'Rainwater Harvesting', description: 'Advanced rainwater collection and recycling systems reduce water consumption by up to 40%.' },
  { icon: '☀️', title: 'Solar Energy', description: 'Rooftop solar panels power common areas, reducing the carbon footprint of the community.' },
  { icon: '🌳', title: 'Green Landscaping', description: 'Native plants and drought-resistant landscaping across 60% of the open areas.' },
  { icon: '♻️', title: 'Waste Management', description: 'Segregated waste collection and composting facilities for organic waste.' },
  { icon: '🌬️', title: 'Natural Ventilation', description: 'Building orientation and design maximise natural airflow, reducing cooling energy needs.' },
  { icon: '🏊', title: 'Water Recycling', description: 'Treated greywater is reused for irrigation and flushing, conserving precious resources.' },
];

export default function GreenCampusSection({ features }: GreenCampusSectionProps) {
  const items = features.length > 0
    ? features
    : DEFAULT_FEATURES.map((f, i) => ({ ...f, id: `default-${i}`, order: i }));

  return (
    <section id="green-campus" className="py-24 px-4 bg-luxury-black relative overflow-hidden border-b border-luxury-stone/5">
      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal animation="fadeUp">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 border border-luxury-gold/50 text-luxury-gold text-xs font-light uppercase tracking-[0.2em] mb-6">
              Sustainability
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-wide text-luxury-stone mb-4">
              Green Campus
            </h2>
            <div className="w-16 h-[1px] bg-luxury-gold mx-auto mb-6" />
            <p className="text-luxury-stone/60 text-xs md:text-sm uppercase tracking-[0.2em] max-w-2xl mx-auto">
              LODHA SADAHALLI — Living in Harmony with Nature
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
            {items.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full border border-luxury-gold/30 flex items-center justify-center text-3xl mb-6 bg-luxury-gold/5 relative transition-transform duration-700 group-hover:scale-110 group-hover:bg-luxury-gold/10 group-hover:border-luxury-gold/60">
                  <span className="relative z-10 block transform transition-transform duration-500 group-hover:-translate-y-1 opacity-80 group-hover:opacity-100">
                    {feature.icon}
                  </span>
                </div>
                
                <h3 className="font-serif font-light tracking-[0.1em] text-luxury-stone text-xl mb-4">
                  {feature.title}
                </h3>
                <p className="font-light text-luxury-stone/60 text-sm leading-loose max-w-xs">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
