import type { VercelRequest, VercelResponse } from "@vercel/node";
import { automationExposure } from "../src/data/automationExposure";
import { countryConfigs } from "../src/data/countryConfigs";
import { countrySignals } from "../src/data/countrySignals";
import { skillReferences } from "../src/data/iscoTaskMappings";
import { opportunityCatalog } from "../src/data/opportunityCatalog";
import { ruleBasedAnalyzeProfile } from "../src/lib/ruleBasedAnalyzeProfile";
import { CountryCode, InstitutionRole, YouthProfile } from "../src/types/domain";

const systemPrompt =
  "You are the reasoning layer for UNMAPPED, a data-grounded labor-market prototype. You must only use the provided user profile, country config, skills reference data, automation exposure reference table, labor signals, and opportunity data. Do not invent statistics, automation scores, wage values, or sources. If data is missing, include that in limitations. Keep youth-facing explanations simple and practical. Keep institution-facing explanations actionable by role. Treat automation exposure as a signal, not a prediction of job loss. Return valid JSON only.";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { profile, selectedCountry, selectedRole } = req.body as {
    profile: YouthProfile;
    selectedCountry: CountryCode;
    selectedRole: InstitutionRole;
  };

  if (!profile || !selectedCountry || !selectedRole) return res.status(400).json({ error: "Missing required fields" });

  const fallback = ruleBasedAnalyzeProfile(profile, selectedCountry, selectedRole);
  const openAiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!openAiKey && !anthropicKey) return res.status(200).json(fallback);

  const payload = {
    profile,
    countryConfig: countryConfigs[selectedCountry],
    skillsReferenceData: skillReferences,
    automationExposureReferenceTable: automationExposure,
    laborSignals: countrySignals.filter((signal) => signal.countryCode === selectedCountry),
    opportunityData: opportunityCatalog.filter((opportunity) => opportunity.countryCode === selectedCountry),
    requiredJsonSchema: {
      skillsPassport: "array",
      aiReadiness: "array",
      selectedSignals: "array",
      opportunityMatches: "array",
      limitations: "array",
    },
  };

  try {
    if (openAiKey) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: JSON.stringify(payload) },
          ],
          temperature: 0.2,
        }),
      });
      if (!response.ok) throw new Error(`OpenAI returned ${response.status}`);
      const data = await response.json();
      return res.status(200).json(JSON.parse(data.choices[0].message.content));
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 4000,
        temperature: 0.2,
        system: systemPrompt,
        messages: [{ role: "user", content: JSON.stringify(payload) }],
      }),
    });
    if (!response.ok) throw new Error(`Anthropic returned ${response.status}`);
    const data = await response.json();
    return res.status(200).json(JSON.parse(data.content[0].text));
  } catch {
    return res.status(200).json(fallback);
  }
}
