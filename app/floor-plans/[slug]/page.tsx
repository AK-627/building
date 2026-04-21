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
    <main className="min-h-screen bg-slate-50">
      <NavigationButtons />

      <section className="bg-white border-b border-slate-200 px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400 text-xs uppercase tracking-[0.3em] mb-3">LODHA SADAHALLI</p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-navy leading-tight">
            {unit.name}
          </h1>
          <p className="text-slate-500 text-sm md:text-base mt-4 max-w-3xl mx-auto">
            Simple listing page for this unit type with all floor plan images, facts, and contact below.
          </p>
          <div className="mt-8 inline-flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/floor-plans"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              Back to Floor Plans
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-navy bg-navy text-white px-5 py-2.5 text-sm font-medium hover:bg-navy-light transition"
            >
              Home Page
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        <div className="space-y-12">
          <UnitTypeDetail unit={unit} />

          {relatedUnits.length > 0 && (
            <div>
              <div className="mb-6 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Other available floor plans</p>
                <p>Explore additional unit layouts with a clean, compact list.</p>
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
