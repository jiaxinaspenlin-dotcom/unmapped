import { CountryCode, YouthProfile } from "../types/domain";
import { countryConfigs } from "../data/countryConfigs";
import { ArrowRight, Sparkles } from "lucide-react";

interface YouthIntakeProps {
  profile: YouthProfile;
  countryCode: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  onProfileChange: (profile: YouthProfile) => void;
  onCreate: () => void;
}

export function YouthIntake({ profile, countryCode, onCountryChange, onProfileChange, onCreate }: YouthIntakeProps) {
  const country = countryConfigs[countryCode];
  const update = (patch: Partial<YouthProfile>) => onProfileChange({ ...profile, ...patch });
  const addToExperience = (text: string) => update({ informalExperience: `${profile.informalExperience}${profile.informalExperience ? " " : ""}${text}` });
  const addToProof = (text: string) => update({ demonstratedCompetencies: `${profile.demonstratedCompetencies}${profile.demonstratedCompetencies ? ", " : ""}${text}` });

  return (
    <section id="intake" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(37,65,96,0.13)] backdrop-blur sm:p-9">
        <h2 className="text-3xl font-black tracking-tight text-ink">Tell us your story</h2>
        <p className="mt-2 text-lg text-slate-600">No formal work profile needed. Just what you've actually done.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-ink">
            Name or nickname
            <input className="focus-ring rounded-2xl border border-slate-200 bg-[#f7fbff] px-4 py-4 font-medium text-ink shadow-inner" placeholder="Your name or nickname" value={profile.name} onChange={(event) => update({ name: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-ink">
            Country
            <select className="focus-ring rounded-2xl border border-slate-200 bg-[#f7fbff] px-4 py-4 font-medium text-ink shadow-inner" value={countryCode} onChange={(event) => onCountryChange(event.target.value as CountryCode)}>
              <option value="GHA">Ghana</option>
              <option value="BGD">Bangladesh</option>
            </select>
          </label>
        </div>

        <label className="mt-5 grid gap-2 text-sm font-bold text-ink">
          Education level
          <select className="focus-ring rounded-2xl border border-slate-200 bg-[#f7fbff] px-4 py-4 font-medium text-ink shadow-inner" value={profile.educationLevel} onChange={(event) => update({ educationLevel: event.target.value })}>
            {[profile.educationLevel, ...country.educationTaxonomy].filter((value, index, array) => array.indexOf(value) === index).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="mt-7 grid gap-2 text-sm font-bold text-ink">
          Tell us what you have done
          <textarea className="focus-ring min-h-40 rounded-2xl border border-slate-200 bg-[#f7fbff] px-4 py-4 font-medium text-ink shadow-inner" placeholder="Example: I farm rice, sell crops through WhatsApp, use mobile money, and repair small pumps." value={profile.informalExperience} onChange={(event) => update({ informalExperience: event.target.value })} />
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          {["I helped with...", "I sold...", "I fixed...", "I taught...", "I used tools like...", "I kept records for..."].map((chip) => (
            <button className="focus-ring rounded-full border border-slate-200 bg-[#e9f2fb] px-4 py-2 text-sm font-bold text-ink hover:bg-white" key={chip} onClick={() => addToExperience(chip)} type="button">
              {chip}
            </button>
          ))}
        </div>

        <label className="mt-7 grid gap-2 text-sm font-bold text-ink">
          What can you show or prove?
          <textarea className="focus-ring min-h-28 rounded-2xl border border-slate-200 bg-[#f7fbff] px-4 py-4 font-medium text-ink shadow-inner" placeholder="Tools used, customers helped, records kept, tasks completed, or people who can vouch for you." value={profile.demonstratedCompetencies} onChange={(event) => update({ demonstratedCompetencies: event.target.value })} />
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          {["Photos", "Receipts", "WhatsApp messages", "Customers who can vouch", "A school report", "Nothing yet"].map((chip) => (
            <button className="focus-ring rounded-full border border-slate-200 bg-[#e9f2fb] px-4 py-2 text-sm font-bold text-ink hover:bg-white" key={chip} onClick={() => addToProof(chip)} type="button">
              {chip}
            </button>
          ))}
        </div>

        <div className="mt-9 flex justify-end">
          <button className="focus-ring inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#2458bd] to-[#3c75e6] px-7 py-4 text-base font-black text-white shadow-[0_18px_45px_rgba(36,88,189,0.25)]" onClick={onCreate} type="button">
            Build my Skills Passport
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#14254b] via-[#244d9f] to-[#3d74e4] p-8 text-white shadow-[0_24px_70px_rgba(37,65,96,0.18)]">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-100">Why this matters</p>
          <h3 className="mt-5 text-3xl font-black leading-tight">Most informal experience never makes it into a work profile.</h3>
          <p className="mt-5 text-lg leading-8 text-blue-100">UNMAPPED translates what you've actually done into evidence employers, non-governmental organizations, and training providers can understand.</p>
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-white/75 p-7 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-[#e7f0ff] p-3 text-ocean"><Sparkles className="h-5 w-5" aria-hidden="true" /></span>
            <h3 className="text-xl font-black text-ink">Tips for a strong intake</h3>
          </div>
          <ul className="mt-5 space-y-4 text-base leading-7 text-slate-600">
            <li>Use real numbers when you can.</li>
            <li>Mention tools, even simple ones.</li>
            <li>Add who can vouch for you.</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}
