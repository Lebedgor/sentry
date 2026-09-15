import { useStore } from "@/lib/store";
import { CheckCircle2 } from "lucide-react";

export function Toaster() {
  const { toasts } = useStore();
  if (toasts.length === 0) return null;
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-[13px] text-white shadow-lg animate-toast-in"
        >
          <CheckCircle2 size={14} className="text-emerald-400" aria-hidden />
          {t.message}
        </div>
      ))}
    </div>
  );
}
