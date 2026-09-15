import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHeader, StatCard } from "@/components/app/Layout";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { SeverityBadge, IncidentStatusText } from "@/components/app/Badges";
import { ScoreTrendChart } from "@/components/charts/ScoreTrendChart";
import { IncidentTrendChart } from "@/components/charts/IncidentTrendChart";
import { RiskDistributionChart } from "@/components/charts/RiskDistributionChart";
import { useStore } from "@/lib/store";
import { usePageTitle } from "@/lib/usePageTitle";
import { relativeTime } from "@/lib/utils";
import type { Severity } from "@/types";

export function DashboardPage() {
  const {
    incidents,
    assets,
    activity,
    scoreHistory,
    incidentTrend,
  } = useStore();
  usePageTitle("Dashboard — SENTRY");

  const open = incidents.filter((i) => i.status !== "resolved");
  const openBySeverity = (["critical", "high", "medium", "low"] as Severity[])
    .map((severity) => ({ severity, count: open.filter((i) => i.severity === severity).length }))
    .filter((s) => s.count > 0);

  const unresolvedByType = (type: string) =>
    incidents.filter((i) => i.type === type && i.status !== "resolved").length;

  const score = scoreHistory[scoreHistory.length - 1]?.score ?? 0;
  const prevScore = scoreHistory[scoreHistory.length - 8]?.score ?? score;
  const delta = score - prevScore;

  const recentIncidents = [...incidents]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5);

  const criticalAssets = assets.filter((a) => a.status === "critical").length;
  const monitored = assets.filter((a) => a.status !== "paused").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security overview"
        description="Live posture across Northbeam Labs — incidents, credentials, logins and monitored assets."
      />

      {/* KPI row */}
      <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Security score"
          value={score}
          tone={score >= 85 ? "positive" : score >= 70 ? "warning" : "critical"}
          hint={`${delta >= 0 ? "+" : ""}${delta} pts vs last week`}
        />
        <StatCard label="Active incidents" value={open.length} tone={open.length > 4 ? "critical" : "warning"} hint="All severities" to="/incidents" />
        <StatCard label="Exposed credentials" value={unresolvedByType("exposed_credential")} tone={unresolvedByType("exposed_credential") > 0 ? "critical" : "neutral"} hint="Live, need rotation" to="/incidents" />
        <StatCard label="Suspicious logins" value={unresolvedByType("suspicious_login")} tone={unresolvedByType("suspicious_login") > 0 ? "warning" : "neutral"} hint="Last 30 days" to="/incidents" />
        <StatCard label="Compromised accounts" value={unresolvedByType("compromised_account")} tone={unresolvedByType("compromised_account") > 0 ? "critical" : "neutral"} hint="Under investigation" to="/incidents" />
        <StatCard label="Monitored assets" value={monitored} hint={`${criticalAssets} critical`} to="/assets" />
      </section>

      {/* Charts */}
      <section aria-label="Trends" className="grid gap-3 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            title="Security score trend"
            action={<span className="text-xs text-zinc-400">Last 30 days</span>}
          />
          <div className="p-4 sm:p-5">
            <ScoreTrendChart data={scoreHistory} />
          </div>
        </Panel>
        <Panel>
          <PanelHeader
            title="Incident volume"
            action={
              <Link to="/incidents" className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-950">
                View all <ArrowRight size={12} aria-hidden />
              </Link>
            }
          />
          <div className="p-4 sm:p-5">
            <IncidentTrendChart data={incidentTrend} />
          </div>
        </Panel>
      </section>

      {/* Bottom row */}
      <section aria-label="Recent incidents and activity" className="grid gap-3 lg:grid-cols-2">
        <Panel className="min-w-0">
          <PanelHeader
            title="Recent incidents"
            action={
              <Link to="/incidents" className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-950">
                View all <ArrowRight size={12} aria-hidden />
              </Link>
            }
          />
          <ul className="divide-y divide-zinc-100">
            {recentIncidents.map((inc) => (
              <li key={inc.id}>
                <Link
                  to={`/incidents/${inc.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-zinc-50 sm:px-5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-zinc-950">{inc.title}</span>
                    <span className="mt-0.5 flex items-center gap-2 truncate font-mono text-[11px] text-zinc-400">
                      <span className="truncate">
                        {inc.id} · {inc.assetName}
                      </span>
                    </span>
                  </span>
                  <span className="hidden shrink-0 sm:block">
                    <IncidentStatusText status={inc.status} />
                  </span>
                  <SeverityBadge severity={inc.severity} />
                  <span className="tabular hidden w-14 shrink-0 text-right text-xs text-zinc-400 md:block">
                    {relativeTime(inc.updatedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="grid min-w-0 gap-3">
          <Panel className="min-w-0">
            <PanelHeader title="Active incidents by severity" />
            <div className="p-4 sm:p-5">
              <RiskDistributionChart data={openBySeverity} />
            </div>
          </Panel>
          <Panel className="min-w-0">
            <PanelHeader title="Recent activity" />
            <ul className="max-h-64 divide-y divide-zinc-100 overflow-y-auto">
              {activity.slice(0, 7).map((a) => (
                <li key={a.id} className="flex items-baseline gap-2 px-4 py-2.5 text-[13px] sm:px-5">
                  <span className="shrink-0 font-medium text-zinc-950">{a.actor}</span>
                  <span className="min-w-0 flex-1 truncate text-zinc-500">
                    {a.action} <span className="text-zinc-700">{a.target}</span>
                  </span>
                  <time className="tabular shrink-0 text-xs text-zinc-400">{relativeTime(a.at)}</time>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>
    </div>
  );
}
