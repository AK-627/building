'use client';

import { useEffect, useState } from 'react';
import LeadFormModal from './LeadFormModal';

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only run on desktop and if it hasn't been shown in this session
    if (window.innerWidth < 768) return;
    if (sessionStorage.getItem('exitIntentShown')) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // If the mouse leaves the top of the window (clientY < 0)
      if (e.clientY <= 0) {
        setIsOpen(true);
        sessionStorage.setItem('exitIntentShown', 'true');
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <LeadFormModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Wait! Don't miss out."
      context="Exit Intent Popup - Pricing Sheet Request"
    />
  );
}
