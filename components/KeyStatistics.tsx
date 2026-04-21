import ScrollReveal from '@/components/ScrollReveal';
import type { KeyStat } from '@/lib/types';

interface KeyStatisticsProps {
  stats: KeyStat[];
}

export default function KeyStatistics({ stats }: KeyStatisticsProps) {
  if (stats.length === 0) return null;

  return (
    <section className="bg-transparent py-16 px-4 border-b border-stone-200" id="key-stats">
      <ScrollReveal>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-50/50 hover:-translate-y-1 transition-transform duration-300">
              <p className="font-sans text-4xl md:text-5xl font-extrabold tracking-tight text-navy mb-2 bg-gradient-to-r from-navy to-blue-600 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-stone-500 text-xs md:text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
