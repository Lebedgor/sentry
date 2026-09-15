import { ShieldCheck } from "lucide-react";
import { ScoreTrendChart } from "@/components/charts/ScoreTrendChart";
import { SeverityBadge } from "@/components/app/Badges";
import { StatusDot } from "@/components/ui/StatusDot";
import { buildScoreHistory } from "@/data/mock";
import { cn } from "@/lib/utils";
import { incidentStatusMeta } from "@/lib/status";

const scoreHistory = buildScoreHistory();

const MINI_INCIDENTS = [
  { id: "INC-1051", title: "AWS access key published in public repo", severity: "critical", status: "open", at: "2h ago" },
  { id: "INC-1050", title: "Impossible-travel login (Lagos, NG)", severity: "high", status: "investigating", at: "5h ago" },
  { id: "INC-1049", title: "Anomalous OAuth grant — Salesforce", severity: "critical", status: "investigating", at: "1d ago" },
  { id: "INC-1048", title: "S3 bucket publicly readable after drift", severity: "high", status: "open", at: "1d ago" },
] as const;

const KPIS = [
  { label: "Security score", value: "92", tone: "text-emerald-600" },
  { label: "Active incidents", value: "9", tone: "text-red-600" },
  { label: "Exposed credentials", value: "1", tone: "text-amber-600" },
  { label: "Monitored assets", value: "16", tone: "text-zinc-950" },
];

export function PreviewWindow() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)]">
      {/* window chrome */}
      <div className="flex h-10 items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-zinc-300" />
          <span className="size-2.5 rounded-full bg-zinc-300" />
          <span className="size-2.5 rounded-full bg-zinc-300" />
        </span>
        <span className="mx-auto hidden rounded-md border border-zinc-200 bg-white px-3 py-1 font-mono text-[11px] text-zinc-400 sm:block">
          app.sentry.dev/dashboard
        </span>
      </div>

      <div className="grid grid-cols-[52px_1fr] sm:grid-cols-[168px_1fr]">
        {/* sidebar */}
        <div className="hidden h-full border-r border-zinc-200 bg-white sm:block">
          <div className="flex h-11 items-center gap-2 px-4">
            <ShieldCheck size={16} className="text-zinc-950" aria-hidden />
            <span className="text-[12px] font-semibold tracking-[0.08em] text-zinc-950">SENTRY</span>
          </div>
          <ul className="mt-2 space-y-1 px-2 text-[12.5px] text-zinc-500">
            {["Dashboard", "Incidents", "Assets", "Team", "Settings"].map((item, i) => (
              <li
                key={item}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-1.5",
                  i === 0 && "bg-zinc-100 font-medium text-zinc-950",
                )}
              >
                <span aria-hidden className={cn("size-1.5 rounded-full", i === 0 ? "bg-zinc-950" : "bg-zinc-300")} />
                {item}
                {item === "Incidents" && (
                  <span className="tabular ml-auto rounded-full bg-zinc-950 px-1.5 text-[10px] font-semibold text-white">9</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* content */}
        <div className="min-w-0 bg-zinc-50/60 p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-zinc-950">Security overview</p>
              <p className="text-[11px] text-zinc-400">Northbeam Labs · updated moments ago</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10.5px] text-zinc-500">
              <StatusDot tone="bg-emerald-500" /> Live
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {KPIS.map((k) => (
              <div key={k.label} className="rounded-lg border border-zinc-200 bg-white p-2.5">
                <p className="truncate text-[10.5px] text-zinc-500">{k.label}</p>
                <p className={cn("tabular mt-0.5 text-lg font-semibold tracking-tight", k.tone)}>{k.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-2 grid gap-2 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-lg border border-zinc-200 bg-white p-3">
              <p className="mb-2 text-[11.5px] font-medium text-zinc-950">Security score — 30 days</p>
              <ScoreTrendChart data={scoreHistory} className="scale-95 origin-top-left" />
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white">
              <p className="border-b border-zinc-100 px-3 py-2 text-[11.5px] font-medium text-zinc-950">Recent incidents</p>
              <ul className="divide-y divide-zinc-100">
                {MINI_INCIDENTS.map((inc) => (
                  <li key={inc.id} className="flex items-center gap-2 px-3 py-2">
                    <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", incidentStatusMeta[inc.status].dot)} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11.5px] font-medium text-zinc-800">{inc.title}</span>
                      <span className="block font-mono text-[10px] text-zinc-400">{inc.id}</span>
                    </span>
                    <SeverityBadge severity={inc.severity} />
                    <span className="hidden text-[10px] text-zinc-400 md:block">{inc.at}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
