'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fadeUp' | 'fade' | 'scaleUp' | 'slideRight';
}

export default function ScrollReveal({ children, className, delay = 0, animation = 'fadeUp' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const variants = {
    fadeUp: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    scaleUp: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } },
    slideRight: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } }
  };

  return (
    <motion.div
      ref={ref}
      initial={variants[animation].initial}
      animate={isInView ? variants[animation].animate : variants[animation].initial}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }} // sophisticated easing curve
      className={className}
    >
      {children}
    </motion.div>
  );
}
