// Emmanuel Aro's project submission for evaluation.
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/lib/api";

export const STATUS_LABEL: Record<TicketStatus, string> = {
  open: "To do",
  in_progress: "In Progress",
  on_hold: "Overdue",
  resolved: "Done",
  closed: "Done",
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

// Tones map to Figma chip backgrounds + foregrounds
export const STATUS_TONE: Record<TicketStatus, string> = {
  open:        "bg-status-todoBg text-status-todoFg",
  in_progress: "bg-status-inProgressBg text-status-inProgressFg",
  on_hold:     "bg-status-overdueBg text-status-overdueFg",
  resolved:    "bg-status-doneBg text-status-doneFg",
  closed:      "bg-status-doneBg text-status-doneFg",
};

export const PRIORITY_TONE: Record<TicketPriority, string> = {
  low:    "bg-status-lowBg text-status-lowFg",
  medium: "bg-status-mediumBg text-status-mediumFg",
  high:   "bg-status-highBg text-status-highFg",
  urgent: "bg-status-highBg text-status-highFg",
};

// Progress bar colors mirror status tone (orange in-progress / overdue, green done, gray todo)
export const PROGRESS_BAR_COLOR: Record<TicketStatus, string> = {
  open:        "bg-ink-300",
  in_progress: "bg-amber-500",
  on_hold:     "bg-orange-500",
  resolved:    "bg-brand",
  closed:      "bg-brand",
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

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
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
