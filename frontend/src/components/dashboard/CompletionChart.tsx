// Emmanuel Aro's project submission for evaluation.
//
// Pure SVG bar chart. Highlights the month with the highest completion
// rate in brand green; all other bars stay neutral. No dependency on a
// chart library.

export function CompletionChart({
  data,
}: {
  data: { month: string; rate: number }[];
}) {
  const maxRate = Math.max(...data.map((d) => d.rate), 0);
  const peakIdx = data.findIndex((d) => d.rate === maxRate && maxRate > 0);

  const chartHeight = 220;
  const yLabels = [100, 75, 50, 25, 0];

  return (
    <div className="w-full">
      <div className="flex">
        <div className="flex flex-col justify-between pr-3 text-[11px] text-ink-400" style={{ height: chartHeight }}>
          {yLabels.map((y) => (
            <span key={y}>{y}%</span>
          ))}
        </div>

        <div className="flex-1 relative" style={{ height: chartHeight }}>
          {yLabels.map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-dashed border-ink-200"
              style={{ top: `${(i / (yLabels.length - 1)) * 100}%` }}
            />
          ))}

          <div className="relative h-full flex items-end gap-2 sm:gap-3">
            {data.map((bucket, i) => {
              const ratio = maxRate > 0 ? bucket.rate / 100 : 0;
              const heightPct = Math.max(ratio * 100, 2);
              const isPeak = i === peakIdx && maxRate > 0;
              return (
                <div
                  key={bucket.month}
                  className="flex-1 flex flex-col items-center justify-end h-full group"
                >
                  <div
                    className={`w-full transition-colors ${
                      isPeak ? "bg-brand" : "bg-ink-200 group-hover:bg-ink-300"
                    }`}
                    style={{ height: `${heightPct}%` }}
                    title={`${bucket.month}: ${bucket.rate.toFixed(0)}%`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex pl-10 mt-2">
        {data.map((bucket) => (
          <div key={bucket.month} className="flex-1 text-center text-[11px] text-ink-500">
            {bucket.month}
          </div>
        ))}
      </div>
    </div>
  );
}
