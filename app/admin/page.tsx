import {
  getCarouselImages,
  getKeyStats,
  getAmenities,
  getUnitTypes,
  getProjectPhotos,
  getLocationConfig,
  getGreenFeatures,
  getContactConfig,
  getAboutConfig,
} from '@/lib/content';
import CarouselManager from '@/components/admin/CarouselManager';
import AboutEditor from '@/components/admin/AboutEditor';
import StatsEditor from '@/components/admin/StatsEditor';
import AmenitiesManager from '@/components/admin/AmenitiesManager';
import UnitTypesManager from '@/components/admin/UnitTypesManager';
import PhotosManager from '@/components/admin/PhotosManager';
import LocationEditor from '@/components/admin/LocationEditor';
import GreenCampusManager from '@/components/admin/GreenCampusManager';
import ContactEditor from '@/components/admin/ContactEditor';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [
    carouselImages,
    keyStats,
    amenities,
    unitTypes,
    projectPhotos,
    locationConfig,
    greenFeatures,
    contactConfig,
    aboutConfig,
  ] = await Promise.all([
    getCarouselImages(),
    getKeyStats(),
    getAmenities(),
    getUnitTypes(),
    getProjectPhotos(),
    getLocationConfig(),
    getGreenFeatures(),
    getContactConfig(),
    getAboutConfig(),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-sans font-bold tracking-wide text-navy mb-1">Dashboard</h2>
        <p className="text-slate-500 text-sm">Manage all content for the LODHA SADAHALLI website.</p>
      </div>

      <section aria-labelledby="section-carousel">
        <div className="mb-4">
          <h2 id="section-carousel" className="text-lg font-semibold text-navy">Hero Carousel</h2>
          <p className="text-slate-500 text-sm">Manage the full-width hero images shown at the top of the page.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <CarouselManager initialImages={carouselImages} />
        </div>
      </section>

      <section aria-labelledby="section-about">
        <div className="bg-white rounded-xl border border-slate-200">
          <AboutEditor initialAbout={aboutConfig} />
        </div>
      </section>

      <section aria-labelledby="section-stats">
        <div className="mb-4">
          <h2 id="section-stats" className="text-lg font-semibold text-navy">Key Statistics</h2>
          <p className="text-slate-500 text-sm">Edit the headline stats displayed below the carousel.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <StatsEditor initialStats={keyStats} />
        </div>
      </section>

      <section aria-labelledby="section-amenities">
        <div className="mb-4">
          <h2 id="section-amenities" className="text-lg font-semibold text-navy">Amenities</h2>
          <p className="text-slate-500 text-sm">Add, edit, or remove amenity cards shown on the public site.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <AmenitiesManager initialAmenities={amenities} />
        </div>
      </section>

      <section aria-labelledby="section-unit-types">
        <div className="mb-4">
          <h2 id="section-unit-types" className="text-lg font-semibold text-navy">Unit Types</h2>
          <p className="text-slate-500 text-sm">Manage apartment configurations and blueprint images.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <UnitTypesManager initialUnitTypes={unitTypes} />
        </div>
      </section>

      <section aria-labelledby="section-photos">
        <div className="mb-4">
          <h2 id="section-photos" className="text-lg font-semibold text-navy">Project Photos</h2>
          <p className="text-slate-500 text-sm">Manage the photo gallery shown on the public site.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <PhotosManager initialPhotos={projectPhotos} />
        </div>
      </section>

      <section aria-labelledby="section-location">
        <div className="mb-4">
          <h2 id="section-location" className="text-lg font-semibold text-navy">Location</h2>
          <p className="text-slate-500 text-sm">Update the Google Maps embed URL and fallback address.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <LocationEditor initialLocation={locationConfig} />
        </div>
      </section>

      <section aria-labelledby="section-green-campus">
        <div className="mb-4">
          <h2 id="section-green-campus" className="text-lg font-semibold text-navy">Green Campus</h2>
          <p className="text-slate-500 text-sm">Manage eco-friendly features highlighted in the Green Campus section.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <GreenCampusManager initialFeatures={greenFeatures} />
        </div>
      </section>

      <section aria-labelledby="section-contact">
        <div className="mb-4">
          <h2 id="section-contact" className="text-lg font-semibold text-navy">Contact</h2>
          <p className="text-slate-500 text-sm">Update the phone number and WhatsApp pre-fill message.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <ContactEditor initialContact={contactConfig} />
        </div>
      </section>
    </div>
  );
}
