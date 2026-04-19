import {
  getCarouselImages,
  getKeyStats,
  getAmenities,
  getProjectPhotos,
  getLocationConfig,
  getGreenFeatures,
  getContactConfig,
} from '@/lib/content';
import HeroCarousel from '@/components/HeroCarousel';
import KeyStatistics from '@/components/KeyStatistics';
import NavigationButtons from '@/components/NavigationButtons';
import ContactSection from '@/components/ContactSection';
import ProjectPhotos from '@/components/ProjectPhotos';
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
  ] = await Promise.all([
    getCarouselImages(),
    getKeyStats(),
    getAmenities(),
    getProjectPhotos(),
    getLocationConfig(),
    getGreenFeatures(),
    getContactConfig(),
  ]);

  return (
    <main>
      {/* Sticky Navigation Buttons */}
      <NavigationButtons />

      {/* Hero - Carousel */}
      <HeroCarousel images={carouselImages} />

      {/* Key Statistics */}
      <KeyStatistics stats={stats} />

      {/* Contact Section */}
      <ContactSection contact={contact} />

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
        <p className="font-serif text-white text-lg tracking-widest mb-1">LODHA MIRABELLE</p>
        <p className="text-white/40 text-xs uppercase tracking-widest">Luxury Residences</p>
        <p className="text-white/30 text-xs mt-4">© {new Date().getFullYear()} LODHA MIRABELLE. All rights reserved.</p>
      </footer>
    </main>
  );
}
