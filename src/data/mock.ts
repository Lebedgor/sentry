import type {
  Activity,
  ApiKey,
  Asset,
  Incident,
  Notification,
  ScorePoint,
  IncidentTrendPoint,
  User,
  Workspace,
} from "@/types";

function daysAgo(days: number, hour = 14, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function hoursAgo(hours: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - hours * 60);
  return d.toISOString();
}

export function buildUsers(): User[] {
  return [
    {
      id: "u-01",
      name: "Maya Chen",
      email: "maya@northbeam.io",
      role: "owner",
      status: "active",
      title: "Head of Platform",
      lastActive: hoursAgo(0.1),
    },
    {
      id: "u-02",
      name: "Daniel Okafor",
      email: "daniel@northbeam.io",
      role: "admin",
      status: "active",
      title: "Staff Engineer",
      lastActive: hoursAgo(1.4),
    },
    {
      id: "u-03",
      name: "Priya Raghavan",
      email: "priya@northbeam.io",
      role: "security_analyst",
      status: "active",
      title: "Security Analyst",
      lastActive: hoursAgo(0.3),
    },
    {
      id: "u-04",
      name: "Tomas Lindqvist",
      email: "tomas@northbeam.io",
      role: "security_analyst",
      status: "active",
      title: "Security Analyst",
      lastActive: hoursAgo(9),
    },
    {
      id: "u-05",
      name: "Elena Marchetti",
      email: "elena@northbeam.io",
      role: "viewer",
      status: "active",
      title: "Product Manager",
      lastActive: daysAgo(2, 9, 20),
    },
    {
      id: "u-06",
      name: "Jordan Reyes",
      email: "jordan@northbeam.io",
      role: "security_analyst",
      status: "suspended",
      title: "Security Analyst",
      lastActive: daysAgo(21, 16, 45),
    },
    {
      id: "u-07",
      name: "Sam Whitaker",
      email: "sam.whitaker@contractor.dev",
      role: "viewer",
      status: "invited",
      title: "Contractor",
      lastActive: null,
    },
  ];
}

