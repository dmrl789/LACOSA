import { useEffect, useMemo, useState } from "react";
import { getJSON } from "../lib/api";

type Essential = {
  id: string;
  name: string;
  type: string;
  tags: string[];
  description: string;
  neighborhood: string;
};

const LABELS: Record<string, string> = {
  pharmacy: "Pharmacies",
  electronics: "Electronics",
  groceries: "Groceries",
};

export default function Essentials() {
  const [essentials, setEssentials] = useState<Essential[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadEssentials() {
      setLoading(true);
      setError(null);
      try {
        const data = await getJSON<Essential[]>("/api/shopping/essentials", { signal: controller.signal });
        if (!cancelled) {
          setEssentials(data);
        }
      } catch (err) {
        if (cancelled) return;
        if ((err as Error).name === "AbortError") return;
        setError("Unable to load essential services right now.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEssentials();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const filtered = useMemo(() => {
    if (!activeType) return essentials;
    return essentials.filter((item) => item.type === activeType);
  }, [essentials, activeType]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(essentials.map((item) => item.type)));
  }, [essentials]);

  return (
    <main className="pb-20">
      <header className="bg-blue-600 px-4 py-3 text-white">
        <h1 className="text-lg font-semibold">Essentials</h1>
        <p className="text-xs opacity-80">Health, markets and critical local services</p>
      </header>

      <section className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              activeType === null
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600"
            }`}
            onClick={() => setActiveType(null)}
          >
            All
          </button>
          {uniqueTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                activeType === type
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
              onClick={() => setActiveType(type)}
            >
              {LABELS[type] ?? type}
            </button>
          ))}
        </div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-24 animate-pulse rounded-xl bg-slate-200/70" />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            No essentials found for this category yet. We are onboarding more partners across the city.
          </p>
        )}

        <div className="grid gap-3">
          {!loading &&
            !error &&
            filtered.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-slate-900">{item.name}</h2>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {LABELS[item.type] ?? item.type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                <p className="mt-2 text-xs font-medium text-slate-600">Neighborhood: {item.neighborhood}</p>
                <div className="mt-2 flex flex-wrap gap-1 text-[11px] uppercase tracking-wide text-slate-500">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
        </div>
      </section>
    </main>
  );
}
