'use client';
import { useState } from 'react';
import CloudinaryUploader from './CloudinaryUploader';
import { saveAmenity, deleteAmenity } from '@/lib/actions';
import type { Amenity } from '@/lib/types';

interface AmenitiesManagerProps {
  initialAmenities: Amenity[];
}

interface EditForm {
  label: string;
  description: string;
  imageUrl: string;
}

const emptyForm: EditForm = { label: '', description: '', imageUrl: '' };

export default function AmenitiesManager({ initialAmenities }: AmenitiesManagerProps) {
  const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyForm);
  const [newForm, setNewForm] = useState<EditForm>(emptyForm);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const startEdit = (amenity: Amenity) => {
    setEditingId(amenity.id);
    setEditForm({ label: amenity.label, description: amenity.description, imageUrl: amenity.imageUrl });
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleSaveEdit = async (amenity: Amenity) => {
    setSaving(true);
    setMessage(null);
    try {
      await saveAmenity({ id: amenity.id, label: editForm.label, description: editForm.description, imageUrl: editForm.imageUrl, order: amenity.order });
      setAmenities(amenities.map((a) => a.id === amenity.id ? { ...amenity, ...editForm } : a));
      setEditingId(null);
      setMessage({ type: 'success', text: 'Amenity saved successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    setMessage(null);
    try {
      await deleteAmenity(id);
      setAmenities(amenities.filter((a) => a.id !== id));
      setMessage({ type: 'success', text: 'Amenity deleted.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Delete failed.' });
    } finally {
      setDeleting(null);
    }
  };

  const handleAddNew = async () => {
    if (!newForm.label.trim() || !newForm.imageUrl) {
      setMessage({ type: 'error', text: 'Label and image are required.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await saveAmenity({ label: newForm.label, description: newForm.description, imageUrl: newForm.imageUrl, order: amenities.length });
      setMessage({ type: 'success', text: 'Amenity added. Refresh to see updated list.' });
      setNewForm(emptyForm);
      setShowAddForm(false);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Add failed.' });
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

      <ul className="space-y-3">
        {amenities.map((amenity) => (
          <li key={amenity.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            {editingId === amenity.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Label</label>
                  <input
                    type="text"
                    value={editForm.label}
                    onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Image</label>
                  {editForm.imageUrl && <img src={editForm.imageUrl} alt="" className="w-24 h-16 object-cover rounded mb-2" />}
                  <CloudinaryUploader onUpload={(url) => setEditForm({ ...editForm, imageUrl: url })} label="Replace Image" />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(amenity)}
                    disabled={saving}
                    className="min-h-[44px] px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy-light disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="min-h-[44px] px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <img src={amenity.imageUrl} alt={amenity.label} className="w-16 h-12 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy text-sm">{amenity.label}</p>
                  <p className="text-xs text-slate-500 truncate">{amenity.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(amenity)}
                    className="min-h-[44px] px-3 py-1 text-sm border border-navy text-navy rounded-lg hover:bg-navy hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(amenity.id)}
                    disabled={deleting === amenity.id}
                    className="min-h-[44px] px-3 py-1 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
                  >
                    {deleting === amenity.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {showAddForm ? (
        <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 space-y-3">
          <h3 className="text-sm font-semibold text-navy">New Amenity</h3>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Label *</label>
            <input
              type="text"
              value={newForm.label}
              onChange={(e) => setNewForm({ ...newForm, label: e.target.value })}
              placeholder="e.g. Swimming Pool"
              className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
            <textarea
              value={newForm.description}
              onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
              rows={2}
              placeholder="Brief description..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Image *</label>
            {newForm.imageUrl && <img src={newForm.imageUrl} alt="" className="w-24 h-16 object-cover rounded mb-2" />}
            <CloudinaryUploader onUpload={(url) => setNewForm({ ...newForm, imageUrl: url })} label="Upload Image" />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddNew}
              disabled={saving}
              className="min-h-[44px] px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy-light disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
            >
              {saving ? 'Adding...' : 'Add Amenity'}
            </button>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setNewForm(emptyForm); }}
              className="min-h-[44px] px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="min-h-[44px] px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-navy hover:text-navy transition-colors text-sm w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
        >
          + Add Amenity
        </button>
      )}
    </div>
  );
}
