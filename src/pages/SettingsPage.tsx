import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserRound, Lock, Bell, KeyRound, Building2, Copy, Eye, EyeOff, Plus, Trash2, Check, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/app/Layout";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Input, Field, Select } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { useStore } from "@/lib/store";
import { usePageTitle } from "@/lib/usePageTitle";
import { cn, relativeTime } from "@/lib/utils";
import { roleMeta } from "@/lib/status";
import type { ApiKey } from "@/types";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api", label: "API", icon: KeyRound },
  { id: "workspace", label: "Workspace", icon: Building2 },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-3.5">
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium text-zinc-950">{label}</p>
        <p className="mt-0.5 text-[13px] text-zinc-500">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-5.5 w-10 shrink-0 rounded-full border transition-colors",
          checked ? "border-zinc-950 bg-zinc-950" : "border-zinc-300 bg-zinc-200",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow transition-all",
            checked ? "left-[22px]" : "left-[3px]",
          )}
        />
      </button>
    </div>
  );
}

function ProfileSection() {
  const { currentUser, updateCurrentUser, toast } = useStore();
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  const [timezone, setTimezone] = useState("Europe/Berlin");
  const dirty = name !== currentUser.name || title !== currentUser.title;

  const save = () => {
    updateCurrentUser({ name: name.trim() || currentUser.name, title: title.trim() || currentUser.title });
    toast("Profile updated");
  };

  return (
    <Panel>
      <PanelHeader title="Profile" />
      <div className="space-y-6 p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <Avatar name={name || currentUser.name} size="lg" />
          <div>
            <p className="text-[13.5px] font-medium text-zinc-950">{currentUser.email}</p>
            <p className="text-xs text-zinc-500">
              {roleMeta[currentUser.role].label} · Member since Mar 2025
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="profile-name">
            <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Job title" htmlFor="profile-title">
            <Input id="profile-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Email" htmlFor="profile-email" hint="Contact a workspace owner to change your email.">
            <Input id="profile-email" value={currentUser.email} disabled />
          </Field>
          <Field label="Timezone" htmlFor="profile-tz">
            <Select id="profile-tz" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              <option>Europe/Berlin</option>
              <option>Europe/London</option>
              <option>America/New_York</option>
              <option>America/Los_Angeles</option>
              <option>Asia/Singapore</option>
            </Select>
          </Field>
        </div>
        <div className="border-t border-zinc-200 pt-4">
          <Button size="sm" disabled={!dirty} onClick={save}>
            Save changes
          </Button>
        </div>
      </div>
    </Panel>
  );
}

const INITIAL_SESSIONS = [
  { id: "s-1", device: "MacBook Pro — Berlin, DE", detail: "Chrome 141 · current session", current: true },
  { id: "s-2", device: "iPhone 17 — Berlin, DE", detail: "SENTRY iOS app · 2h ago", current: false },
];

function SecuritySection() {
  const { toast } = useStore();
  const [mfa, setMfa] = useState(true);
  const [autoExpiry, setAutoExpiry] = useState(true);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [alerts, setAlerts] = useState(true);

  const revoke = (id: string, device: string) => {
    setSessions((list) => list.filter((s) => s.id !== id));
    toast(`Session revoked: ${device}`);
  };

  return (
    <div className="space-y-3">
      <Panel>
        <PanelHeader title="Security" />
        <div className="divide-y divide-zinc-100 px-4 sm:px-5">
          <Toggle
            label="Multi-factor authentication"
            description="Require a hardware key or TOTP app for every sign-in."
            checked={mfa}
            onChange={(v) => {
              setMfa(v);
              toast(v ? "MFA enforced on your account" : "MFA disabled — not recommended");
            }}
          />
          <Toggle
            label="Automatic session expiry"
            description="Sign out inactive sessions after 12 hours."
            checked={autoExpiry}
            onChange={setAutoExpiry}
          />
          <Toggle
            label="Alert on new device sign-in"
            description="Email me when a login occurs from an unrecognized device."
            checked={alerts}
            onChange={setAlerts}
          />
        </div>
      </Panel>
      <Panel>
        <PanelHeader
          title="Active sessions"
          action={
            sessions.length > 1 ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const current = sessions.find((s) => s.current);
                  setSessions(sessions.filter((s) => s.current));
                  toast(current ? "All other sessions revoked" : "All sessions revoked");
                }}
              >
                Revoke all others
              </Button>
            ) : undefined
          }
        />
        <ul className="divide-y divide-zinc-100 text-[13px]">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <p className="truncate font-medium text-zinc-950">{s.device}</p>
                <p className="text-xs text-zinc-500">{s.detail}</p>
              </div>
              {s.current ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-emerald-700">
                  <Check size={13} aria-hidden /> Active
                </span>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => revoke(s.id, s.device)}>
                  Revoke
                </Button>
              )}
            </li>
          ))}
          {sessions.length === 1 && (
            <li className="px-4 py-3 text-xs text-zinc-400 sm:px-5">No other active sessions.</li>
          )}
        </ul>
      </Panel>
    </div>
  );
}

