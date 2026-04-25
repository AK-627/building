'use client';

import { useState } from 'react';
import { enquirySchema } from '@/lib/validation';
import { tryParseJsonResponse } from '@/lib/try-parse-json-response';

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string[];
  email?: string[];
  phone?: string[];
  message?: string[];
}

export default function EnquiryForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = enquirySchema.safeParse(form);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as FormErrors);
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const parsed = await tryParseJsonResponse(res);
      if (!parsed.ok) {
        setStatus('error');
        setErrorMsg(
          parsed.reason === 'empty'
            ? 'Server returned no response. Check deployment logs.'
            : 'Could not read server response. Please try again or use WhatsApp.',
        );
        return;
      }
      const data = parsed.data as { success?: boolean; error?: string };
      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', message: '' });
        setErrors({});
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again or contact us via WhatsApp.');
    }
  };

  const inputClass = 'w-full min-h-[44px] px-5 py-3 border border-white/10 bg-white/5 text-luxury-stone placeholder-luxury-stone/30 focus:outline-none focus:border-luxury-gold focus:bg-white/10 transition-all rounded-2xl font-light backdrop-blur-sm';
  const errorClass = 'text-[#D4AF37] text-xs mt-1 ml-2';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
      <div className="relative">
        <label htmlFor="name" className="block text-xs uppercase tracking-[0.1em] text-luxury-stone/60 mb-2 ml-2">Full Name *</label>
        <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your full name" className={inputClass} aria-describedby={errors.name ? 'name-error' : undefined} />
        {errors.name && <p id="name-error" className={errorClass}>{errors.name[0]}</p>}
      </div>
      <div className="relative">
        <label htmlFor="email" className="block text-xs uppercase tracking-[0.1em] text-luxury-stone/60 mb-2 ml-2">Email Address *</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} aria-describedby={errors.email ? 'email-error' : undefined} />
        {errors.email && <p id="email-error" className={errorClass}>{errors.email[0]}</p>}
      </div>
      <div className="relative">
        <label htmlFor="phone" className="block text-xs uppercase tracking-[0.1em] text-luxury-stone/60 mb-2 ml-2">Phone Number *</label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={inputClass} aria-describedby={errors.phone ? 'phone-error' : undefined} />
        {errors.phone && <p id="phone-error" className={errorClass}>{errors.phone[0]}</p>}
      </div>
      <div className="relative">
        <label htmlFor="message" className="block text-xs uppercase tracking-[0.1em] text-luxury-stone/60 mb-2 ml-2">Message *</label>
        <textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="I am interested in LODHA SADAHALLI..." rows={3} className={`${inputClass} resize-none rounded-3xl`} aria-describedby={errors.message ? 'message-error' : undefined} />
        {errors.message && <p id="message-error" className={errorClass}>{errors.message[0]}</p>}
      </div>

      {status === 'success' && (
        <div role="alert" className="p-4 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-sm font-light text-center">
          Thank you! Your enquiry has been sent. Our team will contact you shortly.
        </div>
      )}
      {status === 'error' && (
        <div role="alert" className="p-4 rounded-2xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm font-light text-center">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full min-h-[44px] px-6 py-4 bg-luxury-gold text-luxury-black text-xs uppercase tracking-[0.2em] hover:bg-luxury-stone transition-all duration-300 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-luxury-gold mt-6 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
      >
        {status === 'loading' ? 'Sending...' : 'Send Enquiry'}
      </button>
    </form>
  );
}
