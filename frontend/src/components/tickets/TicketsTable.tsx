// Emmanuel Aro's project submission for evaluation.
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import {
  CATEGORY_LABEL,
  PRIORITY_LABEL,
  PRIORITY_TONE,
  STATUS_LABEL,
  STATUS_TONE,
  formatRelative,
  initials,
} from "@/lib/format";
import type { TicketListItem } from "@/lib/api";

export function TicketsTable({ tickets }: { tickets: TicketListItem[] }) {
  if (tickets.length === 0) {
    return (
      <div className="border border-dashed border-ink-200 px-6 py-16 text-center text-sm text-ink-400">
        No tickets match the current filters.
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-canvas border-b border-line">
            <tr className="text-left text-[11px] uppercase tracking-widest text-ink-500">
              <th className="px-5 py-3 font-semibold">Ticket</th>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Category</th>
              <th className="px-5 py-3 font-semibold">Priority</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Updated</th>
              <th className="px-5 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr
                key={t.id}
                className="border-b border-line last:border-b-0 hover:bg-canvas/60"
              >
                <td className="px-5 py-3">
                  <p className="text-ink font-medium">{t.subject}</p>
                  <p className="font-mono text-[11px] text-ink-400 mt-0.5">
                    {t.reference}
                  </p>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 bg-ink-700 text-white text-[11px] font-semibold flex items-center justify-center">
                      {initials(t.customer.name)}
                    </span>
                    <div>
                      <p className="text-ink-700 text-sm">{t.customer.name}</p>
                      <p className="text-ink-400 text-[11px]">{t.customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-ink-600">
                  {CATEGORY_LABEL[t.category]}
                </td>
                <td className="px-5 py-3">
                  <Badge tone={PRIORITY_TONE[t.priority]}>
                    {PRIORITY_LABEL[t.priority]}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <Badge tone={STATUS_TONE[t.status]}>
                    {STATUS_LABEL[t.status]}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-xs text-ink-500">
                  {formatRelative(t.updated_at)}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/tickets/${t.id}`}
                    className="text-xs uppercase tracking-widest text-accent hover:underline"
                  >
                    View ticket →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-line border border-line">
        {tickets.map((t) => (
          <Link
            key={t.id}
            href={`/tickets/${t.id}`}
            className="block p-4 hover:bg-canvas/60"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-ink font-medium truncate">{t.subject}</p>
                <p className="font-mono text-[11px] text-ink-400 mt-0.5">
                  {t.reference}
                </p>
              </div>
              <Badge tone={STATUS_TONE[t.status]}>{STATUS_LABEL[t.status]}</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
              <span>{t.customer.name}</span>
              <span>{formatRelative(t.updated_at)}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
