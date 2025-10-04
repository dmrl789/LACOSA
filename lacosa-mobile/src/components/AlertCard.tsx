export type Alert = {
  kind: string;
  title: string;
  time: string;
};

export function AlertCard({ a }: { a: Alert }) {
  return (
    <article className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100/30">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-blue-600">
        <span className="font-semibold">{a.kind}</span>
        <time className="text-slate-500">{a.time}</time>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-900">{a.title}</p>
    </article>
  );
}
