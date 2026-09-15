import { cn } from "@/lib/utils";

export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="7" fill="currentColor" className="text-zinc-950" />
      <path d="M16 6l9 3.5v6.2c0 5.5-3.8 9.4-9 10.8-5.2-1.4-9-5.3-9-10.8V9.5L16 6z" fill="none" stroke="#fafafa" strokeWidth="2" strokeLinejoin="round" />
      <path d="M11.5 16l3 3 6-6.5" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, invert }: { className?: string; invert?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={invert ? "text-white" : undefined} />
      <span
        className={cn(
          "text-[15px] font-semibold tracking-[0.08em]",
          invert ? "text-white" : "text-zinc-950",
        )}
      >
        SENTRY
      </span>
    </span>
  );
}
