// Emmanuel Aro's project submission for evaluation.
"use client";

import { usePathname } from "next/navigation";

const TITLES: { match: RegExp; title: string }[] = [
  { match: /^\/dashboard/, title: "Dashboard" },
  { match: /^\/tickets\/[^/]+$/, title: "Ticket Detail" },
  { match: /^\/tickets/, title: "Tickets" },
  { match: /^\/customers/, title: "Customers" },
];

export function Topbar() {
  const pathname = usePathname() ?? "/";
  const meta = TITLES.find((entry) => entry.match.test(pathname)) ?? TITLES[0];

  return (
    <header className="bg-white border-b border-line">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-ink-900 tracking-tight">
          {meta.title}
        </h1>

        <button
          aria-label="Notifications"
          className="relative h-9 w-9 inline-flex items-center justify-center text-ink-500 hover:bg-ink-50"
        >
          <BellIcon />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-brand" />
        </button>
      </div>
    </header>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
