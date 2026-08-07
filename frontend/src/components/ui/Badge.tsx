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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${tone}`}
    >
      {children}
    </span>
  );
}
