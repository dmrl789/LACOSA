export default function Essentials() {
  const essentials = [
    { title: "Clinics", description: "24/7 urgent care locations and phone numbers" },
    { title: "Grocers", description: "Local markets stocking international staples" },
    { title: "Legal aid", description: "Pro-bono immigration specialists" },
  ];
  return (
    <main className="pb-20">
      <header className="px-4 py-3 bg-blue-600 text-white">
        <h1 className="text-lg font-semibold">Essentials</h1>
        <p className="text-xs opacity-80">Health, food, banking and legal support</p>
      </header>
      <section className="grid gap-3 p-4">
        {essentials.map((item, idx) => (
          <article key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-1 text-xs text-slate-500">{item.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
