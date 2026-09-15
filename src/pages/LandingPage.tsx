import { LandingNav } from "@/components/landing/LandingNav";
import { PreviewWindow } from "@/components/landing/PreviewWindow";
import {
  Capabilities,
  ScoreSection,
  IncidentSection,
  AssetSection,
  TeamSection,
  FinalCta,
  Footer,
} from "@/components/landing/Sections";
import { ButtonLink } from "@/components/ui/Button";
import { usePageTitle } from "@/lib/usePageTitle";
import { ArrowRight, Check } from "lucide-react";
import { StatusDot } from "@/components/ui/StatusDot";

const HERO_POINTS = [
  "Exposed credentials",
  "Suspicious logins",
  "Compromised accounts",
  "Infrastructure drift",
];

export function LandingPage() {
  usePageTitle(
    "SENTRY — Security infrastructure for modern teams",
    "SENTRY monitors security risks, exposed credentials, suspicious logins, compromised accounts and infrastructure — your security posture, in one place.",
  );

  return (
    <div className="bg-white">
      <LandingNav />

      {/* Hero */}
      <main>
        <section className="relative overflow-hidden pt-28 sm:pt-36">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[12px] font-medium text-zinc-500">
                <StatusDot tone="bg-emerald-500" pulse />
                Security operations platform
              </p>
              <h1
                className="animate-fade-up mt-5 text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-[56px] sm:leading-[1.05]"
                style={{ animationDelay: "60ms" }}
              >
                Your security posture, in one place.
              </h1>
              <p
                className="animate-fade-up mx-auto mt-5 max-w-2xl text-balance text-[16.5px] leading-relaxed text-zinc-500"
                style={{ animationDelay: "120ms" }}
              >
                SENTRY continuously monitors security risks across your organization — exposed
                credentials, suspicious logins, compromised accounts and infrastructure — and turns
                them into incidents your team can actually resolve.
              </p>
              <div className="animate-fade-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "180ms" }}>
                <ButtonLink to="/dashboard" size="md" className="px-5">
                  Open live dashboard
                  <ArrowRight size={15} aria-hidden />
                </ButtonLink>
                <ButtonLink to="/dashboard" variant="secondary" size="md" className="px-5">
                  Explore demo workspace
                </ButtonLink>
              </div>
              <ul className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2" style={{ animationDelay: "240ms" }}>
                {HERO_POINTS.map((point) => (
                  <li key={point} className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-500">
                    <Check size={14} className="text-emerald-600" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="animate-fade-up mt-14 sm:mt-16" style={{ animationDelay: "300ms" }}>
              <PreviewWindow />
            </div>
          </div>
        </section>

        <Capabilities />
        <ScoreSection />
        <IncidentSection />
        <AssetSection />
        <TeamSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
