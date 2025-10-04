type House = { title: string; area: string; price: string; distance: string; img?: string };

const data: House[] = [
  { title: "2BR · Kalsa", area: "Kalsa", price: "€1,100/mo", distance: "300m to tram" },
  { title: "Loft near Teatro", area: "Centro", price: "€950/mo", distance: "500m to bus" },
  { title: "Family 3BR", area: "Mondello", price: "€1,600/mo", distance: "Near beach" },
];

export default function Housing() {
  return (
    <main>
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="px-4 py-3 flex gap-2 overflow-x-auto">
          {["Price", "Beds", "Neighborhood", "Furnished", "Family-friendly"].map((f) => (
            <button key={f} className="px-3 py-1.5 text-xs rounded-full border bg-white">
              {f}
            </button>
          ))}
        </div>
      </header>

      <section>
        {data.map((h, i) => (
          <div key={i} className="flex gap-3 p-3 border-b bg-white">
            <div className="w-24 h-24 bg-gray-200 rounded-lg" />
            <div className="min-w-0">
              <h3 className="text-sm font-medium truncate">{h.title}</h3>
              <p className="text-xs text-gray-600">
                {h.area} · {h.price}
              </p>
              <p className="text-xs text-gray-500">{h.distance}</p>
              <div className="mt-2 flex gap-2">
                <button className="text-xs px-2 py-1 rounded bg-blue-600 text-white">
                  Contact
                </button>
                <button className="text-xs px-2 py-1 rounded border">Save</button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
