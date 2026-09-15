import { cn, initials } from "@/lib/utils";

const palette = [
  "bg-zinc-800",
  "bg-zinc-700",
  "bg-stone-700",
  "bg-neutral-800",
  "bg-zinc-900",
];

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const hash = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const sizes = {
    sm: "size-6 text-[10px]",
    md: "size-8 text-xs",
    lg: "size-10 text-sm",
  };
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white uppercase",
        palette[hash % palette.length],
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
