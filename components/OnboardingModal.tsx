'use client';

import { useState, useEffect } from 'react';
import { tryParseJsonResponse } from '@/lib/try-parse-json-response';

type StepType = 'property' | 'bhk' | 'budget' | 'area' | 'contact';

interface Preferences {
  propertyType: string;
  bhk: string;
  budget: string;
  area: string;
  name: string;
  email: string;
  phone: string;
}

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [prefs, setPrefs] = useState<Preferences>({
    propertyType: '',
    bhk: '',
    budget: '',
    area: '',
    name: '',
    email: '',
    phone: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const totalSteps = 5;

  useEffect(() => {
    // Only show once per session
    const hasSeen = sessionStorage.getItem('hasSeenOnboarding');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 15000); // 15 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleSelect = (field: keyof Preferences, value: string) => {
    setPrefs((prev) => ({ ...prev, [field]: value }));
    nextStep();
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prefs.name || !prefs.email || !prefs.phone) {
      setStatus('error');
      setErrorMsg('Name, email, and phone are required.');
      return;
    }

    setStatus('loading');
    
    // Format context string
    const contextStr = [
      'Multi-Step Onboarding Lead',
      prefs.propertyType ? `Type: ${prefs.propertyType}` : '',
      prefs.bhk ? `Size: ${prefs.bhk}` : '',
      prefs.budget ? `Budget: ${prefs.budget}` : '',
      prefs.area ? `Area: ${prefs.area}` : ''
    ].filter(Boolean).join(' | ');

    try {
      const res = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: prefs.name,
          email: prefs.email,
          phone: prefs.phone,
          context: contextStr,
        }),
      });
      const parsed = await tryParseJsonResponse(res);
      
      if (!parsed.ok) {
        setStatus('error');
        setErrorMsg('Something went wrong. Please try again.');
        return;
      }
      
      const data = parsed.data as { success?: boolean; error?: string };
      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-luxury-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-luxury-charcoal rounded-2xl border border-luxury-stone/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header & Progress */}
        <div className="px-6 pt-6 pb-4 border-b border-luxury-stone/5 flex-shrink-0">
          <div className="flex justify-between items-center mb-6">
            <button onClick={prevStep} disabled={step === 1 || status === 'success'} className={`text-luxury-stone/50 hover:text-luxury-stone transition-colors ${step === 1 || status === 'success' ? 'opacity-0 cursor-default' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div className="text-center">
              <p className="font-serif text-luxury-gold tracking-widest text-sm uppercase">Lodha Sadahalli</p>
            </div>
            <button onClick={handleClose} className="text-luxury-stone/50 hover:text-luxury-stone transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Progress Segments */}
          <div className="flex gap-1.5 w-full">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div key={idx} className="h-1 flex-1 rounded-full overflow-hidden bg-luxury-stone/10">
                <div 
                  className={`h-full bg-gradient-to-r from-luxury-gold to-yellow-500 transition-all duration-500 ${idx < step ? 'w-full' : 'w-0'}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {status === 'success' ? (
            <div className="text-center py-12 animate-in slide-in-from-right-4">
              <div className="w-16 h-16 bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="font-serif text-2xl text-luxury-stone mb-2">Thank You!</h3>
              <p className="text-luxury-stone/60 text-sm leading-relaxed mb-8">
                Your preferences have been received. Our luxury real estate expert will contact you shortly.
              </p>
              <button onClick={handleClose} className="w-full py-3 bg-luxury-gold text-luxury-black text-sm uppercase tracking-widest rounded-full hover:bg-white transition-colors">
                Return to Site
              </button>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              {step === 1 && (
                <SelectionStep 
                  title="What type of property are you looking for?"
                  options={['Apartment / Flat', 'Independent House', 'Luxury Villa', 'Plot / Land']}
                  onSelect={(val) => handleSelect('propertyType', val)}
                  onSkip={nextStep}
                />
              )}
              {step === 2 && (
                <SelectionStep 
                  title="What size are you looking for?"
                  options={['2 BHK (1500 - 1800 sqft)', '3 BHK (2000 - 2500 sqft)', '3.5 BHK (2500 - 2800 sqft)', '4+ BHK (3000+ sqft)']}
                  onSelect={(val) => handleSelect('bhk', val)}
                  onSkip={nextStep}
                />
              )}
              {step === 3 && (
                <SelectionStep 
                  title="What is your budget?"
                  options={['₹ 1.5 Cr - ₹ 2.5 Cr', '₹ 2.5 Cr - ₹ 3.5 Cr', '₹ 3.5 Cr - ₹ 5.0 Cr', '₹ 5.0 Cr +']}
                  onSelect={(val) => handleSelect('budget', val)}
                  onSkip={nextStep}
                />
              )}
              {step === 4 && (
                <SelectionStep 
                  title="Which area do you prefer?"
                  options={['North Bangalore (Airport Rd)', 'South Bangalore', 'East Bangalore (Whitefield)', 'West Bangalore']}
                  onSelect={(val) => handleSelect('area', val)}
                  onSkip={nextStep}
                />
              )}
              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl text-luxury-stone mb-6">Where should we send the details?</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Full Name *" 
                        value={prefs.name}
                        onChange={(e) => setPrefs({...prefs, name: e.target.value})}
                        className="w-full min-h-[48px] px-4 py-2 bg-luxury-black border border-luxury-stone/20 rounded-xl text-luxury-stone placeholder-luxury-stone/40 focus:outline-none focus:border-luxury-gold"
                        required
                      />
                    </div>
                    <div>
                      <input 
                        type="email" 
                        placeholder="Email Address *" 
                        value={prefs.email}
                        onChange={(e) => setPrefs({...prefs, email: e.target.value})}
                        className="w-full min-h-[48px] px-4 py-2 bg-luxury-black border border-luxury-stone/20 rounded-xl text-luxury-stone placeholder-luxury-stone/40 focus:outline-none focus:border-luxury-gold"
                        required
                      />
                    </div>
                    <div>
                      <input 
                        type="tel" 
                        placeholder="Phone Number *" 
                        value={prefs.phone}
                        onChange={(e) => setPrefs({...prefs, phone: e.target.value})}
                        className="w-full min-h-[48px] px-4 py-2 bg-luxury-black border border-luxury-stone/20 rounded-xl text-luxury-stone placeholder-luxury-stone/40 focus:outline-none focus:border-luxury-gold"
                        required
                      />
                    </div>

                    {status === 'error' && (
                      <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-xs">
                        {errorMsg}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="w-full py-4 mt-4 bg-gradient-to-r from-luxury-gold to-yellow-600 text-luxury-black font-medium tracking-widest uppercase text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {status === 'loading' ? 'Submitting...' : 'View Details'}
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={handleClose}
                      className="w-full py-3 text-luxury-stone/60 text-xs uppercase tracking-widest hover:text-luxury-stone transition-colors"
                    >
                      Skip for now
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectionStep({ title, options, onSelect, onSkip }: { title: string, options: string[], onSelect: (val: string) => void, onSkip: () => void }) {
  return (
    <div>
      <h3 className="font-serif text-xl text-luxury-stone mb-6">{title}</h3>
      <div className="space-y-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(opt)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-luxury-stone/10 bg-luxury-stone/5 hover:bg-luxury-stone/10 hover:border-luxury-gold/50 transition-all group"
          >
            <span className="text-luxury-stone text-sm">{opt}</span>
            <div className="w-5 h-5 rounded-full border border-luxury-stone/30 group-hover:border-luxury-gold" />
          </button>
        ))}
      </div>
      <button 
        onClick={onSkip}
        className="w-full mt-8 py-3 text-luxury-stone/50 hover:text-luxury-stone text-xs uppercase tracking-widest transition-colors"
      >
        Skip this question
      </button>
    </div>
  );
}
