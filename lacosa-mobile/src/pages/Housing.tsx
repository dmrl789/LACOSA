import { useEffect, useMemo, useState } from "react";
import { getJSON, urlWithParams } from "../lib/api";

type Rental = {
  id: string;
  title: string;
  price_eur: number;
  bedrooms: number;
  furnished: boolean;
  kid_friendly: boolean;
  pet_friendly: boolean;
  neighborhood: string;
  verified: boolean;
  contact: string;
  url?: string | null;
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Housing() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [kidFriendly, setKidFriendly] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadRentals() {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, boolean | number | undefined> = {
          page_size: 12,
          kid_friendly: kidFriendly || undefined,
          pet_friendly: petFriendly || undefined,
        };
        const data = await getJSON<Rental[]>(
          urlWithParams("/api/housing/rentals", params),
          { signal: controller.signal },
        );
        if (!cancelled) {
          setRentals(data);
        }
      } catch (err) {
        if (cancelled) return;
        if ((err as Error).name === "AbortError") return;
        setError("Unable to load rentals. Check your connection and try again.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRentals();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [kidFriendly, petFriendly]);

  const filteredRentals = useMemo(() => {
    if (!verifiedOnly) return rentals;
    return rentals.filter((rental) => rental.verified);
  }, [rentals, verifiedOnly]);

  return (
    <main className="pb-20">
      <header className="bg-blue-600 px-4 py-3 text-white">
        <h1 className="text-lg font-semibold">Housing</h1>
        <p className="text-xs opacity-80">Trusted rentals with curated verifications</p>
      </header>

      <section className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              kidFriendly
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600"
            }`}
            onClick={() => setKidFriendly((prev) => !prev)}
          >
            Kid friendly
          </button>
          <button
            type="button"
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              petFriendly
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600"
            }`}
            onClick={() => setPetFriendly((prev) => !prev)}
          >
            Pet friendly
          </button>
          <button
            type="button"
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              verifiedOnly
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-600"
            }`}
            onClick={() => setVerifiedOnly((prev) => !prev)}
          >
            Verified hosts
          </button>
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

        {!loading && !error && filteredRentals.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            No rentals match your filters yet. Try loosening a filter or check back later as we add fresh listings.
          </p>
        )}

        <div className="grid gap-3">
          {!loading &&
            !error &&
            filteredRentals.map((rental) => (
              <article key={rental.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-slate-900">{rental.title}</h2>
                  <span className="text-sm font-semibold text-blue-700">{formatPrice(rental.price_eur)}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {rental.bedrooms} bedroom{rental.bedrooms === 1 ? "" : "s"} · {rental.neighborhood}
                </p>
                <div className="mt-2 flex flex-wrap gap-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  {rental.furnished && <span className="rounded-full bg-slate-100 px-2 py-0.5">Furnished</span>}
                  {rental.kid_friendly && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">Kid friendly</span>}
                  {rental.pet_friendly && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">Pet friendly</span>
                  )}
                  {rental.verified && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">Verified host</span>
                  )}
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Contact: <span className="font-medium text-slate-700">{rental.contact}</span>
                </p>
                {rental.url && (
                  <a
                    href={rental.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-xs font-semibold text-blue-600 underline"
                  >
                    View details
                  </a>
                )}
              </article>
            ))}
        </div>
      </section>
    </main>
  );
}
