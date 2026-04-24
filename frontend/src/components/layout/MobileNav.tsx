// Emmanuel Aro's project submission for evaluation.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "./Sidebar";
import { NAV } from "./nav";

/**
 * Hamburger button + slide-in drawer for mobile and tablet.
 * Hidden at lg+ where the desktop Sidebar takes over.
 */
export function MobileNav() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  // Close drawer whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while open + close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center justify-center h-9 w-9 text-ink-700 hover:bg-ink-100"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {open ? (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-ink-900/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="relative h-full w-72 max-w-[85vw] bg-white border-r border-line flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="h-8 w-8 inline-flex items-center justify-center text-ink-500 hover:bg-ink-100"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="px-5 mt-3 text-[11px] uppercase tracking-widest text-ink-400">
              Main Menu
            </p>

            <nav className="flex-1 px-3 mt-2 space-y-1">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/dashboard"
                    ? pathname.startsWith("/dashboard")
                    : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm tracking-wide ${
                      active
                        ? "bg-brand-50 text-brand-700 border-l-2 border-brand"
                        : "text-ink-600 hover:bg-ink-50"
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
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
