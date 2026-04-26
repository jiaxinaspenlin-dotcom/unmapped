import { ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, Check, Clipboard, FileText, Map, Printer, Target, WalletCards } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { countryConfigs } from "../data/countryConfigs";
import { AnalysisResult, CountryCode, OpportunityMatch as OpportunityMatchType, SkillPassportItem, YouthProfile } from "../types/domain";
import { AIReadinessLens } from "./AIReadinessLens";
import { OpportunityMatch } from "./OpportunityMatch";
import { SkillsPassport } from "./SkillsPassport";
import { YouthIntake } from "./YouthIntake";

const steps = ["Intake", "Skills Passport", "Artificial Intelligence", "Opportunities", "Your Next Steps"] as const;

interface YouthToolProps {
  countryCode: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  profile: YouthProfile;
  onProfileChange: (profile: YouthProfile) => void;
  analysis: AnalysisResult | null;
  onGenerate: () => void;
  onClear: () => void;
  hasChangedSinceAnalysis: boolean;
  detectedSkillGroups: string[];
}

export function YouthTool({ countryCode, onCountryChange, profile, onProfileChange, analysis, onGenerate, onClear, hasChangedSinceAnalysis, detectedSkillGroups }: YouthToolProps) {
  const [step, setStep] = useState(0);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityMatchType | null>(null);
  const country = countryConfigs[countryCode];
  const hasAnalysis = Boolean(analysis);
  const plainProfile = useMemo(
    () =>
      buildActionPlanText(profile.name, analysis, selectedOpportunity) ??
      analysis?.plainLanguageSummary ??
      `Your strongest skills are ${(analysis?.skillsPassport ?? []).map((skill) => skill.skill).slice(0, 5).join(", ") || "still being identified"}. Choose a path to build your next steps.`,
    [analysis, profile.name, selectedOpportunity],
  );

  useEffect(() => {
    setSelectedOpportunity(null);
  }, [analysis]);

  const copyProfile = async () => {
    try {
      await navigator.clipboard.writeText(plainProfile);
    } catch {
      window.prompt("Copy this plain-language profile", plainProfile);
    }
  };

  return (
    <div className="space-y-8">
      <ProgressStepper currentStep={step} onStepChange={setStep} />

      {hasChangedSinceAnalysis && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 shadow-sm">
          <span className="font-semibold">Your answers changed.</span> Update your results?
          <button className="focus-ring ml-3 rounded-xl bg-ocean px-3 py-1.5 text-sm font-semibold text-white" onClick={onGenerate} type="button">
            Update results
          </button>
        </div>
      )}

      {step === 0 && <YouthIntake profile={profile} countryCode={countryCode} onCountryChange={onCountryChange} onProfileChange={onProfileChange} onCreate={() => {
        onGenerate();
        setStep(1);
      }} />}
      {step > 0 && step !== 3 && hasAnalysis && (
        <div className="rounded-2xl border border-blue-100 bg-white/70 p-4 text-sm text-slate-700 shadow-sm">
          <span className="font-semibold text-ocean">Built from what you told us:</span> {country.countryName}
          {detectedSkillGroups.length ? `, ${detectedSkillGroups.join(", ")}` : ""}.
        </div>
      )}
      {step === 1 && (analysis ? <SkillsPassport skills={analysis.skillsPassport} label={country.languageLabels.passport} name={profile.name} countryName={country.countryName} educationLevel={profile.educationLevel} rawStory={profile.informalExperience} /> : <EmptyState />)}
      {step === 2 && (analysis ? <AIReadinessLens items={analysis.aiReadiness} /> : <EmptyState />)}
      {step === 3 && (analysis ? (
        <div className="space-y-6">
          <OpportunityMatch
            matches={analysis.opportunityMatches}
            role="employer"
            selectedOpportunityId={selectedOpportunity?.id}
            onChoose={(match) => {
              setSelectedOpportunity(match);
            }}
          />
        </div>
      ) : <EmptyState />)}
      {step === 4 && (analysis ? (
        selectedOpportunity ? (
          <ActionPlan
            analysis={analysis}
            onBack={() => setStep(3)}
            onCopy={copyProfile}
            onStartOver={() => {
              setSelectedOpportunity(null);
              onClear();
              setStep(0);
            }}
            opportunity={selectedOpportunity}
            plainProfile={plainProfile}
          />
        ) : (
          <ChooseOpportunityFirst onBack={() => setStep(3)} />
        )
      ) : <EmptyState />)}

      {step > 0 && <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-slate-500">{step === 3 && selectedOpportunity ? `Selected: ${selectedOpportunity.title}` : ""}</span>
        <StepActions
          step={step}
          hasAnalysis={hasAnalysis}
          onBack={() => setStep((current) => Math.max(0, current - 1))}
          onPrimary={() => {
            if (step === 0) {
              onGenerate();
              setStep(1);
              return;
            }
            if (step === 4) {
              setSelectedOpportunity(null);
              onClear();
              setStep(0);
              return;
            }
            setStep((current) => Math.min(steps.length - 1, current + 1));
          }}
        />
      </div>}
    </div>
  );
}

