import { countrySignals } from "../data/countrySignals";
import { CountryCode, InstitutionContext, InstitutionRole, OrganizationConstraint, SignalCard, SkillPassportItem, TargetGroup } from "../types/domain";

const categoryByContext: Record<InstitutionContext, SignalCard["category"][]> = {
  urbanInformal: ["informality", "digital", "finance", "infrastructure"],
  ruralAgricultural: ["informality", "workforce", "digital", "infrastructure", "finance"],
  digitalServices: ["digital", "trade", "workforce", "training"],
  repairTechnical: ["informality", "finance", "infrastructure", "training"],
  manufacturingGarment: ["growth", "training", "workforce", "infrastructure"],
  retailCustomer: ["informality", "digital", "training", "finance"],
};

const categoryByConstraint: Record<OrganizationConstraint, SignalCard["category"][]> = {
  noTrainingBudget: ["training", "workforce"],
  limitedStaffCapacity: ["training", "growth"],
  lowBandwidthDelivery: ["digital", "infrastructure"],
  quickScreening: ["informality", "training"],
  aggregatePlanning: ["workforce", "growth", "informality"],
  referralNeeds: ["informality", "finance", "training"],
};

const categoryByTarget: Record<TargetGroup, SignalCard["category"][]> = {
  incompleteCredentials: ["informality", "training", "workforce"],
  informalWorkers: ["informality", "finance"],
  youngWomen: ["workforce", "training"],
  ruralYouth: ["workforce", "digital", "infrastructure"],
  selfEmployedYouth: ["finance", "informality", "digital"],
  entryLevelJobSeekers: ["growth", "training", "workforce"],
};

export function selectSignalsForYouth(
  countryCode: CountryCode,
  skills: SkillPassportItem[],
  opportunitySignalIds: string[] = [],
  limit = 6,
): SignalCard[] {
  const skillIds = skills.map((skill) => skill.skillId).filter(Boolean).join(" ");
  const categories: SignalCard["category"][] = ["informality"];
  if (/programming|digital|mobile-payments|digital-commerce/.test(skillIds)) categories.push("digital", "trade", "workforce");
  if (/agro|equipment/.test(skillIds)) categories.push("workforce", "infrastructure", "digital");
  if (/business|inventory|commerce|repair/.test(skillIds)) categories.push("finance", "infrastructure");
  if (/customer|training|self-directed/.test(skillIds)) categories.push("training");
  return pickSignals(countryCode, categories, opportunitySignalIds, limit);
}

export function selectSignalsForInstitution(input: {
  countryCode: CountryCode;
  role: InstitutionRole;
  context: InstitutionContext;
  targetGroup: TargetGroup;
  constraint: OrganizationConstraint;
  limit?: number;
}) {
  const roleCategories: Record<InstitutionRole, SignalCard["category"][]> = {
    employer: ["training", "growth", "workforce"],
    ngo: ["informality", "digital", "infrastructure"],
    government: ["informality", "workforce", "infrastructure", "growth"],
    trainingProvider: ["training", "workforce", "digital"],
  };
  const categories = [
    ...roleCategories[input.role],
    ...categoryByContext[input.context],
    ...categoryByTarget[input.targetGroup],
    ...categoryByConstraint[input.constraint],
  ];
  return pickSignals(input.countryCode, categories, [], input.limit ?? 8);
}

export function toSelectedSignal(signal: SignalCard, whySelected: string) {
  return {
    signalId: signal.id,
    label: signal.label,
    value: signal.value,
    year: signal.year,
    whatTheNumberSays: `${signal.label}: ${signal.value} (${signal.year}).`,
    whyItMattersForUser: signal.meaningForYouth,
    whyItMattersForSupportOrg: signal.meaningForInstitution,
    source: `${signal.sourceOrganization}: ${signal.sourceDataset}`,
    plainLanguageMeaningForYouth: signal.meaningForYouth,
    plainLanguageMeaningForInstitution: signal.meaningForInstitution,
    whySelected,
  };
}

function pickSignals(countryCode: CountryCode, categories: SignalCard["category"][], explicitIds: string[], limit: number) {
  const available = countrySignals.filter((signal) => signal.countryCode === countryCode);
  const explicit = explicitIds
    .map((id) => available.find((signal) => signal.id === id))
    .filter((signal): signal is SignalCard => Boolean(signal));
  const ranked = available
    .filter((signal) => !explicit.some((item) => item.id === signal.id))
    .map((signal) => ({ signal, score: categories.filter((category) => category === signal.category).length }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.signal);
  return [...explicit, ...ranked].filter((signal, index, array) => array.findIndex((item) => item.id === signal.id) === index).slice(0, limit);
}
