// Emmanuel Aro's project submission for evaluation.
"use client";

import Link from "next/link";
import useSWR from "swr";

import { CompletionGauge } from "@/components/dashboard/CompletionGauge";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusBreakdown } from "@/components/dashboard/StatusBreakdown";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { api, type Paginated, type TicketListItem, type TicketStats } from "@/lib/api";
import { PRIORITY_TONE, STATUS_TONE, formatRelative, PRIORITY_LABEL, STATUS_LABEL } from "@/lib/format";

export default function DashboardPage() {
  const { data: stats, error: statsError } = useSWR<TicketStats>(
    "/tickets/stats/",
    api.fetcher,
  );
  const { data: recent } = useSWR<Paginated<TicketListItem>>(
    "/tickets/?ordering=-created_at",
    api.fetcher,
  );

  const totals = stats?.total ?? 0;
  const open = stats?.by_status.open ?? 0;
  const inProgress = stats?.by_status.in_progress ?? 0;
  const resolved = (stats?.by_status.resolved ?? 0) + (stats?.by_status.closed ?? 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total tickets" value={totals} delta="All time" />
        <MetricCard
          label="Open"
          value={open}
          delta="Awaiting first response"
          tone="warning"
        />
        <MetricCard
          label="In progress"
          value={inProgress}
          delta="Being worked on"
        />
        <MetricCard
          label="Resolved"
          value={resolved}
          delta="Closed or marked resolved"
          tone="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Tickets Completion Rate</CardTitle>
            <span className="text-[11px] uppercase tracking-widest text-ink-400">
              Live
            </span>
          </CardHeader>
          <CardBody>
            {statsError ? (
              <ApiError />
            ) : stats ? (
              <CompletionGauge
                rate={stats.completion_rate}
                completed={stats.completed}
                total={stats.total}
              />
            ) : (
              <Skeleton className="h-40" />
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
            <Link
              href="/tickets"
              className="text-xs uppercase tracking-widest text-accent hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardBody>
            {stats ? (
              <StatusBreakdown
                byStatus={stats.by_status}
                total={stats.total || 1}
              />
            ) : (
              <Skeleton className="h-40" />
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
          <Link href="/tickets">
            <Button variant="secondary" size="sm">
              Open ticket inbox
            </Button>
          </Link>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-canvas border-b border-line">
                <tr className="text-left text-[11px] uppercase tracking-widest text-ink-500">
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  <th className="px-5 py-3 font-semibold">Subject</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Priority</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Updated</th>
                </tr>
              </thead>
              <tbody>
                {recent?.results.slice(0, 6).map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-line last:border-b-0 hover:bg-canvas/60"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-ink-600">
                      <Link href={`/tickets/${t.id}`} className="hover:text-accent">
                        {t.reference}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-ink">
                      <Link href={`/tickets/${t.id}`} className="hover:underline">
                        {t.subject}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-ink-600">{t.customer.name}</td>
                    <td className="px-5 py-3">
                      <Badge tone={PRIORITY_TONE[t.priority]}>
                        {PRIORITY_LABEL[t.priority]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={STATUS_TONE[t.status]}>
                        {STATUS_LABEL[t.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-ink-500 text-xs">
                      {formatRelative(t.updated_at)}
                    </td>
                  </tr>
                ))}
                {recent && recent.results.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-ink-400">
                      No tickets yet. Create your first one from the inbox.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-ink-100 animate-pulse ${className}`} />;
}

function ApiError() {
  return (
    <div className="text-sm text-danger">
      Could not reach the API. Confirm the Django container is running on
      <code className="ml-1 font-mono text-xs bg-ink-100 px-1 py-0.5">
        :8000
      </code>
      .
    </div>
  );
}
