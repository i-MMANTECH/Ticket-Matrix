// Emmanuel Aro's project submission for evaluation.
import { STATUS_LABEL } from "@/lib/format";
import type { TicketStatus } from "@/lib/api";

const COLOR: Record<TicketStatus, string> = {
  open: "bg-accent",
  in_progress: "bg-amber-500",
  on_hold: "bg-ink-400",
  resolved: "bg-emerald-500",
  closed: "bg-ink-700",
};

export function StatusBreakdown({
  byStatus,
  total,
}: {
  byStatus: Record<TicketStatus, number>;
  total: number;
}) {
  const entries = (Object.entries(byStatus) as [TicketStatus, number][]).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <ul className="space-y-3">
      {entries.map(([status, count]) => {
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <li key={status}>
            <div className="flex items-center justify-between text-xs text-ink-600 mb-1">
              <span className="uppercase tracking-widest">
                {STATUS_LABEL[status]}
              </span>
              <span className="tabular-nums text-ink-700 font-medium">
                {count}
              </span>
            </div>
            <div className="h-2 bg-ink-100 w-full">
              <div
                className={`h-full ${COLOR[status]}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
