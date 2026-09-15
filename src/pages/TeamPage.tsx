import { useMemo, useState } from "react";
import { UserPlus, ShieldCheck, Mail } from "lucide-react";
import { PageHeader } from "@/components/app/Layout";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { SearchInput, Select, Field, Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Overlay";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStore } from "@/lib/store";
import { usePageTitle } from "@/lib/usePageTitle";
import { relativeTime, titleCase, cn } from "@/lib/utils";
import { roleMeta } from "@/lib/status";
import type { Role, MemberStatus } from "@/types";

const ROLES: Role[] = ["owner", "admin", "security_analyst", "viewer"];

const statusStyle: Record<MemberStatus, { badge: string; dot: string }> = {
  active: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  invited: { badge: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500" },
  suspended: { badge: "bg-zinc-100 text-zinc-500 border-zinc-200", dot: "bg-zinc-400" },
};

export function TeamPage() {
  const { users, currentUser, inviteMember, updateMember, toast } = useStore();
  usePageTitle("Team — SENTRY");

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("security_analyst");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (q && !`${u.name} ${u.email}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [users, query, roleFilter]);

  const handleInvite = () => {
    const email = inviteEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Enter a valid email address");
      return;
    }
    if (users.some((u) => u.email === email)) {
      toast("That email is already a member");
      return;
    }
    inviteMember(email, inviteRole);
    toast(`Invite sent to ${email}`);
    setInviteOpen(false);
    setInviteEmail("");
    setInviteRole("security_analyst");
  };

  const changeRole = (id: string, name: string, role: Role) => {
    updateMember(id, { role });
    toast(`${name} is now ${roleMeta[role].label}`);
  };

  const toggleStatus = (id: string, name: string, status: MemberStatus) => {
    const next: MemberStatus = status === "suspended" ? "active" : "suspended";
    updateMember(id, { status: next });
    toast(next === "suspended" ? `${name} suspended` : `${name} reinstated`);
  };

  const counts = {
    active: users.filter((u) => u.status === "active").length,
    invited: users.filter((u) => u.status === "invited").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Team"
        description="Members, roles and access for the Northbeam Labs workspace."
        action={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus size={15} aria-hidden /> Invite member
          </Button>
        }
      />

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          label="Search team members"
          placeholder="Search by name or email…"
          className="sm:w-72"
        />
        <Select
          label="Filter by role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="sm:w-48"
        >
          <option value="all">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {roleMeta[r].label}
            </option>
          ))}
        </Select>
        <span className="tabular text-sm text-zinc-500 sm:ml-auto">
          {counts.active} active · {counts.invited} invited · {counts.suspended} suspended
        </span>
      </div>

      {filtered.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<UserPlus size={18} />}
            title="No members found"
            description="Try a different search term, or invite a new member to the workspace."
            action={
              <Button variant="secondary" size="sm" onClick={() => setInviteOpen(true)}>
                <Mail size={14} aria-hidden /> Invite member
              </Button>
            }
          />
        </Panel>
      ) : (
        <Panel className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13.5px]">
            <caption className="sr-only">Workspace team members</caption>
            <thead>
              <tr className="border-b border-zinc-200 text-[11.5px] uppercase tracking-wide text-zinc-400">
                <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Member</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Role</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Last active</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium sm:px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((member) => {
                const isSelf = member.id === currentUser.id;
                const isOwner = member.role === "owner";
                return (
                  <tr key={member.id} className="transition-colors hover:bg-zinc-50">
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-3">
                        <Avatar name={member.name} />
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 font-medium text-zinc-950">
                            {member.name}
                            {isSelf && <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">You</span>}
                          </p>
                          <p className="truncate text-xs text-zinc-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      {isOwner || isSelf ? (
                        <span className="inline-flex items-center gap-1.5 text-zinc-700">
                          <ShieldCheck size={14} className={isOwner ? "text-zinc-950" : "text-zinc-400"} aria-hidden />
                          {roleMeta[member.role].label}
                        </span>
                      ) : (
                        <Select
                          label={`Change role for ${member.name}`}
                          value={member.role}
                          onChange={(e) => changeRole(member.id, member.name, e.target.value as Role)}
                          className="h-8 w-44 text-[13px]"
                        >
                          {ROLES.filter((r) => r !== "owner" || isOwner).map((r) => (
                            <option key={r} value={r}>
                              {roleMeta[r].label}
                            </option>
                          ))}
                        </Select>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11.5px] font-medium", statusStyle[member.status].badge)}>
                        <span aria-hidden className={cn("size-1.5 rounded-full", statusStyle[member.status].dot)} />
                        {titleCase(member.status)}
                      </span>
                    </td>
                    <td className="tabular whitespace-nowrap px-3 py-3 text-zinc-500">{relativeTime(member.lastActive)}</td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      {isOwner || isSelf || member.status === "invited" ? (
                        <span className="text-xs text-zinc-300">—</span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStatus(member.id, member.name, member.status)}
                        >
                          {member.status === "suspended" ? "Reinstate" : "Suspend"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      )}

      {/* Role reference */}
      <Panel className="p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-zinc-950">Role permissions</h2>
        <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {ROLES.map((r) => (
            <div key={r} className="flex gap-3 text-[13px]">
              <dt className="w-32 shrink-0 font-medium text-zinc-950">{roleMeta[r].label}</dt>
              <dd className="text-zinc-500">{roleMeta[r].description}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      {/* Invite modal */}
      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite a member"
        description="They'll receive an email invitation to join Northbeam Labs."
      >
        <div className="space-y-4">
          <Field label="Email address" htmlFor="invite-email" hint="Use a work email — personal domains can be restricted by policy.">
            <Input
              id="invite-email"
              type="email"
              placeholder="name@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              autoFocus
            />
          </Field>
          <Field label="Role" htmlFor="invite-role">
            <Select id="invite-role" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as Role)}>
              {ROLES.filter((r) => r !== "owner").map((r) => (
                <option key={r} value={r}>
                  {roleMeta[r].label} — {roleMeta[r].description}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4">
            <Button variant="secondary" size="sm" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleInvite}>
              <Mail size={14} aria-hidden /> Send invite
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
