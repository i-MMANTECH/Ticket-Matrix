// Emmanuel Aro's project submission for evaluation.
"use client";

import { usePathname } from "next/navigation";

const TITLES: { match: RegExp; title: string; subtitle: string }[] = [
  { match: /^\/dashboard/, title: "Dashboard", subtitle: "Operational overview" },
  {
    match: /^\/tickets\/[^/]+$/,
    title: "Ticket Detail",
    subtitle: "Conversation, status, and metadata",
  },
  { match: /^\/tickets/, title: "Tickets", subtitle: "Inbox and triage" },
];

export function Topbar() {
  const pathname = usePathname() ?? "/";
  const meta =
    TITLES.find((entry) => entry.match.test(pathname)) ?? TITLES[0];

  return (
    <header className="bg-white border-b border-line">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-ink tracking-tight">
            {meta.title}
          </h1>
          <p className="text-xs text-ink-400 uppercase tracking-widest">
            {meta.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-canvas border border-line px-3 py-2 w-72">
            <svg
              className="h-4 w-4 text-ink-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Search tickets, customers..."
              className="bg-transparent text-sm flex-1 focus:outline-none placeholder:text-ink-400"
            />
          </div>
          <div className="h-9 w-9 bg-ink text-white flex items-center justify-center text-sm font-semibold">
            EA
          </div>
        </div>
      </div>
    </header>
  );
}
