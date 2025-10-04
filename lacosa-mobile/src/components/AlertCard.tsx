export type Alert = {
  kind: "Strike" | "Event" | "Safety";
  title: string;
  time: string;
};

const kindStyles: Record<Alert["kind"], string> = {
  Strike: "bg-amber-100 text-amber-800",
  Event: "bg-emerald-100 text-emerald-800",
  Safety: "bg-rose-100 text-rose-800",
};

export function AlertCard({ a }: { a: Alert }) {
  return (
    <div className="card p-3">
      <span className={`px-2 py-0.5 rounded text-xs ${kindStyles[a.kind]}`}>
        {a.kind}
      </span>
      <h3 className="mt-2 text-sm font-medium">{a.title}</h3>
      <p className="mt-1 text-xs text-gray-500">{a.time}</p>
    </div>
  );
}
