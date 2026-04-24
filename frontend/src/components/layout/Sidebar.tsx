// Emmanuel Aro's project submission for evaluation.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/tickets",   label: "Tickets", icon: TicketIcon },
  { href: "/customers", label: "Customers", icon: UsersIcon },
];

export function Sidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-line">
      <div className="px-6 py-5">
        <Logo />
      </div>

      <p className="px-6 mt-2 text-[11px] uppercase tracking-widest text-ink-400">
        Main Menu
      </p>

      <nav className="flex-1 px-3 mt-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname.startsWith("/dashboard")
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm tracking-wide transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700 border-l-2 border-brand"
                  : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
              }`}
            >
              <Icon className={active ? "text-brand-600" : "text-ink-400"} />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-line flex items-center gap-3">
        <div className="h-9 w-9 bg-ink-200 text-ink-700 text-xs font-semibold flex items-center justify-center">
          EA
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink-900 truncate">Emmanuel Aro</p>
          <p className="text-[11px] text-ink-400 truncate">Admin</p>
        </div>
        <ChevronRight className="text-ink-400" />
      </div>
    </aside>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-1 select-none">
      <span className="text-[22px] font-semibold tracking-tight text-[#1F4DB8]">
        native
      </span>
      <span className="bg-brand text-white text-[14px] font-semibold px-2.5 py-1 leading-none">
        talk
      </span>
    </div>
  );
}

/* ---- Icons (inline SVG, no external deps) ---- */
function HomeIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2V11z" />
    </svg>
  );
}
function TicketIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v2a2 2 0 0 0 0 4v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-2a2 2 0 0 0 0-4V9z" />
      <path d="M9 6v12" />
    </svg>
  );
}
function UsersIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
