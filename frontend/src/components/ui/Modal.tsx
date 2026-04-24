// Emmanuel Aro's project submission for evaluation.
"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  icon,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-xl bg-white border border-line shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="text-base font-semibold text-ink-900">{title}</h3>
          </div>
          <div className="flex items-center gap-2 text-ink-400">
            <button
              aria-label="Expand"
              className="h-7 w-7 inline-flex items-center justify-center hover:bg-ink-100"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="h-7 w-7 inline-flex items-center justify-center hover:bg-ink-100"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-3 border-t border-line px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
