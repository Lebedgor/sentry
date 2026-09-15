import { cn } from "@/lib/utils";
import type { ScorePoint } from "@/types";

export function ScoreTrendChart({ data, className }: { data: ScorePoint[]; className?: string }) {
  const w = 640;
  const h = 200;
  const padX = 8;
  const padTop = 14;
  const padBottom = 22;

  const scores = data.map((d) => d.score);
  const min = Math.min(...scores) - 3;
  const max = Math.max(...scores) + 2;

  const x = (i: number) => padX + (i / (data.length - 1)) * (w - padX * 2);
  const y = (v: number) => padTop + (1 - (v - min) / (max - min)) * (h - padTop - padBottom);

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.score).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${(h - padBottom).toFixed(1)} L${padX},${(h - padBottom).toFixed(1)} Z`;

  const last = data[data.length - 1];
  const first = data[0];
  const delta = last.score - first.score;

  return (
    <figure className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Security score trend over the last 30 days, from ${first.score} to ${last.score}.`}
      >
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={padX}
            x2={w - padX}
            y1={padTop + t * (h - padTop - padBottom)}
            y2={padTop + t * (h - padTop - padBottom)}
            stroke="#e4e4e7"
            strokeWidth="1"
          />
        ))}
        <path d={area} fill="#10b981" opacity="0.07" />
        <path d={line} fill="none" stroke="#059669" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(data.length - 1)} cy={y(last.score)} r="3.5" fill="#059669" />
        <circle cx={x(data.length - 1)} cy={y(last.score)} r="7" fill="#059669" opacity="0.15" />
        <text
          x={x(data.length - 1) - 8}
          y={y(last.score) - 10}
          fontSize="12"
          fontWeight="600"
          fill="#059669"
          textAnchor="end"
        >
          {last.score}
        </text>
        <text x={padX} y={h - 6} fontSize="11" fill="#a1a1aa">
          {new Date(first.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </text>
        <text x={w - padX} y={h - 6} fontSize="11" fill="#a1a1aa" textAnchor="end">
          {new Date(last.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </text>
      </svg>
      <figcaption className="mt-1 text-xs text-zinc-500">
        30-day trend · <span className={delta >= 0 ? "font-medium text-emerald-600" : "font-medium text-red-600"}>
          {delta >= 0 ? "+" : ""}{delta} points
        </span>
      </figcaption>
    </figure>
  );
}
