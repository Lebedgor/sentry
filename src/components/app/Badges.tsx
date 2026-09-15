import { Badge } from "@/components/ui/Badge";
import { incidentStatusMeta, riskMeta, severityMeta } from "@/lib/status";
import type { IncidentStatus, RiskLevel, Severity } from "@/types";

export function SeverityBadge({ severity }: { severity: Severity }) {
  const meta = severityMeta[severity];
  return (
    <Badge className={meta.badge} dot={meta.dot}>
      {meta.label}
    </Badge>
  );
}

/**
 * Compact status indicator for dense lists: severity keeps its colored badge,
 * status stays neutral (dot + text) so color reads as severity, not decoration.
 */
export function IncidentStatusText({ status }: { status: IncidentStatus }) {
  const meta = incidentStatusMeta[status];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-medium text-zinc-600">
      <span aria-hidden className={`inline-block size-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const meta = incidentStatusMeta[status];
  return (
    <Badge className={meta.badge} dot={meta.dot}>
      {meta.label}
    </Badge>
  );
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const meta = riskMeta[risk];
  return (
    <Badge className={meta.badge} dot={meta.bar}>
      {meta.label}
    </Badge>
  );
}
