export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-bold">LODHA MIRABELLE</h1>
          <p className="text-white/60 text-xs">Admin Panel</p>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="min-h-[44px] px-4 py-2 border border-white/30 rounded-lg text-sm hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Sign Out
          </button>
        </form>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
