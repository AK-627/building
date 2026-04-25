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
      <section id="floor-plans" className="py-24 bg-luxury-stone border-b border-luxury-charcoal/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-luxury-charcoal text-center mb-4">
              Floor Plans
            </h2>
            <div className="w-16 h-[1px] bg-luxury-gold mb-6" />
            <p className="text-luxury-gold/80 text-center text-xs md:text-sm uppercase tracking-[0.2em] max-w-2xl mx-auto">
              Thoughtfully designed layouts maximizing space and natural light
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
      <footer className="bg-luxury-black py-16 px-4 text-center border-t border-luxury-gold/20">
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mb-8" />
        <p className="font-serif text-luxury-stone text-xl tracking-[0.2em] mb-2 font-light">LODHA SADAHALLI</p>
        <p className="text-luxury-gold/60 text-xs uppercase tracking-[0.3em] mb-8">Luxury Residences</p>
        <p className="text-luxury-stone/40 text-[10px] max-w-2xl mx-auto leading-loose mb-6 font-light uppercase tracking-wider">
          Disclaimer: The images, content, and details provided on this website are for informational purposes only. 
          This is not the official developer website. 
          RERA Registration No: PRM/KA/RERA/1251/472/PR/XXXXXXXX/XXXXXX
        </p>
        <p className="text-luxury-gold/40 text-xs mt-8 uppercase tracking-widest">© {new Date().getFullYear()} LODHA SADAHALLI. All rights reserved.</p>
      </footer>
    </main>
  );
}
