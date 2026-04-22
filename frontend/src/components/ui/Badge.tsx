// Emmanuel Aro's project submission for evaluation.
import type { ReactNode } from "react";

export function Badge({
  tone,
  children,
}: {
  tone: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${tone}`}
    >
      {children}
    </span>
  );
}
