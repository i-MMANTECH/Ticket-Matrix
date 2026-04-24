// Emmanuel Aro's project submission for evaluation.
import type { CustomerTag } from "@/lib/api";

const META: Record<Exclude<CustomerTag, "">, { label: string; tone: string }> = {
  vip:      { label: "VIP Customer",     tone: "bg-purple-100 text-purple-700" },
  frequent: { label: "Frequent Buyer",   tone: "bg-blue-100 text-blue-700" },
  new:      { label: "New",              tone: "bg-amber-100 text-amber-700" },
};

export function TagBadge({ tag }: { tag: CustomerTag }) {
  if (!tag) return <span className="text-ink-300 text-xs">—</span>;
  const meta = META[tag];
  if (!meta) return null;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium ${meta.tone}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 inline-block bg-current opacity-80" />
      {meta.label}
    </span>
  );
}
