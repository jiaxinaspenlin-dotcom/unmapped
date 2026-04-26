import { automationExposure } from "../data/automationExposure";
import { countryConfigs } from "../data/countryConfigs";
import { AIReadinessItem, CountryCode, SkillPassportItem } from "../types/domain";

export function rankAiExposure(skills: SkillPassportItem[], countryCode: CountryCode): AIReadinessItem[] {
  if (!skills.length) return [];
  const skillIds = new Set(skills.map((skill) => skill.skillId).filter(Boolean));
  const country = countryConfigs[countryCode];

  return automationExposure
    .map((row) => ({
      row,
      matches: row.relatedSkills.filter((skillId) => skillIds.has(skillId)).length,
    }))
    .filter((item) => item.matches > 0)
    .sort((a, b) => b.matches - a.matches || b.row.exposureScore - a.row.exposureScore)
    .slice(0, 5)
    .map(({ row }) => ({
      task: row.taskCluster,
      aiCanHelpWith: row.youthExplanation,
      stillNeedsYouBecause: row.institutionExplanation.replace(/^.*?but\s/i, "") || "Your judgment, local knowledge, and hands-on work still matter.",
      changeLevel: row.exposureLevel,
      whatToLearnNext: row.resilienceRecommendation,
      sourceNote: row.sourceBasis,
      taskType: row.taskType,
      exposureLevel: row.exposureLevel,
      exposureScore: row.exposureScore,
      sourceBasis: row.sourceBasis,
      localCalibrationNote: `${country.automationCalibration} ${row.localCalibrationFactors}`,
      whyItMatters: row.youthExplanation,
      resilienceRecommendation: row.resilienceRecommendation,
    }));
}