export function buildIncidents(): Incident[] {
  return [
    {
      id: "INC-1051",
      title: "AWS root access key published in public GitHub repository",
      type: "exposed_credential",
      severity: "critical",
      status: "open",
      assetId: "a-01",
      assetName: "AWS Access Key — prod-ingest",
      assetType: "api_key",
      createdAt: hoursAgo(2.2),
      updatedAt: hoursAgo(0.5),
      assigneeId: "u-03",
      source: "Secret scanning",
      description:
        "A live access key pair for the prod-ingest AWS account was committed to a public repository and mirrored by three third-party code-sharing sites. The key has read permissions on S3 and SQS. Immediate rotation is required; unusual ListBucket activity was observed from AS14061 (DigitalOcean) 40 minutes after publication.",
      timeline: [
        { id: "t1", at: hoursAgo(2.2), actor: "SENTRY", label: "Incident created", detail: "Secret scanning matched live key prefix AKIA…7QF in repo northbeam/analytics-etl." },
        { id: "t2", at: hoursAgo(1.8), actor: "SENTRY", label: "Severity set to critical", detail: "Key confirmed active against AWS IAM GetCallerIdentity." },
        { id: "t3", at: hoursAgo(0.5), actor: "Priya Raghavan", label: "Assignee set", detail: "Assigned to Priya Raghavan." },
      ],
    },
    {
      id: "INC-1050",
      title: "Impossible travel login for daniel@northbeam.io (Lagos, NG)",
      type: "suspicious_login",
      severity: "high",
      status: "investigating",
      assetId: "a-14",
      assetName: "Identity Provider — Okta",
      assetType: "application",
      createdAt: hoursAgo(5),
      updatedAt: hoursAgo(1.1),
      assigneeId: "u-04",
      source: "Login anomaly detection",
      description:
        "Successful password + SMS MFA login from Lagos, Nigeria 47 minutes after a login from San Francisco. Session token was used to list directory users. Device fingerprint does not match any previously seen device for this user.",
      timeline: [
        { id: "t1", at: hoursAgo(5), actor: "SENTRY", label: "Incident created", detail: "Geo-velocity rule tripped: SFO → LOS in 47m." },
        { id: "t2", at: hoursAgo(4.2), actor: "Tomas Lindqvist", label: "Status changed to investigating", detail: "Reviewing Okta system log around the session." },
        { id: "t3", at: hoursAgo(1.1), actor: "SENTRY", label: "Session revoked", detail: "All active Okta sessions for the user were invalidated via API." },
      ],
    },
    {
      id: "INC-1049",
      title: "Anomalous OAuth grant on e.marchetti Salesforce account",
      type: "compromised_account",
      severity: "critical",
      status: "investigating",
      assetId: "a-15",
      assetName: "Salesforce — Production",
      assetType: "application",
      createdAt: daysAgo(1, 9, 40),
      updatedAt: hoursAgo(3.3),
      assigneeId: "u-03",
      source: "Behavioral analytics",
      description:
        "The account granted a connected app with full API access at 02:14 local time and exported 18,400 lead records via bulk job. Volume is 40× the 30-day baseline. Account owner reports no knowledge of the grant.",
      timeline: [
        { id: "t1", at: daysAgo(1, 9, 40), actor: "SENTRY", label: "Incident created", detail: "Bulk export volume exceeded anomaly threshold." },
        { id: "t2", at: daysAgo(1, 11), actor: "Priya Raghavan", label: "Status changed to investigating" },
        { id: "t3", at: hoursAgo(3.3), actor: "SENTRY", label: "Connected app revoked", detail: "OAuth grant 'Data Sync Pro' revoked; export artifacts quarantined." },
      ],
    },
    {
      id: "INC-1048",
      title: "S3 bucket northbeam-analytics publicly readable after policy drift",
      type: "misconfiguration",
      severity: "high",
      status: "open",
      assetId: "a-01",
      assetName: "AWS — prod-ingest",
      assetType: "api_key",
      createdAt: daysAgo(1, 17, 5),
      updatedAt: daysAgo(1, 18),
      assigneeId: "u-02",
      source: "Cloud posture scan",
      description:
        "Bucket policy changed to allow public s3:GetObject during an infrastructure rollout. 2.1 GB of aggregated usage analytics are exposed. No customer PII detected in object sampling.",
      timeline: [
        { id: "t1", at: daysAgo(1, 17, 5), actor: "SENTRY", label: "Incident created", detail: "Posture scan detected public-read ACL after 14:00 deploy." },
        { id: "t2", at: daysAgo(1, 18), actor: "Daniel Okafor", label: "Assignee set", detail: "Assigned to Daniel Okafor." },
      ],
    },
    {
      id: "INC-1047",
      title: "Customer PII fields present in production log stream",
      type: "data_exposure",
      severity: "medium",
      status: "open",
      assetId: "a-11",
      assetName: "Public API v2",
      assetType: "application",
      createdAt: daysAgo(2, 8, 15),
      updatedAt: daysAgo(2, 10),
      assigneeId: "u-04",
      source: "Log PII scanner",
      description:
        "Checkout service logs include raw email and partial card digits (first 6 + last 4) for roughly 3,100 requests/day. Redaction middleware regression introduced in v2.14.0.",
      timeline: [
        { id: "t1", at: daysAgo(2, 8, 15), actor: "SENTRY", label: "Incident created" },
        { id: "t2", at: daysAgo(2, 10), actor: "Tomas Lindqvist", label: "Assignee set", detail: "Assigned to Tomas Lindqvist." },
      ],
    },
    {
      id: "INC-1046",
      title: "Credential harvesting campaign targeting finance team",
      type: "phishing",
      severity: "high",
      status: "contained",
      assetId: "a-16",
      assetName: "Google Workspace",
      assetType: "application",
      createdAt: daysAgo(3, 13, 30),
      updatedAt: daysAgo(2, 16),
      assigneeId: "u-03",
      source: "Mail gateway",
      description:
        "Look-alike domain northbeam-secure.io delivered 6 emails impersonating the payroll vendor. One user entered credentials on the phishing page; the session was blocked by conditional access before data access.",
      timeline: [
        { id: "t1", at: daysAgo(3, 13, 30), actor: "SENTRY", label: "Incident created", detail: "Mail gateway quarantined 6 messages." },
        { id: "t2", at: daysAgo(3, 15), actor: "Priya Raghavan", label: "Status changed to investigating" },
        { id: "t3", at: daysAgo(2, 16), actor: "Priya Raghavan", label: "Status changed to contained", detail: "Look-alike domain reported to registrar; 14 related domains blocklisted." },
      ],
    },
    {
      id: "INC-1045",
      title: "nginx edge proxy fleet exposed to CVE-2025-4821",
      type: "vulnerability",
      severity: "medium",
      status: "investigating",
      assetId: "a-09",
      assetName: "edge-proxy-01.northbeam.io",
      assetType: "endpoint",
      createdAt: daysAgo(3, 7, 50),
      updatedAt: daysAgo(2, 9, 30),
      assigneeId: "u-02",
      source: "Vulnerability feed",
      description:
        "Edge proxy fleet (6 nodes) runs nginx 1.25.3, affected by CVE-2025-4821 (request smuggling). Patch available in 1.25.5. Rolling upgrade scheduled; WAF rule temporarily mitigates.",
      timeline: [
        { id: "t1", at: daysAgo(3, 7, 50), actor: "SENTRY", label: "Incident created", detail: "CVSS 7.5, exploit maturity: proof-of-concept." },
        { id: "t2", at: daysAgo(2, 9, 30), actor: "Daniel Okafor", label: "Status changed to investigating", detail: "WAF mitigation rule waf-114 deployed to all edge nodes." },
      ],
    },
    {
      id: "INC-1044",
      title: "Repeated failed VPN logins from unrecognized ASN",
      type: "suspicious_login",
      severity: "low",
      status: "resolved",
      assetId: "a-10",
      assetName: "vpn-gw-02.internal",
      assetType: "endpoint",
      createdAt: daysAgo(5, 22, 10),
      updatedAt: daysAgo(4, 8),
      assigneeId: "u-04",
      source: "Login anomaly detection",
      description:
        "212 failed password attempts against three accounts from AS9009 (M247) over 90 minutes. Accounts locked automatically; no successful logins.",
      timeline: [
        { id: "t1", at: daysAgo(5, 22, 10), actor: "SENTRY", label: "Incident created" },
        { id: "t2", at: daysAgo(4, 8), actor: "Tomas Lindqvist", label: "Status changed to resolved", detail: "Source ASN blocklisted; no recurrence in 24h." },
      ],
    },
    {
      id: "INC-1043",
      title: "Session hijack on marketing Google Workspace account",
      type: "compromised_account",
      severity: "high",
      status: "resolved",
      assetId: "a-16",
      assetName: "Google Workspace",
      assetType: "application",
      createdAt: daysAgo(6, 10, 20),
      updatedAt: daysAgo(5, 12),
      assigneeId: "u-03",
      source: "Behavioral analytics",
      description:
        "Stolen session cookie used to send 140 phishing emails from the marketing account. Account recovered, all sessions revoked, password rotated, hardware key enrolled for the user.",
      timeline: [
        { id: "t1", at: daysAgo(6, 10, 20), actor: "SENTRY", label: "Incident created", detail: "Outbound mail volume anomaly detected." },
        { id: "t2", at: daysAgo(6, 11), actor: "Priya Raghavan", label: "Status changed to investigating" },
        { id: "t3", at: daysAgo(5, 12), actor: "Priya Raghavan", label: "Status changed to resolved", detail: "Post-incident review published; phishing emails recalled." },
      ],
    },
    {
      id: "INC-1042",
      title: "Stripe secret key committed to mirrored private repo",
      type: "exposed_credential",
      severity: "medium",
      status: "resolved",
      assetId: "a-02",
      assetName: "Stripe Secret Key — payments",
      assetType: "api_key",
      createdAt: daysAgo(8, 9),
      updatedAt: daysAgo(7, 15),
      assigneeId: "u-02",
      source: "Secret scanning",
      description:
        "A restricted Stripe key leaked via a mirrored internal repository. Key was scoped to read-only and rotated within 4 hours. No fraudulent charges observed.",
      timeline: [
        { id: "t1", at: daysAgo(8, 9), actor: "SENTRY", label: "Incident created" },
        { id: "t2", at: daysAgo(8, 12), actor: "Daniel Okafor", label: "Key rotated", detail: "New key issued; old key revoked." },
        { id: "t3", at: daysAgo(7, 15), actor: "Daniel Okafor", label: "Status changed to resolved" },
      ],
    },
    {
      id: "INC-1040",
      title: "CloudTrail logging disabled for 6 hours in staging",
      type: "misconfiguration",
      severity: "low",
      status: "resolved",
      assetId: "a-01",
      assetName: "AWS Access Key — prod-ingest",
      assetType: "api_key",
      createdAt: daysAgo(10, 6, 30),
      updatedAt: daysAgo(9, 18),
      assigneeId: "u-02",
      source: "Cloud posture scan",
      description:
        "A Terraform change disabled the staging CloudTrail trail. Gaps in the audit log from 01:00–07:00 UTC. Logging restored and guardrail added to prevent trail deletion.",
      timeline: [
        { id: "t1", at: daysAgo(10, 6, 30), actor: "SENTRY", label: "Incident created" },
        { id: "t2", at: daysAgo(9, 18), actor: "Daniel Okafor", label: "Status changed to resolved" },
      ],
    },
    {
      id: "INC-1039",
      title: "Cryptominer binary detected on build runner ci-runner-04",
      type: "malware",
      severity: "high",
      status: "contained",
      assetId: "a-06",
      assetName: "ci-runner-04.internal",
      assetType: "endpoint",
      createdAt: daysAgo(12, 3, 45),
      updatedAt: daysAgo(11, 9),
      assigneeId: "u-04",
      source: "EDR",
      description:
        "EDR flagged xmrig-style CPU saturation following a dependency install from an unscoped third-party registry. Runner isolated from the network; cache and artifacts rebuilt.",
      timeline: [
        { id: "t1", at: daysAgo(12, 3, 45), actor: "SENTRY", label: "Incident created", detail: "EDR heuristic: crypto Miner.Linuxxmrig." },
        { id: "t2", at: daysAgo(12, 4, 30), actor: "SENTRY", label: "Host isolated", detail: "Network containment applied automatically." },
        { id: "t3", at: daysAgo(11, 9), actor: "Tomas Lindqvist", label: "Status changed to contained", detail: "Runner reimaged; registry scoped to private proxy." },
      ],
    },
    {
      id: "INC-1038",
      title: "Internal wiki pages exposed to search crawlers",
      type: "data_exposure",
      severity: "low",
      status: "resolved",
      assetId: "a-05",
      assetName: "dev-northbeam.net",
      assetType: "domain",
      createdAt: daysAgo(14, 11),
      updatedAt: daysAgo(13, 10),
      assigneeId: "u-03",
      source: "External exposure scan",
      description:
        "A staging wiki instance on dev-northbeam.net lacked authentication and was indexed. 42 pages removed from indexes via robots + takedown requests.",
      timeline: [
        { id: "t1", at: daysAgo(14, 11), actor: "SENTRY", label: "Incident created" },
        { id: "t2", at: daysAgo(13, 10), actor: "Priya Raghavan", label: "Status changed to resolved" },
      ],
    },
    {
      id: "INC-1037",
      title: "Unauthenticated SSRF in internal metadata service",
      type: "vulnerability",
      severity: "critical",
      status: "open",
      assetId: "a-12",
      assetName: "Admin Console",
      assetType: "application",
      createdAt: hoursAgo(19),
      updatedAt: hoursAgo(6),
      assigneeId: "u-01",
      source: "DAST scan",
      description:
        "The URL preview feature of the Admin Console fetches arbitrary URLs without allowlisting, allowing SSRF into the 169.254.169.254 metadata service. Feature disabled by feature flag; permanent fix in review.",
      timeline: [
        { id: "t1", at: daysAgo(0.8 * 24), actor: "SENTRY", label: "Incident created", detail: "DAST confirmed metadata credential reachability in test env." },
        { id: "t2", at: hoursAgo(6), actor: "Maya Chen", label: "Feature flag disabled", detail: "URL preview disabled in production pending fix." },
      ],
    },
  ];
}

