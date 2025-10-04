import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { useMemo, useState } from "react";
import L from "leaflet";

// Palermo center
const PALERMO: [number, number] = [38.1157, 13.3613];

// Demo data
const housingPins = [
  { id: 1, name: "2BR · Kalsa", pos: [38.1169, 13.3735] as [number, number] },
  { id: 2, name: "Loft · Centro", pos: [38.12, 13.357] as [number, number] },
];

const schoolPins = [
  { id: 1, name: "Bilingual Montessori", pos: [38.131, 13.36] as [number, number] },
  { id: 2, name: "International School", pos: [38.104, 13.354] as [number, number] },
];

export default function Map() {
  const [showSafety, setShowSafety] = useState(true);
  const [showHousing, setShowHousing] = useState(true);
  const [showSchools, setShowSchools] = useState(true);

  // Simple icon (Leaflet’s default marker needs explicit icon on some bundlers)
  const markerIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    []
  );

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

      <div className="p-4 pt-3">
        <div className="card overflow-hidden">
          <MapContainer
            center={PALERMO}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "65vh", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {showSafety && (
              <>
                {/* Example safety heat circles (fake values) */}
                <Circle
                  center={[38.118, 13.37]}
                  radius={400}
                  pathOptions={{ color: "#ef4444" }}
                />
                <Circle
                  center={[38.125, 13.34]}
                  radius={300}
                  pathOptions={{ color: "#f59e0b" }}
                />
                <Circle
                  center={[38.105, 13.37]}
                  radius={250}
                  pathOptions={{ color: "#10b981" }}
                />
              </>
            )}

            {showHousing &&
              housingPins.map((p) => (
                <Marker key={p.id} position={p.pos} icon={markerIcon}>
                  <Popup>{p.name}</Popup>
                </Marker>
              ))}

            {showSchools &&
              schoolPins.map((p) => (
                <Marker key={p.id} position={p.pos} icon={markerIcon}>
                  <Popup>{p.name}</Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          Toggle layers to view safety heat, housing, and schools. Replace demo pins
          with live API data.
        </p>
      </div>
    </main>
  );
}
