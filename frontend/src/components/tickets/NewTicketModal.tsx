// Emmanuel Aro's project submission for evaluation.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { api, type NewTicketPayload } from "@/lib/api";
import {
  CATEGORY_LABEL,
  PRIORITY_LABEL,
} from "@/lib/format";

const EMPTY: NewTicketPayload = {
  subject: "",
  description: "",
  priority: "medium",
  category: "general",
  status: "open",
  assignee: "",
  customer_name: "",
  customer_email: "",
};

export function NewTicketModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<NewTicketPayload>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof NewTicketPayload>(
    key: K,
    value: NewTicketPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.customer_name?.trim()) {
      setError("Customer name is required.");
      return;
    }
    if (!form.subject.trim() || !form.description.trim()) {
      setError("Subject and description are required.");
      return;
    }

    // Synthesize an email from the name when none provided so the inline
    // customer flow works with just the name field shown in the design.
    const synthesizedEmail =
      form.customer_email?.trim() ||
      `${form.customer_name.trim().toLowerCase().replace(/\s+/g, ".")}@nativetalk.test`;

    setSubmitting(true);
    try {
      const created = await api.createTicket({
        ...form,
        customer_email: synthesizedEmail,
      });
      await Promise.all([
        mutate((key) => typeof key === "string" && key.startsWith("/tickets/")),
        mutate("/tickets/stats/"),
        mutate((key) => typeof key === "string" && key.startsWith("/customers/")),
      ]);
      setForm(EMPTY);
      onClose();
      router.push(`/tickets/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ticket.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Ticket"
      icon={<TicketGlyph />}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="new-ticket-form" disabled={submitting}>
            {submitting ? "Creating..." : "Create Ticket"}
          </Button>
        </>
      }
    >
      <form id="new-ticket-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="customer_name">Customer Name</Label>
          <Input
            id="customer_name"
            placeholder="Joseph Olorunmeyan"
            value={form.customer_name}
            onChange={(e) => update("customer_name", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Brief description of the issue"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              id="priority"
              value={form.priority}
              onChange={(e) =>
                update("priority", e.target.value as NewTicketPayload["priority"])
              }
            >
              {(Object.keys(PRIORITY_LABEL) as (keyof typeof PRIORITY_LABEL)[]).map(
                (key) => (
                  <option key={key} value={key}>
                    {PRIORITY_LABEL[key]}
                  </option>
                ),
              )}
            </Select>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              value={form.category}
              onChange={(e) =>
                update("category", e.target.value as NewTicketPayload["category"])
              }
            >
              {(Object.keys(CATEGORY_LABEL) as (keyof typeof CATEGORY_LABEL)[]).map(
                (key) => (
                  <option key={key} value={key}>
                    {CATEGORY_LABEL[key]}
                  </option>
                ),
              )}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="assignee">Assign To (Optional)</Label>
          <Input
            id="assignee"
            placeholder="Team or person responsible"
            value={form.assignee}
            onChange={(e) => update("assignee", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Monthly Product Discussion by Design and Marketing Teams with CEO to plan our future products sales and reports"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            required
          />
        </div>

        {error ? (
          <div className="border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        ) : null}
      </form>
    </Modal>
  );
}

function TicketGlyph() {
  return (
    <span className="inline-flex items-center justify-center h-7 w-7 bg-tile-purple text-purple-700">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" />
        <path d="M9 9h6v6H9z" />
      </svg>
    </span>
  );
}
