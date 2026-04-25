'use client';

import ScrollReveal from '@/components/ScrollReveal';
import type { KeyStat } from '@/lib/types';

interface KeyStatisticsProps {
  stats: KeyStat[];
}

export default function KeyStatistics({ stats }: KeyStatisticsProps) {
  if (stats.length === 0) return null;

  return (
    <section className="bg-luxury-black py-24 px-4 border-b border-luxury-stone/5" id="key-stats">
      <ScrollReveal animation="fadeUp">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-12 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-luxury-stone/10">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center flex-1 min-w-[200px] pt-8 md:pt-0">
              <p className="font-serif text-5xl md:text-6xl font-light text-luxury-stone mb-4 tracking-wider">
                {stat.value}
              </p>
              <div className="w-12 h-[1px] bg-luxury-gold mx-auto mb-4" />
              <p className="text-luxury-gold/80 text-xs md:text-sm font-light uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
