import {
  getCarouselImages,
  getKeyStats,
  getAmenities,
  getProjectPhotos,
  getLocationConfig,
  getGreenFeatures,
  getContactConfig,
  getUnitTypes,
  getAboutConfig,
} from '@/lib/content';
import HeroCarousel from '@/components/HeroCarousel';
import AboutSection from '@/components/AboutSection';
import KeyStatistics from '@/components/KeyStatistics';
import NavigationButtons from '@/components/NavigationButtons';
import ContactSection from '@/components/ContactSection';
import ProjectPhotos from '@/components/ProjectPhotos';
import UnitTypesGrid from '@/components/UnitTypesGrid';
import AmenitiesSection from '@/components/AmenitiesSection';
import LocationSection from '@/components/LocationSection';
import GreenCampusSection from '@/components/GreenCampusSection';

export default async function HomePage() {
  const [
    carouselImages,
    stats,
    amenities,
    projectPhotos,
    location,
    greenFeatures,
    contact,
    unitTypes,
    about,
  ] = await Promise.all([
    getCarouselImages(),
    getKeyStats(),
    getAmenities(),
    getProjectPhotos(),
    getLocationConfig(),
    getGreenFeatures(),
    getContactConfig(),
    getUnitTypes(),
    getAboutConfig(),
  ]);

  return (
    <main>
      {/* Sticky Navigation Buttons */}
      <NavigationButtons />

      {/* Hero - Carousel */}
      <HeroCarousel images={carouselImages} />

      {/* Key Statistics */}
      <KeyStatistics stats={stats} />

      {/* About Section */}
      <AboutSection content={about?.content} />

      {/* Contact Section */}
      <ContactSection contact={contact} />

      {/* Floor Plans */}
      <section id="floor-plans" className="py-20 bg-transparent">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">Floor Plans</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Thoughtfully designed layouts maximizing space and natural light.
            </p>
          </div>
          <UnitTypesGrid unitTypes={unitTypes} />
        </div>
      </section>

      {/* Project Photos Gallery */}
      <ProjectPhotos photos={projectPhotos} />

      {/* Amenities */}
      <AmenitiesSection amenities={amenities} />

      {/* Location */}
      <LocationSection location={location} />

      {/* Green Campus */}
      <GreenCampusSection features={greenFeatures} />

      {/* Footer */}
      <footer className="bg-stone-900 py-8 px-4 text-center">
        <p className="font-serif text-white text-lg tracking-widest mb-1">LODHA SADAHALLI</p>
        <p className="text-white/40 text-xs uppercase tracking-widest">Luxury Residences</p>
        <p className="text-white/30 text-xs mt-4">© {new Date().getFullYear()} LODHA SADAHALLI. All rights reserved.</p>
      </footer>
    </main>
  );
}
