'use client';
import { useState } from 'react';
import CloudinaryUploader from './CloudinaryUploader';
import { saveProjectPhotos } from '@/lib/actions';
import type { ProjectPhoto } from '@/lib/types';

interface PhotosManagerProps {
  initialPhotos: ProjectPhoto[];
}

export default function PhotosManager({ initialPhotos }: PhotosManagerProps) {
  const [photos, setPhotos] = useState<Omit<ProjectPhoto, 'id'>[]>(
    initialPhotos.map(({ url, alt, order }) => ({ url, alt, order }))
  );
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...photos];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setPhotos(next);
  };

  const moveDown = (index: number) => {
    if (index === photos.length - 1) return;
    const next = [...photos];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setPhotos(next);
  };

  const remove = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleUpload = (url: string) => {
    setPhotos([...photos, { url, alt: '', order: photos.length }]);
  };

  const handleAltChange = (index: number, alt: string) => {
    const next = [...photos];
    next[index] = { ...next[index], alt };
    setPhotos(next);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await saveProjectPhotos(photos.map((p, i) => ({ ...p, order: i })));
      setSuccess('Project photos saved successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {success && (
        <div role="status" className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          {success}
        </div>
      )}
      {error && (
        <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {photos.length === 0 && (
        <p className="text-slate-500 text-sm">No project photos yet. Upload one below.</p>
      )}

      <ul className="space-y-3">
        {photos.map((photo, index) => (
          <li key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <img src={photo.url} alt={photo.alt || 'Project photo'} className="w-20 h-14 object-cover rounded" />
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={photo.alt}
                onChange={(e) => handleAltChange(index, e.target.value)}
                placeholder="Alt text (optional)"
                className="w-full text-sm px-2 py-1 border border-slate-300 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
              />
              <p className="text-xs text-slate-400 mt-1 truncate">{photo.url}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="min-h-[44px] px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveDown(index)}
                disabled={index === photos.length - 1}
                className="min-h-[44px] px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
                aria-label="Move down"
              >
                ↓
              </button>
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="min-h-[44px] px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
              aria-label="Delete photo"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <CloudinaryUploader onUpload={handleUpload} label="+ Add Project Photo" />

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="min-h-[44px] px-6 py-2 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
      >
        {saving ? 'Saving...' : 'Save Photos'}
      </button>
    </div>
  );
}
