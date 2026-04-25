import Link from 'next/link';
import type { Metadata } from 'next';
import { getContactConfig, getProjectPhotos, getUnitTypes } from '@/lib/content';
import UnitTypesGrid from '@/components/UnitTypesGrid';
import ProjectPhotos from '@/components/ProjectPhotos';
import ContactSection from '@/components/ContactSection';
import NavigationButtons from '@/components/NavigationButtons';

export const metadata: Metadata = {
  title: 'Floor Plans - LODHA SADAHALLI',
  description: 'Simple floor plans page with multiple blueprints, project photos, and enquiry contact below.',
};

export default async function FloorPlansPage() {
  const [unitTypes, projectPhotos, contact] = await Promise.all([
    getUnitTypes(),
    getProjectPhotos(),
    getContactConfig(),
  ]);

  return (
    <main className="min-h-screen bg-luxury-black text-luxury-stone font-sans">
      <NavigationButtons />

      <section className="bg-luxury-black border-b border-luxury-stone/5 px-4 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-luxury-gold/80 text-xs uppercase tracking-[0.3em] mb-4">LODHA SADAHALLI</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-luxury-stone leading-tight mb-6">
            Floor Plans
          </h1>
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto mb-6" />
          <p className="text-luxury-stone/60 text-sm md:text-base max-w-3xl mx-auto font-light leading-relaxed">
            Discover all unit layouts with clear floor plan images, quick facts, and contact details in one simple page.
          </p>
          <div className="mt-12 inline-flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-luxury-stone/30 bg-transparent px-8 py-3 text-xs uppercase tracking-[0.1em] text-luxury-stone hover:bg-luxury-stone hover:text-luxury-black transition-colors duration-300"
            >
              Back to Home
            </Link>
            <Link
              href="/unit-types"
              className="inline-flex items-center justify-center border border-luxury-gold bg-luxury-gold px-8 py-3 text-xs uppercase tracking-[0.1em] text-luxury-black hover:bg-transparent hover:text-luxury-gold transition-colors duration-300"
            >
              Full Unit Types Page
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="mb-16 text-center text-luxury-stone/60">
          <p className="mb-8 font-light tracking-wide">All features are shown in compact text for quick reading.</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-luxury-stone/5 bg-luxury-charcoal p-8">
              <p className="font-serif text-luxury-stone mb-3 text-xl tracking-wide">Multiple Blueprints</p>
              <p className="text-luxury-stone/40 text-xs leading-loose">View more than one layout image for every unit type.</p>
            </div>
            <div className="border border-luxury-stone/5 bg-luxury-charcoal p-8">
              <p className="font-serif text-luxury-stone mb-3 text-xl tracking-wide">Compact Details</p>
              <p className="text-luxury-stone/40 text-xs leading-loose">Bedrooms, bathrooms, carpet, balcony and built-up info.</p>
            </div>
            <div className="border border-luxury-stone/5 bg-luxury-charcoal p-8">
              <p className="font-serif text-luxury-stone mb-3 text-xl tracking-wide">Photo Gallery</p>
              <p className="text-luxury-stone/40 text-xs leading-loose">Browse project images and then contact us directly below.</p>
            </div>
            <div className="border border-luxury-stone/5 bg-luxury-charcoal p-8">
              <p className="font-serif text-luxury-stone mb-3 text-xl tracking-wide">Enquiry Form</p>
              <p className="text-luxury-stone/40 text-xs leading-loose">Send a request instantly from the page without leaving it.</p>
            </div>
          </div>
        </div>

        <UnitTypesGrid unitTypes={unitTypes} detailPrefix="/floor-plans" />
      </section>

      <ProjectPhotos photos={projectPhotos} />

      <ContactSection contact={contact} />
    </main>
  );
}
