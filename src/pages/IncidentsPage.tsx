import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShieldAlert, SlidersHorizontal, X, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/app/Layout";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { SearchInput, Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { SeverityBadge, IncidentStatusText } from "@/components/app/Badges";
import { Avatar } from "@/components/ui/Avatar";
import { IncidentDetailPanel } from "@/components/incidents/IncidentDetailPanel";
import { useStore } from "@/lib/store";
import { usePageTitle } from "@/lib/usePageTitle";
import { formatDate, relativeTime, titleCase } from "@/lib/utils";
import { severityMeta } from "@/lib/status";
import type { Incident, IncidentStatus, IncidentType, Severity } from "@/types";

const SEVERITY_ORDER: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const STATUS_ORDER: Record<IncidentStatus, number> = { open: 0, investigating: 1, contained: 2, resolved: 3 };

type SortKey = "newest" | "oldest" | "severity_desc" | "severity_asc" | "status";

const INCIDENT_TYPES: IncidentType[] = [
  "exposed_credential",
  "suspicious_login",
  "compromised_account",
  "phishing",
  "misconfiguration",
  "data_exposure",
  "vulnerability",
  "malware",
];

export function IncidentsPage() {
  const { incidents, users } = useStore();
  const navigate = useNavigate();
  const { incidentId } = useParams();

  usePageTitle("Incidents — SENTRY");

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | IncidentStatus>("all");
  const [severity, setSeverity] = useState<"all" | Severity>("all");
  const [type, setType] = useState<"all" | IncidentType>("all");
  const [sort, setSort] = useState<SortKey>("severity_desc");

  const selected = incidents.find((i) => i.id === incidentId) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = incidents.filter((inc) => {
      if (status !== "all" && inc.status !== status) return false;
      if (severity !== "all" && inc.severity !== severity) return false;
      if (type !== "all" && inc.type !== type) return false;
      if (q) {
        const haystack = `${inc.id} ${inc.title} ${inc.assetName} ${inc.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    return rows.sort((a, b) => {
      switch (sort) {
        case "newest":
          return +new Date(b.createdAt) - +new Date(a.createdAt);
        case "oldest":
          return +new Date(a.createdAt) - +new Date(b.createdAt);
        case "severity_asc":
          return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
        case "status":
          return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        default:
          return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || +new Date(b.createdAt) - +new Date(a.createdAt);
      }
    });
  }, [incidents, query, status, severity, type, sort]);

  const hasFilters = query !== "" || status !== "all" || severity !== "all" || type !== "all";
  const clearFilters = () => {
    setQuery("");
    setStatus("all");
    setSeverity("all");
    setType("all");
  };

  const openRow = (inc: Incident) => navigate(`/incidents/${inc.id}`);

  const counts = {
    all: incidents.length,
    unresolved: incidents.filter((i) => i.status !== "resolved").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Incidents"
        description="Every signal correlated into a single, actionable queue. Select an incident to triage."
        action={
          <span className="tabular text-sm text-zinc-500">
            {counts.all} total · <span className="font-medium text-red-600">{counts.unresolved} unresolved</span> · {counts.resolved} resolved
          </span>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          label="Search incidents"
          placeholder="Search by ID, title, asset or description…"
          className="lg:w-80"
        />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:flex lg:items-center">
          <Select label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="lg:w-36">
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="contained">Contained</option>
            <option value="resolved">Resolved</option>
          </Select>
          <Select label="Filter by severity" value={severity} onChange={(e) => setSeverity(e.target.value as typeof severity)} className="lg:w-36">
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
          <Select label="Filter by type" value={type} onChange={(e) => setType(e.target.value as typeof type)} className="col-span-2 lg:w-44">
            <option value="all">All types</option>
            {INCIDENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {titleCase(t)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-2.5 lg:ml-auto">
          <Select label="Sort incidents" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="lg:w-44">
            <option value="severity_desc">Severity: high → low</option>
            <option value="severity_asc">Severity: low → high</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="status">Status pipeline</option>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X size={14} aria-hidden /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<ShieldAlert size={18} />}
            title="No incidents match your filters"
            description="Try adjusting the search term or clearing filters to see the full queue."
            action={
              hasFilters ? (
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  <SlidersHorizontal size={14} aria-hidden /> Clear filters
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
              <caption className="sr-only">Incident queue</caption>
              <thead>
                <tr className="border-b border-zinc-200 text-[11px] uppercase tracking-wider text-zinc-400">
                  <th scope="col" className="px-4 py-2 font-medium sm:px-5">Incident</th>
                  <th scope="col" className="px-3 py-2 font-medium">Severity</th>
                  <th scope="col" className="px-3 py-2 font-medium">Status</th>
                  <th scope="col" className="px-3 py-2 font-medium">Assignee</th>
                  <th scope="col" className="px-3 py-2 font-medium">Created</th>
                  <th scope="col" className="px-4 py-2 font-medium sm:px-5"><span className="sr-only">Open</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((inc) => {
                  const assignee = users.find((u) => u.id === inc.assigneeId);
                  return (
                    <tr
                      key={inc.id}
                      tabIndex={0}
                      onClick={() => openRow(inc)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openRow(inc);
                        }
                      }}
                      className={`group cursor-pointer transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-900 ${
                        selected?.id === inc.id ? "bg-zinc-50" : ""
                      }`}
                    >
                      <td className="max-w-md px-4 py-2.5 sm:px-5">
                        <p className="truncate text-[13px] font-medium text-zinc-950">{inc.title}</p>
                        <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-400">
                          {inc.id} · {titleCase(inc.type)} · {inc.assetName}
                        </p>
                      </td>
                      <td className="px-3 py-2.5"><SeverityBadge severity={inc.severity} /></td>
                      <td className="px-3 py-2.5"><IncidentStatusText status={inc.status} /></td>
                      <td className="px-3 py-2.5">
                        {assignee ? (
                          <span className="inline-flex items-center gap-2">
                            <Avatar name={assignee.name} size="sm" />
                            <span className="truncate text-zinc-700">{assignee.name}</span>
                          </span>
                        ) : (
                          <span className="text-zinc-400">Unassigned</span>
                        )}
                      </td>
                      <td className="tabular whitespace-nowrap px-3 py-2.5 text-[12.5px] text-zinc-500">{formatDate(inc.createdAt)}</td>
                      <td className="px-4 py-2.5 text-right sm:px-5">
                        <ChevronRight size={14} aria-hidden className="ml-auto text-zinc-300 transition-colors group-hover:text-zinc-500" />
                        <span className="sr-only">Open {inc.id}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Panel>

          {/* Mobile cards */}
          <ul className="space-y-2.5 md:hidden">
            {filtered.map((inc) => {
              const assignee = users.find((u) => u.id === inc.assigneeId);
              return (
                <li key={inc.id}>
                  <button
                    onClick={() => openRow(inc)}
                    className="w-full rounded-lg border border-zinc-200 bg-white p-4 text-left transition-colors hover:border-zinc-300"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-zinc-400">{inc.id}</span>
                      <SeverityBadge severity={inc.severity} />
                    </div>
                    <p className="mt-1.5 text-[13.5px] font-medium leading-snug text-zinc-950">{inc.title}</p>
                    <p className="mt-1 truncate text-xs text-zinc-500">{inc.assetName}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <IncidentStatusText status={inc.status} />
                      <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                        {assignee ? (
                          <>
                            <Avatar name={assignee.name} size="sm" />
                            {assignee.name.split(" ")[0]}
                          </>
                        ) : (
                          "Unassigned"
                        )}
                        <span aria-hidden>·</span>
                        {relativeTime(inc.createdAt)}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <p className="text-xs text-zinc-400" role="note">
        Showing {filtered.length} of {incidents.length} incidents.
        {" "}Highest severity first by default. <span className="sr-only">Severity levels: {(["critical", "high", "medium", "low"] as Severity[]).map((s) => severityMeta[s].label).join(", ")}.</span>
      </p>

      <IncidentDetailPanel
        incident={selected}
        onClose={() => navigate("/incidents")}
      />
    </div>
  );
}
