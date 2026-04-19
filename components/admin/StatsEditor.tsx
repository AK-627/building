'use client';
import { useState } from 'react';
import { saveKeyStat, addKeyStat, deleteKeyStat } from '@/lib/actions';
import type { KeyStat } from '@/lib/types';

interface StatsEditorProps {
  initialStats: KeyStat[];
}

interface EditableStat {
  id: string;
  label: string;
  value: string;
  order: number;
}

export default function StatsEditor({ initialStats }: StatsEditorProps) {
  const [stats, setStats] = useState<EditableStat[]>(initialStats);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const [messages, setMessages] = useState<Record<string, { type: 'success' | 'error'; text: string }>>({});
  const [addMessage, setAddMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);

  const handleChange = (id: string, field: 'label' | 'value', val: string) => {
    setStats(stats.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  };

  const handleSave = async (stat: EditableStat) => {
    setSaving((prev) => ({ ...prev, [stat.id]: true }));
    setMessages((prev) => ({ ...prev, [stat.id]: { type: 'success', text: '' } }));
    try {
      await saveKeyStat(stat.id, stat.label, stat.value);
      setMessages((prev) => ({ ...prev, [stat.id]: { type: 'success', text: 'Saved.' } }));
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [stat.id]: { type: 'error', text: err instanceof Error ? err.message : 'Save failed.' },
      }));
    } finally {
      setSaving((prev) => ({ ...prev, [stat.id]: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting((prev) => ({ ...prev, [id]: true }));
    try {
      await deleteKeyStat(id);
      setStats(stats.filter((s) => s.id !== id));
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [id]: { type: 'error', text: err instanceof Error ? err.message : 'Delete failed.' },
      }));
    } finally {
      setDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleAdd = async () => {
    if (!newLabel.trim() || !newValue.trim()) {
      setAddMessage({ type: 'error', text: 'Both label and value are required.' });
      return;
    }
    setAdding(true);
    setAddMessage(null);
    try {
      await addKeyStat(newLabel.trim(), newValue.trim(), stats.length);
      setAddMessage({ type: 'success', text: 'Stat added. Refresh to see updated list.' });
      setNewLabel('');
      setNewValue('');
    } catch (err) {
      setAddMessage({ type: 'error', text: err instanceof Error ? err.message : 'Add failed.' });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {stats.map((stat) => (
          <li key={stat.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-slate-600 mb-1">Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleChange(stat.id, 'label', e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-slate-600 mb-1">Value</label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleChange(stat.id, 'value', e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => handleSave(stat)}
                  disabled={saving[stat.id]}
                  className="min-h-[44px] px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy-light transition-colors disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
                >
                  {saving[stat.id] ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(stat.id)}
                  disabled={deleting[stat.id]}
                  className="min-h-[44px] px-4 py-2 text-red-600 border border-red-200 text-sm rounded-lg hover:bg-red-50 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
                >
                  {deleting[stat.id] ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            {messages[stat.id]?.text && (
              <p
                role={messages[stat.id].type === 'error' ? 'alert' : 'status'}
                className={`text-xs ${messages[stat.id].type === 'error' ? 'text-red-600' : 'text-green-600'}`}
              >
                {messages[stat.id].text}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 space-y-3">
        <h3 className="text-sm font-semibold text-navy">Add New Stat</h3>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label (e.g. Year of Completion)"
            className="flex-1 min-w-[160px] min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          />
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value (e.g. 2026)"
            className="flex-1 min-w-[120px] min-h-[44px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding}
            className="min-h-[44px] px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy-light transition-colors disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
          >
            {adding ? 'Adding...' : '+ Add Stat'}
          </button>
        </div>
        {addMessage && (
          <p
            role={addMessage.type === 'error' ? 'alert' : 'status'}
            className={`text-xs ${addMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}
          >
            {addMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}
