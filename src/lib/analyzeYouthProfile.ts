import { countryConfigs } from "../data/countryConfigs";
import { countrySignals } from "../data/countrySignals";
import { AnalysisResult, YouthAnalysisInput } from "../types/domain";
import { extractSkills, hasEnoughYouthInput } from "./extractSkills";
import { matchOpportunities } from "./matchOpportunities";
import { rankAiExposure } from "./rankAiExposure";
import { selectSignalsForYouth, toSelectedSignal } from "./selectSignals";

export function analyzeYouthProfile(input: YouthAnalysisInput): AnalysisResult | null {
  if (!hasEnoughYouthInput(input.profile)) return null;
  const skillsPassport = extractSkills(input.profile);
  const inferredContext = input.context ?? inferContext(skillsPassport);
  const selectedSignalsForFirstPass = selectSignalsForYouth(input.countryCode, skillsPassport, [], 6);
  const opportunityMatches = matchOpportunities(skillsPassport, input.countryCode, selectedSignalsForFirstPass, inferredContext);
  const selectedSignals = selectSignalsForYouth(
    input.countryCode,
    skillsPassport,
    opportunityMatches.flatMap((match) => match.signalsUsed),
    6,
  ).map((signal) =>
    toSelectedSignal(signal, "Selected from detected skills, country context, and opportunity pathways. No values are invented."),
  );
  const aiReadiness = rankAiExposure(skillsPassport, input.countryCode);
  const country = countryConfigs[input.countryCode];

  return {
    skillsPassport,
    aiReadiness,
    selectedSignals,
    opportunityMatches,
    plainLanguageSummary: buildSummary(input.profile.name, skillsPassport.map((skill) => skill.skill), opportunityMatches[0]?.title),
    sourceNotes: selectedSignals.map((signal) => `${signal.label}: ${signal.source}`),
    limitations: [
      ...country.limitations,
      "Generated from the current intake only; changing the text and regenerating can change results.",
      "Opportunity matches are not job guarantees.",
      "Automation exposure is a task-level signal, not a prediction that a person will lose work.",
      "Some PDF values are manually encoded into signal cards and should be locally validated before production use.",
      `The current country has ${countrySignals.filter((signal) => signal.countryCode === input.countryCode).length} curated signal cards, not a full labor-market database.`,
    ],
  };
}

function buildSummary(name: string, skills: string[], topOpportunity?: string) {
  const person = name.trim() || "You";
  const skillText = skills.length ? skills.slice(0, 5).join(", ") : "general transferable skills";
  return `${person}: Your strongest skills are ${skillText}. Choose a path to turn them into a 7-day action plan${topOpportunity ? `, starting with ${topOpportunity}` : ""}.`;
}

function inferContext(skills: { skillId?: string }[]) {
  const ids = skills.map((skill) => skill.skillId).join(" ");
  if (/agro-processing|equipment-repair-support/.test(ids)) return "ruralAgricultural" as const;
  if (/garment-manufacturing/.test(ids)) return "manufacturingGarment" as const;
  if (/device-troubleshooting|electronics-repair-support/.test(ids)) return "repairTechnical" as const;
  if (/basic-programming|digital-commerce|digital-problem-solving/.test(ids)) return "digitalServices" as const;
  if (/customer-communication|inventory-handling|small-business/.test(ids)) return "retailCustomer" as const;
  return "urbanInformal" as const;
}
