// Emmanuel Aro's project submission for evaluation.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tickets", label: "Tickets" },
  { href: "/tickets?filter=open", label: "Open Tickets" },
  { href: "/tickets?filter=resolved", label: "Resolved" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-ink text-ink-100 border-r border-ink-700">
      <div className="px-5 py-5 border-b border-ink-700">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-accent flex items-center justify-center text-white font-bold tracking-tight">
            N
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">Nativetalk</p>
            <p className="text-[10px] uppercase tracking-widest text-ink-300">
              Ticketing
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {NAV.map((item) => {
          const active =
            pathname === item.href.split("?")[0] ||
            (item.href === "/tickets" && pathname?.startsWith("/tickets"));
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`block px-3 py-2 text-sm tracking-wide ${
                active
                  ? "bg-ink-700 text-white border-l-2 border-accent"
                  : "text-ink-200 hover:bg-ink-700/60 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-ink-700 text-[11px] uppercase tracking-widest text-ink-300">
        v0.1 · MVP
      </div>
    </aside>
  );
}
