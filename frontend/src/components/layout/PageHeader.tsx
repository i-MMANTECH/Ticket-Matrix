// Emmanuel Aro's project submission for evaluation.
import type { ReactNode } from "react";

import { formatDate } from "@/lib/format";

export function PageHeader({
  lastUpdated,
  right,
}: {
  lastUpdated?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="inline-flex items-center gap-2 bg-white border border-line px-3 py-1.5 text-xs text-ink-600">
        <CalendarIcon />
        <span>
          Last updated:{" "}
          <span className="font-medium text-ink-800">
            {lastUpdated ? formatDate(lastUpdated) : "—"}
          </span>
        </span>
        <RefreshIcon />
      </div>
      {right}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600">
      <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}
