import { AnalysisResult, CountryCode, InstitutionRole, YouthProfile } from "../types/domain";
import { ruleBasedAnalyzeProfile } from "./ruleBasedAnalyzeProfile";

export async function analyzeProfile(
  profile: YouthProfile,
  selectedCountry: CountryCode,
  selectedRole: InstitutionRole,
): Promise<AnalysisResult> {
  const useLlm = import.meta.env.VITE_USE_LLM === "true";
  if (!useLlm) return ruleBasedAnalyzeProfile(profile, selectedCountry, selectedRole);

  try {
    const response = await fetch("/api/analyze-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, selectedCountry, selectedRole }),
    });
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    return (await response.json()) as AnalysisResult;
  } catch {
    return ruleBasedAnalyzeProfile(profile, selectedCountry, selectedRole);
  }
}
