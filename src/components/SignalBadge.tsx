import { SignalCard } from "../types/domain";

interface SignalBadgeProps {
  signal: SignalCard;
  compact?: boolean;
}

export function SignalBadge({ signal, compact = false }: SignalBadgeProps) {
  return (
    <div className="rounded-md border border-line bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ocean">{signal.label}</p>
          <p className="mt-1 text-xl font-bold text-ink">{signal.value}</p>
        </div>
        <span className="shrink-0 rounded bg-skywash px-2 py-1 text-xs font-medium text-ocean">{signal.year}</span>
      </div>
      {!compact && (
        <>
          <p className="mt-2 text-sm text-slate-700">{signal.meaningForYouth}</p>
          <p className="mt-2 text-xs text-slate-500">{signal.sourceOrganization}</p>
        </>
      )}
    </div>
  );
}
