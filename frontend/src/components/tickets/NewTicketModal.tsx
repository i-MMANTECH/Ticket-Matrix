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
  STATUS_LABEL,
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

    if (!form.subject.trim() || !form.description.trim()) {
      setError("Subject and description are required.");
      return;
    }
    if (!form.customer_name?.trim() || !form.customer_email?.trim()) {
      setError("Customer name and email are required.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await api.createTicket(form);
      await Promise.all([
        mutate((key) => typeof key === "string" && key.startsWith("/tickets/")),
        mutate("/tickets/stats/"),
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
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="new-ticket-form"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create ticket"}
          </Button>
        </>
      }
    >
      <form
        id="new-ticket-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="subject" required>
            Subject
          </Label>
          <Input
            id="subject"
            placeholder="Briefly describe the issue"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="description" required>
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Steps to reproduce, expected vs actual behaviour, screenshots..."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customer_name" required>
              Customer name
            </Label>
            <Input
              id="customer_name"
              placeholder="e.g. Adaeze Okafor"
              value={form.customer_name}
              onChange={(e) => update("customer_name", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="customer_email" required>
              Customer email
            </Label>
            <Input
              id="customer_email"
              type="email"
              placeholder="customer@example.com"
              value={form.customer_email}
              onChange={(e) => update("customer_email", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={form.status}
              onChange={(e) =>
                update("status", e.target.value as NewTicketPayload["status"])
              }
            >
              {(Object.keys(STATUS_LABEL) as (keyof typeof STATUS_LABEL)[]).map(
                (key) => (
                  <option key={key} value={key}>
                    {STATUS_LABEL[key]}
                  </option>
                ),
              )}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="assignee">Assignee (optional)</Label>
          <Input
            id="assignee"
            placeholder="Team or person responsible"
            value={form.assignee}
            onChange={(e) => update("assignee", e.target.value)}
          />
        </div>

        {error ? (
          <div className="border border-danger/40 bg-red-50 px-3 py-2 text-xs text-danger">
            {error}
          </div>
        ) : null}
      </form>
    </Modal>
  );
}
