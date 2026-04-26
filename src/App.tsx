import { useEffect, useState } from "react";
import { analyzeInstitutionNeeds, analyzeYouthProfile } from "./lib/analysisService";
import {
  AnalysisResult,
  CountryCode,
  InstitutionAnalysisResult,
  InstitutionInput,
  YouthProfile,
} from "./types/domain";
import { InstitutionalDashboard } from "./components/InstitutionalDashboard";
import { Landing } from "./components/Landing";
import { AppView, Layout } from "./components/Layout";
import { YouthTool } from "./components/YouthTool";

const hashToView: Record<string, AppView> = {
  "#home": "home",
  "#youth": "youth",
  "#institution": "institution",
  "#localize": "localize",
  "#data": "data",
  "#intake": "youth",
};

function getInitialView(): AppView {
  const initial = hashToView[window.location.hash] ?? "home";
  return initial === "localize" || initial === "data" ? "home" : initial;
}

export default function App() {
  const [view, setView] = useState<AppView>(getInitialView);
  const [countryCode, setCountryCode] = useState<CountryCode>("GHA");
  const [profile, setProfile] = useState<YouthProfile>(() => createBlankProfile("GHA"));
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [youthDirty, setYouthDirty] = useState(false);
  const [institutionInput, setInstitutionInput] = useState<InstitutionInput>({
    role: "employer",
    countryCode: "GHA",
    context: "urbanInformal",
    targetGroup: "incompleteCredentials",
    constraint: "noTrainingBudget",
  });
  const [institutionAnalysis, setInstitutionAnalysis] = useState<InstitutionAnalysisResult | null>(null);
  const [status, setStatus] = useState("");

  const navigate = (nextView: AppView) => {
    setView(nextView);
    window.history.replaceState(null, "", `#${nextView}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onHashChange = () => setView(getInitialView());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    let isMounted = true;
    analyzeInstitutionNeeds(institutionInput).then((result) => {
      if (!isMounted) return;
      setInstitutionAnalysis(result);
    });
    return () => {
      isMounted = false;
    };
  }, [institutionInput]);

  return (
    <Layout activeView={view} onNavigate={navigate}>
      <div className="space-y-5 sm:space-y-7">
        {view === "home" && (
          <Landing
            countryCode={countryCode}
            onCountryChange={setCountryCode}
            onStartYouth={() => navigate("youth")}
            onStartInstitution={(selectedRole) => {
              if (selectedRole) setInstitutionInput((current) => ({ ...current, role: selectedRole }));
              navigate("institution");
            }}
          />
        )}

        {view === "youth" && (
          <div className="space-y-4">
            {status && <div className="rounded-md border border-line bg-white p-3 text-sm text-slate-700 shadow-sm">{status}</div>}
            <YouthTool
              countryCode={countryCode}
              onCountryChange={(nextCountry) => {
                setCountryCode(nextCountry);
                setProfile((current) => ({ ...current, countryCode: nextCountry }));
                setAnalysis(null);
                setYouthDirty(false);
              }}
              profile={profile}
              onProfileChange={(nextProfile) => {
                setProfile(nextProfile);
                if (analysis) setYouthDirty(true);
              }}
              analysis={analysis}
              onGenerate={() => void generateYouthAnalysis(profile, countryCode)}
              onClear={() => {
                setProfile(createBlankProfile(countryCode));
                setAnalysis(null);
                setYouthDirty(false);
              }}
              hasChangedSinceAnalysis={youthDirty}
              detectedSkillGroups={analysis?.skillsPassport.map((skill) => skill.skill) ?? []}
            />
          </div>
        )}

        {view === "institution" && (
          <div className="space-y-4">
            {institutionAnalysis && (
              <InstitutionalDashboard
                input={institutionInput}
                onInputChange={(nextInput) => {
                  setInstitutionInput(nextInput);
                  setCountryCode(nextInput.countryCode);
                }}
                analysis={institutionAnalysis}
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );

  async function generateYouthAnalysis(nextProfile: YouthProfile, nextCountry: CountryCode) {
    setStatus("Analyzing current intake");
    const result = await analyzeYouthProfile({ profile: { ...nextProfile, countryCode: nextCountry }, countryCode: nextCountry });
    setAnalysis(result);
    setYouthDirty(false);
    setStatus(result ? "" : "Enter your experience and skills to create a Skills Passport.");
  }
}

function createBlankProfile(countryCode: CountryCode): YouthProfile {
  return {
    name: "",
    age: 18,
    countryCode,
    educationLevel: "",
    informalExperience: "",
    demonstratedCompetencies: "",
    constraints: {
      sharedDevice: true,
      lowBandwidth: true,
      incompleteCredentials: true,
    },
  };
}
