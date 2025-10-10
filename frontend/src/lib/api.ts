const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

const alertKindMap: Record<string, "Strike" | "Event" | "Safety"> = {
  transport: "Strike",
  safety: "Safety",
  mobility: "Strike",
};

const rentalImages = [
  "https://picsum.photos/seed/lacosa-rental-1/800/480",
  "https://picsum.photos/seed/lacosa-rental-2/800/480",
  "https://picsum.photos/seed/lacosa-rental-3/800/480",
];

function capitalise(value: string): string {
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
    const alerts = await get<
      Array<{ id: string; category: string; message: string; severity: string; published_at: string }>
    >("/api/utilities/alerts");
    return alerts.map((alert) => ({
      id: alert.id,
      type: alertKindMap[alert.category] ?? "Event",
      title: alert.message,
      timestamp: alert.published_at,
    }));
  },
  housing: async () => {
    const rentals = await get<
      Array<{
        id: string;
        title: string;
        neighborhood: string;
        price_eur: number;
        bedrooms: number;
        furnished: boolean;
        kid_friendly: boolean;
        pet_friendly: boolean;
        verified: boolean;
      }>
    >("/api/housing/rentals");
    return rentals.map((rental, index) => ({
      id: rental.id,
      title: rental.title,
      neighborhood: rental.neighborhood,
      price_eur_month: rental.price_eur,
      bedrooms: rental.bedrooms,
      distance_to_transit_m: 400 + index * 150,
      furnished: rental.furnished,
      family_friendly: rental.kid_friendly,
      image_url: rentalImages[index % rentalImages.length],
    }));
  },
  essentials: async () => {
    const essentials = await get<
      Array<{
        id: string;
        name: string;
        type: string;
        tags?: string[];
        description: string;
        neighborhood: string;
      }>
    >("/api/shopping/essentials");
    return essentials.map((item, index) => {
      const languages = item.tags?.includes("english-speaking") ? ["IT", "EN"] : ["IT"];
      return {
        id: item.id,
        name: item.name,
        category: capitalise(item.type ?? "Service"),
        distance_m: 600 + index * 250,
        languages,
        status: item.tags?.includes("24h") ? "Open 24h" : "Open now",
        address: `${item.neighborhood}, Palermo`,
      };
    });
  },
  schools: async () => {
    const schools = await get<
      Array<{
        id: string;
        name: string;
        curriculum: string;
        level: string;
        language: string[];
        tuition_eur: number | null;
        address: string;
      }>
    >("/api/schools/directory");
    return schools.map((school) => ({
      id: school.id,
      name: school.name,
      neighborhood: school.address,
      pedagogy: school.curriculum,
      languages: school.language,
      tuition_eur: school.tuition_eur ?? 0,
      level: capitalise(school.level),
    }));
  },
  events: async () => {
    const events = await get<
      Array<{
        id: string;
        name: string;
        venue: string;
        start_time: string;
        end_time: string;
        summary: string;
        ticket_url: string | null;
      }>
    >("/api/culture/events");
    return events.map((event) => ({
      id: event.id,
      name: event.name,
      location: event.venue,
      date: event.start_time,
      cost: event.ticket_url ? "Ticketed" : "Free",
    }));
  },
};
