// Emmanuel Aro's project submission for evaluation.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV } from "./nav";

export function Sidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-bg/80 border-r border-line sticky top-0 h-screen self-start z-30 glass-neo">
      <div className="px-6 py-6 border-b border-line">
        <Logo />
      </div>

      <p className="px-6 mt-4 text-[11px] uppercase tracking-widest text-fg-subtle font-semibold">
        Main Menu
      </p>

      <nav className="flex-1 px-4 mt-3 space-y-1.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname.startsWith("/dashboard")
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm tracking-wide transition-all rounded-lg ${
                active
                  ? "bg-brand/20 text-brand-glow shadow-[0_0_15px_rgba(77,107,254,0.3)] border border-brand/30"
                  : "text-fg-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={active ? "text-brand-glow" : "text-fg-subtle"} />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-line flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
        <div className="h-9 w-9 bg-brand/20 text-brand-glow border border-brand/30 rounded-full text-xs font-semibold flex items-center justify-center shadow-[0_0_10px_rgba(77,107,254,0.3)]">
          EA
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">Emmanuel Aro</p>
          <p className="text-[11px] text-fg-subtle truncate">Admin</p>
        </div>
        <ChevronRight className="text-fg-subtle" />
      </div>
    </aside>
  );
}

export function Logo() {
  return (
    <div className="flex flex-col gap-1.5 select-none group cursor-pointer">
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 transition-transform duration-300 group-hover:scale-110 animate-float-soft" style={{ filter: "drop-shadow(0 0 8px rgba(77,107,254,0.6))" }} aria-hidden="true">
          <defs>
            <linearGradient id="geod-mark" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0" stopColor="#4d6bfe"></stop>
              <stop offset="1" stopColor="#76e8ff"></stop>
            </linearGradient>
            <radialGradient id="geod-core" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#aeccff"></stop>
              <stop offset="1" stopColor="#4d6bfe"></stop>
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r="12" stroke="url(#geod-mark)" strokeWidth="1.8" fill="none"></circle>
          <ellipse cx="16" cy="16" rx="12" ry="4" stroke="url(#geod-mark)" strokeWidth="1.1" fill="none" opacity="0.75"></ellipse>
          <ellipse cx="16" cy="16" rx="4" ry="12" stroke="url(#geod-mark)" strokeWidth="1.1" fill="none" opacity="0.75" transform="rotate(-18 16 16)"></ellipse>
          <circle cx="16" cy="16" r="2.4" fill="url(#geod-core)"></circle>
        </svg>
        <div className="flex items-baseline">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-fg-muted bg-clip-text text-transparent">
            Geod
          </span>
          <span className="text-xl font-medium tracking-tight text-accent ml-1">
            Talk
          </span>
        </div>
      </div>
      <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-fg-subtle ml-9">
        A subsidiary of Geod
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
