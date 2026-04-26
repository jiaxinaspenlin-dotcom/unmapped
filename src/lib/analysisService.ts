import { InstitutionAnalysisResult, InstitutionInput, YouthAnalysisInput } from "../types/domain";
import { analyzeInstitutionNeeds as ruleBasedInstitution } from "./analyzeInstitutionNeeds";
import { analyzeYouthProfile as ruleBasedYouth } from "./analyzeYouthProfile";

export async function analyzeYouthProfile(input: YouthAnalysisInput) {
  return ruleBasedYouth(input);
}

export async function analyzeInstitutionNeeds(input: InstitutionInput): Promise<InstitutionAnalysisResult> {
  return ruleBasedInstitution(input);
}
