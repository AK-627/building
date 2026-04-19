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
    <section id="green-campus" className="py-16 px-4 bg-green-campus">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 bg-white/20 text-white text-xs font-semibold uppercase tracking-widest rounded-full mb-4">
              Sustainability
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
              Green Campus
            </h2>
            <p className="text-white/70 text-sm uppercase tracking-widest">
              LODHA MIRABELLE — Living in Harmony with Nature
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((feature) => (
              <div
                key={feature.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <div className="text-4xl mb-3" aria-hidden="true">{feature.icon}</div>
                <h3 className="font-semibold text-white text-lg mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
