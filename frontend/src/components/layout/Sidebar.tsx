// Emmanuel Aro's project submission for evaluation.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV } from "./nav";

export function Sidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-line sticky top-0 h-screen self-start z-30">
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

export function Logo() {
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

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
