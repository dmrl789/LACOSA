import "leaflet/dist/leaflet.css";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { getJSON } from "../lib/api";

const PALERMO: [number, number] = [38.1157, 13.3613];

type Housing = { id: number; name: string; lat: number; lng: number };
type School = Housing;
type Safety = { id: number; lat: number; lng: number; risk: "low" | "medium" | "high" };

const riskColors: Record<Safety["risk"], string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
};

export default function Map() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const safetyLayerRef = useRef<L.LayerGroup | null>(null);
  const housingLayerRef = useRef<L.LayerGroup | null>(null);
  const schoolsLayerRef = useRef<L.LayerGroup | null>(null);

  const [showSafety, setShowSafety] = useState(true);
  const [showHousing, setShowHousing] = useState(true);
  const [showSchools, setShowSchools] = useState(true);
  const [housing, setHousing] = useState<Housing[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [safety, setSafety] = useState<Safety[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const markerIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    [],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }
    const map = L.map(containerRef.current, {
      center: PALERMO,
      zoom: 13,
      scrollWheelZoom: false,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    mapRef.current = map;

    return () => {
      safetyLayerRef.current?.remove();
      housingLayerRef.current?.remove();
      schoolsLayerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [housingData, schoolData, safetyData] = await Promise.all([
          getJSON<Housing[]>("/api/housing", { signal: controller.signal }),
          getJSON<School[]>("/api/schools", { signal: controller.signal }),
          getJSON<Safety[]>("/api/safety", { signal: controller.signal }),
        ]);
        if (!cancelled) {
          setHousing(housingData);
          setSchools(schoolData);
          setSafety(safetyData);
        }
      } catch (err) {
        if (cancelled) return;
        if ((err as Error).name === "AbortError") return;
        setError("We couldn't load the Palermo layers. Is the API running?");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (safetyLayerRef.current) {
      safetyLayerRef.current.remove();
      safetyLayerRef.current = null;
    }
    if (showSafety && safety.length) {
      const layer = L.layerGroup();
      safety.forEach((item) => {
        const color = riskColors[item.risk];
        L.circle([item.lat, item.lng], {
          radius: 400,
          color,
          fillColor: color,
          fillOpacity: 0.15,
        })
          .bindPopup(`Safety index: ${item.risk}`)
          .addTo(layer);
      });
      layer.addTo(map);
      safetyLayerRef.current = layer;
    }

    if (housingLayerRef.current) {
      housingLayerRef.current.remove();
      housingLayerRef.current = null;
    }
    if (showHousing && housing.length) {
      const layer = L.layerGroup();
      housing.forEach((home) => {
        L.marker([home.lat, home.lng], { icon: markerIcon })
          .bindPopup(home.name)
          .addTo(layer);
      });
      layer.addTo(map);
      housingLayerRef.current = layer;
    }

    if (schoolsLayerRef.current) {
      schoolsLayerRef.current.remove();
      schoolsLayerRef.current = null;
    }
    if (showSchools && schools.length) {
      const layer = L.layerGroup();
      schools.forEach((school) => {
        L.marker([school.lat, school.lng], { icon: markerIcon })
          .bindPopup(school.name)
          .addTo(layer);
      });
      layer.addTo(map);
      schoolsLayerRef.current = layer;
    }
  }, [showSafety, safety, showHousing, housing, showSchools, schools, markerIcon]);

  return (
    <main className="pb-20">
      <header className="border-b bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-auto">
            <h1 className="text-base font-semibold">City Intelligence Map</h1>
            <p className="text-xs text-slate-500">Safety heatmap, rentals and schools layered in one view</p>
          </div>
          <button
            type="button"
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              showSafety
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600"
            }`}
            onClick={() => setShowSafety((value) => !value)}
          >
            Safety
          </button>
          <button
            type="button"
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              showHousing
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600"
            }`}
            onClick={() => setShowHousing((value) => !value)}
          >
            Housing
          </button>
          <button
            type="button"
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              showSchools
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600"
            }`}
            onClick={() => setShowSchools((value) => !value)}
          >
            Schools
          </button>
        </div>
      </header>

      <section className="space-y-4 p-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <div ref={containerRef} className="h-[60vh] w-full" />
        </div>

        {loading && <p className="text-xs text-slate-500">Loading live layers…</p>}
        {error && !loading && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700">{error}</div>
        )}
      </section>
    </main>
  );
}
