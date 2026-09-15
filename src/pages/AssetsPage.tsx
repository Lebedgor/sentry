import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Server, X, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/app/Layout";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { SearchInput, Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { RiskBadge } from "@/components/app/Badges";
import { AssetStatusIndicator } from "@/components/ui/StatusDot";
import { AssetDetailPanel } from "@/components/assets/AssetDetailPanel";
import { useStore } from "@/lib/store";
import { usePageTitle } from "@/lib/usePageTitle";
import { cn, relativeTime } from "@/lib/utils";
import { assetTypeLabels } from "@/lib/status";
import type { Asset, AssetStatus } from "@/types";

type TypeFilter = "all" | Asset["type"];

const TYPE_TABS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All assets" },
  { value: "domain", label: "Domains" },
  { value: "endpoint", label: "Endpoints" },
  { value: "api_key", label: "API keys" },
  { value: "application", label: "Applications" },
];

const STATUS_FILTERS: { value: "all" | AssetStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "healthy", label: "Healthy" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
  { value: "paused", label: "Paused" },
];

const TYPE_ICON = {
  domain: "🌐",
  endpoint: "🖧",
  api_key: "🔑",
  application: "▣",
} as const;

export function AssetsPage() {
  const { assets } = useStore();
  const navigate = useNavigate();
  const { assetId } = useParams();

  usePageTitle("Assets — SENTRY");

  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const [status, setStatus] = useState<"all" | AssetStatus>("all");
  const [sortBy, setSortBy] = useState<"risk" | "findings" | "name" | "scanned">("risk");

  const selected = assets.find((a) => a.id === assetId) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = assets.filter((asset) => {
      if (type !== "all" && asset.type !== type) return false;
      if (status !== "all" && asset.status !== status) return false;
      if (q && !`${asset.name} ${JSON.stringify(asset.meta)}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const riskRank = { critical: 0, high: 1, medium: 2, low: 3 };
    return rows.sort((a, b) => {
      switch (sortBy) {
        case "findings":
          return b.findings - a.findings;
        case "name":
          return a.name.localeCompare(b.name);
        case "scanned":
          return +new Date(b.lastScanned) - +new Date(a.lastScanned);
        default:
          return riskRank[a.risk] - riskRank[b.risk];
      }
    });
  }, [assets, query, type, status, sortBy]);

  const hasFilters = query !== "" || type !== "all" || status !== "all";
  const clearFilters = () => {
    setQuery("");
    setType("all");
    setStatus("all");
  };

  const counts = {
    total: assets.length,
    critical: assets.filter((a) => a.status === "critical").length,
    findings: assets.reduce((acc, a) => acc + a.findings, 0),
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Assets"
        description="Live inventory of your monitored surface — domains, endpoints, API keys and applications."
        action={
          <span className="tabular text-sm text-zinc-500">
            {counts.total} assets · <span className="font-medium text-red-600">{counts.critical} critical</span> · {counts.findings} findings
          </span>
        }
      />

      {/* Type tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1" role="group" aria-label="Filter assets by type">
        {TYPE_TABS.map((tab) => {
          const count = tab.value === "all" ? assets.length : assets.filter((a) => a.type === tab.value).length;
          return (
            <button
              key={tab.value}
              aria-pressed={type === tab.value}
              onClick={() => setType(tab.value)}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                type === tab.value
                  ? "bg-zinc-950 text-white"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950",
              )}
            >
              {tab.label}
              <span className={cn("tabular ml-1.5 text-[11px]", type === tab.value ? "text-zinc-400" : "text-zinc-400")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          label="Search assets"
          placeholder="Search assets…"
          className="sm:w-72"
        />
        <Select
          label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="sm:w-40"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
        <Select
          label="Sort assets"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="sm:w-44"
        >
          <option value="risk">Sort: risk level</option>
          <option value="findings">Sort: most findings</option>
          <option value="scanned">Sort: last scanned</option>
          <option value="name">Sort: name</option>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X size={14} aria-hidden /> Clear
          </Button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<Server size={18} />}
            title="No assets match your filters"
            description="Try a different search term or clear the filters to see all monitored assets."
            action={
              hasFilters ? (
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        </Panel>
      ) : (
        <>
          {/* Desktop table */}
          <Panel className="hidden md:block">
            <table className="w-full text-left text-[13.5px]">
              <caption className="sr-only">Monitored assets</caption>
              <thead>
                <tr className="border-b border-zinc-200 text-[11px] uppercase tracking-wider text-zinc-400">
                  <th scope="col" className="px-4 py-2 font-medium sm:px-5">Asset</th>
                  <th scope="col" className="px-3 py-2 font-medium">Status</th>
                  <th scope="col" className="px-3 py-2 font-medium">Risk</th>
                  <th scope="col" className="px-3 py-2 font-medium">Findings</th>
                  <th scope="col" className="px-3 py-2 font-medium">Last scanned</th>
                  <th scope="col" className="px-4 py-2 font-medium sm:px-5"><span className="sr-only">Open</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((asset) => (
                  <tr
                    key={asset.id}
                    tabIndex={0}
                    onClick={() => navigate(`/assets/${asset.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/assets/${asset.id}`);
                      }
                    }}
                    className={cn(
                      "group cursor-pointer transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-900",
                      selected?.id === asset.id && "bg-zinc-50",
                    )}
                  >
                    <td className="max-w-sm px-4 py-2.5 sm:px-5">
                      <p className="truncate font-mono text-[13px] font-medium text-zinc-950">{asset.name}</p>
                      <p className="mt-0.5 text-[11px] text-zinc-400">{assetTypeLabels[asset.type]}</p>
                    </td>
                    <td className="px-3 py-2.5"><AssetStatusIndicator status={asset.status} label /></td>
                    <td className="px-3 py-2.5"><RiskBadge risk={asset.risk} /></td>
                    <td className="tabular px-3 py-2.5">
                      {asset.findings > 0 ? (
                        <span className="text-zinc-950">
                          {asset.findings}
                          {asset.criticalFindings > 0 && (
                            <span className="ml-1.5 rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-700">
                              {asset.criticalFindings} critical
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-zinc-400">None</span>
                      )}
                    </td>
                    <td className="tabular whitespace-nowrap px-3 py-2.5 text-[12.5px] text-zinc-500">{relativeTime(asset.lastScanned)}</td>
                    <td className="px-4 py-2.5 text-right sm:px-5">
                      <ChevronRight size={14} aria-hidden className="ml-auto text-zinc-300 transition-colors group-hover:text-zinc-500" />
                      <span className="sr-only">Open {asset.name}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          {/* Mobile cards */}
          <ul className="space-y-2.5 md:hidden">
            {filtered.map((asset) => (
              <li key={asset.id}>
                <button
                  onClick={() => navigate(`/assets/${asset.id}`)}
                  className="w-full rounded-lg border border-zinc-200 bg-white p-4 text-left transition-colors hover:border-zinc-300"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-400">
                      <span aria-hidden>{TYPE_ICON[asset.type]}</span> {assetTypeLabels[asset.type]}
                    </span>
                    <RiskBadge risk={asset.risk} />
                  </div>
                  <p className="mt-1.5 truncate font-mono text-[13px] font-medium text-zinc-950">{asset.name}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                    <AssetStatusIndicator status={asset.status} label />
                    <span className="tabular">
                      {asset.findings > 0 ? `${asset.findings} findings` : "No findings"} · {relativeTime(asset.lastScanned)}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <AssetDetailPanel asset={selected} onClose={() => navigate("/assets")} />
    </div>
  );
}