function NotificationsSection() {
  const { toast } = useStore();
  const [prefs, setPrefs] = useState({
    criticalIncidents: true,
    credentialExposure: true,
    weeklyDigest: true,
    assetFindings: false,
    teamActivity: false,
  });

  const set = (key: keyof typeof prefs) => (v: boolean) => {
    setPrefs((p) => ({ ...p, [key]: v }));
    toast("Notification preferences saved");
  };

  return (
    <Panel>
      <PanelHeader title="Notifications" />
      <div className="divide-y divide-zinc-100 px-4 sm:px-5">
        <Toggle label="Critical incidents" description="Immediate email and push for critical severity incidents." checked={prefs.criticalIncidents} onChange={set("criticalIncidents")} />
        <Toggle label="Credential exposure" description="Alert the moment a live secret is detected anywhere." checked={prefs.credentialExposure} onChange={set("credentialExposure")} />
        <Toggle label="Asset scan findings" description="New high or critical findings on monitored assets." checked={prefs.assetFindings} onChange={set("assetFindings")} />
        <Toggle label="Team activity" description="Invites, role changes and access requests." checked={prefs.teamActivity} onChange={set("teamActivity")} />
        <Toggle label="Weekly digest" description="Posture summary and incident recap every Monday." checked={prefs.weeklyDigest} onChange={set("weeklyDigest")} />
      </div>
    </Panel>
  );
}

function maskKey(key: ApiKey) {
  return `${key.prefix}${"•".repeat(20)}`;
}

