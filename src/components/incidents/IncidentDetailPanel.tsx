import { Drawer } from "@/components/ui/Overlay";
import { SeverityBadge, IncidentStatusBadge } from "@/components/app/Badges";
import { Avatar } from "@/components/ui/Avatar";
import { Select } from "@/components/ui/Input";
import { useStore } from "@/lib/store";
import { formatDateTime, relativeTime, titleCase } from "@/lib/utils";
import { assetTypeLabels, roleMeta } from "@/lib/status";
import type { Incident, IncidentStatus } from "@/types";

const STATUS_FLOW: IncidentStatus[] = ["open", "investigating", "contained", "resolved"];

export function IncidentDetailPanel({
  incident,
  onClose,
}: {
  incident: Incident | null;
  onClose: () => void;
}) {
  const { users, setIncidentStatus, assignIncident, toast } = useStore();

  if (!incident) return null;

  const assignee = users.find((u) => u.id === incident.assigneeId);
  const canManage = true; // in a real app this would come from the current user's role

  return (
    <Drawer open onClose={onClose} title={`${incident.id} · ${incident.severity.toUpperCase()}`} wide>
      <div className="space-y-6 px-5 py-5">
        {/* Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={incident.severity} />
            <IncidentStatusBadge status={incident.status} />
            <span className="text-xs text-zinc-400">{titleCase(incident.type)}</span>
          </div>
          <h3 className="mt-2.5 text-lg font-semibold leading-snug tracking-tight text-zinc-950">
            {incident.title}
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            Detected {formatDateTime(incident.createdAt)} via {incident.source} · updated {relativeTime(incident.updatedAt)}
          </p>
        </div>

        {/* Affected asset */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">Affected asset</p>
          <p className="mt-1 font-mono text-[13px] font-medium text-zinc-950">{incident.assetName}</p>
          <p className="text-xs text-zinc-500">{assetTypeLabels[incident.assetType]}</p>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-[13px] font-semibold text-zinc-950">Description</h4>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-600">{incident.description}</p>
        </div>

        {/* Triage controls */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="incident-status" className="mb-1.5 block text-[13px] font-medium text-zinc-700">
              Status
            </label>
            <Select
              id="incident-status"
              label="Change incident status"
              value={incident.status}
              disabled={!canManage}
              onChange={(e) => {
                const next = e.target.value as IncidentStatus;
                if (next !== incident.status) {
                  setIncidentStatus(incident.id, next);
                  toast(`${incident.id} moved to ${next}`);
                }
              }}
            >
              {STATUS_FLOW.map((s) => (
                <option key={s} value={s}>
                  {titleCase(s)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="incident-assignee" className="mb-1.5 block text-[13px] font-medium text-zinc-700">
              Assignee
            </label>
            <Select
              id="incident-assignee"
              label="Change assignee"
              value={incident.assigneeId ?? ""}
              disabled={!canManage}
              onChange={(e) => {
                assignIncident(incident.id, e.target.value || null);
                toast(e.target.value ? "Incident assigned" : "Assignee cleared");
              }}
            >
              <option value="">Unassigned</option>
              {users
                .filter((u) => u.status === "active" && u.role !== "viewer")
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {roleMeta[u.role].label}
                  </option>
                ))}
            </Select>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="text-[13px] font-semibold text-zinc-950">Timeline</h4>
          <ol className="mt-3 space-y-0">
            {[...incident.timeline].reverse().map((event, i, arr) => (
              <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
                {i < arr.length - 1 && (
                  <span aria-hidden className="absolute left-[5px] top-3 h-full w-px bg-zinc-200" />
                )}
                <span aria-hidden className="relative mt-1.5 size-[11px] shrink-0 rounded-full border-2 border-zinc-950 bg-white" />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-zinc-950">
                    {event.label}
                    <span className="ml-2 text-[11px] font-normal text-zinc-400">{formatDateTime(event.at)}</span>
                  </p>
                  {event.detail && <p className="mt-0.5 text-[12.5px] leading-relaxed text-zinc-500">{event.detail}</p>}
                  <p className="mt-0.5 text-[11.5px] text-zinc-400">{event.actor}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Assignee footer card */}
        {assignee && (
          <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3.5">
            <Avatar name={assignee.name} size="lg" />
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium text-zinc-950">{assignee.name}</p>
              <p className="truncate text-xs text-zinc-500">
                {roleMeta[assignee.role].label} · {assignee.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
