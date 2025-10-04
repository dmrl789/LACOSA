export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

type Primitive = string | number | boolean;

function buildQuery(params?: Record<string, Primitive | undefined | null>): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function urlWithParams(path: string, params?: Record<string, Primitive | undefined | null>): string {
  return `${path}${buildQuery(params)}`;
}

export async function getJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`Request failed with status ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}
