import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, MapPinned, MessageCircle } from "lucide-react";
import AlertCard from "../components/AlertCard";
import HomeHeader from "../components/HomeHeader";
import { api } from "../lib/api";

const quickActions = [
  "Find school",
  "Rent near Kalsa",
  "24h Pharmacy",
  "Airport transit",
  "SIM & internet",
  "Talk to concierge",
];

export default function HomePage() {
  const { data: alerts } = useQuery({ queryKey: ["alerts"], queryFn: api.alerts });
  const { data: housing } = useQuery({ queryKey: ["housing", "spotlight"], queryFn: api.housing });
  const { data: essentials } = useQuery({ queryKey: ["essentials"], queryFn: api.essentials });
  const { data: schools } = useQuery({ queryKey: ["schools"], queryFn: api.schools });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: api.events });

  const housingSpotlight = useMemo(() => housing?.slice(0, 3) ?? [], [housing]);
  const schoolSpotlight = useMemo(() => schools?.slice(0, 6) ?? [], [schools]);
  const essentialsSpotlight = useMemo(() => essentials?.slice(0, 6) ?? [], [essentials]);
  const eventSpotlight = useMemo(() => events?.slice(0, 4) ?? [], [events]);

  return (
    <div className="pb-6">
      <HomeHeader />
      <section className="space-y-6 px-5 pt-5">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Live alerts</h2>
            <button className="text-xs font-medium text-primary-600">View all</button>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {alerts?.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={{
                  id: alert.id,
                  kind: (alert.type as "Strike" | "Event" | "Safety") ?? "Event",
                  title: alert.title,
                  time: alert.timestamp,
                }}
              />
            )) || <SkeletonRow />}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Safety snapshot</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Low risk</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">Watchlist</span>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">Caution</span>
              </div>
            </div>
            <button className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">
              <MapPinned size={16} /> View map
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-800">Quick actions</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action}
                className="flex h-20 flex-col justify-between rounded-2xl bg-white p-3 text-left text-sm font-semibold text-slate-700 shadow-sm"
              >
                <span>{action}</span>
                <ChevronRight size={18} className="text-primary-500" />
              </button>
            ))}
          </div>
        </div>

        <Carousel
          title="Housing spotlight"
          action="See all listings"
          items={
            housingSpotlight.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-1">
                {housingSpotlight.map((rental) => (
                  <div key={rental.id} className="min-w-[240px] rounded-3xl bg-white shadow-sm">
                    <img
                      src={rental.image_url}
                      alt={rental.title}
                      className="h-36 w-full rounded-3xl object-cover"
                    />
                    <div className="space-y-1 p-3">
                      <p className="text-sm font-semibold text-slate-800">{rental.title}</p>
                      <p className="text-xs text-slate-500">
                        €{rental.price_eur_month.toLocaleString()} / mo · {rental.neighborhood}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {Math.round(rental.distance_to_transit_m)}m to transit
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <SkeletonRow />
            )
          }
        />

        <Carousel
          title="Schools & learning"
          items={
            schoolSpotlight.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {schoolSpotlight.map((school) => (
                  <span
                    key={school.id}
                    className="inline-flex min-w-[140px] flex-col gap-1 rounded-2xl bg-white p-3 text-xs font-semibold text-slate-600 shadow-sm"
                  >
                    {school.name}
                    <span className="text-[11px] font-medium text-primary-600">{school.pedagogy}</span>
                    <span className="text-[11px] text-slate-400">{school.languages.join(", ")}</span>
                  </span>
                ))}
              </div>
            ) : (
              <SkeletonRow />
            )
          }
        />

        <Carousel
          title="Daily essentials"
          items={
            essentialsSpotlight.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {essentialsSpotlight.map((place) => (
                  <span
                    key={place.id}
                    className="inline-flex min-w-[150px] flex-col gap-1 rounded-2xl bg-white p-3 text-xs font-semibold text-slate-600 shadow-sm"
                  >
                    {place.name}
                    <span className="text-[11px] text-slate-400">{(place.distance_m / 1000).toFixed(1)} km away</span>
                    <span className="text-[11px] text-primary-600">{place.languages.join(" / ")}</span>
                  </span>
                ))}
              </div>
            ) : (
              <SkeletonRow />
            )
          }
        />

        <Carousel
          title="Events"
          items={
            eventSpotlight.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {eventSpotlight.map((event) => (
                  <div key={event.id} className="min-w-[200px] rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{event.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{event.location}</p>
                    <p className="mt-2 text-xs font-semibold text-emerald-600">{event.cost}</p>
                  </div>
                ))}
              </div>
            ) : (
              <SkeletonRow />
            )
          }
        />
      </section>

      <footer className="sticky bottom-16 mt-6 flex justify-center px-5">
        <button className="flex w-full max-w-sm items-center justify-between rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg">
          Ask the concierge
          <MessageCircle size={18} className="text-white/80" />
        </button>
      </footer>
    </div>
  );
}

function Carousel({
  title,
  action,
  items,
}: {
  title: string;
  action?: string;
  items: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {action && <button className="text-xs font-medium text-primary-600">{action}</button>}
      </div>
      {items}
    </section>
  );
}

function SkeletonRow() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="h-28 w-48 animate-pulse rounded-2xl bg-slate-200/70" />
      ))}
    </div>
  );
}
