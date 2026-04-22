// Emmanuel Aro's project submission for evaluation.
import { Card } from "@/components/ui/Card";

export function MetricCard({
  label,
  value,
  delta,
  tone = "neutral",
}: {
  label: string;
  value: number | string;
  delta?: string;
  tone?: "neutral" | "positive" | "warning" | "danger";
}) {
  const accent =
    tone === "positive"
      ? "border-l-2 border-success"
      : tone === "warning"
        ? "border-l-2 border-warning"
        : tone === "danger"
          ? "border-l-2 border-danger"
          : "border-l-2 border-ink";

  return (
    <Card className={`flex flex-col justify-between ${accent}`}>
      <div className="px-5 pt-4">
        <p className="text-[11px] uppercase tracking-widest text-ink-400">
          {label}
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">
          {value}
        </p>
      </div>
      <div className="px-5 pb-4 pt-3 text-xs text-ink-500">
        {delta ?? <span className="text-ink-300">No change reported</span>}
      </div>
    </Card>
  );
}
