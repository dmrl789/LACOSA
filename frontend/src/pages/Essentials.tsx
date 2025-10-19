import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation2 } from "lucide-react";
import { api } from "../lib/api";

type Category = "Health" | "Schools" | "Transport" | "Shopping" | "Services";

export default function EssentialsPage() {
  const [category, setCategory] = useState<Category>("Health");
  const { data: essentials } = useQuery({ queryKey: ["essentials"], queryFn: api.essentials });
  const { data: schools } = useQuery({ queryKey: ["schools"], queryFn: api.schools });
  const { data: transport } = useQuery({ queryKey: ["transport"], queryFn: api.transportOptions });

  const items = useMemo(() => {
    switch (category) {
      case "Health":
        return essentials?.filter((e) => e.category === "Pharmacy" || e.category === "Clinic");
      case "Schools":
        return schools?.map((school) => ({
          id: school.id,
          name: school.name,
          distance_m: 1200,
          languages: school.languages,
          status: "Open",
        }));
      case "Transport":
        return transport;
      case "Shopping":
        return essentials?.filter((e) => e.category === "Shopping" || e.category === "Electronics");
      case "Services":
        return essentials?.filter((e) => e.category === "Services");
      default:
        return essentials;
    }
  }, [category, essentials, schools, transport]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-5 py-4 shadow-sm">
        <h1 className="text-base font-semibold text-slate-800">Essentials</h1>
        <p className="text-xs text-slate-500">Curated services for daily life</p>
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 text-xs font-semibold text-slate-500">
          {(["Health", "Schools", "Transport", "Shopping", "Services"] as Category[]).map((option) => (
            <button
              key={option}
              onClick={() => setCategory(option)}
              className={`rounded-xl px-3 py-2 transition ${
                category === option ? "bg-white text-slate-900 shadow" : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 pb-20 pt-4">
        <ul className="space-y-3">
          {items?.map((item) => (
            <li key={item?.id ?? item?.name} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item?.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{((item?.distance_m ?? 0) / 1000).toFixed(1)} km away</p>
                  <div className="mt-2 flex flex-wrap gap-1 text-[11px] font-semibold text-primary-600">
                    {(item?.languages ?? ["IT"]).map((lang: string) => (
                      <span key={lang} className="rounded-full bg-primary-50 px-2 py-0.5">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right text-[11px] uppercase tracking-wide text-emerald-600">
                  {item?.status ?? "Open"}
                </div>
              </div>
              <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                <Navigation2 size={14} /> Directions
              </button>
            </li>
          )) || <p className="text-sm text-slate-500">Loading essentials…</p>}
        </ul>
      </div>
    </div>
  );
}
