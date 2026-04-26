import { sourceRegistry } from "../data/sourceRegistry";
import { stepSkillsSignals } from "../data/stepSkillsSignals";

export function DataProvenance() {
  return (
    <section id="limits" className="rounded-md border border-line bg-white p-4 shadow-soft sm:p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Data provenance and limits</p>
      <h2 className="mt-1 text-2xl font-bold text-ink">What the prototype knows and does not know</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {sourceRegistry.map((source) => (
          <article className="rounded-md border border-line p-4" key={source.id}>
            <p className="text-sm font-semibold text-ocean">{source.organization} · {source.year}</p>
            <h3 className="mt-1 font-bold text-ink">{source.title}</h3>
            <p className="mt-2 text-sm text-slate-700">{source.supports}</p>
            <p className="mt-2 text-xs text-slate-500">Limit: {source.limitation}</p>
          </article>
        ))}
      </div>
      <div className="mt-5 rounded-md bg-skywash p-4">
        <h3 className="font-bold text-ink">Ghana STEP inspection summaries used for design</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {stepSkillsSignals.map((item) => (
            <div className="rounded-md bg-white p-3" key={item.id}>
              <p className="text-sm font-bold text-ink">{item.label}</p>
              <p className="text-lg font-bold text-ocean">{item.value}</p>
              <p className="text-xs text-slate-500">{item.limitation}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
