// Emmanuel Aro's project submission for evaluation.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import { CompletionChart } from "@/components/dashboard/CompletionChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { NewTicketModal } from "@/components/tickets/NewTicketModal";
import { NewCustomerModal } from "@/components/customers/NewCustomerModal";
import {
  api,
  type Paginated,
  type TicketListItem,
  type TicketStats,
  type Customer,
} from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const { data: stats, error } = useSWR<TicketStats>(
    "/tickets/stats/",
    api.fetcher,
  );
  const { data: customers } = useSWR<Paginated<Customer>>(
    "/customers/",
    api.fetcher,
  );
  const { data: recent } = useSWR<Paginated<TicketListItem>>(
    "/tickets/?ordering=-created_at",
    api.fetcher,
  );

  const commentsTotal =
    recent?.results.reduce((sum, t) => sum + (t.comments_count ?? 0), 0) ?? 0;

  return (
    <>
      <div className="space-y-5">
        <PageHeader
          lastUpdated={recent?.results[0]?.updated_at}
          right={
            <Button variant="secondary" size="sm">
              <FilterIcon /> Filter
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard label="Comments" value={commentsTotal} tone="green" icon={<ChatIcon />} />
          <MetricCard label="Customers" value={customers?.count ?? 0} tone="blue" icon={<PeopleIcon />} />
          <MetricCard label="Tickets" value={stats?.total ?? 0} tone="purple" icon={<TicketSquareIcon />} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tickets Completion Rate</CardTitle>
          </CardHeader>
          <CardBody>
            {error ? (
              <ApiError />
            ) : stats ? (
              <CompletionChart data={stats.monthly_completion} />
            ) : (
              <div className="h-56 bg-ink-100 animate-pulse" />
            )}
          </CardBody>
        </Card>

        <QuickActions
          actions={[
            {
              label: "Create New Customer",
              tone: "blue",
              icon: <PeopleIcon />,
              onClick: () => setShowCustomerModal(true),
            },
            {
              label: "Create New Ticket",
              tone: "purple",
              icon: <TicketSquareIcon />,
              onClick: () => setShowTicketModal(true),
            },
            {
              label: "View All Tickets",
              tone: "green",
              icon: <ListIcon />,
              onClick: () => router.push("/tickets"),
            },
          ]}
        />
      </div>

      <NewTicketModal open={showTicketModal} onClose={() => setShowTicketModal(false)} />
      <NewCustomerModal open={showCustomerModal} onClose={() => setShowCustomerModal(false)} />
    </>
  );
}

function ApiError() {
  return (
    <div className="text-sm text-red-600">
      Could not reach the API. Confirm the Django container is running on
      <code className="ml-1 font-mono text-xs bg-ink-100 px-1 py-0.5">:8000</code>
      .
    </div>
  );
}

/* Icons */
function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function TicketSquareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" />
      <path d="M9 9h6v6H9z" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}
