'use client';
import { useState } from 'react';
import { saveLocationConfig } from '@/lib/actions';
import type { LocationConfig } from '@/lib/types';

interface LocationEditorProps {
  initialLocation: LocationConfig | null;
}

export default function LocationEditor({ initialLocation }: LocationEditorProps) {
  const [embedUrl, setEmbedUrl] = useState(initialLocation?.embedUrl ?? '');
  const [address, setAddress] = useState(initialLocation?.address ?? '');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!embedUrl.trim() || !address.trim()) {
      setMessage({ type: 'error', text: 'Both embed URL and address are required.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await saveLocationConfig(embedUrl.trim(), address.trim());
      setMessage({ type: 'success', text: 'Location saved successfully.' });
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
        <label htmlFor="embed-url" className="block text-sm font-medium text-navy mb-1">
          Google Maps Embed URL
        </label>
        <input
          id="embed-url"
          type="url"
          value={embedUrl}
          onChange={(e) => setEmbedUrl(e.target.value)}
          placeholder="https://www.google.com/maps/embed?pb=..."
          className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        />
        <p className="text-xs text-slate-500 mt-1">Paste a Google Maps link or embed iframe src. It will be converted automatically.</p>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-navy mb-1">
          Address (fallback text)
        </label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          placeholder="e.g. LODHA MIRABELLE, Thane West, Maharashtra 400601"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="min-h-[44px] px-6 py-2 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
      >
        {saving ? 'Saving...' : 'Save Location'}
      </button>
    </div>
  );
}
