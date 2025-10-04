export default function Housing() {
  const listings = [
    { title: "Centro Storico studio", details: "€650 · 1 bed · Available now" },
    { title: "Shared flat near Kalsa", details: "€420 · 1 room · Waitlist" },
  ];
  return (
    <main className="pb-20">
      <header className="px-4 py-3 bg-blue-600 text-white">
        <h1 className="text-lg font-semibold">Housing</h1>
        <p className="text-xs opacity-80">Trusted landlords and verified hosts</p>
      </header>
      <section className="grid gap-3 p-4">
        {listings.map((item, idx) => (
          <article key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-1 text-xs text-slate-500">{item.details}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
