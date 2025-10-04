import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, MapPinned } from "lucide-react";
import HousingItem from "../components/HousingItem";
import { api } from "../lib/api";

const priceSteps = ["Any", "< €900", "€900-1,200", "€1,200-1,500", "> €1,500"];
const bedOptions = ["Any", "1", "2", "3+"];

export default function HousingPage() {
  const { data: rentals } = useQuery({ queryKey: ["housing"], queryFn: api.housing });
  const [price, setPrice] = useState("Any");
  const [beds, setBeds] = useState("Any");
  const [onlyFurnished, setOnlyFurnished] = useState(false);
  const [familyFriendly, setFamilyFriendly] = useState(false);

  const filtered = useMemo(() => {
    return (
      rentals?.filter((rental) => {
        if (price !== "Any") {
          const value = rental.price_eur_month;
          if (price === "< €900" && value >= 900) return false;
          if (price === "€900-1,200" && (value < 900 || value > 1200)) return false;
          if (price === "€1,200-1,500" && (value < 1200 || value > 1500)) return false;
          if (price === "> €1,500" && value <= 1500) return false;
        }
        if (beds !== "Any") {
          const bedVal = beds === "3+" ? 3 : Number(beds);
          if (beds === "3+" && rental.bedrooms < bedVal) return false;
          if (beds !== "3+" && rental.bedrooms !== bedVal) return false;
        }
        if (onlyFurnished && !rental.furnished) return false;
        if (familyFriendly && !rental.family_friendly) return false;
        return true;
      }) ?? []
    );
  }, [beds, familyFriendly, onlyFurnished, price, rentals]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-slate-800">Housing</h1>
            <p className="text-xs text-slate-500">Verified rentals curated for relocators</p>
          </div>
          <button className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
            <MapPinned size={16} className="mr-1 inline" /> Map
          </button>
        </div>
      </header>

      <div className="sticky top-[68px] z-10 bg-slate-50/90 px-5 pb-2 pt-3 backdrop-blur">
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <FilterChip label="Price" value={price} onSelect={setPrice} options={priceSteps} />
          <FilterChip label="Beds" value={beds} onSelect={setBeds} options={bedOptions} />
          <ToggleChip label="Furnished" active={onlyFurnished} onToggle={setOnlyFurnished} />
          <ToggleChip label="Family-friendly" active={familyFriendly} onToggle={setFamilyFriendly} />
        </div>
      </div>

      <div className="divide-y divide-slate-100 bg-white">
        {filtered.map((rental) => (
          <HousingItem
            key={rental.id}
            house={{
              id: rental.id,
              title: rental.title,
              area: `${rental.bedrooms}BR · ${rental.neighborhood}`,
              price: `€${rental.price_eur_month.toLocaleString()}/mo`,
              distance: `${Math.round(rental.distance_to_transit_m)}m`,
              img: rental.image_url,
            }}
          />
        ))}
        {filtered.length === 0 && (
          <p className="p-6 text-sm text-slate-500">No listings match these filters yet.</p>
        )}
      </div>
    </div>
  );
}

type FilterChipProps = {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
};

function FilterChip({ label, value, options, onSelect }: FilterChipProps) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer select-none items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm">
        {label}: <span className="font-semibold text-slate-800">{value}</span>
      </summary>
      <div className="absolute left-0 top-full z-30 mt-2 w-40 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
        <ul className="space-y-2 text-sm">
          {options.map((option) => (
            <li key={option}>
              <button
                onClick={() => onSelect(option)}
                className={`w-full rounded-full px-3 py-1 text-left text-xs font-medium ${
                  value === option ? "bg-primary-50 text-primary-600" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

type ToggleChipProps = {
  label: string;
  active: boolean;
  onToggle: (value: boolean) => void;
};

function ToggleChip({ label, active, onToggle }: ToggleChipProps) {
  return (
    <button
      onClick={() => onToggle(!active)}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
        active ? "bg-primary-600 text-white" : "border border-slate-200 bg-white text-slate-600"
      }`}
    >
      <Filter size={14} /> {label}
    </button>
  );
}
