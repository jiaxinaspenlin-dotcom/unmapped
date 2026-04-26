import { ArrowRight, Bot, Building2, Compass, Map, MessageSquareText, Target, UserRound, Wallet } from "lucide-react";
import { CountryCode, InstitutionRole } from "../types/domain";

interface LandingProps {
  countryCode: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  onStartYouth: () => void;
  onStartInstitution: (role?: InstitutionRole) => void;
}

export function Landing({ onStartYouth, onStartInstitution }: LandingProps) {
  const flow = [
    { icon: MessageSquareText, label: "Tell us what you've done" },
    { icon: Wallet, label: "Build your Skills Passport" },
    { icon: Bot, label: "See what artificial intelligence tools can help with" },
    { icon: Map, label: "Choose a path" },
    { icon: Target, label: "Get next steps" },
  ];

  return (
    <section>
      <div className="relative overflow-hidden bg-gradient-to-br from-[#071832] via-[#11366f] to-[#1266d6] text-white">
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#2f80ff]/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#1266d6]/30 blur-3xl" />
        <div className="relative mx-auto max-w-[1608px] px-6 pb-28 pt-10 sm:px-8 lg:pb-32 lg:pt-16 xl:px-0">
          <div className="max-w-[1120px] py-16 lg:py-28">
            <h1 className="text-5xl font-black leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Turn invisible skills into visible opportunity.
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-8 text-white/75 sm:text-2xl sm:leading-9">
              UNMAPPED helps youth and support organizations translate informal experience into a Skills Passport,
              artificial intelligence readiness map, and local opportunity plan.
            </p>
          </div>

          <div className="grid max-w-[1350px] gap-8 md:grid-cols-2">
            <RoleCard
              icon={Compass}
              title="Build a Skills Passport"
              subtitle="For youth users and community navigators."
              cta="Start your passport"
              onClick={onStartYouth}
              accent
            />
            <RoleCard
              icon={Building2}
              title="Open Institution Dashboard"
              subtitle="For employers, non-governmental organizations, governments, and training providers."
              cta="Open dashboard"
              onClick={() => onStartInstitution("employer")}
            />
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1608px] px-6 py-16 sm:px-8 sm:py-20 xl:px-0">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#1266d6]">How it works</div>
            <h2 className="text-3xl font-black tracking-tight text-ink">From your story to a real plan in five steps.</h2>
          </div>
          <button className="focus-ring inline-flex items-center gap-2 rounded-2xl bg-[#2f66cf] px-6 py-4 font-black text-white shadow-elevated" onClick={onStartYouth} type="button">
            Try the youth flow
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-card sm:p-8">
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {flow.map((step, index) => {
              const Icon = step.icon;
              return (
                <li className="rounded-2xl bg-[#eef7ff]/80 p-5 transition-spring hover:-translate-y-0.5 hover:bg-[#ddf3ff]" key={step.label}>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#2f80ff]/15 text-sm font-black text-[#1266d6]">{index + 1}</span>
                    <Icon className="h-4 w-4 text-[#1266d6]" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-black leading-snug text-ink">{step.label}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: Wallet, title: "Portable Skills Passport", text: "A wallet-style profile that travels with the user across employers and programs." },
            { icon: Bot, title: "Artificial intelligence readiness, not fear", text: "See what tools can help, what still needs you, and what to build next." },
            { icon: Target, title: "Local opportunity match", text: "Pathways grounded in country-specific labor-market signals." },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <article className="rounded-[1.5rem] border border-white/70 bg-white/75 p-6 shadow-card" key={card.title}>
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#1266d6] to-[#2f80ff] text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-black text-ink">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}

function RoleCard({
  icon: Icon,
  title,
  subtitle,
  cta,
  onClick,
  accent,
}: {
  icon: typeof UserRound;
  title: string;
  subtitle: string;
  cta: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      className={`focus-ring group relative min-h-60 overflow-hidden rounded-[2rem] bg-white/90 p-8 text-left text-ink shadow-elevated transition-spring hover:-translate-y-1 ${accent ? "ring-1 ring-[#2f80ff]/40" : ""}`}
      onClick={onClick}
      type="button"
    >
      {accent && <div className="absolute inset-0 bg-gradient-to-br from-[#2f80ff]/10 to-[#ddf3ff]/40" />}
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className={`grid h-14 w-14 place-items-center rounded-2xl ${accent ? "bg-gradient-to-br from-[#1266d6] to-[#2f80ff] text-white shadow-glow" : "bg-[#eef7ff] text-[#1266d6]"}`}>
            <Icon className="h-7 w-7" aria-hidden="true" />
          </span>
          {accent && <span className="rounded-full border border-[#2f80ff]/20 bg-[#2f80ff]/10 px-3 py-1 text-xs font-bold text-[#1266d6]">Most popular</span>}
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-black leading-tight">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{subtitle}</p>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#1266d6]">
            {cta}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </button>
  );
}
