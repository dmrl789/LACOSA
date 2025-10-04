import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPinned, Navigation2, SlidersHorizontal, Target } from "lucide-react";
import { api } from "../lib/api";

const layers = ["Safety", "Housing", "Schools", "Essentials"] as const;
type Layer = (typeof layers)[number];

export default function MapPage() {
  const [activeLayer, setActiveLayer] = useState<Layer>("Safety");
  const { data: safetyZones } = useQuery({ queryKey: ["safety"], queryFn: api.safetyZones });
  const { data: housing } = useQuery({ queryKey: ["housing"], queryFn: api.housing });
  const { data: schools } = useQuery({ queryKey: ["schools"], queryFn: api.schools });
  const { data: essentials } = useQuery({ queryKey: ["essentials"], queryFn: api.essentials });

  const list = useMemo(() => {
    switch (activeLayer) {
      case "Safety":
        return safetyZones?.map((zone) => ({
          id: zone.id,
          title: zone.neighborhood,
          subtitle: zone.trend,
          badge: zone.risk_level,
        }));
      case "Housing":
        return housing?.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: `${item.neighborhood} · €${item.price_eur_month.toLocaleString()}/mo`,
          badge: `${Math.round(item.distance_to_transit_m)}m`,
        }));
      case "Schools":
        return schools?.map((school) => ({
          id: school.id,
          title: school.name,
          subtitle: `${school.pedagogy} · ${school.level}`,
          badge: school.languages.join(" / "),
        }));
      case "Essentials":
        return essentials?.map((place) => ({
          id: place.id,
          title: place.name,
          subtitle: `${place.category} · ${(place.distance_m / 1000).toFixed(1)}km`,
          badge: place.status,
        }));
      default:
        return [];
    }
  }, [activeLayer, essentials, housing, safetyZones, schools]);

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-slate-900 text-white">
      <div className="absolute inset-0">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_#1d4ed8_0%,_#0f172a_70%)] opacity-80" />
        <div className="absolute inset-6 rounded-3xl border-2 border-white/10" />
        <div className="absolute inset-0 bg-[url('https://tile.openstreetmap.org/11/1061/714.png')] bg-cover mix-blend-overlay opacity-40" />
      </div>

      <div className="relative flex flex-col gap-3 px-5 pt-14">
        <header className="flex items-center justify-between text-sm font-semibold">
          <button className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-2">
            Palermo Centro
            <MapPinned size={16} />
          </button>
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-white/15 p-2" aria-label="Filters">
              <SlidersHorizontal size={18} />
            </button>
            <button className="rounded-full bg-white/15 p-2" aria-label="Locate me">
              <Target size={18} />
            </button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {layers.map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                activeLayer === layer ? "bg-white text-slate-900" : "bg-white/15 text-white"
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center">
        <div className="pointer-events-auto h-1.5 w-16 rounded-full bg-white/60" />
      </div>

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-md rounded-t-3xl bg-white p-5 text-slate-900 shadow-sheet">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">{activeLayer} near you</h2>
          <button className="text-xs font-medium text-primary-600">Filters</button>
        </div>
        <ul className="mt-4 space-y-3">
          {list?.slice(0, 6).map((item) => (
            <li key={item.id} className="rounded-2xl border border-slate-100 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.subtitle}</p>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-[11px] font-semibold text-primary-600">
                    {item.badge}
                  </span>
                )}
              </div>
            </li>
          )) || <EmptyState layer={activeLayer} />}
        </ul>
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
          <Navigation2 size={16} />
          Launch directions
        </button>
      </div>
    </div>
  );
}

function EmptyState({ layer }: { layer: Layer }) {
  return <div className="text-sm text-slate-500">Loading {layer.toLowerCase()} data…</div>;
}
