// Emmanuel Aro's project submission for evaluation.
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/lib/api";

export const STATUS_LABEL: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  on_hold: "On Hold",
  resolved: "Resolved",
  closed: "Closed",
};

export const PRIORITY_LABEL: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const CATEGORY_LABEL: Record<TicketCategory, string> = {
  technical: "Technical",
  billing: "Billing",
  account: "Account",
  feature_request: "Feature Request",
  general: "General",
};

export const STATUS_TONE: Record<TicketStatus, string> = {
  open: "bg-accent-soft text-accent border border-accent/30",
  in_progress: "bg-amber-50 text-amber-700 border border-amber-300/60",
  on_hold: "bg-ink-100 text-ink-600 border border-ink-200",
  resolved: "bg-emerald-50 text-emerald-700 border border-emerald-300/60",
  closed: "bg-ink-200 text-ink-700 border border-ink-300",
};

export const PRIORITY_TONE: Record<TicketPriority, string> = {
  low: "bg-ink-100 text-ink-600 border border-ink-200",
  medium: "bg-sky-50 text-sky-700 border border-sky-300/60",
  high: "bg-orange-50 text-orange-700 border border-orange-300/60",
  urgent: "bg-red-50 text-red-700 border border-red-300/60",
};

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDateTime(iso);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
