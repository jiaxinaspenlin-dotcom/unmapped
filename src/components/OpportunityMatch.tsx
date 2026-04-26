import { countrySignals } from "../data/countrySignals";
import { InstitutionRole, OpportunityMatch as OpportunityMatchType } from "../types/domain";
import { ArrowRight, Check, Plus, Sparkles, TrendingUp } from "lucide-react";

interface OpportunityMatchProps {
  matches: OpportunityMatchType[];
  role: InstitutionRole;
  onChoose?: (match: OpportunityMatchType) => void;
  selectedOpportunityId?: string;
}

export function OpportunityMatch({ matches, role, onChoose, selectedOpportunityId }: OpportunityMatchProps) {
  return (
    <section id="opportunities" className="space-y-8">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-300/70 bg-[#dbeafe] px-4 py-2 text-xs font-bold text-[#1266d6]">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          Choose your path
        </span>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-ink">Realistic next paths for you.</h2>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">Each card is built from your evidence and what is visible in the local data. Pick the one that fits your life right now — you can always come back.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        {matches.map((match) => {
          const signals = match.signalsUsed.map((id) => countrySignals.find((signal) => signal.id === id)).filter(Boolean);
          const isSelected = selectedOpportunityId === match.id;
          return (
            <article
              className={`relative overflow-hidden rounded-[2rem] bg-white p-8 text-left shadow-card transition-spring ${
                isSelected ? "border-2 border-[#2f80ff] shadow-glow ring-4 ring-[#2f80ff]/15" : "border border-white hover:-translate-y-0.5 hover:border-[#2f80ff]/40 hover:shadow-elevated"
              }`}
              key={match.title}
            >
              {isSelected && (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2f80ff]/10 to-[#ddf3ff]/40" />
                  <div className="absolute right-5 top-5 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2f80ff] px-3 py-1.5 text-xs font-bold text-white shadow-glow">
                      <Check className="h-3 w-3" aria-hidden="true" />
                      Selected path
                    </span>
                  </div>
                </>
              )}
              <div className="relative">
                <div className="pr-28">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#1266d6]">Pathway</p>
                  <h3 className="mt-2 text-2xl font-black leading-tight text-ink">{match.title}</h3>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div className="h-2 w-36 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-[#2f80ff]" style={{ width: `${Math.min(100, Math.max(0, match.fitScore))}%` }} />
                  </div>
                  <span className="text-lg font-black text-ink">{match.fitScore}%</span>
                  <span className="text-sm text-slate-500">Fit score</span>
                </div>

                <PathwaySection title="Why this fits your skills">
                  <p className="text-sm leading-6 text-slate-700">{match.whyThisFits ?? match.whyItFits}</p>
                </PathwaySection>

                <PathwaySection title="What to add next">
                  <div className="flex flex-wrap gap-1.5">
                    {(match.whatYouStillNeed ?? match.missingGaps).slice(0, 4).map((gap) => (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-amber-50/80 px-3 py-1 text-xs font-bold text-amber-700" key={gap}>
                        <Plus className="h-3 w-3" aria-hidden="true" />
                        {gap}
                      </span>
                    ))}
                  </div>
                </PathwaySection>

                <PathwaySection title="Local job-market signs used">
                  <div className="flex flex-wrap gap-1.5">
                    {signals.slice(0, 3).map((signal) => signal && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/80 bg-[#dbe5ee] px-3 py-1 text-xs font-semibold text-ink" key={signal.id}>
                        <TrendingUp className="h-3 w-3 text-[#1266d6]" aria-hidden="true" />
                        {signal.label}
                      </span>
                    ))}
                    {!signals.length && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Local data for this exact pathway is not available yet.</span>}
                  </div>
                </PathwaySection>

                <details className="mt-4 text-xs text-slate-500">
                  <summary className="cursor-pointer font-semibold text-ocean">Where this comes from</summary>
                  <div className="mt-3 space-y-2">
                    {signals.map((signal) => signal && (
                      <div className="rounded-xl bg-[#e8f0f7] p-3" key={signal.id}>
                        <p className="font-bold text-ink">{signal.label}: {signal.value}</p>
                        <p className="mt-1">{signal.meaningForYouth}</p>
                      </div>
                    ))}
                  </div>
                </details>

                <p className="mt-5 text-sm leading-6 text-slate-600"><span className="font-bold text-ink">Support action:</span> {match.supportOrganizationAction ?? match.recommendationsByRole[role]}</p>

                {onChoose && (
                  <div className="mt-7">
                    <button
                      className={`focus-ring inline-flex h-14 items-center gap-3 rounded-2xl px-6 text-base font-black ${
                        isSelected ? "bg-[#071832] text-white" : "bg-gradient-to-r from-[#1266d6] to-[#2f80ff] text-white shadow-card"
                      }`}
                      onClick={() => onChoose(match)}
                      type="button"
                    >
                      {isSelected ? <><Check className="h-4 w-4" aria-hidden="true" />Path selected</> : <>Choose this path <ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PathwaySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-slate-500">{title}</p>
      {children}
    </div>
  );
}
