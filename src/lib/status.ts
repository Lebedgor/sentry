import type { AssetStatus, AssetType, IncidentStatus, RiskLevel, Role, Severity } from "@/types";

export const severityMeta: Record<Severity, { label: string; badge: string; dot: string }> = {
  critical: { label: "Critical", badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-600" },
  high: { label: "High", badge: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  medium: { label: "Medium", badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  low: { label: "Low", badge: "bg-zinc-100 text-zinc-600 border-zinc-200", dot: "bg-zinc-400" },
};

export const incidentStatusMeta: Record<IncidentStatus, { label: string; badge: string; dot: string }> = {
  open: { label: "Open", badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-600" },
  investigating: { label: "Investigating", badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  contained: { label: "Contained", badge: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500" },
  resolved: { label: "Resolved", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
};

export const assetStatusMeta: Record<AssetStatus, { label: string; dot: string; text: string }> = {
  healthy: { label: "Healthy", dot: "bg-emerald-500", text: "text-emerald-700" },
  warning: { label: "Warning", dot: "bg-amber-500", text: "text-amber-700" },
  critical: { label: "Critical", dot: "bg-red-600", text: "text-red-700" },
  paused: { label: "Paused", dot: "bg-zinc-400", text: "text-zinc-500" },
};

export const riskMeta: Record<RiskLevel, { label: string; badge: string; bar: string }> = {
  critical: { label: "Critical", badge: "bg-red-50 text-red-700 border-red-200", bar: "bg-red-600" },
  high: { label: "High", badge: "bg-orange-50 text-orange-700 border-orange-200", bar: "bg-orange-500" },
  medium: { label: "Medium", badge: "bg-amber-50 text-amber-700 border-amber-200", bar: "bg-amber-500" },
  low: { label: "Low", badge: "bg-zinc-100 text-zinc-600 border-zinc-200", bar: "bg-zinc-400" },
};

export const assetTypeLabels: Record<AssetType, string> = {
  domain: "Domain",
  endpoint: "Endpoint",
  api_key: "API key",
  application: "Application",
};

export const roleMeta: Record<Role, { label: string; description: string }> = {
  owner: { label: "Owner", description: "Full access, including billing and workspace deletion." },
  admin: { label: "Admin", description: "Manage members, settings, and all security data." },
  security_analyst: { label: "Security Analyst", description: "Triage and resolve incidents, manage assets." },
  viewer: { label: "Viewer", description: "Read-only access to dashboards and reports." },
};

export function scoreTone(score: number): string {
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-amber-600";
  return "text-red-600";
}
