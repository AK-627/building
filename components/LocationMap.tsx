'use client';

import { useState, useEffect } from 'react';
import { normalizeGoogleMapsEmbedUrl } from '@/lib/map-url';

interface LocationMapProps {
  embedUrl: string;
  address: string;
}

export default function LocationMap({ embedUrl, address }: LocationMapProps) {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const normalizedEmbedUrl = normalizeGoogleMapsEmbedUrl(embedUrl);

  useEffect(() => {
    setLoaded(false);
    setTimedOut(false);
  }, [normalizedEmbedUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) setTimedOut(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [loaded, normalizedEmbedUrl]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-slate-100">
      {!timedOut && (
        <iframe
          src={normalizedEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="LODHA SADAHALLI Location"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {!loaded && !timedOut && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {timedOut && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 mb-3" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <p className="text-slate-600 font-medium">Map unavailable</p>
          <p className="text-slate-500 text-sm mt-1">{address}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-sm font-medium text-navy hover:text-navy-light"
          >
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
