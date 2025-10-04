import { AlertCard, type Alert } from "../components/AlertCard";

export default function Home() {
  const alerts: Alert[] = [
    { kind: "Strike", title: "AMAT bus strike Fri 08:00–12:00", time: "22 May · 09:00" },
    { kind: "Event", title: "Protest at Piazza Pretoria Sat 17:00", time: "17 May · 09:00" },
    { kind: "Safety", title: "Pickpocketing watch at Ballarò market", time: "18 May · 21:10" },
  ];

  const quick = [
    "Find school",
    "Rent near Kalsa",
    "24h Pharmacy",
    "Airport transit",
    "SIM & internet",
    "Talk to concierge",
  ];

  return (
    <main className="pb-4">
      <header className="px-4 pt-4 pb-3 bg-gradient-to-b from-blue-600 to-blue-500 text-white">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">LACOSA</h1>
          <span className="ml-auto text-sm bg-white/20 rounded px-2 py-1">Palermo ▾</span>
        </div>
        <p className="text-xs opacity-90 mt-1">Live alerts, housing, schools & essentials</p>
      </header>

      <section className="section grid gap-3">
        {alerts.map((a, i) => (
          <AlertCard key={i} a={a} />
        ))}
      </section>

      <section className="section">
        <h2 className="text-sm font-semibold mb-2">Quick actions</h2>
        <div className="grid grid-cols-3 gap-2">
          {quick.map((q) => (
            <button
              key={q}
              className="text-xs px-3 py-2 rounded-lg border bg-white"
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="text-sm font-semibold mb-2">Housing spotlight</h2>
        <div className="flex gap-3 overflow-x-auto snap-x">
          {[1, 2, 3].map((n) => (
            <article key={n} className="min-w-[260px] snap-start card overflow-hidden">
              <div className="h-28 bg-gray-200" />
              <div className="p-3">
                <h3 className="text-sm font-medium">2BR near Teatro Massimo</h3>
                <p className="text-xs text-gray-600">€1,150/mo · 350m to tram</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="h-6" />
    </main>
  );
}
