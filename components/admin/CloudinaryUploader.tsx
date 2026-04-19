'use client';
import { useRef, useState, type ChangeEvent } from 'react';

interface CloudinaryUploaderProps {
  onUpload: (url: string) => void;
  label?: string;
}

export default function CloudinaryUploader({ onUpload, label = 'Upload Image' }: CloudinaryUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data?.success || !data?.url) {
        throw new Error(data?.error || 'Upload failed. Please try again.');
      }

      onUpload(data.url as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="min-h-[44px] px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-navy hover:text-navy transition-colors text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy w-full"
      >
        {uploading ? 'Uploading...' : label}
      </button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
