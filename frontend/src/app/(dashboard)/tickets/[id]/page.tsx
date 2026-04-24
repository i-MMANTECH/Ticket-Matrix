// Emmanuel Aro's project submission for evaluation.
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";

import { CommentComposer } from "@/components/tickets/CommentComposer";
import { StatusActions } from "@/components/tickets/StatusActions";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { api, type TicketDetail } from "@/lib/api";
import {
  CATEGORY_LABEL,
  PRIORITY_LABEL,
  PRIORITY_TONE,
  PROGRESS_BAR_COLOR,
  STATUS_LABEL,
  STATUS_TONE,
  formatDateTime,
  formatRelative,
  initials,
} from "@/lib/format";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useSWR<TicketDetail>(
    id ? `/tickets/${id}/` : null,
    api.fetcher,
  );

  if (error) {
    return (
      <Card>
        <CardBody>
          <p className="text-sm text-red-600">
            Could not load this ticket. It may have been deleted, or the API
            isn&apos;t reachable.
          </p>
          <Link
            href="/tickets"
            className="mt-3 inline-block text-xs uppercase tracking-widest text-brand-700 hover:underline"
          >
            ← Back to tickets
          </Link>
        </CardBody>
      </Card>
    );
  }

  if (isLoading || !data) {
    return <div className="h-64 bg-ink-100 animate-pulse" />;
  }

  const progress = Math.max(0, Math.min(100, data.progress ?? 0));

  return (
    <div className="space-y-5">
      <Link
        href="/tickets"
        className="text-xs uppercase tracking-widest text-ink-500 hover:text-ink-800"
      >
        ← Back to tickets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-ink-500">
                  {data.reference}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-ink-900">
                  {data.subject}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={PRIORITY_TONE[data.priority]}>
                  {PRIORITY_LABEL[data.priority]}
                </Badge>
                <Badge tone={STATUS_TONE[data.status]}>
                  {STATUS_LABEL[data.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardBody className="space-y-5">
              <p className="whitespace-pre-wrap text-sm leading-6 text-ink-700">
                {data.description}
              </p>

              <div>
                <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
                  <span>Progress</span>
                  <span className="font-medium text-ink-800">{progress}%</span>
                </div>
                <div className="h-1.5 bg-ink-100">
                  <div
                    className={`h-full ${PROGRESS_BAR_COLOR[data.status]}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Meta label="Category" value={CATEGORY_LABEL[data.category]} />
                <Meta label="Assignee" value={data.assignee || "Unassigned"} />
                <Meta label="Created" value={formatDateTime(data.created_at)} />
                <Meta label="Updated" value={formatRelative(data.updated_at)} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversation ({data.comments.length})</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              {data.comments.length === 0 ? (
                <p className="text-sm text-ink-400">
                  No comments yet. Add the first one below.
                </p>
              ) : (
                <ul className="space-y-3">
                  {data.comments.map((comment) => (
                    <li
                      key={comment.id}
                      className="flex gap-3 border border-line bg-canvas/40 p-4"
                    >
                      <div className="h-9 w-9 shrink-0 bg-ink-200 text-ink-700 text-[11px] font-semibold flex items-center justify-center">
                        {initials(comment.author_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-ink-900">
                            {comment.author_name}
                          </p>
                          <span className="text-[11px] uppercase tracking-widest text-ink-400">
                            {formatRelative(comment.created_at)}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm text-ink-700 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add a comment</CardTitle>
            </CardHeader>
            <CardBody>
              <CommentComposer ticketId={data.id} />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-ink-200 text-ink-700 text-sm font-semibold flex items-center justify-center">
                  {initials(data.customer.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-900 truncate">
                    {data.customer.name}
                  </p>
                  <p className="text-xs text-ink-500 truncate">
                    {data.customer.email}
                  </p>
                </div>
              </div>
              {data.customer.company ? (
                <Meta label="Company" value={data.customer.company} />
              ) : null}
              {data.customer.phone ? (
                <Meta label="Phone" value={data.customer.phone} />
              ) : null}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              <StatusActions ticketId={data.id} current={data.status} />
              <p className="text-[11px] uppercase tracking-widest text-ink-400">
                Status changes propagate to the dashboard and inbox.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-ink-400">
        {label}
      </p>
      <p className="mt-1 text-sm text-ink-700">{value}</p>
    </div>
  );
}
