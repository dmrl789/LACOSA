import { Bell, ChevronDown, Search } from "lucide-react";

export default function HomeHeader() {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-primary-600 via-primary-500 to-primary-500 px-5 pt-6 pb-4 text-white shadow-md">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">City</p>
          <button className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur">
            Palermo
            <ChevronDown size={16} />
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            aria-label="Alerts"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20"
          >
            <Bell size={18} />
          </button>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium tracking-tight text-white/90">
        Live alerts, housing, schools & essentials
      </p>
      <div className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
          <input
            type="search"
            placeholder="Search Palermo insight"
            className="w-full rounded-full border border-white/20 bg-white/15 px-9 py-2 text-sm placeholder:text-white/60 focus:border-white focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
}
