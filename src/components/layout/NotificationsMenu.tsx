import { Bell, CheckCheck } from "lucide-react";
import { Menu, MenuDivider, MenuItem } from "@/components/ui/Menu";
import { useStore } from "@/lib/store";
import { cn, relativeTime } from "@/lib/utils";
import type { Notification } from "@/types";

const kindDot: Record<Notification["kind"], string> = {
  incident: "bg-red-500",
  asset: "bg-amber-500",
  team: "bg-sky-500",
  system: "bg-zinc-400",
};

export function NotificationsMenu() {
  const { notifications, markRead, markAllRead } = useStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Menu
      label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
      trigger={
        <span className="relative flex size-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950">
          <Bell size={16} strokeWidth={1.8} />
          {unread > 0 && (
            <span aria-hidden className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-600 ring-2 ring-white" />
          )}
        </span>
      }
    >
      {(close) => (
        <div className="w-[min(92vw,380px)]">
          <div className="flex items-center justify-between px-2.5 py-2">
            <span className="text-[13px] font-semibold text-zinc-950">Notifications</span>
            <button
              onClick={() => markAllRead()}
              className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
            >
              <CheckCheck size={13} aria-hidden /> Mark all read
            </button>
          </div>
          <MenuDivider />
          <ul className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <li className="px-3 py-6 text-center text-[13px] text-zinc-500">You're all caught up.</li>
            )}
            {notifications.map((n) => (
              <li key={n.id}>
                <MenuItem
                  onClick={() => {
                    markRead(n.id);
                    close();
                  }}
                  className="items-start"
                >
                  <span aria-hidden className={cn("mt-1.5 size-2 shrink-0 rounded-full", kindDot[n.kind], n.read && "opacity-30")} />
                  <span className="min-w-0 text-left">
                    <span className={cn("block text-[13px]", n.read ? "font-normal text-zinc-600" : "font-medium text-zinc-950")}>
                      {n.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-zinc-500 line-clamp-2">{n.body}</span>
                    <span className="mt-1 block text-[11px] text-zinc-400">{relativeTime(n.at)}</span>
                  </span>
                </MenuItem>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Menu>
  );
}
