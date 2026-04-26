import { automationExposure } from "../data/automationExposure";
import { AIReadinessItem, CountryCode, SkillPassportItem } from "../types/domain";
import { countryConfigs } from "../data/countryConfigs";

export function rankAIRisks(skills: SkillPassportItem[], countryCode: CountryCode): AIReadinessItem[] {
  const skillText = skills.map((skill) => skill.skill.toLowerCase()).join(" ");
  const country = countryConfigs[countryCode];
  const preferred = automationExposure
    .map((row) => {
      const matchCount = row.relatedSkills.filter((id) =>
        skillText.includes(id.replaceAll("-", " ")) ||
        skills.some((skill) => skill.taxonomyMapping.toLowerCase().includes(id.split("-")[0]))
      ).length;
      const countryBoost =
        countryCode === "BGD" && ["crop-sorting-agro-processing", "agricultural-equipment-support", "mobile-marketplace", "garment-repetitive-production"].includes(row.id)
          ? 2
          : countryCode === "GHA" && ["physical-device-repair", "customer-trust-service", "basic-coding", "inventory-bookkeeping", "sales-pricing"].includes(row.id)
            ? 2
            : 0;
      return { row, score: matchCount + countryBoost };
    })
    .sort((a, b) => b.score - a.score || b.row.exposureScore - a.row.exposureScore)
    .slice(0, 5);

  return preferred.map(({ row }) => ({
    task: row.taskCluster,
    taskType: row.taskType,
    exposureLevel: row.exposureLevel,
    exposureScore: row.exposureScore,
    sourceBasis: row.sourceBasis,
    localCalibrationNote: `${country.automationCalibration} ${row.localCalibrationFactors}`,
    whyItMatters: row.youthExplanation,
    resilienceRecommendation: row.resilienceRecommendation,
  }));
}
