'use client';
import { useState } from 'react';
import CloudinaryUploader from './CloudinaryUploader';
import { saveUnitType, deleteUnitType } from '@/lib/actions';
import type { UnitType } from '@/lib/types';

interface UnitTypesManagerProps {
  initialUnitTypes: UnitType[];
}

interface EditForm {
  name: string;
  bedrooms: string;
  bathrooms: string;
  carpetArea: string;
  builtUpArea: string;
  balcony: string;
  blueprintUrls: string[];
}

const emptyForm: EditForm = {
  name: '',
  bedrooms: '',
  bathrooms: '',
  carpetArea: '',
  builtUpArea: '',
  balcony: '',
  blueprintUrls: [],
};

function unitToForm(unit: UnitType): EditForm {
  return {
    name: unit.name,
    bedrooms: String(unit.bedrooms),
    bathrooms: String(unit.bathrooms),
    carpetArea: unit.carpetArea,
    builtUpArea: unit.builtUpArea ?? '',
    balcony: unit.balcony ?? '',
    blueprintUrls: unit.blueprintUrls,
  };
}

export default function UnitTypesManager({ initialUnitTypes }: UnitTypesManagerProps) {
  const [units, setUnits] = useState<UnitType[]>(initialUnitTypes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyForm);
  const [newForm, setNewForm] = useState<EditForm>(emptyForm);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const startEdit = (unit: UnitType) => {
    setEditingId(unit.id);
    setEditForm(unitToForm(unit));
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleSaveEdit = async (unit: UnitType) => {
    if (!editForm.name.trim() || !editForm.carpetArea.trim() || editForm.blueprintUrls.length === 0) {
      setMessage({ type: 'error', text: 'Name, carpet area, and at least one blueprint image are required.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await saveUnitType({
        id: unit.id,
        name: editForm.name,
        bedrooms: parseInt(editForm.bedrooms) || 0,
        bathrooms: parseInt(editForm.bathrooms) || 0,
        carpetArea: editForm.carpetArea,
        builtUpArea: editForm.builtUpArea || undefined,
        balcony: editForm.balcony || undefined,
        blueprintUrls: editForm.blueprintUrls,
        order: unit.order,
      });
      setUnits(units.map((u) => u.id === unit.id ? {
        ...unit,
        name: editForm.name,
        bedrooms: parseInt(editForm.bedrooms) || 0,
        bathrooms: parseInt(editForm.bathrooms) || 0,
        carpetArea: editForm.carpetArea,
        builtUpArea: editForm.builtUpArea || undefined,
        balcony: editForm.balcony || undefined,
        blueprintUrls: editForm.blueprintUrls,
      } : u));
      setEditingId(null);
      setMessage({ type: 'success', text: 'Unit type saved successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  const addBlueprintUrl = (form: EditForm, setForm: (f: EditForm) => void, url: string) => {
    setForm({ ...form, blueprintUrls: [...form.blueprintUrls, url] });
  };

  const removeBlueprintUrl = (form: EditForm, setForm: (f: EditForm) => void, index: number) => {
    setForm({ ...form, blueprintUrls: form.blueprintUrls.filter((_, i) => i !== index) });
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    setMessage(null);
    try {
      await deleteUnitType(id);
      setUnits(units.filter((u) => u.id !== id));
      setMessage({ type: 'success', text: 'Unit type deleted.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Delete failed.' });
    } finally {
      setDeleting(null);
    }
  };

  const handleAddNew = async () => {
    if (!newForm.name.trim() || !newForm.carpetArea.trim() || newForm.blueprintUrls.length === 0) {
      setMessage({ type: 'error', text: 'Name, carpet area, and at least one blueprint image are required.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await saveUnitType({
        name: newForm.name,
        bedrooms: parseInt(newForm.bedrooms) || 0,
        bathrooms: parseInt(newForm.bathrooms) || 0,
        carpetArea: newForm.carpetArea,
        builtUpArea: newForm.builtUpArea || undefined,
        balcony: newForm.balcony || undefined,
        blueprintUrls: newForm.blueprintUrls,
        order: units.length,
      });
      setMessage({ type: 'success', text: 'Unit type added. Refresh to see updated list.' });
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Name *</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. 2 BHK Premium" className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Bedrooms</label>
          <input type="number" min="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Bathrooms</label>
          <input type="number" min="0" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Carpet Area *</label>
          <input type="text" value={form.carpetArea} onChange={(e) => setForm({ ...form, carpetArea: e.target.value })} placeholder="e.g. 850 sq ft" className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Built-up Area (optional)</label>
          <input type="text" value={form.builtUpArea} onChange={(e) => setForm({ ...form, builtUpArea: e.target.value })} placeholder="e.g. 1050 sq ft" className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Balcony (optional)</label>
          <input type="text" value={form.balcony} onChange={(e) => setForm({ ...form, balcony: e.target.value })} placeholder="e.g. 1 Balcony" className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Blueprint Images *</label>
          <div className="space-y-2">
            {form.blueprintUrls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <img src={url} alt={`Blueprint ${index + 1}`} className="w-16 h-12 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeBlueprintUrl(form, setForm, index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <CloudinaryUploader onUpload={(url) => addBlueprintUrl(form, setForm, url)} label="Add Blueprint" />
          </div>
        </div>
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
        {units.map((unit) => (
          <li key={unit.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            {editingId === unit.id ? (
              renderForm(editForm, setEditForm, () => handleSaveEdit(unit), cancelEdit, 'Save Changes')
            ) : (
              <div className="flex items-center gap-3">
                <img src={unit.blueprintUrls[0]} alt={unit.name} className="w-16 h-12 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy text-sm">{unit.name}</p>
                  <p className="text-xs text-slate-500">{unit.bedrooms} bed · {unit.bathrooms} bath · {unit.carpetArea}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => startEdit(unit)} className="min-h-[44px] px-3 py-1 text-sm border border-navy text-navy rounded-lg hover:bg-navy hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(unit.id)} disabled={deleting === unit.id} className="min-h-[44px] px-3 py-1 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600">
                    {deleting === unit.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {showAddForm ? (
        <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 space-y-3">
          <h3 className="text-sm font-semibold text-navy">New Unit Type</h3>
          {renderForm(newForm, setNewForm, handleAddNew, () => { setShowAddForm(false); setNewForm(emptyForm); }, 'Add Unit Type')}
        </div>
      ) : (
        <button type="button" onClick={() => setShowAddForm(true)} className="min-h-[44px] px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-navy hover:text-navy transition-colors text-sm w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy">
          + Add Unit Type
        </button>
      )}
    </div>
  );
}
