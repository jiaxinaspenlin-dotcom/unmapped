import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { ArrowRight, Briefcase, Building2, GraduationCap, Landmark, Lightbulb, MapPinned, Users, UsersRound } from "lucide-react";
import {
  InstitutionAnalysisResult,
  InstitutionContext,
  InstitutionInput,
  InstitutionRole,
  OrganizationConstraint,
  TargetGroup,
} from "../types/domain";
import { SignalBadge } from "./SignalBadge";
import { countryConfigs } from "../data/countryConfigs";

interface InstitutionalDashboardProps {
  input: InstitutionInput;
  onInputChange: (input: InstitutionInput) => void;
  analysis: InstitutionAnalysisResult;
}

const roles: Array<{ value: InstitutionRole; label: string; icon: typeof Briefcase }> = [
  { value: "employer", label: "Employer", icon: Briefcase },
  { value: "ngo", label: "Non-governmental organization", icon: Users },
  { value: "government", label: "Government", icon: Landmark },
  { value: "trainingProvider", label: "Training Provider", icon: GraduationCap },
];

const contexts: Array<{ value: InstitutionContext; label: string }> = [
  { value: "urbanInformal", label: "Urban informal" },
  { value: "ruralAgricultural", label: "Rural agricultural" },
  { value: "digitalServices", label: "Digital services" },
  { value: "repairTechnical", label: "Repair-technical services" },
  { value: "manufacturingGarment", label: "Manufacturing-garment" },
  { value: "retailCustomer", label: "Retail-customer service" },
];

const targetGroups: Array<{ value: TargetGroup; label: string }> = [
  { value: "incompleteCredentials", label: "Youth with incomplete credentials" },
  { value: "informalWorkers", label: "Informal workers" },
  { value: "youngWomen", label: "Young women" },
  { value: "ruralYouth", label: "Rural youth" },
  { value: "selfEmployedYouth", label: "Self-employed youth" },
  { value: "entryLevelJobSeekers", label: "Entry-level job seekers" },
];

const constraints: Array<{ value: OrganizationConstraint; label: string }> = [
  { value: "noTrainingBudget", label: "No training budget" },
  { value: "limitedStaffCapacity", label: "Limited staff capacity" },
  { value: "lowBandwidthDelivery", label: "Low bandwidth delivery" },
  { value: "quickScreening", label: "Quick screening" },
  { value: "aggregatePlanning", label: "Aggregate planning" },
  { value: "referralNeeds", label: "Referral needs" },
];

