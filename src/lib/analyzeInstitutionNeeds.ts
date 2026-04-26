import { countryConfigs } from "../data/countryConfigs";
import { InstitutionAnalysisResult, InstitutionInput, InstitutionRole, OrganizationConstraint } from "../types/domain";
import { matchAggregateOpportunityPathways } from "./matchOpportunities";
import { selectSignalsForInstitution } from "./selectSignals";

const contextSkills = {
  urbanInformal: ["Customer communication", "Small business operations", "Digital problem-solving", "Informal work evidence"],
  ruralAgricultural: ["Agricultural operations", "Mobile payments", "Equipment repair support", "Market coordination"],
  digitalServices: ["Digital commerce", "Basic programming", "Customer support", "Digital records"],
  repairTechnical: ["Device troubleshooting", "Equipment handling", "Customer trust", "Repair evidence"],
  manufacturingGarment: ["Garment/manufacturing operations", "Quality checks", "Reliability", "Supervisor communication"],
  retailCustomer: ["Customer communication", "Inventory handling", "Sales and pricing", "Mobile payments"],
};

const roleActions: Record<InstitutionRole, string[]> = {
  employer: ["Use practical skill evidence", "Run a 30-minute task assessment", "Hire for adjacent skills"],
  ngo: ["Run community verification days", "Translate youth profiles into badges", "Build referral pathways"],
  government: ["Fund assessment-based credentials", "Recognize informal skills", "Use labor signals for workforce planning"],
  trainingProvider: ["Design short bridge modules", "Build practical assessments", "Offer low-bandwidth training"],
};

const constraintActions: Record<OrganizationConstraint, string[]> = {
  noTrainingBudget: ["Refer training gaps to partner programs", "Use probationary trial tasks", "Screen for current adjacent skills"],
  limitedStaffCapacity: ["Use short checklists", "Prioritize high-fit pathways", "Batch verification events"],
  lowBandwidthDelivery: ["Use text-first materials", "Offer offline worksheets", "Avoid video-only training"],
  quickScreening: ["Use 30-minute task assessments", "Filter by evidence type", "Record gaps for referral"],
  aggregatePlanning: ["Compare signal categories", "Track repeated missing gaps", "Plan infrastructure and credential pilots"],
  referralNeeds: ["Map partner programs", "Attach next action to each pathway", "Use navigators for follow-up"],
};

export function analyzeInstitutionNeeds(input: InstitutionInput): InstitutionAnalysisResult {
  const visibleSignals = selectSignalsForInstitution({ ...input, limit: 8 });
  const opportunityPipeline = matchAggregateOpportunityPathways(input.countryCode, input.context, visibleSignals);
  const country = countryConfigs[input.countryCode];
  const recommendedInterventions = [...roleActions[input.role], ...constraintActions[input.constraint]];
  const summary = `Configured for: ${labelRole(input.role)}, ${country.countryName}, ${label(input.context)}, ${label(input.targetGroup)}, ${label(input.constraint)}.`;

  return {
    prioritySignals: visibleSignals.slice(0, 6).map((signal) => ({
      signalId: signal.id,
      label: signal.label,
      value: signal.value,
      year: signal.year,
      whyItMatters: signal.meaningForInstitution,
      source: `${signal.sourceOrganization}: ${signal.sourceDataset}`,
    })),
    visibleSkillsInContext: contextSkills[input.context].map((skill) => ({
      skill,
      whyVisible: `Commonly visible in ${label(input.context)} work when programs look beyond formal credentials.`,
      verificationApproach: verificationApproach(input.role, input.constraint),
    })),
    opportunityPathways: opportunityPipeline.map((pathway) => ({
      pathway: pathway.title,
      targetUsers: label(input.targetGroup),
      supportNeeded: pathway.missingGaps.join(", "),
      signalsUsed: pathway.signalsUsed,
    })),
    recommendedActions: recommendedInterventions.map((action) => ({
      action,
      why: actionReason(input.constraint),
      roleFit: `${labelRole(input.role)} action for ${label(input.context)} context.`,
    })),
    sourceNotes: visibleSignals.slice(0, 6).map((signal) => `${signal.label}: ${signal.sourceOrganization}, ${signal.year}`),
    visibleSignals,
    opportunityPipeline,
    visibleSkills: contextSkills[input.context],
    recommendedInterventions,
    nextActions: buildNextActions(input.role, input.constraint),
    summary,
    limitations: [
      ...country.limitations,
      "Institution dashboard uses curated signal cards and pathway templates, not live vacancies.",
      "Recommendations are planning prompts and require local validation with youth, employers, and community organizations.",
    ],
  };
}

function verificationApproach(role: InstitutionRole, constraint: OrganizationConstraint) {
  if (role === "employer" || constraint === "quickScreening") return "Use a short practical task and evidence review.";
  if (constraint === "lowBandwidthDelivery") return "Use text-first evidence and offline checklists.";
  return "Use community validation, practical evidence, and referral notes.";
}

function actionReason(constraint: OrganizationConstraint) {
  if (constraint === "noTrainingBudget") return "It works even when the organization cannot fund full training.";
  if (constraint === "lowBandwidthDelivery") return "It avoids excluding youth with shared devices or weak connectivity.";
  if (constraint === "referralNeeds") return "It connects visible skills to the next organization that can help.";
  return "It turns local signals into a practical operating step.";
}

function buildNextActions(role: InstitutionRole, constraint: OrganizationConstraint) {
  if (role === "employer" && constraint === "noTrainingBudget") {
    return ["Pick one practical task assessment", "Review skill evidence before credentials", "Refer missing gaps to a partner program"];
  }
  if (role === "ngo") return ["Select a verification day format", "Choose referral partners", "Prepare shared-device support"];
  if (role === "government") return ["Pick a credential pilot target", "Check infrastructure blockers", "Publish validation plan"];
  if (role === "trainingProvider") return ["Choose two bridge modules", "Write a practical assessment rubric", "Prepare low-bandwidth delivery"];
  return ["Review visible signals", "Choose one pathway", "Define a practical next action"];
}

function labelRole(role: InstitutionRole) {
  if (role === "ngo") return "NGO";
  return role === "trainingProvider" ? "Training Provider" : role[0].toUpperCase() + role.slice(1);
}

function label(value: string) {
  return value.replace(/([A-Z])/g, " $1").toLowerCase();
}
