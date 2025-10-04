import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { getJSON } from "../lib/api";

const PALERMO: [number, number] = [38.1157, 13.3613];

type Housing = { id: number; name: string; lat: number; lng: number };
type School = Housing;
type Safety = { id: number; lat: number; lng: number; risk: "low" | "medium" | "high" };

export default function Map() {
  const [showSafety, setShowSafety] = useState(true);
  const [showHousing, setShowHousing] = useState(true);
  const [showSchools, setShowSchools] = useState(true);
  const [housing, setHousing] = useState<Housing[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [safety, setSafety] = useState<Safety[]>([]);

  const markerIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    []
  );

  useEffect(() => {
    getJSON<Housing[]>("/api/housing").then(setHousing).catch(console.error);
    getJSON<School[]>("/api/schools").then(setSchools).catch(console.error);
    getJSON<Safety[]>("/api/safety").then(setSafety).catch(console.error);
  }, []);

  const riskColor = (r: Safety["risk"]) =>
    r === "high" ? "#ef4444" : r === "medium" ? "#f59e0b" : "#10b981";

  return (
    <main className="pb-2">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="px-4 py-3 flex flex-wrap items-center gap-2">
          <h1 className="text-base font-semibold mr-auto">Map</h1>
          <button
            className={`px-3 py-1.5 text-xs rounded-full border ${
              showSafety ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white"
            }`}
            onClick={() => setShowSafety((v) => !v)}
          >
            Safety
          </button>
          <button
            className={`px-3 py-1.5 text-xs rounded-full border ${
              showHousing ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white"
            }`}
            onClick={() => setShowHousing((v) => !v)}
          >
            Housing
          </button>
          <button
            className={`px-3 py-1.5 text-xs rounded-full border ${
              showSchools ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white"
            }`}
            onClick={() => setShowSchools((v) => !v)}
          >
            Schools
          </button>
        </div>
      </header>

      <div className="p-4">
        <div className="card overflow-hidden">
          <MapContainer center={PALERMO} zoom={13} scrollWheelZoom style={{ height: "65vh", width: "100%" }}>
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {showSafety &&
              safety.map((s) => (
                <Circle
                  key={s.id}
                  center={[s.lat, s.lng]}
                  radius={400}
                  pathOptions={{ color: riskColor(s.risk) }}
                />
              ))}

            {showHousing &&
              housing.map((h) => (
                <Marker key={h.id} position={[h.lat, h.lng]} icon={markerIcon}>
                  <Popup>{h.name}</Popup>
                </Marker>
              ))}

            {showSchools &&
              schools.map((s) => (
                <Marker key={s.id} position={[s.lat, s.lng]} icon={markerIcon}>
                  <Popup>{s.name}</Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </div>
    </main>
  );
}
