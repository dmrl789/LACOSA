import { FormEvent, useState } from "react";
import { getJSON, urlWithParams } from "../lib/api";

type ConciergeAnswer = {
  query: string;
  answer: string;
  sources: string[];
  confidence: number;
  language: string;
  requested_language: string;
};

const LANG_LABELS: Record<string, string> = {
  en: "English",
  it: "Italiano",
  es: "Español",
};

export default function Concierge() {
  const [query, setQuery] = useState("Is Kalsa safe at night?");
  const [language, setLanguage] = useState<keyof typeof LANG_LABELS>("en");
  const [answer, setAnswer] = useState<ConciergeAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const payload = await getJSON<ConciergeAnswer>(
        urlWithParams("/api/concierge/ask", { query: trimmed, lang: language }),
      );
      setAnswer(payload);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError("Unable to reach the concierge right now. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pb-20">
      <header className="bg-blue-600 px-4 py-3 text-white">
        <h1 className="text-lg font-semibold">Concierge</h1>
        <p className="text-xs opacity-80">Ask anything — we connect you to verified local knowledge</p>
      </header>

      <section className="space-y-4 p-4">
        <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
            Your question
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-24 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Where should I stay with kids in Palermo?"
            />
          </label>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-medium">Language</span>
            <div className="flex gap-2">
              {(Object.keys(LANG_LABELS) as Array<keyof typeof LANG_LABELS>).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-full border px-3 py-1 font-medium transition ${
                    language === lang
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {LANG_LABELS[lang]}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? "Thinking…" : "Ask concierge"}
          </button>
        </form>

        {error && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
        )}

        {answer && !error && (
          <article className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-500">Answer</p>
              <h2 className="text-sm font-semibold text-slate-900">{answer.query}</h2>
            </header>
            <div className="space-y-2 text-sm text-slate-700">
              {answer.answer.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500">
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">
                Confidence {Math.round(answer.confidence * 100)}%
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5">
                Answered in {LANG_LABELS[answer.language] ?? answer.language}
              </span>
              {answer.requested_language !== answer.language && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                  Requested {LANG_LABELS[answer.requested_language] ?? answer.requested_language}
                </span>
              )}
            </div>
            <footer className="space-y-1 text-xs text-slate-500">
              <p className="font-semibold uppercase tracking-wide text-slate-600">Sources</p>
              <ul className="grid gap-1">
                {answer.sources.map((source) => (
                  <li key={source} className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">
                    {source}
                  </li>
                ))}
              </ul>
            </footer>
          </article>
        )}

        {!answer && !error && !loading && (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            Ask about safety, rentals, essentials or relocation. Answers include the underlying data sources for extra trust.
          </div>
        )}
      </section>
    </main>
  );
}
