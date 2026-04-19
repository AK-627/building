'use client';
import { useState } from 'react';
import { saveContactConfig } from '@/lib/actions';
import type { ContactConfig } from '@/lib/types';

interface ContactEditorProps {
  initialContact: ContactConfig | null;
}

export default function ContactEditor({ initialContact }: ContactEditorProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialContact?.phoneNumber ?? '');
  const [whatsappMessage, setWhatsappMessage] = useState(
    initialContact?.whatsappMessage ?? 'Hi, I am interested in LODHA MIRABELLE.'
  );
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!phoneNumber.trim()) {
      setMessage({ type: 'error', text: 'Phone number is required.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await saveContactConfig(phoneNumber.trim(), whatsappMessage.trim());
      setMessage({ type: 'success', text: 'Contact settings saved successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          role={message.type === 'error' ? 'alert' : 'status'}
          className={`p-3 rounded-lg text-sm border ${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label htmlFor="phone-number" className="block text-sm font-medium text-navy mb-1">
          Phone Number
        </label>
        <input
          id="phone-number"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+919876543210"
          className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        />
        <p className="text-xs text-slate-500 mt-1">Use E.164 format, e.g. +919876543210</p>
      </div>

      <div>
        <label htmlFor="whatsapp-message" className="block text-sm font-medium text-navy mb-1">
          WhatsApp Pre-fill Message
        </label>
        <textarea
          id="whatsapp-message"
          value={whatsappMessage}
          onChange={(e) => setWhatsappMessage(e.target.value)}
          rows={3}
          placeholder="Hi, I am interested in LODHA MIRABELLE."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        />
        <p className="text-xs text-slate-500 mt-1">This message will be pre-filled when users click the WhatsApp button.</p>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="min-h-[44px] px-6 py-2 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
      >
        {saving ? 'Saving...' : 'Save Contact Settings'}
      </button>
    </div>
  );
}
