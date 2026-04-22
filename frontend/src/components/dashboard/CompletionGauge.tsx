// Emmanuel Aro's project submission for evaluation.
//
// SVG semicircle gauge: dependency-free, scales cleanly, honours the
// "no border-radius" rule by drawing the track with butt line caps.

export function CompletionGauge({
  rate,
  completed,
  total,
}: {
  rate: number;
  completed: number;
  total: number;
}) {
  const clamped = Math.max(0, Math.min(100, rate));
  const radius = 80;
  const circumference = Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-2">
      <svg viewBox="0 0 200 110" className="w-full max-w-xs">
        <path
          d={`M 20 100 A ${radius} ${radius} 0 0 1 180 100`}
          stroke="#E5E7EB"
          strokeWidth={14}
          fill="none"
          strokeLinecap="butt"
        />
        <path
          d={`M 20 100 A ${radius} ${radius} 0 0 1 180 100`}
          stroke="#1F6FEB"
          strokeWidth={14}
          fill="none"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms ease-out" }}
        />
        <text
          x="100"
          y="86"
          textAnchor="middle"
          className="fill-ink"
          fontSize="28"
          fontWeight="600"
        >
          {clamped.toFixed(0)}%
        </text>
        <text
          x="100"
          y="104"
          textAnchor="middle"
          className="fill-ink-400"
          fontSize="10"
          letterSpacing="2"
        >
          COMPLETION RATE
        </text>
      </svg>
      <div className="flex items-center gap-6 text-xs uppercase tracking-widest text-ink-500">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 bg-accent" />
          <span>
            {completed} resolved / closed
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 bg-ink-200" />
          <span>{total - completed} remaining</span>
        </div>
      </div>
    </div>
  );
}