export function buildAssets(): Asset[] {
  return [
    {
      id: "a-01",
      name: "AWS Access Key — prod-ingest",
      type: "api_key",
      status: "critical",
      risk: "critical",
      lastScanned: hoursAgo(0.5),
      findings: 4,
      criticalFindings: 2,
      meta: {
        Provider: "AWS",
        Permissions: "s3:*, sqs:*, iam:List*",
        Age: "217 days",
        Environment: "Production",
      },
      findingDetails: [
        { id: "f-01", title: "Key material published in public repository", severity: "critical", detail: "Live key found in northbeam/analytics-etl, mirrored by 3 code-sharing sites.", firstSeen: hoursAgo(2.2) },
        { id: "f-02", title: "Overly broad IAM permissions", severity: "high", detail: "Key grants wildcard access to S3 and SQS; least-privilege policy recommended.", firstSeen: daysAgo(30) },
        { id: "f-03", title: "Public S3 bucket reachable with this key's account", severity: "high", detail: "northbeam-analytics bucket allows public read after policy drift.", firstSeen: daysAgo(1) },
        { id: "f-04", title: "Key age exceeds 180-day policy", severity: "medium", detail: "Rotate credentials on a 180-day cycle per internal policy SEC-04.", firstSeen: daysAgo(37) },
      ],
    },
    {
      id: "a-02",
      name: "Stripe Secret Key — payments",
      type: "api_key",
      status: "warning",
      risk: "medium",
      lastScanned: hoursAgo(3),
      findings: 2,
      criticalFindings: 0,
      meta: { Provider: "Stripe", Permissions: "read-only", Age: "43 days", Environment: "Production" },
      findingDetails: [
        { id: "f-01", title: "Key previously exposed in private repo mirror", severity: "medium", detail: "Rotated on INC-1042; monitoring for reuse of the old prefix.", firstSeen: daysAgo(8) },
        { id: "f-02", title: "No IP allowlist configured", severity: "low", detail: "Restrict API usage to known egress ranges.", firstSeen: daysAgo(8) },
      ],
    },
    {
      id: "a-03",
      name: "GitHub PAT — ci-automation",
      type: "api_key",
      status: "healthy",
      risk: "low",
      lastScanned: hoursAgo(4),
      findings: 0,
      criticalFindings: 0,
      meta: { Provider: "GitHub", Permissions: "repo:write, workflow", Age: "12 days", Environment: "CI" },
      findingDetails: [],
    },
    {
      id: "a-04",
      name: "Datadog API Key — observability",
      type: "api_key",
      status: "healthy",
      risk: "low",
      lastScanned: hoursAgo(5),
      findings: 1,
      criticalFindings: 0,
      meta: { Provider: "Datadog", Permissions: "logs:read, metrics:write", Age: "88 days", Environment: "Production" },
      findingDetails: [
        { id: "f-01", title: "Key age exceeds 90-day policy", severity: "low", detail: "Rotate before day 90 per SEC-04.", firstSeen: daysAgo(2) },
      ],
    },
    {
      id: "a-05",
      name: "dev-northbeam.net",
      type: "domain",
      status: "warning",
      risk: "medium",
      lastScanned: hoursAgo(2),
      findings: 3,
      criticalFindings: 0,
      meta: { Registrar: "Namecheap", Expires: "in 26 days", DNS: "Cloudflare", TLS: "Let's Encrypt" },
      findingDetails: [
        { id: "f-01", title: "Domain expires in 26 days", severity: "medium", detail: "Expiring staging domain used by internal tooling; renew or decommission.", firstSeen: daysAgo(4) },
        { id: "f-02", title: "Subdomain takeover risk — dangling CNAME", severity: "medium", detail: "old-blog.dev-northbeam.net points to a decommissioned Heroku app.", firstSeen: daysAgo(11) },
        { id: "f-03", title: "No DMARC policy", severity: "low", detail: "Add p=quarantine to prevent spoofing.", firstSeen: daysAgo(14) },
      ],
    },
    {
      id: "a-06",
      name: "ci-runner-04.internal",
      type: "endpoint",
      status: "critical",
      risk: "critical",
      lastScanned: hoursAgo(0.8),
      findings: 2,
      criticalFindings: 1,
      meta: { OS: "Ubuntu 24.04", Agent: "SENTRY EDR 4.2.1", Zone: "build", "Last patch": "9 days ago" },
      findingDetails: [
        { id: "f-01", title: "Cryptominer executed post-dependency install", severity: "critical", detail: "xmrig binary observed; host isolated and reimaged on INC-1039.", firstSeen: daysAgo(12) },
        { id: "f-02", title: "Unscoped third-party registry in npm config", severity: "high", detail: "Pin registry to the private proxy to prevent dependency confusion.", firstSeen: daysAgo(12) },
      ],
    },
    {
      id: "a-07",
      name: "northbeam.io",
      type: "domain",
      status: "healthy",
      risk: "low",
      lastScanned: hoursAgo(1),
      findings: 0,
      criticalFindings: 0,
      meta: { Registrar: "MarkMonitor", Expires: "in 311 days", DNS: "Cloudflare", TLS: "TLS 1.3" },
      findingDetails: [],
    },
    {
      id: "a-08",
      name: "status.northbeam.io",
      type: "domain",
      status: "healthy",
      risk: "low",
      lastScanned: hoursAgo(1),
      findings: 0,
      criticalFindings: 0,
      meta: { Registrar: "MarkMonitor", Expires: "in 311 days", DNS: "Cloudflare", TLS: "TLS 1.3" },
      findingDetails: [],
    },
    {
      id: "a-09",
      name: "edge-proxy-01.northbeam.io",
      type: "endpoint",
      status: "warning",
      risk: "high",
      lastScanned: hoursAgo(1.5),
      findings: 2,
      criticalFindings: 0,
      meta: { OS: "Debian 12", Agent: "SENTRY EDR 4.2.1", Zone: "edge", "Last patch": "31 days ago" },
      findingDetails: [
        { id: "f-01", title: "nginx 1.25.3 vulnerable to CVE-2025-4821", severity: "high", detail: "Request smuggling; WAF mitigation active, patch in rollout (INC-1045).", firstSeen: daysAgo(3) },
        { id: "f-02", title: "TLS 1.0/1.1 still accepted on legacy listener", severity: "low", detail: "Disable legacy protocols on :8443.", firstSeen: daysAgo(19) },
      ],
    },
    {
      id: "a-10",
      name: "vpn-gw-02.internal",
      type: "endpoint",
      status: "healthy",
      risk: "low",
      lastScanned: hoursAgo(2.5),
      findings: 0,
      criticalFindings: 0,
      meta: { OS: "Debian 12", Agent: "SENTRY EDR 4.2.1", Zone: "network", "Last patch": "4 days ago" },
      findingDetails: [],
    },
    {
      id: "a-11",
      name: "Public API v2",
      type: "application",
      status: "warning",
      risk: "medium",
      lastScanned: hoursAgo(6),
      findings: 2,
      criticalFindings: 0,
      meta: { Stack: "Go 1.24", Owner: "Platform", Env: "Production", Deploys: "per-commit" },
      findingDetails: [
        { id: "f-01", title: "PII fields in production logs", severity: "medium", detail: "Redaction regression in v2.14.0 (INC-1047).", firstSeen: daysAgo(2) },
        { id: "f-02", title: "Missing rate limit on /auth/token", severity: "low", detail: "Add per-IP token bucket.", firstSeen: daysAgo(9) },
      ],
    },
    {
      id: "a-12",
      name: "Admin Console",
      type: "application",
      status: "critical",
      risk: "high",
      lastScanned: hoursAgo(7),
      findings: 2,
      criticalFindings: 1,
      meta: { Stack: "TypeScript / React", Owner: "Platform", Env: "Production", Deploys: "daily" },
      findingDetails: [
        { id: "f-01", title: "Unauthenticated SSRF via URL preview", severity: "critical", detail: "Metadata service reachable (INC-1037); feature disabled by flag.", firstSeen: daysAgo(1) },
        { id: "f-02", title: "Outdated dependency with known XSS", severity: "medium", detail: "markdown-it 12.x has a known XSS; upgrade available.", firstSeen: daysAgo(6) },
      ],
    },
    {
      id: "a-13",
      name: "Marketing Site",
      type: "application",
      status: "healthy",
      risk: "low",
      lastScanned: hoursAgo(9),
      findings: 0,
      criticalFindings: 0,
      meta: { Stack: "Astro", Owner: "Marketing", Env: "Production", Deploys: "weekly" },
      findingDetails: [],
    },
    {
      id: "a-14",
      name: "Identity Provider — Okta",
      type: "application",
      status: "warning",
      risk: "high",
      lastScanned: hoursAgo(1),
      findings: 3,
      criticalFindings: 1,
      meta: { Vendor: "Okta", Owner: "Security", Env: "Production", Seats: "84" },
      findingDetails: [
        { id: "f-01", title: "Impossible travel login on admin account", severity: "critical", detail: "Session revoked; investigation ongoing (INC-1050).", firstSeen: hoursAgo(5) },
        { id: "f-02", title: "3 accounts without MFA", severity: "high", detail: "Break-glass accounts exempted; enforce for all others.", firstSeen: daysAgo(5) },
        { id: "f-03", title: "Legacy tokens API active", severity: "low", detail: "Migrate to OAuth 2.0 before deprecation.", firstSeen: daysAgo(16) },
      ],
    },
    {
      id: "a-15",
      name: "Salesforce — Production",
      type: "application",
      status: "critical",
      risk: "high",
      lastScanned: hoursAgo(4),
      findings: 2,
      criticalFindings: 1,
      meta: { Vendor: "Salesforce", Owner: "Sales Ops", Env: "Production", Seats: "38" },
      findingDetails: [
        { id: "f-01", title: "Rogue connected app with full API access", severity: "critical", detail: "OAuth grant 'Data Sync Pro' revoked after bulk export (INC-1049).", firstSeen: daysAgo(1) },
        { id: "f-02", title: "Reports shared via link without expiry", severity: "medium", detail: "12 report links have no expiration; rotate quarterly.", firstSeen: daysAgo(8) },
      ],
    },
    {
      id: "a-16",
      name: "Google Workspace",
      type: "application",
      status: "healthy",
      risk: "medium",
      lastScanned: hoursAgo(2),
      findings: 1,
      criticalFindings: 0,
      meta: { Vendor: "Google", Owner: "Security", Env: "Production", Seats: "61" },
      findingDetails: [
        { id: "f-01", title: "Two users without hardware keys", severity: "medium", detail: "Password-only MFA on two finance accounts; enroll keys (post INC-1043 review).", firstSeen: daysAgo(4) },
      ],
    },
  ];
}

