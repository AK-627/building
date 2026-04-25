'use client';

import { useState } from 'react';
import { saveAboutConfig } from '@/lib/actions';
import type { AboutConfig } from '@/lib/types';

interface AboutEditorProps {
  initialAbout: AboutConfig | null;
}

export default function AboutEditor({ initialAbout }: AboutEditorProps) {
  const [content, setContent] = useState(
    initialAbout?.content || 'Lodha Sadahalli – A New Benchmark of Luxury Living in Bangalore.\n\nIntroducing Lodha Sadahalli, a landmark residential development...'
  );
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    if (!content.trim()) return;
    setStatus('saving');

    try {
      await saveAboutConfig(content.trim());
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-navy">About Section Configuration</h2>
          <p className="text-sm text-slate-500">Edit the paragraph that appears below the hero carousel.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className="px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy-light transition-colors disabled:opacity-50"
        >
          {status === 'saving' ? 'Saving...' : status === 'success' ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Project Description
          <span className="block text-xs font-normal text-slate-500 mt-1">
            Tip: Wrap text in double asterisks (**) to make it bold. e.g. **80-acre**
          </span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy bg-white text-slate-900 placeholder:text-slate-400"
          placeholder="Enter the about section text here..."
        />
      </div>
      
      {status === 'error' && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">Failed to save changes. Please try again.</p>
      )}
    </div>
  );
}
