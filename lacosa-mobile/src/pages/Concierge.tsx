import { useState } from "react";
import { postJSON } from "../lib/api";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function Concierge() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! Ask me anything about Palermo." },
  ]);

  const suggestions = [
    "Find bilingual Montessori",
    "Best area for 2BR under €1.2k",
    "How to get permesso di soggiorno?",
    "Safest route from airport tonight",
  ];

  async function send() {
    const prompt = text.trim();
    if (!prompt || loading) return;
    setText("");
    const next = [...messages, { role: "user", content: prompt } as ChatMessage];
    setMessages(next);
    setLoading(true);
    try {
      // Adjust the path to match your FastAPI route
      // Example FastAPI:
      // @post("/api/concierge") def concierge(req: {message: str}) -> {reply: str}
      const data = await postJSON<{ reply: string }>("/api/concierge", {
        message: prompt,
        // Optionally include geo/city from state
        city: "Palermo",
      });
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Sorry, I had a problem reaching the server: ${e.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section pb-24">
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

      <div className="card p-3 min-h-[40vh]">
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                m.role === "assistant"
                  ? "bg-gray-100"
                  : "bg-blue-600 text-white ml-auto"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="bg-gray-100 rounded-2xl px-3 py-2 text-sm w-28">
              Typing…
            </div>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="Ask anything about Palermo…"
            className="flex-1 text-sm outline-none resize-none border rounded-xl p-2"
          />
          <button
            onClick={send}
            disabled={loading}
            className="px-3 py-2 text-sm rounded-xl bg-blue-600 text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Connected to <code>/api/concierge</code>. Set <code>VITE_API_BASE</code> to point at
        your FastAPI.
      </p>
    </main>
  );
}
