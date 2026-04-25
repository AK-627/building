'use client';

import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';

interface AboutSectionProps {
  content?: string;
}

export default function AboutSection({ content }: AboutSectionProps) {
  const displayContent = content || `Lodha Sadahalli – A New Benchmark of Luxury Living in Bangalore.

Introducing Lodha Sadahalli, a landmark residential development inspired by the grandeur of Balmoral Castle. This iconic **80-acre** project beautifully blends Neo-Classical architecture with European garden estates. With **85% lush open spaces**, expansive residences ranging from **2,200 to 5,000 sq. ft.**, and a starting price of **₹3.5 Cr**, it offers a rare balance of luxury and nature.

An address of distinction, where legacy meets luxury.`;

  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-6 text-luxury-charcoal/80 leading-loose text-lg md:text-2xl font-light">
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} className="font-normal text-luxury-gold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </p>
    ));
  };

  return (
    <section className="py-24 md:py-40 bg-luxury-stone px-4 border-b border-luxury-charcoal/5">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal animation="fadeUp">
          <div className="flex flex-col items-center mb-12">
            <span className="inline-block px-4 py-1.5 border border-luxury-gold/50 rounded-full text-luxury-gold text-xs font-light uppercase tracking-[0.2em] mb-8">
              About the Project
            </span>
          </div>
          <div className="text-center font-serif">
            {renderText(displayContent)}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
