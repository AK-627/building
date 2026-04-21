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
    <main className="min-h-screen bg-slate-50">
      <NavigationButtons />

      <section className="bg-gradient-to-b from-navy-dark via-navy to-[#102c50] px-4 py-16 md:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-100/80 text-xs md:text-sm uppercase tracking-[0.22em] mb-3">
            LODHA SADAHALLI
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white leading-tight">
            Floor Plans
          </h1>
          <p className="text-blue-100/85 mt-4 text-sm md:text-base uppercase tracking-[0.16em]">
            Choose Your Home
          </p>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200/40 bg-white/10 px-5 py-2.5 text-sm font-medium text-blue-50 hover:bg-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-200"
            >
              <span aria-hidden="true">&larr;</span>
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-14">
        <UnitTypesGrid unitTypes={unitTypes} />
      </div>
    </main>
  );
}
