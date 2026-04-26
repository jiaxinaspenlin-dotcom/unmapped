import { AnalysisResult, CountryCode, InstitutionRole, YouthProfile } from "../types/domain";
import { analyzeYouthProfile } from "./analyzeYouthProfile";

export function ruleBasedAnalyzeProfile(
  profile: YouthProfile,
  selectedCountry: CountryCode,
  _selectedRole: InstitutionRole,
): AnalysisResult {
  return analyzeYouthProfile({ profile, countryCode: selectedCountry }) ?? {
    skillsPassport: [],
    aiReadiness: [],
    selectedSignals: [],
    opportunityMatches: [],
    limitations: ["Enter experience and competencies to generate a Skills Passport."],
  };
}
