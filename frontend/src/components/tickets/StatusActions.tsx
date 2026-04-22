// Emmanuel Aro's project submission for evaluation.
"use client";

import { useState } from "react";
import { mutate } from "swr";

import { Select } from "@/components/ui/Field";
import { api, type TicketStatus } from "@/lib/api";
import { STATUS_LABEL } from "@/lib/format";

export function StatusActions({
  ticketId,
  current,
}: {
  ticketId: string;
  current: TicketStatus;
}) {
  const [value, setValue] = useState<TicketStatus>(current);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: TicketStatus) {
    setValue(next);
    setSaving(true);
    try {
      await api.updateTicket(ticketId, { status: next });
      await Promise.all([
        mutate(`/tickets/${ticketId}/`),
        mutate("/tickets/stats/"),
        mutate((key) => typeof key === "string" && key.startsWith("/tickets/")),
      ]);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-widest text-ink-400">
        Status
      </span>
      <Select
        value={value}
        disabled={saving}
        onChange={(e) => handleChange(e.target.value as TicketStatus)}
        className="h-8 py-1 text-xs"
      >
        {(Object.keys(STATUS_LABEL) as TicketStatus[]).map((key) => (
          <option key={key} value={key}>
            {STATUS_LABEL[key]}
          </option>
        ))}
      </Select>
    </div>
  );
}