export function buildNotifications(): Notification[] {
  return [
    {
      id: "n-1",
      kind: "incident",
      title: "INC-1051 · Critical incident opened",
      body: "AWS root access key published in a public GitHub repository. Assigned to Priya Raghavan.",
      at: hoursAgo(2.2),
      read: false,
    },
    {
      id: "n-2",
      kind: "incident",
      title: "INC-1050 · Session revoked",
      body: "All Okta sessions for daniel@northbeam.io were invalidated after impossible-travel detection.",
      at: hoursAgo(1.1),
      read: false,
    },
    {
      id: "n-3",
      kind: "asset",
      title: "Asset scan completed with findings",
      body: "dev-northbeam.net expires in 26 days and has a dangling CNAME. 2 new findings.",
      at: hoursAgo(2),
      read: false,
    },
    {
      id: "n-4",
      kind: "team",
      title: "Daniel Okafor approved an access request",
      body: "Tomas Lindqvist was granted temporary read access to the payments workspace.",
      at: daysAgo(1, 12, 30),
      read: true,
    },
    {
      id: "n-5",
      kind: "system",
      title: "Weekly posture digest is ready",
      body: "Security score improved 78 → 92 over the last 30 days. 6 incidents resolved.",
      at: daysAgo(2, 8),
      read: true,
    },
  ];
}

