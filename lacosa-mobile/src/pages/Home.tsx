import { AlertCard } from "../components/AlertCard";

export default function Home() {
  const alerts = [
    { kind: "Strike", title: "AMAT bus strike Fri 08–12", time: "22 May 09:00" },
    { kind: "Event", title: "Peaceful protest Sat Piazza Pretoria 17:00", time: "17 May 09:00" },
  ];
  return (
    <main className="pb-20">
      <header className="px-4 py-3 bg-blue-600 text-white">
        <h1 className="text-lg font-semibold">LACOSA</h1>
        <p className="text-xs opacity-80">Local Companion</p>
      </header>
      <section className="p-4 grid gap-3">
        {alerts.map((a, i) => (
          <AlertCard key={i} a={a} />
        ))}
      </section>
    </main>
  );
}
