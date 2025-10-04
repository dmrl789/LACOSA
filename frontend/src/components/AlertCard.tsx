type Alert = {
  id: string;
  kind: "Strike" | "Event" | "Safety";
  title: string;
  time: string;
};

const kindColor: Record<Alert["kind"], string> = {
  Strike: "bg-amber-100 text-amber-900",
  Event: "bg-emerald-100 text-emerald-900",
  Safety: "bg-rose-100 text-rose-900",
};

export default function AlertCard({ alert }: { alert: Alert }) {
  return (
    <article className="flex h-full min-w-[220px] flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${kindColor[alert.kind]}`}
        >
          {alert.kind}
        </span>
        <h3 className="mt-3 line-clamp-3 text-sm font-semibold text-slate-800">{alert.title}</h3>
      </div>
      <time className="mt-4 text-[11px] uppercase tracking-wide text-slate-400">{alert.time}</time>
    </article>
  );
}
