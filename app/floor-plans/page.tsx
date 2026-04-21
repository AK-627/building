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
    <main className="min-h-screen bg-slate-50">
      <NavigationButtons />

      <section className="bg-white border-b border-slate-200 px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400 text-xs uppercase tracking-[0.3em] mb-3">LODHA SADAHALLI</p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-navy leading-tight">
            Floor Plans
          </h1>
          <p className="text-slate-500 text-sm md:text-base mt-4 max-w-3xl mx-auto">
            Discover all unit layouts with clear floor plan images, quick facts, and contact details in one simple page.
          </p>
          <div className="mt-8 inline-flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              Back to Home
            </Link>
            <Link
              href="/unit-types"
              className="inline-flex items-center justify-center rounded-full border border-navy bg-navy text-white px-5 py-2.5 text-sm font-medium hover:bg-navy-light transition"
            >
              Full Unit Types Page
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        <div className="mb-8 text-sm text-slate-600">
          <p className="mb-3">All features are shown in compact text for quick reading.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-900 mb-1">Multiple Blueprints</p>
              <p className="text-slate-500">View more than one layout image for every unit type.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-900 mb-1">Compact Details</p>
              <p className="text-slate-500">Bedrooms, bathrooms, carpet, balcony and built-up info in small font.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-900 mb-1">Photo Gallery</p>
              <p className="text-slate-500">Browse project images and then contact us directly below.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-900 mb-1">Enquiry Form</p>
              <p className="text-slate-500">Send a request instantly from the page without leaving it.</p>
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
