'use client';
import { useEffect, useState } from 'react';

export default function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setExpired(params.get('expired') === '1');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (data.success) { window.location.href = '/admin'; }
      else setError(data.error || 'Incorrect password');
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold text-navy">LODHA MIRABELLE</h1>
          <p className="text-slate-500 text-sm mt-1">Admin Panel</p>
        </div>
        {expired && <div role="alert" className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-sm">Session expired. Please log in again.</div>}
        {error && <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-navy mb-1">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full min-h-[44px] px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-navy" required autoFocus />
          </div>
          <button type="submit" disabled={loading} className="w-full min-h-[44px] bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
