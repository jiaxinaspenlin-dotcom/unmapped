import { SkillPassportItem } from "../types/domain";
import { BadgeCheck, QrCode, ShieldCheck, Sparkles } from "lucide-react";

interface SkillsPassportProps {
  skills: SkillPassportItem[];
  label: string;
  name: string;
  countryName: string;
  educationLevel: string;
  rawStory: string;
}

export function SkillsPassport({ skills, label, name, countryName, educationLevel, rawStory }: SkillsPassportProps) {
  const strongSkills = skills.filter((skill) => skill.confidence === "high").length;
  const readyPercent = skills.length ? Math.round((strongSkills / skills.length) * 100) : 0;

  return (
    <section id="passport" className="mx-auto max-w-[1160px] space-y-8">
      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_72px_1fr]">
        <article className="relative flex min-h-[285px] flex-col rounded-[2rem] border border-white bg-white p-8 pt-14 shadow-card">
          <span className="absolute -top-4 left-8 inline-flex rounded-full border border-slate-300/80 bg-[#dfe8f1] px-5 py-2 text-sm font-bold text-slate-600 shadow-sm">Before — your raw story</span>
          <p className="text-xl italic leading-9 text-slate-700">"{rawStory || "Your story will appear here after intake."}"</p>
        </article>
        <div className="z-10 mx-auto grid h-16 w-16 place-items-center self-center rounded-full bg-gradient-to-br from-[#1266d6] to-[#2f80ff] text-white shadow-glow">
          <Sparkles className="h-7 w-7" aria-hidden="true" />
        </div>
        <article className="relative flex min-h-[285px] flex-col justify-center rounded-[2rem] border-2 border-[#96b8e8] bg-[#e8f3ff] p-8 pt-14 shadow-card">
          <span className="absolute -top-4 left-8 inline-flex rounded-full bg-[#2f66cf] px-5 py-2 text-sm font-bold text-white shadow-card">After — extracted evidence</span>
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.slice(0, 4).map((skill) => (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" key={skill.skill}>
                <p className="line-clamp-2 text-base font-black leading-6 text-ink">{skill.skill}</p>
                <EvidenceBadge confidence={skill.confidence} />
              </div>
            ))}
          </div>
          <p className="mt-6 text-base font-bold text-ocean">Now you can explain what you know how to do.</p>
        </article>
      </div>

      <article className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#14254b] via-[#244d9f] to-[#3d74e4] p-7 text-white shadow-[0_28px_80px_rgba(36,88,189,0.25)]">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-blue-100">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {label}
              <span className="rounded-full border border-white/25 px-3 py-1 tracking-normal">Preview</span>
            </div>
            <h2 className="mt-7 text-4xl font-black tracking-tight">{name || "Your name"}</h2>
            <p className="mt-2 text-sm font-semibold text-blue-100">{countryName} · {educationLevel || "Education level not added"}</p>
            <div className="mt-7 grid grid-cols-3 gap-8">
              <PassportStat label="Skills" value={String(skills.length)} />
              <PassportStat label="Strong" value={String(strongSkills)} />
              <PassportStat label="Ready" value={`${readyPercent}%`} />
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {skills.slice(0, 6).map((skill) => (
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-blue-50" key={skill.skill}>{skill.skill}</span>
              ))}
            </div>
          </div>
          <div className="w-fit rounded-3xl bg-white/90 p-4 text-[#14254b] shadow-soft">
            <QrCode className="h-20 w-20" aria-hidden="true" />
            <p className="mt-2 text-center text-[0.6rem] font-black uppercase tracking-widest text-slate-500">Preview</p>
          </div>
        </div>
      </article>

      <div>
        <h3 className="text-2xl font-black text-ink">What's inside your passport</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
        {skills.map((skill) => (
          <article className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-soft" key={skill.skill}>
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-lg font-black text-ink">{skill.skill}</h4>
              <EvidenceBadge confidence={skill.confidence} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{skill.whatThisMeans ?? skill.plainLanguageExplanation}</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="rounded-2xl bg-[#eaf2f8] p-4"><span className="block text-xs font-black uppercase tracking-widest text-slate-500">Where we saw this</span>{skill.evidence}</div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4"><span className="block text-xs font-black uppercase tracking-widest text-amber-700">Next proof to collect</span>{nextProof(skill)}</div>
              <p><span className="font-bold text-ink">Where this can help:</span> {skill.whereItCanHelp ?? skill.portabilityNote}</p>
            </div>
            <details className="mt-3 text-sm text-slate-600">
              <summary className="cursor-pointer font-semibold text-ocean">More details</summary>
              <p className="mt-2">{skill.technicalMapping ?? skill.taxonomyMapping}</p>
              <p className="mt-1">Evidence status: {skill.verificationStatus}</p>
            </details>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}

function EvidenceBadge({ confidence }: { confidence: SkillPassportItem["confidence"] }) {
  const label = confidence === "high" ? "Strong evidence" : confidence === "medium" ? "Some evidence" : "Needs proof";
  const cls = confidence === "high" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : confidence === "medium" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-amber-200 bg-amber-50 text-amber-700";
  return <span className={`mt-2 inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold ${cls}`}><BadgeCheck className="h-3 w-3" aria-hidden="true" />{label}</span>;
}

function PassportStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-blue-100">{label}</p>
    </div>
  );
}

function nextProof(skill: SkillPassportItem) {
  if (skill.confidence === "high") return "Ask someone who saw this work to confirm it.";
  if (/record|payment|inventory|book/i.test(skill.skill)) return "Photo or screenshot of one simple record.";
  if (/repair|equipment|device/i.test(skill.skill)) return "Before/after note from one repair or maintenance task.";
  if (/customer|sell|commerce/i.test(skill.skill)) return "Short customer or buyer reference.";
  return "One small example, record, or person who can vouch for this.";
}
