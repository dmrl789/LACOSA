const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
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

  alerts: async () => {
    const data = await get<
      Array<{
        id: string;
        category: string;
        message: string;
        severity: string;
        published_at: string;
      }>
    >("/api/utilities/alerts");
    return data.map((a) => {
      const isStrike = /strike/i.test(a.message);
      const type = a.category.toLowerCase() === "safety" ? "Safety" : isStrike ? "Strike" : "Event";
      return { id: a.id, type, title: a.message, timestamp: a.published_at };
    });
  },

  housing: async () => {
    const data = await get<
      Array<{
        id: string;
        title: string;
        price_eur: number;
        bedrooms: number;
        furnished: boolean;
        kid_friendly: boolean;
        pet_friendly: boolean;
        neighborhood: string;
        verified: boolean;
        coordinates: { lat: number; lng: number };
        contact: string;
        url?: string | null;
      }>
    >("/api/housing/rentals");
    return data.map((r) => ({
      id: r.id,
      title: r.title,
      neighborhood: r.neighborhood,
      price_eur_month: r.price_eur,
      bedrooms: r.bedrooms,
      distance_to_transit_m: 800, // demo value for UI display
      furnished: r.furnished,
      family_friendly: r.kid_friendly,
      image_url: "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop",
    }));
  },

  essentials: async () => {
    const data = await get<
      Array<{
        id: string;
        name: string;
        type: string;
        tags: string[];
        description: string;
        neighborhood: string;
        coordinates: { lat: number; lng: number };
        url?: string | null;
      }>
    >("/api/shopping/essentials");
    return data.map((e) => ({
      id: e.id,
      name: e.name,
      category: titleCase(e.type),
      distance_m: 1200,
      languages: e.tags.some((t) => /english/i.test(t)) ? ["EN", "IT"] : ["IT"],
      status: e.tags.some((t) => /24h|24-hour/i.test(t)) ? "24h" : "Open",
      address: e.neighborhood,
    }));
  },

  transportOptions: async () => {
    const data = await get<
      Array<{
        id: string;
        mode: string;
        provider: string;
        description: string;
        contact?: string | null;
        availability: string;
        safety_notes: string;
      }>
    >("/api/transport/options");
    return data.map((t) => ({
      id: t.id,
      name: `${t.provider} (${titleCase(t.mode)})`,
      category: "Transport",
      distance_m: 800,
      languages: [],
      status: "Available",
      address: "Palermo",
    }));
  },

  schools: async () => {
    const data = await get<
      Array<{
        id: string;
        name: string;
        curriculum: string;
        level: string;
        language: string[];
        rating: number;
        tuition_eur?: number | null;
        address: string;
        application_tips: string;
      }>
    >("/api/schools/directory");
    return data.map((s) => ({
      id: s.id,
      name: s.name,
      neighborhood: "Palermo",
      pedagogy: s.curriculum,
      languages: s.language,
      tuition_eur: s.tuition_eur ?? 0,
      level: s.level,
    }));
  },

  events: async () => {
    const data = await get<
      Array<{
        id: string;
        name: string;
        category: string;
        venue: string;
        start_time: string;
        end_time: string;
        summary: string;
        ticket_url?: string | null;
      }>
    >("/api/culture/events");
    return data.map((e) => ({
      id: e.id,
      name: e.name,
      location: e.venue,
      date: e.start_time,
      cost: /ticket|€|eur|pay|price/i.test(e.summary) ? "Paid" : "Free",
    }));
  },
};
