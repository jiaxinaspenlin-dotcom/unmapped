import { AnalysisResult } from "../types/domain";

interface SelectedSignalsProps {
  analysis: AnalysisResult;
}

export function SelectedSignals({ analysis }: SelectedSignalsProps) {
  return (
    <section className="rounded-md border border-line bg-white p-4 shadow-soft sm:p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Selected econometric signals</p>
      <h2 className="mt-1 text-2xl font-bold text-ink">Data is visible, not hidden in a score</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {analysis.selectedSignals.map((signal) => (
          <div className="rounded-md border border-line p-4" key={signal.signalId}>
            <p className="font-bold text-ink">{signal.label}: {signal.value}</p>
            <p className="mt-2 text-sm text-slate-700">{signal.plainLanguageMeaningForYouth}</p>
            <p className="mt-2 text-sm text-slate-600">{signal.plainLanguageMeaningForInstitution}</p>
            <p className="mt-2 text-xs text-slate-500">{signal.source} · {signal.year}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
