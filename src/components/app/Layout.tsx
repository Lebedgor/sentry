import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-zinc-500">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  tone?: "neutral" | "critical" | "warning" | "positive" | "info";
  hint?: string;
  to?: string;
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, { dot: string; value: string }> = {
  neutral: { dot: "bg-zinc-400", value: "text-zinc-950" },
  critical: { dot: "bg-red-600", value: "text-red-600" },
  warning: { dot: "bg-amber-500", value: "text-amber-600" },
  positive: { dot: "bg-emerald-500", value: "text-emerald-600" },
  info: { dot: "bg-sky-500", value: "text-zinc-950" },
};

export function StatCard({ label, value, tone = "neutral", hint, to }: StatCardProps) {
  const toneStyle = toneStyles[tone];
  const body = (
    <Panel className="group h-full p-4 transition-colors">
      <span className="block truncate text-[13px] font-medium text-zinc-500">{label}</span>
      <div className="mt-1.5 flex items-center gap-2">
        <span className={cn("tabular text-[22px] font-semibold leading-7 tracking-tight", toneStyle.value)}>{value}</span>
        {to && (
          <ArrowUpRight
            size={13}
            aria-hidden
            className="text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100"
          />
        )}
      </div>
      {hint && <span className="mt-0.5 block truncate text-xs text-zinc-400">{hint}</span>}
    </Panel>
  );
  if (to) {
    return (
      <Link to={to} className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900" aria-label={`${label}: ${value}. ${hint ?? ""}`}>
        {body}
      </Link>
    );
  }
  return body;
}
