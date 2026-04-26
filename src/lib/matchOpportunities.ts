import { opportunityCatalog } from "../data/opportunityCatalog";
import { CountryCode, InstitutionContext, OpportunityMatch, SignalCard, SkillPassportItem } from "../types/domain";

const contextPathways: Record<InstitutionContext, string[]> = {
  urbanInformal: ["repair", "service", "digital", "commerce", "credential"],
  ruralAgricultural: ["agro", "repair", "digital", "commerce"],
  digitalServices: ["digital", "ict", "service"],
  repairTechnical: ["repair", "ict", "credential"],
  manufacturingGarment: ["manufacturing", "credential"],
  retailCustomer: ["service", "commerce", "digital"],
};

export function matchOpportunities(
  skills: SkillPassportItem[],
  countryCode: CountryCode,
  selectedSignals: SignalCard[] = [],
  context?: InstitutionContext,
): OpportunityMatch[] {
  if (!skills.length) return [];
  const skillIds = new Set(skills.map((skill) => skill.skillId).filter(Boolean));
  const preferredPathways = context ? contextPathways[context] : undefined;

  return opportunityCatalog
    .filter((opportunity) => opportunity.countryCode === countryCode)
    .filter((opportunity) => {
      if (context !== "ruralAgricultural") return true;
      const hasDeviceSkill = skillIds.has("device-troubleshooting") || skillIds.has("electronics-repair-support");
      const hasCodingSkill = skillIds.has("basic-programming");
      if (["gha-phone-repair-microbusiness", "gha-ict-support-assistant", "gha-customer-tech-support"].includes(opportunity.id)) {
        return hasDeviceSkill || hasCodingSkill;
      }
      return true;
    })
    .map((opportunity) => {
      const matches = opportunity.currentSkillIds.filter((id) => skillIds.has(id));
      const contextScore = preferredPathways?.includes(opportunity.pathwayType) ? 2 : 0;
      const fitScore = Math.min(96, 42 + matches.length * 14 + contextScore * 7);
      return {
        id: opportunity.id,
        pathwayType: opportunity.pathwayType,
        title: opportunity.title,
        fitScore,
        whyThisFits: matches.length
          ? `It matches ${matches.length} skill area${matches.length === 1 ? "" : "s"} from your intake.`
          : "It may fit the local context, but needs more proof from your intake.",
        whatYouStillNeed: opportunity.missingGaps,
        nextStepThisWeek: opportunity.nextAction,
        supportOrganizationAction: opportunity.recommendationsByRole.ngo,
        whyItFits: matches.length
          ? `It matches ${matches.length} detected skill area${matches.length === 1 ? "" : "s"} and stays close to the selected context.`
          : "It is context-relevant but needs more direct skill evidence before it should be recommended strongly.",
        missingGaps: opportunity.missingGaps,
        nextAction: opportunity.nextAction,
        signalsUsed: [...opportunity.signalIds, ...selectedSignals.map((signal) => signal.id)].slice(0, 3),
        recommendationsByRole: opportunity.recommendationsByRole,
      };
    })
    .filter((match) => match.fitScore >= 56)
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 5);
}

export function matchAggregateOpportunityPathways(countryCode: CountryCode, context: InstitutionContext, selectedSignals: SignalCard[]): OpportunityMatch[] {
  const pathways = contextPathways[context];
  return opportunityCatalog
    .filter((opportunity) => opportunity.countryCode === countryCode && pathways.includes(opportunity.pathwayType))
    .filter((opportunity) => {
      if (context !== "ruralAgricultural") return true;
      return !["gha-phone-repair-microbusiness", "gha-ict-support-assistant", "gha-customer-tech-support"].includes(opportunity.id);
    })
    .slice(0, 5)
    .map((opportunity, index) => ({
      id: opportunity.id,
      pathwayType: opportunity.pathwayType,
      title: opportunity.title,
      fitScore: 88 - index * 6,
      whyThisFits: `This pathway fits the ${labelContext(context)} context.`,
      whatYouStillNeed: opportunity.missingGaps,
      nextStepThisWeek: opportunity.nextAction,
      supportOrganizationAction: opportunity.recommendationsByRole.ngo,
      whyItFits: `This pathway fits the ${labelContext(context)} context and can be screened with practical evidence.`,
      missingGaps: opportunity.missingGaps,
      nextAction: opportunity.nextAction,
      signalsUsed: [...opportunity.signalIds, ...selectedSignals.map((signal) => signal.id)].slice(0, 3),
      recommendationsByRole: opportunity.recommendationsByRole,
    }));
}

function labelContext(context: InstitutionContext) {
  return context.replace(/([A-Z])/g, " $1").toLowerCase();
}