export function buildActivity(): Activity[] {
  return [
    { id: "ac-1", actor: "SENTRY", action: "opened", target: "INC-1051 · AWS access key published", at: hoursAgo(2.2) },
    { id: "ac-2", actor: "Priya Raghavan", action: "was assigned", target: "INC-1051", at: hoursAgo(0.5) },
    { id: "ac-3", actor: "SENTRY", action: "revoked", target: "all sessions for daniel@northbeam.io", at: hoursAgo(1.1) },
    { id: "ac-4", actor: "Tomas Lindqvist", action: "changed status to investigating", target: "INC-1050", at: hoursAgo(4.2) },
    { id: "ac-5", actor: "SENTRY", action: "completed a scan with 2 findings", target: "dev-northbeam.net", at: hoursAgo(2) },
    { id: "ac-6", actor: "SENTRY", action: "revoked connected app", target: "Salesforce · Data Sync Pro", at: hoursAgo(3.3) },
    { id: "ac-7", actor: "Daniel Okafor", action: "deployed WAF mitigation", target: "edge fleet (INC-1045)", at: daysAgo(2, 9, 30) },
    { id: "ac-8", actor: "Maya Chen", action: "disabled URL preview flag", target: "Admin Console (INC-1037)", at: hoursAgo(6) },
  ];
}

