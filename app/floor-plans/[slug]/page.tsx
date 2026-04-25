import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContactConfig, getProjectPhotos, getUnitTypes } from '@/lib/content';
import { slugify } from '@/lib/slug';
import ContactSection from '@/components/ContactSection';
import NavigationButtons from '@/components/NavigationButtons';
import ProjectPhotos from '@/components/ProjectPhotos';
import UnitTypeDetail from '@/components/UnitTypeDetail';
import UnitTypesGrid from '@/components/UnitTypesGrid';

interface FloorPlanDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const unitTypes = await getUnitTypes();
  return unitTypes.map((unit) => ({ slug: slugify(unit.name) }));
}

export async function generateMetadata({ params }: FloorPlanDetailPageProps): Promise<Metadata> {
  const unitTypes = await getUnitTypes();
  const unit = unitTypes.find((item) => slugify(item.name) === params.slug);

  if (!unit) {
    return {
      title: 'Floor Plan - LODHA SADAHALLI',
      description: 'View floor plan details for LODHA SADAHALLI unit types.',
    };
  }

  return {
    title: `${unit.name} Floor Plan - LODHA SADAHALLI`,
    description: `Explore the ${unit.name} floor plan, unit details, photos, and enquiry option.`,
  };
}

export default async function FloorPlanDetailPage({ params }: FloorPlanDetailPageProps) {
  const [unitTypes, projectPhotos, contact] = await Promise.all([
    getUnitTypes(),
    getProjectPhotos(),
    getContactConfig(),
  ]);

  const unit = unitTypes.find((item) => slugify(item.name) === params.slug);
  if (!unit) notFound();

  const relatedUnits = unitTypes.filter((item) => item.id !== unit.id);

  return (
    <main className="min-h-screen bg-luxury-black text-luxury-stone font-sans">
      <NavigationButtons />

      <section className="bg-luxury-black border-b border-luxury-stone/5 px-4 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-luxury-gold/80 text-xs uppercase tracking-[0.3em] mb-4">LODHA SADAHALLI</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-luxury-stone leading-tight mb-6">
            {unit.name}
          </h1>
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto mb-6" />
          <p className="text-luxury-stone/60 text-sm md:text-base max-w-3xl mx-auto font-light leading-relaxed">
            Simple listing page for this unit type with all floor plan images, facts, and contact below.
          </p>
          <div className="mt-12 inline-flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/floor-plans"
              className="inline-flex items-center justify-center border border-luxury-stone/30 bg-transparent px-8 py-3 text-xs uppercase tracking-[0.1em] text-luxury-stone hover:bg-luxury-stone hover:text-luxury-black transition-colors duration-300"
            >
              Back to Floor Plans
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-luxury-gold bg-luxury-gold px-8 py-3 text-xs uppercase tracking-[0.1em] text-luxury-black hover:bg-transparent hover:text-luxury-gold transition-colors duration-300"
            >
              Home Page
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="space-y-24">
          <UnitTypeDetail unit={unit} />

          {relatedUnits.length > 0 && (
            <div>
              <div className="mb-12 text-center">
                <p className="font-serif text-3xl font-light text-luxury-stone mb-4">Other Floor Plans</p>
                <div className="w-12 h-[1px] bg-luxury-gold mx-auto mb-4" />
                <p className="text-luxury-stone/60 font-light text-sm uppercase tracking-widest">Explore additional unit layouts</p>
              </div>
              <UnitTypesGrid unitTypes={relatedUnits} detailPrefix="/floor-plans" />
            </div>
          )}
        </div>
      </section>

      <ProjectPhotos photos={projectPhotos} />

      <ContactSection contact={contact} />
    </main>
  );
}
