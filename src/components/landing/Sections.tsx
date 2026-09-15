import { KeyRound, Fingerprint, UserX, Server, Siren, Webhook, Eye, Globe, Terminal, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { SeverityBadge } from "@/components/app/Badges";
import { AssetStatusIndicator } from "@/components/ui/StatusDot";
import { ButtonLink } from "@/components/ui/Button";
import type { ReactNode } from "react";

function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  dark,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  dark?: boolean;
}) {
  return (
    <section id={id} className={dark ? "bg-zinc-950" : undefined}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <p className={`text-xs font-medium uppercase tracking-[0.14em] ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            {eyebrow}
          </p>
          <h2 className={`mt-3 text-balance text-2xl font-semibold tracking-tight sm:text-3xl ${dark ? "text-white" : "text-zinc-950"}`}>
            {title}
          </h2>
          <p className={`mt-3 text-balance text-[15px] leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
            {description}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

const CAPABILITIES: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <KeyRound size={17} strokeWidth={1.8} />,
    title: "Exposed credentials",
    body: "Continuous secret scanning across repositories, cloud storage and paste sites. Live keys are flagged within minutes and rotated through your existing tooling.",
  },
  {
    icon: <Fingerprint size={17} strokeWidth={1.8} />,
    title: "Suspicious logins",
    body: "Impossible travel, credential stuffing and anomalous device fingerprints are detected across your identity provider, VPN and SSO logs.",
  },
  {
    icon: <UserX size={17} strokeWidth={1.8} />,
    title: "Compromised accounts",
    body: "Behavioral baselines catch hijacked sessions and rogue OAuth grants before data leaves — then revoke access automatically.",
  },
  {
    icon: <Server size={17} strokeWidth={1.8} />,
    title: "Infrastructure monitoring",
    body: "Domains, endpoints, API keys and applications are scanned around the clock for misconfigurations, expirations and takeover risks.",
  },
  {
    icon: <Siren size={17} strokeWidth={1.8} />,
    title: "Incident response",
    body: "Every signal becomes a triaged incident with severity, assignee and a full timeline — from first detection to post-incident review.",
  },
  {
    icon: <Webhook size={17} strokeWidth={1.8} />,
    title: "API & automation",
    body: "Push findings into Slack, PagerDuty or your SIEM. A REST API and webhooks keep SENTRY in sync with the tools you already run.",
  },
];

export function Capabilities() {
  return (
    <SectionShell
      id="capabilities"
      eyebrow="Capabilities"
      title="Everything that moves your risk, monitored in one system."
      description="SENTRY watches the signals that actually lead to breaches — leaked secrets, stolen sessions, drifting infrastructure — and turns them into work your team can finish."
    >
      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((c) => (
          <article key={c.title} className="bg-white p-6">
            <div className="flex size-9 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-700">
              {c.icon}
            </div>
            <h3 className="mt-4 text-[15px] font-semibold text-zinc-950">{c.title}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-500">{c.body}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

const FACTORS = [
  { label: "Credential hygiene", value: 96 },
  { label: "Access control", value: 88 },
  { label: "Infrastructure posture", value: 90 },
  { label: "Incident response readiness", value: 94 },
];

export function ScoreSection() {
  return (
    <SectionShell
      id="security-score"
      eyebrow="Security score"
      title="One number your board understands. Four factors your team can act on."
      description="The SENTRY security score runs 0–100 and is recomputed as findings appear and get resolved. It weighs credential hygiene, access control, infrastructure posture and how quickly your team closes incidents — so improvement is always measurable, never cosmetic."
    >
      <div className="mt-10 grid gap-10 rounded-lg border border-zinc-200 bg-white p-6 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="flex flex-col items-center gap-3">
          <ScoreRing score={92} size={168} />
          <p className="text-[13px] font-medium text-emerald-600">Good — up 14 points this quarter</p>
        </div>
        <div>
          <ul className="space-y-5">
            {FACTORS.map((f) => (
              <li key={f.label}>
                <div className="mb-1.5 flex items-center justify-between text-[13.5px]">
                  <span className="font-medium text-zinc-950">{f.label}</span>
                  <span className="tabular text-zinc-500">{f.value}/100</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100" role="img" aria-label={`${f.label}: ${f.value} out of 100`}>
                  <div className="h-full rounded-full bg-zinc-950" style={{ width: `${f.value}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[13px] leading-relaxed text-zinc-500">
            A score is only useful if the path upward is obvious. Each factor links directly to the findings,
            incidents and assets that are currently reducing it.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

const INCIDENT_ROWS = [
  { id: "INC-1051", title: "AWS root access key published in public repository", severity: "critical", when: "2h ago" },
  { id: "INC-1049", title: "Anomalous OAuth grant on Salesforce account", severity: "critical", when: "1d ago" },
  { id: "INC-1050", title: "Impossible travel login detected (Lagos, NG)", severity: "high", when: "5h ago" },
] as const;

export function IncidentSection() {
  return (
    <SectionShell
      id="incidents"
      eyebrow="Incident monitoring"
      title="From raw signal to resolved incident — without the spreadsheet."
      description="SENTRY deduplicates and correlates raw events into incidents with severity, status, assignee and an auditable timeline. Your team triages a queue instead of a firehose."
    >
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="min-w-0 rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-4 py-3">
            <p className="text-[13px] font-semibold text-zinc-950">Incident queue</p>
            <p className="text-xs text-zinc-400">Sorted by severity · updated live</p>
          </div>
          <ul className="divide-y divide-zinc-100">
            {INCIDENT_ROWS.map((row) => (
              <li key={row.id} className="flex items-center gap-3 px-4 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-zinc-950">{row.title}</span>
                  <span className="block font-mono text-[11px] text-zinc-400">
                    {row.id} · {row.when}
                  </span>
                </span>
                <SeverityBadge severity={row.severity} />
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6 text-[14px] leading-relaxed text-zinc-600">
          <div className="flex gap-3.5">
            <Eye size={18} className="mt-0.5 shrink-0 text-zinc-400" aria-hidden />
            <p>
              <span className="font-medium text-zinc-950">Detect.</span> Signals from secret scanning, identity providers,
              cloud posture and DAST are correlated into a single incident — not six duplicate alerts.
            </p>
          </div>
          <div className="flex gap-3.5">
            <Siren size={18} className="mt-0.5 shrink-0 text-zinc-400" aria-hidden />
            <p>
              <span className="font-medium text-zinc-950">Triage.</span> Severity is assigned automatically, then adjusted by
              analysts. Every status change is recorded on the timeline for compliance and review.
            </p>
          </div>
          <div className="flex gap-3.5">
            <Webhook size={18} className="mt-0.5 shrink-0 text-zinc-400" aria-hidden />
            <p>
              <span className="font-medium text-zinc-950">Respond.</span> Containment actions — session revocation, key
              rotation, host isolation — run through the API and are logged against the incident.
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

const ASSET_ROWS = [
  { name: "AWS Access Key — prod-ingest", type: "API key", status: "critical", findings: "4 findings" },
  { name: "edge-proxy-01.northbeam.io", type: "Endpoint", status: "warning", findings: "2 findings" },
  { name: "northbeam.io", type: "Domain", status: "healthy", findings: "No findings" },
  { name: "Admin Console", type: "Application", status: "critical", findings: "2 findings" },
] as const;

export function AssetSection() {
  return (
    <SectionShell
      id="assets"
      eyebrow="Asset monitoring"
      title="Know what you run before an attacker does."
      description="SENTRY maintains a live inventory of your external and internal surface — domains, endpoints, API keys and applications — and scores each one for risk."
    >
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="min-w-0 rounded-lg border border-zinc-200 bg-white">
          <ul className="divide-y divide-zinc-100">
            {ASSET_ROWS.map((row) => (
              <li key={row.name} className="flex items-center gap-3 px-4 py-3.5">
                <AssetStatusIndicator status={row.status} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-mono text-[13px] font-medium text-zinc-950">{row.name}</span>
                  <span className="block text-[11.5px] text-zinc-400">{row.type}</span>
                </span>
                <span className="text-[12px] text-zinc-500">{row.findings}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6 text-[14px] leading-relaxed text-zinc-600">
          <div className="flex gap-3.5">
            <Globe size={18} className="mt-0.5 shrink-0 text-zinc-400" aria-hidden />
            <p>
              <span className="font-medium text-zinc-950">Domains.</span> Expirations, dangling DNS records, missing DMARC
              and look-alike registrations are tracked continuously.
            </p>
          </div>
          <div className="flex gap-3.5">
            <Terminal size={18} className="mt-0.5 shrink-0 text-zinc-400" aria-hidden />
            <p>
              <span className="font-medium text-zinc-950">Endpoints & keys.</span> Patch level, agent coverage and credential
              age are checked against your policies on every scan.
            </p>
          </div>
          <div className="flex gap-3.5">
            <Users size={18} className="mt-0.5 shrink-0 text-zinc-400" aria-hidden />
            <p>
              <span className="font-medium text-zinc-950">Applications.</span> Ownership is attached to every asset, so a
              finding routes to a person — not a shared inbox.
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

const ROLES = [
  { role: "Owner", detail: "Full control: billing, workspace settings, member management." },
  { role: "Admin", detail: "Manage members and all security data except billing." },
  { role: "Security Analyst", detail: "Triage incidents, manage assets, run scans." },
  { role: "Viewer", detail: "Read-only dashboards and reports for stakeholders." },
];

export function TeamSection() {
  return (
    <SectionShell
      id="team"
      eyebrow="Team & access"
      title="Access designed for how security teams actually work."
      description="Role-based access with a clear separation between owners, admins, analysts and viewers. Every invite, role change and membership event is logged."
    >
      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
        {ROLES.map((r) => (
          <article key={r.role} className="bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[14.5px] font-semibold text-zinc-950">{r.role}</h3>
              <Users size={15} className="text-zinc-300" aria-hidden />
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{r.detail}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function FinalCta() {
  return (
    <section className="bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Put your security posture in one place.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-balance text-[15px] leading-relaxed text-zinc-400">
          Explore the SENTRY dashboard with a fully populated demo workspace — real incidents, assets and
          team workflows, no signup required.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink to="/dashboard" size="md" className="bg-white text-zinc-950 hover:bg-zinc-200 border-white">
            Open the dashboard
          </ButtonLink>
          <ButtonLink
            to="/incidents"
            size="md"
            className="border-zinc-800 bg-transparent text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
          >
            View incidents
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

const FOOTER_COLS = [
  {
    title: "Product",
    links: ["Capabilities", "Security score", "Incidents", "Assets"],
    hrefs: ["#capabilities", "#security-score", "#incidents", "#assets"],
  },
  {
    title: "Workspace",
    links: ["Dashboard", "Incidents", "Assets", "Team"],
    hrefs: ["/dashboard", "/incidents", "/assets", "/team"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-[15px] font-semibold tracking-[0.08em] text-zinc-950">SENTRY</p>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-zinc-500">
              Security infrastructure for modern teams. Monitor risks, credentials, logins and
              infrastructure from one place.
            </p>
            <a
              href="mailto:hello@sentry.dev"
              className="mt-3 inline-block text-[13px] font-medium text-zinc-600 hover:text-zinc-950"
            >
              hello@sentry.dev
            </a>
          </div>
          {FOOTER_COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-950">{col.title}</p>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link, i) => (
                  <li key={link}>
                    {col.hrefs[i].startsWith("/") ? (
                      <Link to={col.hrefs[i]} className="text-[13px] text-zinc-500 hover:text-zinc-950">
                        {link}
                      </Link>
                    ) : (
                      <a href={col.hrefs[i]} className="text-[13px] text-zinc-500 hover:text-zinc-950">
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-zinc-400">
            <p>© 2026 SENTRY. A portfolio concept — not a real product.</p>
            <p className="mt-1">
              Designed &amp; Developed by{" "}
              <a
                href="https://lebedev-labs.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-zinc-500 hover:text-zinc-950"
              >
                Lebedev Labs
              </a>
            </p>
          </div>
          <p className="text-xs text-zinc-400">SOC 2 Type II · ISO 27001 · GDPR ready</p>
        </div>
      </div>
    </footer>
  );
}
