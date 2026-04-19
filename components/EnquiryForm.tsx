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
            ? 'Server returned no response. Check deployment logs and email (RESEND_API_KEY, ADMIN_EMAIL) on the host.'
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

  const inputClass = 'w-full min-h-[44px] px-4 py-2 border border-slate-300 rounded-lg text-navy placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy bg-white';
  const errorClass = 'text-red-600 text-xs mt-1';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-navy mb-1">Full Name *</label>
        <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your full name" className={inputClass} aria-describedby={errors.name ? 'name-error' : undefined} />
        {errors.name && <p id="name-error" className={errorClass}>{errors.name[0]}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-navy mb-1">Email Address *</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} aria-describedby={errors.email ? 'email-error' : undefined} />
        {errors.email && <p id="email-error" className={errorClass}>{errors.email[0]}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-navy mb-1">Phone Number *</label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={inputClass} aria-describedby={errors.phone ? 'phone-error' : undefined} />
        {errors.phone && <p id="phone-error" className={errorClass}>{errors.phone[0]}</p>}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-navy mb-1">Message *</label>
        <textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="I am interested in LODHA MIRABELLE..." rows={4} className={`${inputClass} resize-none`} aria-describedby={errors.message ? 'message-error' : undefined} />
        {errors.message && <p id="message-error" className={errorClass}>{errors.message[0]}</p>}
      </div>

      {status === 'success' && (
        <div role="alert" className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          Thank you! Your enquiry has been sent. Our team will contact you shortly.
        </div>
      )}
      {status === 'error' && (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full min-h-[44px] px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
      >
        {status === 'loading' ? 'Sending...' : 'Send Enquiry'}
      </button>
    </form>
  );
}
