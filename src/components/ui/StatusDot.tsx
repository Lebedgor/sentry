import { cn } from "@/lib/utils";
import { assetStatusMeta } from "@/lib/status";
import type { AssetStatus } from "@/types";

export function StatusDot({ tone, pulse, className }: { tone: string; pulse?: boolean; className?: string }) {
  return (
    <span aria-hidden className={cn("inline-block size-2 rounded-full", tone, pulse && "animate-pulse-dot", className)} />
  );
}

export function AssetStatusIndicator({ status, label }: { status: AssetStatus; label?: boolean }) {
  const meta = assetStatusMeta[status];
  return (
    <span className="inline-flex items-center gap-2 text-[13px]">
      <StatusDot tone={meta.dot} pulse={status === "critical"} />
      {label && <span className={meta.text}>{meta.label}</span>}
    </span>
  );
}
