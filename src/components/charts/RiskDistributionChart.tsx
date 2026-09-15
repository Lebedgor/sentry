import { cn } from "@/lib/utils";
import type { Severity } from "@/types";

const colors: Record<Severity, string> = {
  critical: "#dc2626",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#a1a1aa",
};

export interface RiskSlice {
  severity: Severity;
  count: number;
}

export function RiskDistributionChart({ data, className }: { data: RiskSlice[]; className?: string }) {
  const total = data.reduce((acc, d) => acc + d.count, 0) || 1;
  const r = 62;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <figure className={cn("w-full", className)}>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 160 160" className="size-36 shrink-0" role="img" aria-label={`Open incidents by severity: ${data.map((d) => `${d.count} ${d.severity}`).join(", ")}.`}>
          <circle cx="80" cy="80" r={r} fill="none" stroke="#f4f4f5" strokeWidth="14" />
          {data.map((d) => {
            const frac = d.count / total;
            const dash = `${frac * c} ${c}`;
            const el = (
              <circle
                key={d.severity}
                cx="80"
                cy="80"
                r={r}
                fill="none"
                stroke={colors[d.severity]}
                strokeWidth="14"
                strokeDasharray={dash}
                strokeDashoffset={-offset * c}
                transform="rotate(-90 80 80)"
              />
            );
            offset += frac;
            return el;
          })}
          <text x="80" y="76" textAnchor="middle" fontSize="26" fontWeight="600" fill="#09090b">
            {total}
          </text>
          <text x="80" y="94" textAnchor="middle" fontSize="10" fill="#71717a">
            OPEN
          </text>
        </svg>
        <ul className="min-w-0 flex-1 space-y-2.5">
          {data.map((d) => (
            <li key={d.severity} className="flex items-center justify-between gap-3 text-[13px]">
              <span className="inline-flex items-center gap-2 text-zinc-600 capitalize">
                <span aria-hidden className="inline-block size-2 rounded-full" style={{ backgroundColor: colors[d.severity] }} />
                {d.severity}
              </span>
              <span className="tabular font-medium text-zinc-950">{d.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
