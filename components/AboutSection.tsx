'use client';

import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';

interface AboutSectionProps {
  content?: string;
}

export default function AboutSection({ content }: AboutSectionProps) {
  // We use a fallback just in case, but typically the parsed content from DB is shown.
  const displayContent = content || `Lodha Sadahalli – A New Benchmark of Luxury Living in Bangalore.

Introducing Lodha Sadahalli, a landmark residential development inspired by the grandeur of Balmoral Castle. This iconic **80-acre** project beautifully blends Neo-Classical architecture with European garden estates. With **85% lush open spaces**, expansive residences ranging from **2,200 to 5,000 sq. ft.**, and a starting price of **₹3.5 Cr**, it offers a rare balance of luxury and nature.

An address of distinction, where legacy meets luxury.`;

  // Function to render markdown-like bold (**)
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-4 text-stone-600 leading-relaxed text-base md:text-lg lg:text-xl">
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} className="font-semibold text-navy">
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
    <section className="py-16 md:py-24 bg-transparent px-4 border-b border-stone-100">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <span className="inline-block px-4 py-1 bg-stone-100 text-stone-600 text-xs font-semibold uppercase tracking-widest rounded-full mb-6">
            About the Project
          </span>
          <div className="text-left md:text-center">
            {renderText(displayContent)}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
