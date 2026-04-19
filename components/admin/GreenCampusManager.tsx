'use client';
import { useState } from 'react';
import { saveGreenFeature, deleteGreenFeature } from '@/lib/actions';
import type { GreenFeature } from '@/lib/types';

interface GreenCampusManagerProps {
  initialFeatures: GreenFeature[];
}

interface EditForm {
  icon: string;
  title: string;
  description: string;
}

const emptyForm: EditForm = { icon: '', title: '', description: '' };

export default function GreenCampusManager({ initialFeatures }: GreenCampusManagerProps) {
  const [features, setFeatures] = useState<GreenFeature[]>(initialFeatures);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyForm);
  const [newForm, setNewForm] = useState<EditForm>(emptyForm);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const startEdit = (feature: GreenFeature) => {
    setEditingId(feature.id);
    setEditForm({ icon: feature.icon, title: feature.title, description: feature.description });
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleSaveEdit = async (feature: GreenFeature) => {
    if (!editForm.title.trim()) {
      setMessage({ type: 'error', text: 'Title is required.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await saveGreenFeature({ id: feature.id, icon: editForm.icon, title: editForm.title, description: editForm.description, order: feature.order });
      setFeatures(features.map((f) => f.id === feature.id ? { ...feature, ...editForm } : f));
      setEditingId(null);
      setMessage({ type: 'success', text: 'Feature saved successfully.' });
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
      await deleteGreenFeature(id);
      setFeatures(features.filter((f) => f.id !== id));
      setMessage({ type: 'success', text: 'Feature deleted.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Delete failed.' });
    } finally {
      setDeleting(null);
    }
  };

  const handleAddNew = async () => {
    if (!newForm.title.trim()) {
      setMessage({ type: 'error', text: 'Title is required.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await saveGreenFeature({ icon: newForm.icon, title: newForm.title, description: newForm.description, order: features.length });
      setMessage({ type: 'success', text: 'Feature added. Refresh to see updated list.' });
      setNewForm(emptyForm);
      setShowAddForm(false);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Add failed.' });
    } finally {
      setSaving(false);
    }
  };

  const renderForm = (form: EditForm, setForm: (f: EditForm) => void, onSave: () => void, onCancel: () => void, saveLabel: string) => (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Icon (emoji or text)</label>
        <input
          type="text"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          placeholder="e.g. 🌿 or leaf"
          className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Solar Energy"
          className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          placeholder="Brief description..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onSave} disabled={saving} className="min-h-[44px] px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy-light disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy">
          {saving ? 'Saving...' : saveLabel}
        </button>
        <button type="button" onClick={onCancel} className="min-h-[44px] px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy">
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {message && (
        <div role={message.type === 'error' ? 'alert' : 'status'} className={`p-3 rounded-lg text-sm border ${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
          {message.text}
        </div>
      )}

      <ul className="space-y-3">
        {features.map((feature) => (
          <li key={feature.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            {editingId === feature.id ? (
              renderForm(editForm, setEditForm, () => handleSaveEdit(feature), cancelEdit, 'Save Changes')
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-2xl w-10 text-center">{feature.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy text-sm">{feature.title}</p>
                  <p className="text-xs text-slate-500 truncate">{feature.description}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => startEdit(feature)} className="min-h-[44px] px-3 py-1 text-sm border border-navy text-navy rounded-lg hover:bg-navy hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(feature.id)} disabled={deleting === feature.id} className="min-h-[44px] px-3 py-1 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600">
                    {deleting === feature.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {showAddForm ? (
        <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 space-y-3">
          <h3 className="text-sm font-semibold text-navy">New Green Feature</h3>
          {renderForm(newForm, setNewForm, handleAddNew, () => { setShowAddForm(false); setNewForm(emptyForm); }, 'Add Feature')}
        </div>
      ) : (
        <button type="button" onClick={() => setShowAddForm(true)} className="min-h-[44px] px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-navy hover:text-navy transition-colors text-sm w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy">
          + Add Green Feature
        </button>
      )}
    </div>
  );
}
