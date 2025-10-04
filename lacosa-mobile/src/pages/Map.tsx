export default function Map() {
  return (
    <main className="flex min-h-screen flex-col pb-20">
      <header className="px-4 py-3 bg-blue-600 text-white">
        <h1 className="text-lg font-semibold">City Map</h1>
        <p className="text-xs opacity-80">Safe zones, transport and updates</p>
      </header>
      <section className="flex flex-1 items-center justify-center bg-slate-100 p-4 text-center text-slate-500">
        <p className="max-w-xs text-sm">
          Interactive map coming soon. Connect your preferred mapping provider to show live transit, shelters and alerts.
        </p>
      </section>
    </main>
  );
}
