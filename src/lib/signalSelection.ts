import { getSignalsByCountry } from "../data/countrySignals";
import { CountryCode, SignalCard } from "../types/domain";

const categoryPriority = ["informality", "training", "infrastructure", "digital", "growth", "finance", "workforce", "trade"];

export function selectSignals(countryCode: CountryCode, signalIds: string[] = [], limit = 5): SignalCard[] {
  const signals = getSignalsByCountry(countryCode);
  const picked = signalIds
    .map((id) => signals.find((signal) => signal.id === id))
    .filter((signal): signal is SignalCard => Boolean(signal));

  const remaining = signals
    .filter((signal) => !picked.some((item) => item.id === signal.id))
    .sort((a, b) => categoryPriority.indexOf(a.category) - categoryPriority.indexOf(b.category));

  return [...picked, ...remaining].slice(0, limit);
}

export function toSelectedSignal(signal: SignalCard, whySelected: string) {
  return {
    signalId: signal.id,
    label: signal.label,
    value: signal.value,
    year: signal.year,
    source: `${signal.sourceOrganization}: ${signal.sourceDataset}`,
    plainLanguageMeaningForYouth: signal.meaningForYouth,
    plainLanguageMeaningForInstitution: signal.meaningForInstitution,
    whySelected,
  };
}
