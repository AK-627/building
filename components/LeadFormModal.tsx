'use client';

import { useState } from 'react';
import { tryParseJsonResponse } from '@/lib/try-parse-json-response';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title: string;
  context: string;
}

export default function LeadFormModal({ isOpen, onClose, onSuccess, title, context }: LeadFormModalProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setStatus('error');
      setErrorMsg('All fields are required.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, context }),
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
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  const inputClass = 'w-full min-h-[44px] px-4 py-2 border border-slate-300 rounded-lg text-navy placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy bg-white';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-serif font-bold text-navy mb-2">{title}</h2>
          <p className="text-stone-600 mb-6 text-sm">Please provide your details to continue.</p>

          {status === 'success' && !onSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Thank You!</h3>
              <p className="text-stone-600">Your details have been received. We will get in touch with you shortly.</p>
              <button onClick={onClose} className="mt-6 w-full min-h-[44px] px-6 py-2 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-name" className="block text-sm font-medium text-navy mb-1">Full Name *</label>
                <input id="modal-name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your full name" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="modal-email" className="block text-sm font-medium text-navy mb-1">Email Address *</label>
                <input id="modal-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="modal-phone" className="block text-sm font-medium text-navy mb-1">Contact Number *</label>
                <input id="modal-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={inputClass} required />
              </div>

              {status === 'error' && (
                <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full min-h-[44px] mt-2 px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
              >
                {status === 'loading' ? 'Submitting...' : status === 'success' ? 'Success!' : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
