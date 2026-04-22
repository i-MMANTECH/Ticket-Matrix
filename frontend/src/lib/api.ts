// Emmanuel Aro's project submission for evaluation.
//
// Thin typed client over the Django REST API. Centralised so that swapping
// transports or adding auth later is a one-file change.

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export type TicketStatus =
  | "open"
  | "in_progress"
  | "on_hold"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketCategory =
  | "technical"
  | "billing"
  | "account"
  | "feature_request"
  | "general";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  ticket: string;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
}

export interface TicketListItem {
  id: string;
  reference: string;
  customer: Customer;
  subject: string;
  priority: TicketPriority;
  category: TicketCategory;
  status: TicketStatus;
  assignee: string;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface TicketDetail extends TicketListItem {
  description: string;
  comments: Comment[];
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TicketStats {
  total: number;
  completed: number;
  completion_rate: number;
  by_status: Record<TicketStatus, number>;
  by_priority: { priority: TicketPriority; count: number }[];
  by_category: { category: TicketCategory; count: number }[];
}

export interface NewTicketPayload {
  subject: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  status?: TicketStatus;
  assignee?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let detail: unknown = null;
    try {
      detail = await response.json();
    } catch {
      /* response had no JSON body */
    }
    const message =
      typeof detail === "object" && detail !== null
        ? JSON.stringify(detail)
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export const api = {
  fetcher: <T,>(path: string) => request<T>(path),

  listTickets: (params?: Record<string, string>) => {
    const search = params ? `?${new URLSearchParams(params).toString()}` : "";
    return request<Paginated<TicketListItem>>(`/tickets/${search}`);
  },

  getTicket: (id: string) => request<TicketDetail>(`/tickets/${id}/`),

  createTicket: (payload: NewTicketPayload) =>
    request<TicketDetail>("/tickets/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateTicket: (id: string, payload: Partial<NewTicketPayload>) =>
    request<TicketDetail>(`/tickets/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteTicket: (id: string) =>
    request<void>(`/tickets/${id}/`, { method: "DELETE" }),

  addComment: (
    ticketId: string,
    payload: { author_name: string; author_email?: string; content: string },
  ) =>
    request<Comment>(`/tickets/${ticketId}/comments/`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  stats: () => request<TicketStats>("/tickets/stats/"),

  listCustomers: () => request<Paginated<Customer>>("/customers/"),
};
