import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Icon } from "leaflet";
import L from "leaflet";
import { useMap } from "react-leaflet";

const defaultIcon: Icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const housing = [
  { id: "h1", name: "Centro Storico Loft", lat: 38.1157, lng: 13.3613 },
  { id: "h2", name: "Politeama Terrace", lat: 38.1267, lng: 13.3569 },
];

const schools = [
  { id: "s1", name: "International School Palermo", lat: 38.1466, lng: 13.3473 },
  { id: "s2", name: "British Primary Campus", lat: 38.1369, lng: 13.3235 },
];

const safety = [
  { id: "sa1", name: "Safe Zone — Mondello", lat: 38.2041, lng: 13.3186 },
  { id: "sa2", name: "Caution — Kalsa Night", lat: 38.1188, lng: 13.3731 },
];

type Focus = { lat: number; lng: number; zoom?: number } | null;

type MapSection = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom?: number;
};

function FlyTo({ lat, lng, zoom = 16 }: { lat: number; lng: number; zoom?: number }) {
  const map = useMap();
  map.flyTo([lat, lng], zoom, { duration: 1 });
  return null;
}

export default function Map() {
  const [focus, setFocus] = useState<Focus>(null);

  const items = useMemo(() => {
    return [
      { id: "housing", label: "Housing", data: housing, zoom: 17 },
      { id: "schools", label: "Schools", data: schools, zoom: 16 },
      { id: "safety", label: "Safety", data: safety, zoom: 15 },
    ];
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
      <MapContainer
        center={[38.1157, 13.3613]}
        zoom={13}
        className="w-full h-[60vh] rounded-xl overflow-hidden"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {housing.map((item) => (
          <Marker key={item.id} position={[item.lat, item.lng]} icon={defaultIcon}>
            <Popup>
              <strong>{item.name}</strong>
              <div>Housing</div>
            </Popup>
          </Marker>
        ))}
        {schools.map((item) => (
          <Marker key={item.id} position={[item.lat, item.lng]} icon={defaultIcon}>
            <Popup>
              <strong>{item.name}</strong>
              <div>School</div>
            </Popup>
          </Marker>
        ))}
        {safety.map((item) => (
          <Marker key={item.id} position={[item.lat, item.lng]} icon={defaultIcon}>
            <Popup>
              <strong>{item.name}</strong>
              <div>Safety</div>
            </Popup>
          </Marker>
        ))}

        {focus && <FlyTo lat={focus.lat} lng={focus.lng} zoom={focus.zoom} />}
      </MapContainer>

      <div className="space-y-4 overflow-y-auto">
        {items.map((section) => (
          <div key={section.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 font-semibold border-b bg-slate-50">{section.label}</div>
            <div>
              {section.data.map((entry: MapSection) => (
                <div
                  key={entry.id}
                  className="px-4 py-2 border-b last:border-b-0 text-sm hover:bg-slate-100 cursor-pointer"
                  onClick={() =>
                    setFocus({ lat: entry.lat, lng: entry.lng, zoom: section.zoom ?? focus?.zoom })
                  }
                >
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
