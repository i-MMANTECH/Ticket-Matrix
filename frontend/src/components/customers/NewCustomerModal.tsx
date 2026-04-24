// Emmanuel Aro's project submission for evaluation.
"use client";

import { useState } from "react";
import { mutate } from "swr";

import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { api, type NewCustomerPayload } from "@/lib/api";

const EMPTY: NewCustomerPayload = {
  name: "",
  email: "",
  phone: "",
  company: "",
  tag: "",
  channels: [],
};

const ALL_CHANNELS: NonNullable<NewCustomerPayload["channels"]> = [
  "instagram",
  "facebook",
  "whatsapp",
  "email",
  "sms",
];

export function NewCustomerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<NewCustomerPayload>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof NewCustomerPayload>(
    key: K,
    value: NewCustomerPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleChannel(channel: NonNullable<NewCustomerPayload["channels"]>[number]) {
    setForm((prev) => {
      const set = new Set(prev.channels ?? []);
      set.has(channel) ? set.delete(channel) : set.add(channel);
      return { ...prev, channels: Array.from(set) };
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError("Customer name and email are required.");
      return;
    }

    setSubmitting(true);
    try {
      await api.createCustomer(form);
      await mutate((key) => typeof key === "string" && key.startsWith("/customers/"));
      setForm(EMPTY);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create customer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Customer"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="new-customer-form" disabled={submitting}>
            {submitting ? "Creating..." : "Create Customer"}
          </Button>
        </>
      }
    >
      <form id="new-customer-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cust-name" required>Customer Name</Label>
            <Input
              id="cust-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Ogechi Arinze"
              required
            />
          </div>
          <div>
            <Label htmlFor="cust-email" required>Email</Label>
            <Input
              id="cust-email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="customer@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="cust-phone">Phone</Label>
            <Input
              id="cust-phone"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+234 000 000 0000"
            />
          </div>
          <div>
            <Label htmlFor="cust-company">Company</Label>
            <Input
              id="cust-company"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              placeholder="Company name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cust-tag">Tag</Label>
          <Select
            id="cust-tag"
            value={form.tag ?? ""}
            onChange={(e) => update("tag", e.target.value as NewCustomerPayload["tag"])}
          >
            <option value="">No tag</option>
            <option value="vip">VIP Customer</option>
            <option value="frequent">Frequent Buyer</option>
            <option value="new">New</option>
          </Select>
        </div>

        <div>
          <Label>Channels</Label>
          <div className="flex flex-wrap gap-2">
            {ALL_CHANNELS.map((channel) => {
              const active = form.channels?.includes(channel);
              return (
                <button
                  type="button"
                  key={channel}
                  onClick={() => toggleChannel(channel)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider border ${
                    active
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-ink-600 border-ink-200 hover:border-ink-400"
                  }`}
                >
                  {channel}
                </button>
              );
            })}
          </div>
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