export function buildScoreHistory(): ScorePoint[] {
  // 30 days of score history ending at 92.
  const raw = [
    78, 78, 77, 77, 79, 80, 80, 82, 82, 81,
    83, 84, 84, 86, 86, 85, 87, 88, 88, 88,
    89, 89, 91, 90, 90, 91, 91, 92, 92, 92,
  ];
  return raw.map((score, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (raw.length - 1 - i));
    return { date: d.toISOString().slice(0, 10), score };
  });
}

export function buildIncidentTrend(): IncidentTrendPoint[] {
  const opened = [3, 2, 4, 1, 2, 3, 5, 2, 1, 3, 2, 2, 4, 3];
  const resolved = [2, 2, 3, 2, 2, 3, 4, 3, 2, 3, 2, 3, 3, 2];
  return opened.map((o, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (opened.length - i));
    return { date: d.toISOString().slice(0, 10), opened: o, resolved: resolved[i] };
  });
}

export function buildApiKeys(): ApiKey[] {
  return [
    { id: "k-1", name: "CI pipeline (default)", prefix: "snt_live_9fQ2…", createdAt: daysAgo(90, 10), lastUsed: hoursAgo(0.4) },
    { id: "k-2", name: "Terraform drift reporter", prefix: "snt_live_4Kx8…", createdAt: daysAgo(45, 16), lastUsed: daysAgo(1, 3) },
    { id: "k-3", name: "Grafana sync", prefix: "snt_live_7Bm1…", createdAt: daysAgo(12, 9), lastUsed: null },
  ];
}

export function buildWorkspace(): Workspace {
  return {
    id: "ws-1",
    name: "Northbeam Labs",
    plan: "Enterprise",
    region: "us-east-1",
  };
}
