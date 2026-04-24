// Emmanuel Aro's project submission for evaluation.
import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";

type Tone = "green" | "blue" | "purple" | "red";

const TILE_BG: Record<Tone, string> = {
  green:  "bg-tile-green text-brand-700",
  blue:   "bg-tile-blue text-status-inProgressFg",
  purple: "bg-tile-purple text-purple-700",
  red:    "bg-tile-red text-red-700",
};

export function MetricCard({
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
    <Card className="px-5 py-5">
      <div className={`inline-flex items-center justify-center h-11 w-11 mb-4 ${TILE_BG[tone]}`}>
        {icon}
      </div>
      <p className="text-sm text-ink-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-ink-900">
        {value}
      </p>
    </Card>
  );
}
