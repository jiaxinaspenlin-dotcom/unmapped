import { opportunityCatalog } from "../data/opportunityCatalog";
import { selectSignals } from "./signalSelection";
import { CountryCode, OpportunityMatch, SkillPassportItem } from "../types/domain";

export function matchOpportunities(skills: SkillPassportItem[], countryCode: CountryCode): OpportunityMatch[] {
  const skillText = skills.map((skill) => `${skill.skill} ${skill.taxonomyMapping}`).join(" ").toLowerCase();

  return opportunityCatalog
    .filter((opportunity) => opportunity.countryCode === countryCode)
    .map((opportunity) => {
      const matches = opportunity.currentSkillIds.filter((id) => skillText.includes(id.replaceAll("-", " ")) || skillText.includes(id.split("-")[0]));
      const fitScore = Math.min(94, 58 + matches.length * 9 + (opportunity.currentSkillIds.length <= skills.length ? 5 : 0));
      const signals = selectSignals(countryCode, opportunity.signalIds, 3);
      return {
        title: opportunity.title,
        fitScore,
        whyItFits: matches.length
          ? `It builds on ${matches.length} visible skill area${matches.length === 1 ? "" : "s"} from the passport and stays close to current experience.`
          : "It is a realistic stepping-stone in this country configuration, but it needs a practical assessment before matching.",
        missingGaps: opportunity.missingGaps,
        nextAction: opportunity.nextAction,
        signalsUsed: signals.map((signal) => signal.id),
        recommendationsByRole: opportunity.recommendationsByRole,
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 5);
}
