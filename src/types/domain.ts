export type CountryCode = "GHA" | "BGD";
export type InstitutionRole = "employer" | "ngo" | "government" | "trainingProvider";
export type RecommendationRole = InstitutionRole | "youth";
export type ExposureLevel = "low" | "medium" | "high";
export type VerificationStatus = "self-reported" | "partially verified" | "verified";
export type InstitutionContext = "urbanInformal" | "ruralAgricultural" | "digitalServices" | "repairTechnical" | "manufacturingGarment" | "retailCustomer";
export type TargetGroup = "incompleteCredentials" | "informalWorkers" | "youngWomen" | "ruralYouth" | "selfEmployedYouth" | "entryLevelJobSeekers";
export type OrganizationConstraint = "noTrainingBudget" | "limitedStaffCapacity" | "lowBandwidthDelivery" | "quickScreening" | "aggregatePlanning" | "referralNeeds";

export interface YouthProfile {
  name: string;
  age: number;
  countryCode: CountryCode;
  educationLevel: string;
  informalExperience: string;
  demonstratedCompetencies: string;
  constraints: {
    sharedDevice: boolean;
    lowBandwidth: boolean;
    incompleteCredentials: boolean;
  };
}

export interface YouthAnalysisInput {
  profile: YouthProfile;
  countryCode: CountryCode;
  context?: InstitutionContext;
}

export interface InstitutionInput {
  role: InstitutionRole;
  countryCode: CountryCode;
  context: InstitutionContext;
  targetGroup: TargetGroup;
  constraint: OrganizationConstraint;
}

export interface CountryConfig {
  code: CountryCode;
  countryName: string;
  region: string;
  contextLabel: string;
  persona: YouthProfile;
  educationTaxonomy: string[];
  languageLabels: {
    passport: string;
    opportunity: string;
    verification: string;
  };
  localizationChanges: string[];
  automationCalibration: string;
  digitalConstraints: string[];
  limitations: string[];
}

export interface SourceRecord {
  id: string;
  title: string;
  organization: string;
  year: string;
  file: string;
  supports: string;
  limitation: string;
}

export interface SignalCard {
  id: string;
  countryCode: CountryCode;
  countryName: string;
  label: string;
  value: string;
  year: string;
  sourceDataset: string;
  sourceOrganization: string;
  sourceType:
    | "microdata"
    | "country profile PDF"
    | "Data360 CSV"
    | "ILOSTAT CSV"
    | "research paper"
    | "prototype reference";
  category: "training" | "growth" | "informality" | "finance" | "infrastructure" | "digital" | "workforce" | "trade";
  meaningForYouth: string;
  meaningForInstitution: string;
  limitation: string;
}

export interface SkillReference {
  id: string;
  skill: string;
  keywords: string[];
  taxonomyMapping: string;
  plainLanguageExplanation: string;
  portabilityNote: string;
  baseConfidence: "low" | "medium" | "high";
}

export interface SkillPassportItem {
  skillId?: string;
  skill: string;
  whatThisMeans?: string;
  evidence: string;
  whereItCanHelp?: string;
  confidence: "low" | "medium" | "high";
  technicalMapping?: string;
  taxonomyMapping: string;
  verificationStatus: VerificationStatus;
  plainLanguageExplanation: string;
  portabilityNote: string;
}

export interface AutomationExposure {
  id: string;
  taskCluster: string;
  relatedSkills: string[];
  relatedISCOCodes: string[];
  taskType: string;
  exposureLevel: ExposureLevel;
  exposureScore: number;
  sourceBasis: string;
  youthExplanation: string;
  institutionExplanation: string;
  localCalibrationFactors: string;
  resilienceRecommendation: string;
  limitations: string;
}

export interface AIReadinessItem {
  task: string;
  aiCanHelpWith?: string;
  stillNeedsYouBecause?: string;
  changeLevel?: ExposureLevel;
  whatToLearnNext?: string;
  sourceNote?: string;
  taskType: string;
  exposureLevel: ExposureLevel;
  exposureScore: number;
  sourceBasis: string;
  localCalibrationNote: string;
  whyItMatters: string;
  resilienceRecommendation: string;
}

export interface Opportunity {
  id: string;
  countryCode: CountryCode;
  title: string;
  pathwayType: string;
  currentSkillIds: string[];
  missingGaps: string[];
  nextAction: string;
  signalIds: string[];
  recommendationsByRole: Record<RecommendationRole, string>;
}

export interface OpportunityMatch {
  id?: string;
  pathwayType?: string;
  title: string;
  fitScore: number;
  whyThisFits?: string;
  whatYouStillNeed?: string[];
  nextStepThisWeek?: string;
  supportOrganizationAction?: string;
  whyItFits: string;
  missingGaps: string[];
  nextAction: string;
  signalsUsed: string[];
  recommendationsByRole: Record<RecommendationRole, string>;
}

export interface AnalysisResult {
  skillsPassport: SkillPassportItem[];
  aiReadiness: AIReadinessItem[];
  selectedSignals: Array<{
    signalId: string;
    label: string;
    value: string;
    year: string;
    whatTheNumberSays?: string;
    whyItMattersForUser?: string;
    whyItMattersForSupportOrg?: string;
    source: string;
    plainLanguageMeaningForYouth: string;
    plainLanguageMeaningForInstitution: string;
    whySelected: string;
  }>;
  opportunityMatches: OpportunityMatch[];
  plainLanguageSummary?: string;
  sourceNotes?: string[];
  limitations: string[];
}

export interface InstitutionAnalysisResult {
  prioritySignals?: Array<{
    signalId: string;
    label: string;
    value: string;
    year: string;
    whyItMatters: string;
    source: string;
  }>;
  visibleSkillsInContext?: Array<{
    skill: string;
    whyVisible: string;
    verificationApproach: string;
  }>;
  opportunityPathways?: Array<{
    pathway: string;
    targetUsers: string;
    supportNeeded: string;
    signalsUsed: string[];
  }>;
  recommendedActions?: Array<{
    action: string;
    why: string;
    roleFit: string;
  }>;
  sourceNotes?: string[];
  visibleSignals: SignalCard[];
  opportunityPipeline: OpportunityMatch[];
  visibleSkills: string[];
  recommendedInterventions: string[];
  nextActions: string[];
  summary: string;
  limitations: string[];
}
