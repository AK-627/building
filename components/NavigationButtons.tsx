'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LeadFormModal from '@/components/LeadFormModal';

const NAV_ITEMS = [
  { label: 'Floor Plans', href: '/#floor-plans', isPage: false },
  { label: 'Amenities', anchor: 'amenities', isPage: false },
  { label: 'Gallery', anchor: 'gallery', isPage: false },
  { label: 'Location', anchor: 'location', isPage: false },
  { label: 'Green Campus', anchor: 'green-campus', isPage: false },
  { label: 'Contact', anchor: 'contact', isPage: false },
];

export default function NavigationButtons() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (item: (typeof NAV_ITEMS)[0]) => {
    setMenuOpen(false);
    if (item.isPage) {
      window.location.href = item.href!;
      return;
    }
    const target = item.href ? item.href.replace('/#', '') : item.anchor;
    const el = document.getElementById(target!);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (item.href) {
      window.location.href = item.href;
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled ? 'bg-luxury-black/90 backdrop-blur-md border-luxury-stone/10 py-2' : 'bg-transparent border-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo / Title */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-luxury-gold rounded"
          >
            <span className="w-[1px] h-10 bg-luxury-gold" aria-hidden="true" />
            <div>
              <p className="font-serif text-lg md:text-xl font-light text-luxury-stone leading-tight tracking-[0.1em]">
                LODHA SADAHALLI
              </p>
              <p className="text-[10px] text-luxury-gold uppercase tracking-[0.2em] leading-none mt-1">
                Luxury Residences
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleClick(item)}
                className="text-xs uppercase tracking-[0.1em] font-light text-luxury-stone/80 hover:text-luxury-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-luxury-gold whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setBrochureModalOpen(true)}
              className="ml-4 px-6 py-2.5 border border-luxury-gold text-luxury-gold text-xs uppercase tracking-[0.1em] hover:bg-luxury-gold hover:text-luxury-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-luxury-gold whitespace-nowrap"
            >
              Download Brochure
            </button>
            <button
              onClick={() => handleClick(NAV_ITEMS[5])}
              className="ml-2 px-6 py-2.5 bg-luxury-gold text-luxury-black text-xs uppercase tracking-[0.1em] hover:bg-luxury-gold/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-luxury-gold whitespace-nowrap"
            >
              Enquire Now
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-luxury-stone focus-visible:outline focus-visible:outline-2 focus-visible:outline-luxury-gold"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="flex flex-col gap-1.5 w-6">
              <span className={`block h-[1px] bg-luxury-stone transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-[1px] bg-luxury-stone transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[1px] bg-luxury-stone transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </span>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav
            className="md:hidden absolute top-full left-0 right-0 bg-luxury-black/95 backdrop-blur-md border-b border-luxury-stone/10 px-6 py-6 flex flex-col gap-4 shadow-2xl"
            aria-label="Mobile navigation"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleClick(item)}
                className="w-full text-left py-2 text-sm uppercase tracking-[0.15em] font-light text-luxury-stone/80 hover:text-luxury-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-luxury-gold"
              >
                {item.label}
              </button>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setBrochureModalOpen(true);
                }}
                className="w-full px-6 py-3 border border-luxury-gold text-luxury-gold text-xs uppercase tracking-[0.1em] hover:bg-luxury-gold hover:text-luxury-black transition-colors"
              >
                Download Brochure
              </button>
              <button
                onClick={() => handleClick(NAV_ITEMS[5])}
                className="w-full px-6 py-3 bg-luxury-gold text-luxury-black text-xs uppercase tracking-[0.1em] hover:bg-luxury-gold/80 transition-colors"
              >
                Enquire Now
              </button>
            </div>
          </nav>
        )}
      </header>

      {brochureModalOpen && (
        <LeadFormModal
          isOpen={brochureModalOpen}
          onClose={() => setBrochureModalOpen(false)}
          title="Download Brochure"
          context="Requested Brochure"
        />
      )}
    </>
  );
}
