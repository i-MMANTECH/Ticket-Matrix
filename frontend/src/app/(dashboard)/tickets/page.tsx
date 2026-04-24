// Emmanuel Aro's project submission for evaluation.
"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";

import { PageHeader } from "@/components/layout/PageHeader";
import { NewTicketModal } from "@/components/tickets/NewTicketModal";
import { StatusMetricCard } from "@/components/tickets/StatusMetricCard";
import { TicketCard } from "@/components/tickets/TicketCard";
import { Button } from "@/components/ui/Button";
import {
  api,
  type Paginated,
  type TicketListItem,
  type TicketStats,
} from "@/lib/api";

export default function TicketsPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    params.set("ordering", "-created_at");
    return `?${params.toString()}`;
  }, [search]);

  const { data, isLoading, error } = useSWR<Paginated<TicketListItem>>(
    `/tickets/${queryString}`,
    api.fetcher,
  );
  const { data: stats } = useSWR<TicketStats>("/tickets/stats/", api.fetcher);

  const notStarted = stats?.by_status.open ?? 0;
  const inProgress = stats?.by_status.in_progress ?? 0;
  const completed =
    (stats?.by_status.resolved ?? 0) + (stats?.by_status.closed ?? 0);

  return (
    <>
      <div className="space-y-5">
        <PageHeader
          lastUpdated={data?.results[0]?.updated_at}
          right={
            <Button onClick={() => setShowModal(true)}>
              <PlusIcon /> New Ticket
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatusMetricCard label="Not Started" value={notStarted} tone="red"   icon={<NotStartedIcon />} />
          <StatusMetricCard label="In Progress" value={inProgress} tone="blue"  icon={<InProgressIcon />} />
          <StatusMetricCard label="Completed"   value={completed}  tone="green" icon={<CompletedIcon />} />
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-3 inline-flex items-center text-ink-400">
              <SearchIcon />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full bg-white border border-line pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-ink-400"
            />
          </div>
          <Button variant="primary">
            <ExportIcon /> Export
          </Button>
        </div>

        {error ? (
          <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            Failed to load tickets. Confirm the backend is running on
            <code className="mx-1 font-mono text-xs">:8000</code>.
          </div>
        ) : isLoading || !data ? (
          <div className="space-y-3">
            <div className="h-28 bg-ink-100 animate-pulse" />
            <div className="h-28 bg-ink-100 animate-pulse" />
            <div className="h-28 bg-ink-100 animate-pulse" />
          </div>
        ) : data.results.length === 0 ? (
          <div className="border border-dashed border-ink-200 bg-white px-6 py-16 text-center text-sm text-ink-400">
            No tickets match your search.
          </div>
        ) : (
          <div className="space-y-3">
            {data.results.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>

      <NewTicketModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

/* Icons */
function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>; }
function SearchIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>; }
function ExportIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>; }
function NotStartedIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" /><path d="M9 9l6 6M15 9l-6 6" /></svg>; }
function InProgressIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" /><path d="M9 12h6" /></svg>; }
function CompletedIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" /><path d="m9 12 2 2 4-4" /></svg>; }
