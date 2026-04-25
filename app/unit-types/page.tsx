import { getUnitTypes } from '@/lib/content';
import UnitTypesGrid from '@/components/UnitTypesGrid';
import NavigationButtons from '@/components/NavigationButtons';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Floor Plans & Unit Types - LODHA SADAHALLI',
  description: 'Explore all apartment configurations at LODHA SADAHALLI - 2 BHK, 3 BHK, and premium units with detailed floor plans.',
};

export default async function UnitTypesPage() {
  const unitTypes = await getUnitTypes();

  return (
    <main className="min-h-screen bg-luxury-black text-luxury-stone font-sans">
      <NavigationButtons />

      <section className="bg-luxury-black border-b border-luxury-stone/5 px-4 pt-32 pb-16 md:pt-40 md:pb-24 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-luxury-gold/80 text-xs md:text-sm uppercase tracking-[0.3em] mb-4">
            LODHA SADAHALLI
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-luxury-stone leading-tight mb-6">
            Floor Plans
          </h1>
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto mb-6" />
          <p className="text-luxury-stone/60 mt-4 text-xs uppercase tracking-[0.2em]">
            Choose Your Home
          </p>

          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-luxury-stone/30 bg-transparent px-8 py-3 text-xs uppercase tracking-[0.1em] text-luxury-stone hover:bg-luxury-stone hover:text-luxury-black transition-colors duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <UnitTypesGrid unitTypes={unitTypes} />
      </div>
    </main>
  );
}
