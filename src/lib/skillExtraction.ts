import { SkillPassportItem, YouthProfile } from "../types/domain";
import { skillReferences } from "../data/iscoTaskMappings";

const includesAny = (text: string, keywords: string[]) =>
  keywords.some((keyword) => text.includes(keyword.toLowerCase()));

export function extractSkills(profile: YouthProfile): SkillPassportItem[] {
  const text = `${profile.informalExperience} ${profile.demonstratedCompetencies} ${profile.educationLevel}`.toLowerCase();
  const matched = skillReferences.filter((reference) => includesAny(text, reference.keywords));

  const fallback = profile.countryCode === "GHA"
    ? ["device-troubleshooting", "customer-communication", "self-directed-learning"]
    : ["agro-processing", "mobile-payments", "customer-communication"];

  const references = matched.length
    ? matched
    : skillReferences.filter((reference) => fallback.includes(reference.id));

  return references.slice(0, 8).map((reference) => ({
    skill: reference.skill,
    evidence: buildEvidence(profile, reference.keywords),
    confidence: profile.demonstratedCompetencies.length > 40 ? reference.baseConfidence : "medium",
    taxonomyMapping: reference.taxonomyMapping,
    verificationStatus: profile.constraints.incompleteCredentials ? "self-reported" : "partially verified",
    plainLanguageExplanation: reference.plainLanguageExplanation,
    portabilityNote: reference.portabilityNote,
  }));
}

function buildEvidence(profile: YouthProfile, keywords: string[]) {
  const source = `${profile.informalExperience} ${profile.demonstratedCompetencies}`;
  const keyword = keywords.find((item) => source.toLowerCase().includes(item.toLowerCase()));
  if (!keyword) return "Evidence from the intake statement and demonstrated competencies.";
  const sentence = source
    .split(/[.]/)
    .find((part) => part.toLowerCase().includes(keyword.toLowerCase()))
    ?.trim();
  return sentence || `Evidence mentions ${keyword}.`;
}