function ApiSection() {
  const { apiKeys, addApiKey, revokeApiKey, toast } = useStore();
  const [revealed, setRevealed] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");

  const createKey = () => {
    const name = newKeyName.trim();
    if (!name) {
      toast("Give the key a name first");
      return;
    }
    addApiKey(name);
    setNewKeyName("");
    toast(`API key "${name}" created`);
  };

  const copy = (key: ApiKey) => {
    void navigator.clipboard?.writeText(maskKey(key)).catch(() => {});
    toast("Key copied to clipboard");
  };

  return (
    <div className="space-y-3">
      <Panel>
        <PanelHeader
          title="API keys"
          action={
            <span className="hidden text-xs text-zinc-400 sm:block">Base URL: api.sentry.dev/v1</span>
          }
        />
        <ul className="divide-y divide-zinc-100">
          {apiKeys.map((key) => (
            <li key={key.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-[13px] sm:px-5">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-950">{key.name}</p>
                <p className="font-mono text-xs text-zinc-500">
                  {revealed === key.id ? `snt_live_9fQ2xV7kLm3Rp8TzW1yBnD4qJhCeFgAu6iS0oXvNb5` : maskKey(key)}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-400">
                  Created {relativeTime(key.createdAt)} · Last used {relativeTime(key.lastUsed)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRevealed(revealed === key.id ? null : key.id)}
                  aria-label={revealed === key.id ? `Hide key ${key.name}` : `Reveal key ${key.name}`}
                  className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                >
                  {revealed === key.id ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  onClick={() => copy(key)}
                  aria-label={`Copy key ${key.name}`}
                  className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                >
                  <Copy size={15} />
                </button>
                <button
                  onClick={() => {
                    revokeApiKey(key.id);
                    toast(`API key "${key.name}" revoked`);
                  }}
                  aria-label={`Revoke key ${key.name}`}
                  className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 border-t border-zinc-200 p-4 sm:flex-row sm:items-center sm:px-5">
          <Input
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="New key name (e.g. Terraform reporter)"
            aria-label="New API key name"
            className="sm:max-w-xs"
            onKeyDown={(e) => e.key === "Enter" && createKey()}
          />
          <Button size="sm" onClick={createKey}>
            <Plus size={14} aria-hidden /> Create key
          </Button>
        </div>
      </Panel>

      <Panel className="p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-zinc-950">Webhook endpoint</h3>
        <p className="mt-1 text-[13px] text-zinc-500">
          SENTRY POSTs signed JSON events for incident and finding changes.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <code className="min-w-0 flex-1 overflow-x-auto rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-[12.5px] text-zinc-700">
            https://hooks.northbeam.io/sentry/security-events
          </code>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              void navigator.clipboard?.writeText("https://hooks.northbeam.io/sentry/security-events").catch(() => {});
              toast("Webhook URL copied");
            }}
          >
            <Copy size={13} aria-hidden /> Copy
          </Button>
        </div>
      </Panel>
    </div>
  );
}

function WorkspaceSection() {
  const { workspace, users, toast, updateWorkspace, resetDemo } = useStore();
  const [name, setName] = useState(workspace.name);
  const [region, setRegion] = useState(workspace.region);
  const dirty = name !== workspace.name || region !== workspace.region;

  return (
    <div className="space-y-3">
      <Panel>
        <PanelHeader title="Workspace" />
        <div className="space-y-4 p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Workspace name" htmlFor="ws-name">
              <Input id="ws-name" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Data region" htmlFor="ws-region" hint="Where security data is stored and processed.">
              <Select id="ws-region" value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="us-east-1">us-east-1 (N. Virginia)</option>
                <option value="eu-central-1">eu-central-1 (Frankfurt)</option>
                <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
              </Select>
            </Field>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5">
            <div>
              <p className="text-[13.5px] font-medium text-zinc-950">Enterprise plan</p>
              <p className="text-[13px] text-zinc-500">
                Unlimited assets and scans · {users.length} seats used · renews Jan 2027
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => toast("Billing portal is disabled in this demo")}>
              Manage billing
            </Button>
          </div>
          <div className="border-t border-zinc-200 pt-4">
            <Button
              size="sm"
              disabled={!dirty}
              onClick={() => {
                updateWorkspace({ name: name.trim() || workspace.name, region });
                toast("Workspace settings saved");
              }}
            >
              Save changes
            </Button>
          </div>
        </div>
      </Panel>
      <Panel className="p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-zinc-950">Demo data</h3>
        <p className="mt-1 text-[13px] text-zinc-500">
          Your changes are kept in this browser. Reset restores the original demo dataset.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              resetDemo();
              toast("Demo data reset");
            }}
          >
            <RotateCcw size={14} aria-hidden /> Reset demo data
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => toast("Workspace deletion is disabled in this demo")}
          >
            Delete workspace
          </Button>
        </div>
      </Panel>
    </div>
  );
}

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionParam = searchParams.get("section");
  const section: SectionId = SECTIONS.some((s) => s.id === sectionParam)
    ? (sectionParam as SectionId)
    : "profile";
  const setSection = (next: SectionId) => setSearchParams(next === "profile" ? {} : { section: next });
  usePageTitle("Settings — SENTRY");

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" description="Manage your profile, security posture, notifications, API access and workspace." />

      <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
        {/* Section nav */}
        <nav aria-label="Settings sections" className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          <div className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0" role="group" aria-label="Settings sections" aria-orientation="vertical">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                aria-pressed={section === id}
                onClick={() => setSection(id)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors",
                  section === id
                    ? "bg-zinc-100 text-zinc-950"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950",
                )}
              >
                <Icon size={15} strokeWidth={1.8} aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </nav>

        <div className="min-w-0">
          {section === "profile" && <ProfileSection />}
          {section === "security" && <SecuritySection />}
          {section === "notifications" && <NotificationsSection />}
          {section === "api" && <ApiSection />}
          {section === "workspace" && <WorkspaceSection />}
        </div>
      </div>
    </div>
  );
}
