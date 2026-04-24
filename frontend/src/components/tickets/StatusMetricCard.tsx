// Emmanuel Aro's project submission for evaluation.
import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";

type Tone = "red" | "blue" | "green";

const TILE: Record<Tone, string> = {
  red:   "bg-tile-red text-red-600",
  blue:  "bg-tile-blue text-status-inProgressFg",
  green: "bg-tile-green text-brand-700",
};

export function StatusMetricCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number | string;
  tone: Tone;
  icon: ReactNode;
}) {
  return (
    <Card className="px-5 py-4 flex items-start gap-3">
      <div className={`inline-flex items-center justify-center h-10 w-10 ${TILE[tone]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-ink-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-900">
          {value}
        </p>
      </div>
    </Card>
  );
}