export function InstitutionalDashboard({ input, onInputChange, analysis }: InstitutionalDashboardProps) {
  const [built, setBuilt] = useState(false);
  const chartData = analysis.visibleSignals
    .filter((signal) => /%/.test(signal.value))
    .slice(0, 6)
    .map((signal) => ({ name: signal.label.replace(" as biggest obstacle", ""), value: Number(signal.value.replace(/[^0-9.-]/g, "")) }));

  const update = (patch: Partial<InstitutionInput>) => {
    setBuilt(false);
    onInputChange({ ...input, ...patch });
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <aside className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(37,65,96,0.13)]">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-ocean">Configure dashboard</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-ink">Institution view</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Select a role and local context. The dashboard recomputes using the same input-driven engine.</p>

          <div className="mt-6 grid gap-4">
            <div>
              <p className="mb-2 text-sm font-bold text-ink">Organization type</p>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const active = input.role === role.value;
                  return (
                    <button
                      className={`focus-ring flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-xs font-black transition-spring ${
                        active ? "border-transparent bg-gradient-to-br from-[#1266d6] to-[#2f80ff] text-white shadow-glow" : "border-slate-200 bg-[#f7fbff] text-ink hover:border-blue-300"
                      }`}
                      key={role.value}
                      onClick={() => update({ role: role.value })}
                      type="button"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {role.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <SelectControl
              label="Country"
              value={input.countryCode}
              options={[
                { value: "GHA", label: "Ghana" },
                { value: "BGD", label: "Bangladesh" },
              ]}
              onChange={(value) => update({ countryCode: value as InstitutionInput["countryCode"] })}
            />
            <SelectControl label="Work setting" value={input.context} options={contexts} onChange={(value) => update({ context: value as InstitutionContext })} />
            <SelectControl label="Target group" value={input.targetGroup} options={targetGroups} onChange={(value) => update({ targetGroup: value as TargetGroup })} />
            <SelectControl label="Main constraint" value={input.constraint} options={constraints} onChange={(value) => update({ constraint: value as OrganizationConstraint })} />
          </div>
          <button className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2f66cf] px-5 py-4 font-black text-white shadow-soft" onClick={() => setBuilt(true)} type="button">
            Build Dashboard
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </aside>

        <div className="rounded-[2rem] bg-gradient-to-br from-[#14254b] via-[#244d9f] to-[#3d74e4] p-8 text-white shadow-[0_24px_70px_rgba(37,65,96,0.18)]">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-100">Same engine, local context</p>
          <h2 className="mt-5 text-4xl font-black leading-tight">Skills infrastructure for programs, hiring, and referrals.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">Use visible labor-market signs, practical skill evidence, and role-specific actions without forcing youth into formal work-profile assumptions.</p>
          {built && <p className="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-blue-50">{analysis.summary}</p>}
        </div>
      </div>

      {!built && (
        <div className="rounded-[1.5rem] border border-dashed border-blue-200 bg-white/60 p-6 text-sm text-slate-700 shadow-sm">
          Choose the organization type, place, target group, and main constraint. Then build the dashboard to see local signs, pathways, and actions.
        </div>
      )}

      {built && <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <UsersRound className="h-5 w-5 text-ocean" aria-hidden="true" />
            <h3 className="text-xl font-black text-ink">Visible skills in this community</h3>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {analysis.visibleSkills.map((skill) => (
              <div className="rounded-2xl bg-[#eaf2f8] p-4" key={skill}>
                <p className="font-black text-ink">{skill}</p>
                <p className="mt-1 text-sm text-slate-600">Visible through the selected context and opportunity pathways.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <MapPinned className="h-5 w-5 text-ocean" aria-hidden="true" />
            <h3 className="text-xl font-black text-ink">Priority local job-market signs</h3>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {analysis.visibleSignals.slice(0, 6).map((signal) => <SignalBadge key={signal.id} signal={signal} compact />)}
          </div>
        </section>
      </div>}

      {built && <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft">
          <h3 className="text-xl font-black text-ink">Signal snapshot</h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#d9e5f2" />
                <XAxis type="number" fontSize={11} />
                <YAxis dataKey="name" type="category" width={130} fontSize={11} />
                <Tooltip formatter={(value) => [`${value}%`, "Value"]} />
                <Bar dataKey="value" fill="#2f66cf" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-ocean" aria-hidden="true" />
            <h3 className="text-xl font-black text-ink">Opportunity pathways to support</h3>
          </div>
          <div className="mt-5 space-y-3">
            {analysis.opportunityPipeline.map((match) => (
              <div className="rounded-2xl bg-[#eaf2f8] p-4" key={match.title}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-ink">{match.title}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-ocean">{match.fitScore}%</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{match.missingGaps.slice(0, 2).join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>
      </div>}

      {built && <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-ocean" aria-hidden="true" />
            <h3 className="text-xl font-black text-ink">Recommended actions</h3>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {(analysis.recommendedActions ?? []).map((action) => (
              <div className="rounded-2xl border border-blue-100 bg-[#eaf2f8] p-4 text-sm text-slate-700" key={action.action}>
                <p className="font-black text-ink">{action.action}</p>
                <p className="mt-2 leading-6">{action.why}</p>
                <p className="mt-3 text-xs font-bold text-ocean">{action.roleFit}</p>
              </div>
            ))}
          </div>
      </section>}

      {built && <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft">
        <h3 className="text-xl font-black text-ink">Next actions</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {analysis.nextActions.map((action) => (
            <div className="rounded-2xl bg-[#eaf2f8] p-4 text-sm font-bold text-slate-700" key={action}>{action}</div>
          ))}
        </div>
      </div>}

      {built && <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft">
        <h3 className="text-xl font-black text-ink">Same engine, different context</h3>
        <p className="mt-2 text-sm text-slate-600">Country configuration changes signals, education labels, opportunity types, and delivery constraints while keeping the same analysis flow.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {(["GHA", "BGD"] as const).map((code) => (
            <div className={`rounded-2xl border p-4 ${input.countryCode === code ? "border-[#2f66cf] bg-blue-50" : "border-slate-200 bg-[#f5f9fd]"}`} key={code}>
              <p className="font-black text-ink">{countryConfigs[code].countryName}</p>
              <p className="mt-1 text-sm text-slate-600">{countryConfigs[code].contextLabel}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-widest text-ocean">{input.countryCode === code ? "Current dashboard" : "Available reconfiguration"}</p>
            </div>
          ))}
        </div>
      </section>}

      {built && (
        <details className="rounded-[1.5rem] border border-white/70 bg-white/70 p-5 text-sm text-slate-600 shadow-sm">
          <summary className="cursor-pointer font-semibold text-ocean">Source notes</summary>
          <ul className="mt-2 space-y-1">
            {(analysis.sourceNotes ?? []).map((note) => <li key={note}>{note}</li>)}
          </ul>
        </details>
      )}
    </section>
  );
}

function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink">
      {label}
      <select className="focus-ring rounded-2xl border border-slate-200 bg-[#f7fbff] px-4 py-3 font-semibold text-slate-700 shadow-inner" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
