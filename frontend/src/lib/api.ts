const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  health: () => get<{ status: string }>("/health"),
  safetyZones: () =>
    get<
      Array<{
        id: string;
        neighborhood: string;
        risk_level: string;
        description: string;
        trend: string;
        updated_at: string;
      }>
    >("/api/safety/zones"),
  alerts: () => get<Array<{ id: string; type: string; title: string; timestamp: string }>>("/api/utilities/alerts"),
  housing: () =>
    get<
      Array<{
        id: string;
        title: string;
        neighborhood: string;
        price_eur_month: number;
        bedrooms: number;
        distance_to_transit_m: number;
        furnished: boolean;
        family_friendly: boolean;
        image_url: string;
      }>
    >("/api/housing/rentals"),
  essentials: () =>
    get<
      Array<{
        id: string;
        name: string;
        category: string;
        distance_m: number;
        languages: string[];
        status: string;
        address: string;
      }>
    >("/api/shopping/essentials"),
  schools: () =>
    get<
      Array<{
        id: string;
        name: string;
        neighborhood: string;
        pedagogy: string;
        languages: string[];
        tuition_eur: number;
        level: string;
      }>
    >("/api/schools/directory"),
  events: () =>
    get<
      Array<{
        id: string;
        name: string;
        location: string;
        date: string;
        cost: string;
      }>
    >("/api/culture/events"),
};
