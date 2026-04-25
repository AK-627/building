'use client';

import { motion } from 'framer-motion';
import type { KeyStat } from '@/lib/types';

interface KeyStatisticsProps {
  stats: KeyStat[];
}

export default function KeyStatistics({ stats }: KeyStatisticsProps) {
  if (stats.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 15 }
    }
  };

  return (
    <section className="bg-luxury-black py-24 px-4 border-b border-luxury-stone/5 relative overflow-hidden" id="key-stats">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-luxury-gold/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <motion.div 
              key={stat.id} 
              variants={item}
              className="text-center p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl hover:bg-white/10 transition-colors duration-500"
            >
              <p className="font-serif text-5xl md:text-6xl font-light text-luxury-stone mb-4 tracking-wider">
                {stat.value}
              </p>
              <div className="w-12 h-[1px] bg-luxury-gold mx-auto mb-4" />
              <p className="text-luxury-gold/80 text-xs md:text-sm font-light uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
