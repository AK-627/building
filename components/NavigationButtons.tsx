'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Floor Plans', href: '/unit-types', isPage: true },
  { label: 'Amenities', anchor: 'amenities', isPage: false },
  { label: 'Gallery', anchor: 'gallery', isPage: false },
  { label: 'Location', anchor: 'location', isPage: false },
  { label: 'Green Campus', anchor: 'green-campus', isPage: false },
  { label: 'Contact', anchor: 'contact', isPage: false },
];

export default function NavigationButtons() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (item: (typeof NAV_ITEMS)[0]) => {
    setMenuOpen(false);
    if (item.isPage) {
      window.location.href = item.href!;
      return;
    }
    const el = document.getElementById(item.anchor!);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-stone-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo / Title */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy rounded"
        >
          <span className="w-2 h-8 bg-navy rounded-full" aria-hidden="true" />
          <div>
            <p className="font-serif text-base font-bold text-stone-900 leading-tight tracking-wide">
              LODHA MIRABELLE
            </p>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-none">
              Luxury Residences
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className="min-h-[44px] px-3 py-2 text-sm font-medium text-stone-600 hover:text-navy transition-colors rounded-lg hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleClick(NAV_ITEMS[5])}
            className="min-h-[44px] ml-2 px-5 py-2 bg-navy text-white text-sm font-semibold rounded-full hover:bg-navy-light transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy whitespace-nowrap"
          >
            Enquire Now
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="flex flex-col gap-1.5 w-5">
            <span className={`block h-0.5 bg-stone-700 rounded transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-stone-700 rounded transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-stone-700 rounded transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          className="md:hidden border-t border-stone-100 bg-white px-4 py-3 flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className="min-h-[44px] w-full text-left px-3 py-2 text-sm font-medium text-stone-700 hover:text-navy hover:bg-blue-50 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleClick(NAV_ITEMS[5])}
            className="min-h-[44px] mt-2 w-full px-5 py-2 bg-navy text-white text-sm font-semibold rounded-full hover:bg-navy-light transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
          >
            Enquire Now
          </button>
        </nav>
      )}
    </header>
  );
}
