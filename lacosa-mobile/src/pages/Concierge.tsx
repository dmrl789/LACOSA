import { useState } from "react";

export default function Concierge() {
  const [text, setText] = useState("");
  const suggestions = [
    "Find bilingual Montessori",
    "Best area for 2BR under €1.2k",
    "How to get permesso di soggiorno?",
    "Safest route from airport tonight",
  ];

  return (
    <main className="section pb-2">
      <h1 className="text-base font-semibold mb-3">Concierge</h1>

      <div className="mb-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setText(s)}
            className="text-xs px-3 py-1.5 rounded-full border bg-white"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="card p-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Ask anything about Palermo…"
          className="w-full text-sm outline-none resize-none"
        />
        <div className="mt-2 flex justify-end">
          <button className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white">
            Send
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        (Wire this to your AI endpoint later)
      </p>
    </main>
  );
}
