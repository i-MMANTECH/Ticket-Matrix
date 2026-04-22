// Emmanuel Aro's project submission for evaluation.
"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";

import { NewTicketModal } from "@/components/tickets/NewTicketModal";
import { TicketsTable } from "@/components/tickets/TicketsTable";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Field";
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
} from "@/lib/format";
import { api, type Paginated, type TicketListItem } from "@/lib/api";

export default function TicketsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (priorityFilter) params.set("priority", priorityFilter);
    if (search.trim()) params.set("search", search.trim());
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }, [statusFilter, priorityFilter, search]);

  const { data, isLoading, error } = useSWR<Paginated<TicketListItem>>(
    `/tickets/${queryString}`,
    api.fetcher,
  );

  return (
    <>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Inbox</CardTitle>
            <Button onClick={() => setShowModal(true)}>+ New ticket</Button>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject, reference, customer..."
                className="md:col-span-2 w-full bg-white border border-ink-200 px-3 py-2 text-sm focus:outline-none focus:border-ink-600"
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All statuses</option>
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All priorities</option>
                {Object.entries(PRIORITY_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            {error ? (
              <div className="border border-danger/40 bg-red-50 px-3 py-3 text-sm text-danger">
                Failed to load tickets. Is the backend running on
                <code className="mx-1 font-mono text-xs">:8000</code>?
              </div>
            ) : isLoading || !data ? (
              <div className="h-48 bg-ink-100 animate-pulse" />
            ) : (
              <TicketsTable tickets={data.results} />
            )}

            {data ? (
              <p className="text-xs text-ink-400">
                Showing {data.results.length} of {data.count} tickets
              </p>
            ) : null}
          </CardBody>
        </Card>
      </div>

      <NewTicketModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
