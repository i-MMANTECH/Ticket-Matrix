// Emmanuel Aro's project submission for evaluation.
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/Badge";
import {
  PRIORITY_LABEL,
  PRIORITY_TONE,
  PROGRESS_BAR_COLOR,
  STATUS_LABEL,
  STATUS_TONE,
  initials,
} from "@/lib/format";
import type { TicketListItem } from "@/lib/api";

export function TicketCard({ ticket }: { ticket: TicketListItem }) {
  const progressColor = PROGRESS_BAR_COLOR[ticket.status];
  const progress = Math.max(0, Math.min(100, ticket.progress ?? 0));

  return (
    <motion.article 
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-neo rounded-xl border border-line shadow-soft hover:shadow-brand hover:border-brand/40 transition-all"
    >
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold tracking-widest text-fg-subtle">
              {ticket.reference}
            </span>
            <Badge tone={PRIORITY_TONE[ticket.priority]}>
              {PRIORITY_LABEL[ticket.priority]}
            </Badge>
            <Badge tone={STATUS_TONE[ticket.status]}>
              <StatusDot status={ticket.status} /> {STATUS_LABEL[ticket.status]}
            </Badge>
          </div>

          <h3 className="mt-2 text-base font-semibold text-white leading-snug tracking-wide">
            {ticket.subject}
          </h3>
          <p className="mt-1 text-sm text-fg-muted line-clamp-1">
            {ticket.customer.name} — {ticket.customer.email}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-fg-subtle font-medium">
              {ticket.comments_count} {ticket.comments_count === 1 ? "Task" : "Tasks"}
            </span>
            <span className="h-6 w-6 bg-brand/20 text-brand-glow border border-brand/30 shadow-[0_0_10px_rgba(77,107,254,0.3)] rounded-full text-[10px] font-bold flex items-center justify-center">
              {initials(ticket.customer.name)}
            </span>
            {ticket.assignee ? (
              <span className="text-[11px] text-fg-subtle font-medium">
                Assigned: {ticket.assignee}
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full ${progressColor} shadow-[0_0_10px_currentColor]`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-white font-medium tabular-nums w-10 text-right">
              {progress}%
            </span>
          </div>
        </div>

        <div className="sm:ml-4 shrink-0">
          <Link
            href={`/tickets/${ticket.id}`}
            className="inline-flex items-center text-brand-glow font-medium text-sm hover:text-white drop-shadow-sm transition-colors"
          >
            View ticket
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function StatusDot({ status }: { status: TicketListItem["status"] }) {
  const color =
    status === "in_progress" ? "bg-status-inProgressFg" :
    status === "on_hold"     ? "bg-status-overdueFg"    :
    status === "resolved" || status === "closed" ? "bg-status-doneFg" :
    "bg-status-todoFg";
  return <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${color} shadow-[0_0_8px_currentColor]`} />;
}
