import { cn } from "@/lib/utils";

export function ScoreRing({ score, size = 120, className }: { score: number; size?: number; className?: string }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = score >= 85 ? "#059669" : score >= 70 ? "#d97706" : "#dc2626";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Security score: ${score} out of 100`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f4f4f5" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * c} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tabular text-2xl font-semibold tracking-tight text-zinc-950" style={{ fontSize: size * 0.22 }}>
          {score}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400" style={{ fontSize: size * 0.085 }}>
          / 100
        </span>
      </div>
    </div>
  );
}
