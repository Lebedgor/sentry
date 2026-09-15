import { cn } from "@/lib/utils";
import type { IncidentTrendPoint } from "@/types";

export function IncidentTrendChart({ data, className }: { data: IncidentTrendPoint[]; className?: string }) {
  const w = 640;
  const h = 200;
  const padX = 8;
  const padTop = 14;
  const padBottom = 22;
  const chartH = h - padTop - padBottom;

  const max = Math.max(...data.map((d) => Math.max(d.opened, d.resolved)), 1);
  const groupW = (w - padX * 2) / data.length;
  const barW = Math.min(9, groupW / 3.2);

  const y = (v: number) => padTop + chartH - (v / max) * chartH;

  return (
    <figure className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Incidents opened and resolved per day over the last 14 days. Peak of ${max} on a single day.`}
      >
        {[0.5].map((t) => (
          <line
            key={t}
            x1={padX}
            x2={w - padX}
            y1={padTop + t * chartH}
            y2={padTop + t * chartH}
            stroke="#e4e4e7"
            strokeWidth="1"
          />
        ))}
        <line x1={padX} x2={w - padX} y1={padTop + chartH} y2={padTop + chartH} stroke="#d4d4d8" strokeWidth="1" />
        {data.map((d, i) => {
          const cx = padX + groupW * i + groupW / 2;
          return (
            <g key={d.date}>
              <rect
                x={cx - barW - 1.5}
                y={y(d.opened)}
                width={barW}
                height={padTop + chartH - y(d.opened)}
                rx="2"
                fill="#18181b"
              />
              <rect
                x={cx + 1.5}
                y={y(d.resolved)}
                width={barW}
                height={padTop + chartH - y(d.resolved)}
                rx="2"
                fill="#a1a1aa"
              />
            </g>
          );
        })}
        <text x={padX} y={h - 6} fontSize="11" fill="#a1a1aa">
          {new Date(data[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </text>
        <text x={w - padX} y={h - 6} fontSize="11" fill="#a1a1aa" textAnchor="end">
          {new Date(data[data.length - 1].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </text>
      </svg>
      <figcaption className="mt-1 flex items-center gap-4 text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="inline-block size-2 rounded-sm bg-zinc-950" /> Opened
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="inline-block size-2 rounded-sm bg-zinc-400" /> Resolved
        </span>
        <span>14-day trend</span>
      </figcaption>
    </figure>
  );
}
