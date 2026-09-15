export type Severity = "critical" | "high" | "medium" | "low";

export type IncidentStatus = "open" | "investigating" | "contained" | "resolved";

export type IncidentType =
  | "exposed_credential"
  | "suspicious_login"
  | "compromised_account"
  | "phishing"
  | "misconfiguration"
  | "data_exposure"
  | "vulnerability"
  | "malware";

export type AssetType = "domain" | "endpoint" | "api_key" | "application";

export type AssetStatus = "healthy" | "warning" | "critical" | "paused";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type Role = "owner" | "admin" | "security_analyst" | "viewer";

export type MemberStatus = "active" | "invited" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  title: string;
  lastActive: string | null; // ISO date, null = never (invited)
}

export interface IncidentTimelineEvent {
  id: string;
  at: string;
  actor: string;
  label: string;
  detail?: string;
}

export interface Incident {
  id: string; // human readable, e.g. INC-1042
  title: string;
  type: IncidentType;
  severity: Severity;
  status: IncidentStatus;
  assetId: string;
  assetName: string;
  assetType: AssetType;
  createdAt: string;
  updatedAt: string;
  assigneeId: string | null;
  source: string;
  description: string;
  timeline: IncidentTimelineEvent[];
}

export interface AssetFinding {
  id: string;
  title: string;
  severity: Severity;
  detail: string;
  firstSeen: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  risk: RiskLevel;
  lastScanned: string;
  findings: number;
  criticalFindings: number;
  meta: Record<string, string>;
  findingDetails: AssetFinding[];
}

export interface Notification {
  id: string;
  kind: "incident" | "asset" | "team" | "system";
  title: string;
  body: string;
  at: string;
  read: boolean;
}

export interface Activity {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  region: string;
}

export interface ScorePoint {
  date: string;
  score: number;
}

export interface IncidentTrendPoint {
  date: string;
  opened: number;
  resolved: number;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string | null;
}
