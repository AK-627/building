import ScrollReveal from '@/components/ScrollReveal';
import type { KeyStat } from '@/lib/types';

interface KeyStatisticsProps {
  stats: KeyStat[];
}

export default function KeyStatistics({ stats }: KeyStatisticsProps) {
  if (stats.length === 0) return null;

  return (
    <section className="bg-stone-900 py-10 px-4" id="key-stats">
      <ScrollReveal>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <p className="font-serif text-3xl md:text-5xl font-bold text-white leading-none">
                {stat.value}
              </p>
              <p className="text-white/60 text-xs md:text-sm mt-2 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
