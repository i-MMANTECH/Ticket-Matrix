// Emmanuel Aro's project submission for evaluation.
import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";

type Tone = "green" | "blue" | "purple" | "red";

const TILE_BG: Record<Tone, string> = {
  green:  "bg-tile-green/20 text-status-doneFg shadow-[0_0_10px_rgba(34,197,94,0.3)] border border-green-500/20",
  blue:   "bg-tile-blue/20 text-status-inProgressFg shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-blue-500/20",
  purple: "bg-tile-purple/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)] border border-purple-500/20",
  red:    "bg-tile-red/20 text-status-highFg shadow-[0_0_10px_rgba(239,68,68,0.3)] border border-red-500/20",
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
      <div className={`inline-flex items-center justify-center rounded-lg h-11 w-11 mb-4 ${TILE_BG[tone]}`}>
        {icon}
      </div>
      <p className="text-sm text-fg-muted font-medium">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-white drop-shadow-sm">
        {value}
      </p>
    </Card>
  );
}
