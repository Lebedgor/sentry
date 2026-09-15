import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShieldAlert, Server, Users, Settings } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/incidents", label: "Incidents", icon: ShieldAlert, countKey: "incidents" },
  { to: "/assets", label: "Assets", icon: Server },
  { to: "/team", label: "Team", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { incidents } = useStore();
  const openCount = incidents.filter((i) => i.status !== "resolved").length;

  return (
    <nav aria-label="Primary">
      <ul className="space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon, ...rest }) => (
          <li key={to}>
            <NavLink
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-zinc-100 text-zinc-950" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950",
                )
              }
            >
              <Icon size={16} strokeWidth={1.8} aria-hidden />
              {label}
              {"countKey" in rest && rest.countKey === "incidents" && openCount > 0 && (
                <span className="tabular ml-auto rounded-full bg-zinc-950 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {openCount}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Sidebar() {
  const { workspace, currentUser } = useStore();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-zinc-200 bg-white lg:flex">
      <div className="flex h-14 items-center border-b border-zinc-200 px-5">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto px-2.5 py-4">
        <SidebarNav />
      </div>
      <div className="border-t border-zinc-200 p-2.5">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          <span aria-hidden className="mt-0.5 inline-block size-1.5 shrink-0 rounded-full bg-emerald-500" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-zinc-950">{workspace.name}</p>
            <p className="truncate text-[11px] text-zinc-500">
              {workspace.plan} · {currentUser.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
