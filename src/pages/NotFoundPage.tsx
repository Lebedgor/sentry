import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/Logo";
import { usePageTitle } from "@/lib/usePageTitle";

export function NotFoundPage() {
  usePageTitle("Page not found — SENTRY");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6">
      <Logo />
      <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.14em] text-zinc-400">404</p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">This page doesn't exist</h1>
      <p className="mt-2 max-w-sm text-center text-sm text-zinc-500">
        The page you're looking for may have been moved, or the address is incorrect.
      </p>
      <div className="mt-6 flex gap-2">
        <ButtonLink to="/" size="sm" variant="secondary">
          Back to home
        </ButtonLink>
        <ButtonLink to="/dashboard" size="sm">
          Open dashboard
        </ButtonLink>
      </div>
    </div>
  );
}
