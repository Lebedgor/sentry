import { useNavigate } from "react-router-dom";
import { LogOut, Settings, UserRound } from "lucide-react";
import { Menu, MenuDivider, MenuItem, MenuLabel } from "@/components/ui/Menu";
import { Avatar } from "@/components/ui/Avatar";
import { useStore } from "@/lib/store";
import { roleMeta } from "@/lib/status";

export function UserMenu() {
  const { currentUser, toast } = useStore();
  const navigate = useNavigate();
  return (
    <Menu
      label="User menu"
      trigger={
        <span className="flex size-8 items-center justify-center rounded-md hover:bg-zinc-100">
          <Avatar name={currentUser.name || "User"} size="sm" />
        </span>
      }
    >
      {(close) => (
        <div className="w-60">
          <div className="flex items-center gap-3 px-2.5 py-2">
            <Avatar name={currentUser.name || "User"} />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-zinc-950">{currentUser.name}</p>
              <p className="truncate text-xs text-zinc-500">{currentUser.email}</p>
            </div>
          </div>
          <p className="px-2.5 pb-1 text-[11px] text-zinc-400">{roleMeta[currentUser.role].label}</p>
          <MenuDivider />
          <MenuLabel>Workspace</MenuLabel>
          <MenuItem
            onClick={() => {
              close();
              navigate("/settings");
            }}
          >
            <UserRound size={15} aria-hidden /> Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              close();
              navigate("/settings");
            }}
          >
            <Settings size={15} aria-hidden /> Settings
          </MenuItem>
          <MenuDivider />
          <MenuItem
            onClick={() => {
              close();
              toast("This is a demo workspace — sign-out is disabled.");
            }}
          >
            <LogOut size={15} aria-hidden /> Sign out
          </MenuItem>
        </div>
      )}
    </Menu>
  );
}
