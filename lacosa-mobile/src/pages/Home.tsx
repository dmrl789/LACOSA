import { useEffect, useState } from "react";
import { AlertCard, type Alert } from "../components/AlertCard";
import { getJSON } from "../lib/api";

export default function Home() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadAlerts() {
      setLoading(true);
      setError(null);
      try {
        const data = await getJSON<Alert[]>("/api/utilities/alerts", { signal: controller.signal });
        if (!cancelled) {
          setAlerts(
            [...data].sort(
              (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
            ),
          );
        }
      } catch (err) {
        if (cancelled) return;
        if ((err as Error).name === "AbortError") return;
        setError("Unable to load alerts right now. Please try again shortly.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAlerts();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return (
    <main className="pb-20">
      <header className="bg-blue-600 px-4 py-3 text-white">
        <h1 className="text-lg font-semibold">LACOSA</h1>
        <p className="text-xs opacity-80">Local Companion for Expats &amp; Nomads</p>
      </header>
      <section className="grid gap-3 p-4">
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-20 animate-pulse rounded-xl bg-slate-200/70" />
            ))}
          </div>
        )}
        {error && !loading && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}
        {!loading && !error && alerts.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            You are all caught up. We will surface new city alerts here as soon as they are published.
          </p>
        )}
        {!loading && !error &&
          alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
      </section>
    </main>
  );
}
