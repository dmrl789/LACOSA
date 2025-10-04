type Item = { name: string; kind: string; meta: string };

const groups: Record<string, Item[]> = {
  Health: [
    { name: "Farmacia Internazionale", kind: "Pharmacy", meta: "24h · EN speaking" },
    { name: "Clinic Centro", kind: "Clinic", meta: "Walk-in" },
  ],
  Schools: [
    { name: "Bilingual Montessori", kind: "Early Education", meta: "EN/IT" },
    { name: "International School", kind: "Primary–HS", meta: "Admissions Feb" },
  ],
  Transport: [
    { name: "AMAT Tram T1", kind: "Tram", meta: "Every 7–10 min" },
    { name: "Taxi Palermo", kind: "Taxi", meta: "WhatsApp booking" },
  ],
};

export default function Essentials() {
  const tabs = Object.keys(groups);
  return (
    <main className="section">
      <h1 className="text-base font-semibold mb-2">Essentials</h1>
      <div className="mb-3 flex gap-2">
        {tabs.map((t) => (
          <button key={t} className="px-3 py-1.5 text-xs rounded-full border bg-white">
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        {tabs.map((t) => (
          <section key={t}>
            <h2 className="text-xs font-semibold text-gray-600 mb-1">{t}</h2>
            <div className="grid gap-2">
              {groups[t].map((it, i) => (
                <div key={i} className="card p-3">
                  <div className="text-sm font-medium">{it.name}</div>
                  <div className="text-xs text-gray-600">{it.kind}</div>
                  <div className="text-xs text-gray-500">{it.meta}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
