import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import { Menu, MenuDivider, MenuItem, MenuLabel } from "@/components/ui/Menu";
import { useStore } from "@/lib/store";

export function WorkspaceSelector() {
  const { workspace, toast } = useStore();
  return (
    <Menu
      align="left"
      label="Select workspace"
      trigger={
        <span className="flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[13px] font-medium text-zinc-950 hover:border-zinc-300">
          <Building2 size={15} className="text-zinc-400" aria-hidden />
          <span className="max-w-36 truncate">{workspace.name || "Workspace"}</span>
          <ChevronsUpDown size={13} className="text-zinc-400" aria-hidden />
        </span>
      }
    >
      {(close) => (
        <div className="w-64">
          <MenuLabel>Workspaces</MenuLabel>
          <MenuItem onClick={close}>
            <span className="flex w-full items-center justify-between gap-2">
              <span className="min-w-0">
                <span className="block truncate font-medium text-zinc-950">{workspace.name}</span>
                <span className="block text-xs text-zinc-500">{workspace.plan} · {workspace.region}</span>
              </span>
              <Check size={14} className="text-zinc-900" aria-hidden />
            </span>
          </MenuItem>
          <MenuDivider />
          <MenuItem
            onClick={() => {
              close();
              toast("Multi-workspace support is coming soon.");
            }}
          >
            <Plus size={15} aria-hidden /> New workspace
          </MenuItem>
        </div>
      )}
    </Menu>
  );
}
