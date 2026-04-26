import { AIReadinessItem } from "../types/domain";
import { BriefcaseBusiness, HandHeart, Wrench } from "lucide-react";

interface AIReadinessLensProps {
  items: AIReadinessItem[];
}

export function AIReadinessLens({ items }: AIReadinessLensProps) {
  const columns = [
    {
      title: "Tools can help a lot",
      subtitle: "Speed up the boring parts.",
      level: "high",
      icon: BriefcaseBusiness,
      className: "border-blue-300 bg-blue-50/50",
      badge: "bg-[#2f66cf] text-white",
    },
    {
      title: "Tools can help a little",
      subtitle: "Useful, but you still steer.",
      level: "medium",
      icon: Wrench,
      className: "border-sky-300 bg-sky-50/50",
      badge: "bg-blue-100 text-ocean",
    },
    {
      title: "Mostly still needs you",
      subtitle: "These are your strengths.",
      level: "low",
      icon: HandHeart,
      className: "border-emerald-300 bg-emerald-50/40",
      badge: "bg-emerald-100 text-emerald-800",
    },
  ] as const;

  return (
    <section id="risk" className="space-y-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/80 p-7 shadow-soft sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-ocean">Empowering, not displacing</span>
        </div>
        <h2 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-ink">Artificial intelligence readiness: what tools can help with, and what still needs you</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          This is a map of your everyday tasks. We highlight where artificial intelligence tools can save you time, and where your judgment, trust, and local knowledge still lead.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {columns.map((column) => {
          const Icon = column.icon;
          const columnItems = items.filter((item) => item.exposureLevel === column.level);
          return (
            <section className={`rounded-[1.5rem] border p-5 shadow-soft ${column.className}`} key={column.title}>
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-white/70 p-3 text-ocean"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <h3 className="font-black text-ink">{column.title}</h3>
                  <p className="text-sm text-slate-600">{column.subtitle}</p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {(columnItems.length ? columnItems : []).map((item) => (
                  <article className="rounded-2xl bg-white/80 p-4 shadow-sm" key={item.task}>
                    <h4 className="font-black text-ink">{item.task}</h4>
                    <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${column.badge}`}>{column.title}</span>
                    <p className="mt-4 text-sm leading-6 text-slate-700"><span className="font-bold text-ink">Artificial intelligence tools can help with:</span> {item.aiCanHelpWith ?? item.whyItMatters}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-700"><span className="font-bold text-ink">Still needs you because:</span> {item.stillNeedsYouBecause}</p>
                    <div className="mt-4 border-t border-slate-100 pt-3 text-sm text-ocean"><span className="font-bold">Build next:</span> {item.whatToLearnNext ?? item.resilienceRecommendation}</div>
                    <details className="mt-3 text-xs text-slate-500">
                      <summary className="cursor-pointer font-semibold text-ocean">Where this comes from</summary>
                      <p className="mt-1">{item.sourceNote ?? item.sourceBasis}</p>
                    </details>
                  </article>
                ))}
                {!columnItems.length && <p className="rounded-2xl bg-white/60 p-4 text-sm text-slate-500">No tasks from your current intake are in this group.</p>}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
