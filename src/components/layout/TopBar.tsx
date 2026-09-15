import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu as MenuIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SidebarNav } from "@/components/layout/Sidebar";
import { NotificationsMenu } from "@/components/layout/NotificationsMenu";
import { UserMenu } from "@/components/layout/UserMenu";
import { WorkspaceSelector } from "@/components/layout/WorkspaceSelector";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { roleMeta } from "@/lib/status";

export function TopBar() {
  const { currentUser, workspace } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <button
          className="flex size-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
        >
          <MenuIcon size={18} />
        </button>

        <div className="lg:hidden">
          <Link to="/dashboard" aria-label="SENTRY home">
            <Logo />
          </Link>
        </div>

        <div className="hidden lg:block">
          <WorkspaceSelector />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <span className="mr-1 hidden items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-500 md:inline-flex">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-emerald-500" />
            All systems monitored
          </span>
          <NotificationsMenu />
          <div className="lg:hidden">
            <UserMenu />
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-zinc-950/40 animate-fade-in" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl animate-slide-up">
            <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="px-3 py-3">
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="mt-auto border-t border-zinc-200 p-3">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-zinc-100"
              >
                <Avatar name={currentUser.name || "User"} />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium text-zinc-950">{currentUser.name}</span>
                  <span className="block truncate text-xs text-zinc-500">
                    {roleMeta[currentUser.role].label} · {workspace.name}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