function ProgressStepper({ currentStep, onStepChange }: { currentStep: number; onStepChange: (step: number) => void }) {
  const icons = [FileText, WalletCards, BriefcaseBusiness, Map, Target];
  return (
    <section className="-mx-5 overflow-x-auto border-b border-slate-400/20 px-5 pb-7 sm:-mx-8 sm:px-8">
      <div className="mx-auto grid min-w-[760px] max-w-[1160px] grid-cols-5 items-start gap-0 pt-1">
        {steps.map((label, index) => {
          const Icon = icons[index];
          const done = index < currentStep;
          const active = index === currentStep;
          return (
            <button className="focus-ring group relative flex flex-col items-center gap-2 rounded-2xl px-3 py-1 text-center" key={label} onClick={() => onStepChange(index)} type="button">
              {index > 0 && <span className={`absolute left-0 top-[23px] h-0.5 w-1/2 ${done || active ? "bg-[#2f66cf]" : "bg-slate-300"}`} />}
              {index < steps.length - 1 && <span className={`absolute right-0 top-[23px] h-0.5 w-1/2 ${index < currentStep ? "bg-[#2f66cf]" : "bg-slate-300"}`} />}
              <span className={`relative z-10 grid h-11 w-11 place-items-center rounded-2xl border text-sm transition-spring ${active ? "border-[#2f66cf] bg-gradient-to-br from-[#1266d6] to-[#2f80ff] text-white shadow-glow" : done ? "border-[#2f66cf] bg-[#2f66cf] text-white shadow-card" : "border-slate-300 bg-[#dbe5ee] text-slate-500"}`}>
                {done ? <Check className="h-5 w-5" aria-hidden="true" /> : <Icon className="h-5 w-5" aria-hidden="true" />}
              </span>
              <span className={`text-xs font-bold ${active ? "text-ink" : done ? "text-[#1266d6]" : "text-slate-600"}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function LocalJobMarketSigns({ analysis }: { analysis: AnalysisResult }) {
  return (
    <section className="rounded-md border border-line bg-white p-4 shadow-soft sm:p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Local job-market signs</p>
      <h2 className="mt-1 text-2xl font-bold text-ink">Numbers used for these matches</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {analysis.selectedSignals.slice(0, 4).map((signal) => (
          <article className="rounded-md border border-line p-4" key={signal.signalId}>
            <p className="text-sm font-semibold text-ocean">{signal.label}</p>
            <p className="mt-1 text-2xl font-bold text-ink">{signal.value}</p>
            <p className="mt-2 text-sm text-slate-700"><span className="font-semibold text-ink">What the number says:</span> {signal.whatTheNumberSays}</p>
            <p className="mt-2 text-sm text-slate-700"><span className="font-semibold text-ink">Why it matters for you:</span> {signal.whyItMattersForUser ?? signal.plainLanguageMeaningForYouth}</p>
            <p className="mt-2 text-sm text-slate-700"><span className="font-semibold text-ink">Why it matters for support organizations:</span> {signal.whyItMattersForSupportOrg ?? signal.plainLanguageMeaningForInstitution}</p>
            <details className="mt-2 text-xs text-slate-500">
              <summary className="cursor-pointer font-semibold text-ocean">Where this comes from</summary>
              <p className="mt-1">{signal.source}</p>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="rounded-md border border-dashed border-blue-200 bg-white p-8 text-center shadow-soft">
      <h2 className="text-xl font-bold text-ink">Enter experience and competencies to generate a Skills Passport.</h2>
      <p className="mt-2 text-sm text-slate-600">Use Step 1, then click Create my Skills Passport.</p>
    </section>
  );
}

interface ActionPlanProps {
  analysis: AnalysisResult;
  opportunity: OpportunityMatchType;
  plainProfile: string;
  onCopy: () => void;
  onBack: () => void;
  onStartOver: () => void;
}

function ActionPlan({ analysis, opportunity, plainProfile, onCopy, onBack }: ActionPlanProps) {
  const usefulSkills = getUsefulSkills(analysis.skillsPassport);
  const improveNext = (opportunity.whatYouStillNeed ?? opportunity.missingGaps).slice(0, 5);
  const proofItems = getProofItems(opportunity);
  const signals = getSignalsForOpportunity(analysis, opportunity);
  const actionDays = buildSevenDayPlan(opportunity, improveNext);

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-gradient-to-br from-[#14254b] via-[#244d9f] to-[#3d74e4] p-7 text-white shadow-[0_28px_80px_rgba(36,88,189,0.25)] sm:p-9">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-100">Your next steps</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight">{opportunity.title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">A practical plan grounded in what you already have, what's missing, and local signs behind this path.</p>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-100">Plan progress</p>
            <p className="mt-2 text-4xl font-black">0%</p>
            <div className="mt-3 h-2 w-32 rounded-full bg-white/15" />
            <p className="mt-2 text-xs text-blue-100">0 of 7 done</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Why this path fits you" items={[`You showed ${analysis.skillsPassport.slice(0, 4).map((skill) => skill.skill).join(", ") || "skills from your intake"}.`, opportunity.whyThisFits ?? opportunity.whyItFits]} />
        <SummaryCard title="Skills to keep building" items={usefulSkills.slice(0, 4).map((skill) => skill.skill)} />
        <SummaryCard title="Skills to improve next" items={improveNext.slice(0, 4)} accent="amber" />
      </div>

      <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black text-ink">Your 7-day action plan</h3>
            <p className="mt-1 text-sm text-slate-600">Tap each day as you complete it.</p>
          </div>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-ocean">One step a day</span>
        </div>
        <div className="relative mt-7 space-y-4 pl-12">
          <div className="absolute bottom-6 left-5 top-6 w-0.5 bg-[#2f66cf]/35" />
          {actionDays.map((item) => (
            <article className="relative rounded-2xl border border-slate-200 bg-[#f5f9fd] p-4" key={item.day}>
              <span className="absolute -left-12 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#2f66cf] text-sm font-black text-white shadow-soft">{item.number}</span>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">{item.day}</p>
              <p className="mt-2 font-bold text-ink">{item.action}</p>
              <p className="mt-3 text-xs text-slate-600"><span className="font-bold text-ocean">Proof:</span> {item.proof} <span className="mx-2 text-slate-300">|</span><span className="font-bold text-ocean">Helper:</span> {item.helper}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoList title="Proof to collect this week" items={proofItems} />
        <InfoList
          title="Who can help"
          items={["training program", "community organization", "employer", "cooperative or local business group", "government youth program"]}
        />
      </div>

      <div>
        <h3 className="text-2xl font-black text-ink">Local signs behind this plan</h3>
        <p className="mt-1 text-sm text-slate-600">Evidence used to recommend this path — not a guarantee.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {signals.map((signal) => (
            <article className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-soft" key={signal.signalId}>
              <p className="text-sm font-semibold text-ocean">{signal.label}</p>
              <p className="mt-2 text-3xl font-black text-ink">{signal.value}</p>
              <p className="mt-2 text-sm text-slate-700">{signal.whyItMattersForUser ?? signal.plainLanguageMeaningForYouth}</p>
              <details className="mt-3 text-xs text-slate-500">
                <summary className="cursor-pointer font-semibold text-ocean">Where this comes from</summary>
                <p className="mt-1">{signal.source}</p>
              </details>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-white/70 p-5 shadow-sm">
        <p className="text-sm font-bold text-ink">Plain-language summary</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{plainProfile}</p>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <button className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700" onClick={onBack} type="button">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        <button className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700" onClick={() => window.print()} type="button">
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print
        </button>
        <button className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700" onClick={onCopy} type="button">
          <Clipboard className="h-4 w-4" aria-hidden="true" />
          Copy
        </button>
        <button className="focus-ring rounded-xl bg-[#2f66cf] px-4 py-3 text-sm font-semibold text-white" onClick={onBack} type="button">
          Choose another path
        </button>
      </div>
    </section>
  );
}

function ChooseOpportunityFirst({ onBack }: { onBack: () => void }) {
  return (
    <section className="rounded-md border border-dashed border-blue-200 bg-white p-8 text-center shadow-soft">
      <h2 className="text-xl font-bold text-ink">Choose an opportunity first so we can build your next steps.</h2>
      <button className="focus-ring mt-4 rounded-md bg-ocean px-4 py-2 text-sm font-semibold text-white" onClick={onBack} type="button">
        Go back to opportunities
      </button>
    </section>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-soft">
      <h3 className="text-sm font-black uppercase tracking-[0.25em] text-ocean">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function SummaryCard({ title, items, accent = "blue" }: { title: string; items: string[]; accent?: "blue" | "amber" }) {
  return (
    <div className={`rounded-[1.5rem] border bg-white/80 p-5 shadow-soft ${accent === "amber" ? "border-amber-200" : "border-blue-100"}`}>
      <h3 className="text-xs font-black uppercase tracking-[0.25em] text-ocean">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => <span className={`rounded-full px-3 py-1 text-xs font-bold ${accent === "amber" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`} key={item}>{item}</span>)}
      </div>
    </div>
  );
}

function buildActionPlanText(name: string, analysis: AnalysisResult | null, opportunity: OpportunityMatchType | null) {
  if (!analysis || !opportunity) return null;
  const person = name.trim() || "You";
  const strongestSkills = analysis.skillsPassport.slice(0, 5).map((skill) => skill.skill).join(", ") || "your current skills";
  const improveNext = (opportunity.whatYouStillNeed ?? opportunity.missingGaps).slice(0, 3).join(", ") || "one practical gap for this path";
  const proof = getProofItems(opportunity).slice(0, 3).join(", ");
  return `${person}: Your strongest skills are ${strongestSkills}. The path you chose is ${opportunity.title}. This week, focus on ${improveNext}. The proof you can show is ${proof}.`;
}

function getUsefulSkills(skills: SkillPassportItem[]) {
  const durableWords = /customer|trust|repair|hands|crop|farm|quality|delivery|problem|explain|community|equipment|reliable|service/i;
  const durable = skills.filter((skill) => durableWords.test(`${skill.skill} ${skill.whatThisMeans ?? ""} ${skill.whereItCanHelp ?? ""}`));
  const selected = durable.length ? durable : skills.filter((skill) => skill.confidence !== "low");
  return (selected.length ? selected : skills).slice(0, 5);
}

function getProofItems(opportunity: OpportunityMatchType) {
  const text = `${opportunity.title} ${opportunity.pathwayType ?? ""}`.toLowerCase();
  const items = ["photo-free work log", "customer or buyer reference", "simple record sheet", "short explanation of how you solved a problem"];

  if (/repair|technical|equipment|device|ict/.test(text)) {
    items.push("before/after repair note", "tool or maintenance checklist");
  }
  if (/agro|crop|farm|agricultural|cooperative/.test(text)) {
    items.push("product list", "delivery record", "quality checking note");
  }
  if (/digital|marketplace|mobile|sales|retail|customer/.test(text)) {
    items.push("product description or listing", "safe payment record", "customer message or order log");
  }
  if (/garment|manufacturing|production/.test(text)) {
    items.push("quality checklist", "task or attendance log");
  }

  return Array.from(new Set(items)).slice(0, 7);
}

function buildSevenDayPlan(opportunity: OpportunityMatchType, gaps: string[]) {
  const firstGap = gaps[0] ?? "one skill gap for this path";
  return [
    { number: 1, day: "Day 1", action: `Write down 3 examples of work you have done that connect to ${opportunity.title}.`, proof: "Work examples", helper: "A trusted person who knows your work" },
    { number: 2, day: "Day 2", action: "Ask one customer, buyer, supervisor, or trusted person for short feedback.", proof: "Voice note or short message", helper: "Customer, buyer, or neighbor" },
    { number: 3, day: "Day 3", action: `Make a simple record for ${firstGap.toLowerCase()}: date, task, result, and any payment or buyer details.`, proof: "Simple record sheet", helper: "Anyone comfortable with records" },
    { number: 4, day: "Day 4", action: "Practice explaining your product, service, or work experience in 3 clear sentences.", proof: "Short written pitch", helper: "Friend or community navigator" },
    { number: 5, day: "Day 5", action: "Prepare one proof item that shows your work clearly without sharing private information.", proof: "Photo-free work log or example", helper: "Training program or local mentor" },
    { number: 6, day: "Day 6", action: "Contact one program, employer, cooperative, or local support organization.", proof: "Contact note", helper: "Community organization" },
    { number: 7, day: "Day 7", action: "Review your strongest proof and choose what to show first.", proof: "One-page proof list", helper: "Employer, cooperative, or youth program" },
  ];
}

function getSignalsForOpportunity(analysis: AnalysisResult, opportunity: OpportunityMatchType) {
  const selectedIds = new Set(opportunity.signalsUsed);
  const matchedSignals = analysis.selectedSignals.filter((signal) => selectedIds.has(signal.signalId));
  return (matchedSignals.length ? matchedSignals : analysis.selectedSignals).slice(0, 3);
}

function StepActions({
  step,
  hasAnalysis,
  onBack,
  onPrimary,
}: {
  step: number;
  hasAnalysis: boolean;
  onBack: () => void;
  onPrimary: () => void;
}) {
  const labels = ["Create my Skills Passport", "See Artificial Intelligence Readiness", "See Opportunity Matches", "Choose a Path", "Start Over"];
  const visibleLabels = ["Create my Skills Passport", "See artificial intelligence readiness", "See opportunity matches", "Build my next steps", "Start over"];
  return (
    <div className="flex gap-3">
      {step > 0 && (
        <button className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm" onClick={onBack} type="button">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
      )}
      <button className="focus-ring inline-flex items-center gap-2 rounded-xl bg-[#2f66cf] px-5 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(47,102,207,0.25)] disabled:opacity-40" disabled={step > 0 && !hasAnalysis} onClick={onPrimary} type="button">
        {visibleLabels[step] ?? labels[step]}
        {step < 4 && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
