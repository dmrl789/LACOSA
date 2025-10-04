export type Alert = {
  id: string;
  category: string;
  message: string;
  severity: "low" | "medium" | "high";
  published_at: string;
};

const severityVariants: Record<Alert["severity"], string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  high: "bg-rose-50 text-rose-700 border-rose-100",
};

function formatPublishedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AlertCard({ alert }: { alert: Alert }) {
  const badgeClasses = severityVariants[alert.severity] ?? severityVariants.low;
  return (
    <article className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100/30">
      <div className="flex items-start justify-between gap-3 text-xs uppercase tracking-wide text-blue-600">
        <div className="space-y-1">
          <span className="font-semibold">{alert.category}</span>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badgeClasses}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
            {alert.severity}
          </span>
        </div>
        <time className="whitespace-nowrap text-slate-500">{formatPublishedAt(alert.published_at)}</time>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-900">{alert.message}</p>
    </article>
  );
}
