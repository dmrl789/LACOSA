import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Send } from "lucide-react";
import { api } from "../lib/api";

const suggestions = [
  "Find bilingual Montessori",
  "Best area for 2BR under €1.2k",
  "How to get permesso di soggiorno",
];

type Message = {
  role: "user" | "concierge";
  content: string;
};

export default function ConciergePage() {
  useQuery({ queryKey: ["alerts"], queryFn: api.alerts });
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "concierge",
      content:
        "Ciao! I'm your Palermo relocation concierge. Ask me about neighborhoods, documents or daily essentials and I'll route you to the right answer.",
    },
  ]);

  function sendMessage(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((msgs) => [...msgs, userMessage, fakeReply(userMessage)]);
    setInput("");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-5 py-4 shadow-sm">
        <h1 className="text-base font-semibold text-slate-800">Concierge</h1>
        <p className="text-xs text-slate-500">AI chat with Palermo experts on-call</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="rounded-full bg-primary-50 px-3 py-1 text-primary-600 shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-snug shadow-sm ${
                message.role === "user"
                  ? "rounded-br-md bg-primary-600 text-white"
                  : "rounded-bl-md bg-white text-slate-700"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="sticky bottom-16 border-t border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center rounded-full border border-slate-200 bg-slate-100 p-1">
          <MessageCircle className="ml-3 h-5 w-5 text-primary-500" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the concierge…"
            className="flex-1 bg-transparent px-3 text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="mr-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white"
            aria-label="Send"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

function fakeReply(userMessage: Message): Message {
  return {
    role: "concierge",
    content: `Here's how I'd help with "${userMessage.content}". In the full build I'd pull from Palermo data, housing, and alerts to tailor your answer.`,
  };
}
