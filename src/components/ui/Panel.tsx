import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]", className)}
      {...props}
    />
  );
}

export function PanelHeader({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-4 py-2.5 sm:px-5">
      <h2 className="text-[13px] font-semibold text-zinc-950">{title}</h2>
      {action}
      {children}
    </div>
  );
}
