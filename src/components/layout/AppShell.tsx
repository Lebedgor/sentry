import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Toaster } from "@/components/ui/Toaster";
import { useStore } from "@/lib/store";
import { LogoMark } from "@/components/Logo";

function ShellLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50" role="status" aria-label="Loading workspace">
      <div className="flex flex-col items-center gap-3">
        <span className="animate-pulse-dot">
          <LogoMark size={36} />
        </span>
        <span className="text-sm text-zinc-400">Loading workspace…</span>
      </div>
    </div>
  );
}

function ShellError({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-950">Something went wrong</p>
        <p className="mt-1 text-sm text-zinc-500">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex h-8 items-center rounded-md border border-zinc-200 bg-white px-3 text-[13px] font-medium text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export function AppShell() {
  const { loading, error } = useStore();
  if (loading) return <ShellLoading />;
  if (error) return <ShellError message={error} />;

  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar />
      <div className="lg:pl-56">
        <TopBar />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
        <footer className="border-t border-zinc-200 px-4 py-4 sm:px-6">
          <p className="text-xs text-zinc-400">
            SENTRY · Security infrastructure for modern teams — demo workspace with simulated data.
          </p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
}
