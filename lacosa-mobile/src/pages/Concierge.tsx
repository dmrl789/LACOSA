export default function Concierge() {
  return (
    <main className="pb-20">
      <header className="px-4 py-3 bg-blue-600 text-white">
        <h1 className="text-lg font-semibold">Concierge</h1>
        <p className="text-xs opacity-80">Ask anything — we will connect you</p>
      </header>
      <section className="p-4">
        <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50 p-6 text-center text-sm text-blue-700">
          <p className="font-medium">Chat interface coming soon</p>
          <p className="mt-2 text-xs opacity-80">
            Wire this view to your AI concierge endpoint to let newcomers get guidance in their language.
          </p>
        </div>
      </section>
    </main>
  );
}
