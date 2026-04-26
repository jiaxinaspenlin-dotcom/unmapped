import { skillReferences } from "../data/iscoTaskMappings";
import { SkillPassportItem, YouthProfile } from "../types/domain";

const generalSkillIds = ["customer-communication", "problem-solving", "self-directed-learning", "reliability"];

export function hasEnoughYouthInput(profile: YouthProfile) {
  return `${profile.informalExperience} ${profile.demonstratedCompetencies}`.trim().length >= 12;
}

export function extractSkills(profile: YouthProfile): SkillPassportItem[] {
  const source = `${profile.informalExperience} ${profile.demonstratedCompetencies}`.trim();
  if (!source) return [];

  const lower = source.toLowerCase();
  const matched = skillReferences.filter((reference) => reference.keywords.some((keyword) => lower.includes(keyword.toLowerCase())));
  const references = matched.length ? matched : skillReferences.filter((reference) => generalSkillIds.includes(reference.id));

  return references.slice(0, 8).map((reference) => ({
    skillId: reference.id,
    skill: reference.skill,
    whatThisMeans: reference.plainLanguageExplanation,
    evidence: buildEvidence(source, reference.keywords),
    whereItCanHelp: reference.portabilityNote,
    confidence: matched.length ? reference.baseConfidence : "low",
    technicalMapping: reference.taxonomyMapping,
    taxonomyMapping: reference.taxonomyMapping,
    verificationStatus: profile.constraints.incompleteCredentials ? "self-reported" : "partially verified",
    plainLanguageExplanation: reference.plainLanguageExplanation,
    portabilityNote: reference.portabilityNote,
  }));
}

function buildEvidence(source: string, keywords: string[]) {
  const keyword = keywords.find((item) => source.toLowerCase().includes(item.toLowerCase()));
  if (!keyword) return "General evidence from the intake statement; needs practical verification.";
  const lower = source.toLowerCase();
  const index = lower.indexOf(keyword.toLowerCase());
  const rawStart = Math.max(0, index - 18);
  const rawEnd = Math.min(source.length, index + keyword.length + 32);
  const startSpace = source.lastIndexOf(" ", rawStart);
  const endSpace = source.indexOf(" ", rawEnd);
  const start = rawStart === 0 ? 0 : Math.max(0, startSpace + 1);
  const end = endSpace === -1 ? source.length : endSpace;
  return source.slice(start, end).trim().replace(/^[,.;:\s]+|[,.;:\s]+$/g, "");
}
