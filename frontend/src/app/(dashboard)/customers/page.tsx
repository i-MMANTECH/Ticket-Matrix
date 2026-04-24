// Emmanuel Aro's project submission for evaluation.
"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";

import { ChannelIcons } from "@/components/customers/ChannelIcons";
import { NewCustomerModal } from "@/components/customers/NewCustomerModal";
import { TagBadge } from "@/components/customers/TagBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { api, type Customer, type Paginated } from "@/lib/api";
import { initials } from "@/lib/format";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }, [search]);

  const { data, isLoading, error } = useSWR<Paginated<Customer>>(
    `/customers/${queryString}`,
    api.fetcher,
  );

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="relative w-full max-w-md">
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
          <Button onClick={() => setShowModal(true)}>
            <PlusIcon /> New Customer
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-line">
                <tr className="text-left text-[12px] text-ink-500">
                  <th className="px-5 py-3 font-medium">
                    <span className="inline-flex items-center gap-2">
                      <CheckboxIcon /> Customer Name
                    </span>
                  </th>
                  <th className="px-5 py-3 font-medium">
                    <span className="inline-flex items-center gap-1.5"><MailIcon /> Email</span>
                  </th>
                  <th className="px-5 py-3 font-medium">
                    <span className="inline-flex items-center gap-1.5"><PhoneIcon /> Phone</span>
                  </th>
                  <th className="px-5 py-3 font-medium">
                    <span className="inline-flex items-center gap-1.5"><LinkIcon /> Channel</span>
                  </th>
                  <th className="px-5 py-3 font-medium">
                    <span className="inline-flex items-center gap-1.5"><TagIcon /> Tag</span>
                  </th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-red-600 text-sm">
                      Failed to load customers. Confirm the API is running.
                    </td>
                  </tr>
                ) : isLoading || !data ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10">
                      <div className="h-24 bg-ink-100 animate-pulse" />
                    </td>
                  </tr>
                ) : data.results.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-ink-400 text-sm">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  data.results.map((customer) => (
                    <tr key={customer.id} className="border-b border-line last:border-b-0 hover:bg-ink-50/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="h-4 w-4 accent-brand border border-ink-300" />
                          <div className="h-8 w-8 bg-ink-200 text-ink-700 text-[11px] font-semibold flex items-center justify-center">
                            {initials(customer.name)}
                          </div>
                          <span className="text-ink-800">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-600">{customer.email}</td>
                      <td className="px-5 py-3 text-ink-600">{customer.phone || "—"}</td>
                      <td className="px-5 py-3"><ChannelIcons channels={customer.channels} /></td>
                      <td className="px-5 py-3"><TagBadge tag={customer.tag} /></td>
                      <td className="px-5 py-3 text-right text-ink-400">
                        <button className="hover:text-ink-700" aria-label="Customer actions">⋯</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {data ? (
            <div className="flex items-center justify-between px-5 py-3 border-t border-line text-xs text-ink-500">
              <span>
                Showing {data.results.length} of {data.count} entries
              </span>
              <div className="inline-flex items-center gap-1">
                <PageButton disabled>&larr;</PageButton>
                <PageButton active>1</PageButton>
                <PageButton disabled>&rarr;</PageButton>
              </div>
            </div>
          ) : null}
        </Card>
      </div>

      <NewCustomerModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

function PageButton({
  children,
  active,
  disabled,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={`h-7 min-w-[28px] px-2 text-xs border ${
        active
          ? "bg-brand text-white border-brand"
          : disabled
            ? "bg-white text-ink-300 border-line"
            : "bg-white text-ink-600 border-line hover:border-ink-300"
      }`}
    >
      {children}
    </button>
  );
}

/* Header icons */
function SearchIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>; }
function PlusIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>; }
function MailIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="m22 6-10 7L2 6" /></svg>; }
function PhoneIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>; }
function LinkIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>; }
function TagIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.6-7.6V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><path d="M7 7h.01" /></svg>; }
function CheckboxIcon() { return <span className="inline-block h-3.5 w-3.5 border border-ink-300 bg-white" />; }
