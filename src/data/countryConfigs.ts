import { CountryConfig } from "../types/domain";

export const countryConfigs: Record<CountryConfig["code"], CountryConfig> = {
  GHA: {
    code: "GHA",
    countryName: "Ghana",
    region: "Sub-Saharan Africa",
    contextLabel: "Urban and peri-urban informal economy",
    persona: {
      name: "Amara",
      age: 22,
      countryCode: "GHA",
      educationLevel: "Secondary school certificate",
      informalExperience: "I repair phones, sell phone accessories, help customers, and learned basic coding from YouTube.",
      demonstratedCompetencies: "Phone fault diagnosis, screen and battery replacement support, customer explanations, stock handling, mobile money, simple HTML/CSS practice.",
      constraints: {
        sharedDevice: true,
        lowBandwidth: true,
        incompleteCredentials: true,
      },
    },
    educationTaxonomy: ["Junior secondary", "Senior secondary", "Technical and vocational education and training certificate", "Apprenticeship evidence", "Practical assessment badge"],
    languageLabels: {
      passport: "Skills Passport",
      opportunity: "Next practical step",
      verification: "Evidence check",
    },
    localizationChanges: [
      "Persona: Amara, phone repair and accessories seller outside Accra",
      "Signals: Ghana Enterprise Survey, Ghana STEP, Data360 Ghana rows",
      "Opportunities: device repair, information and communications technology support, digital services, technical and vocational education and training bridge",
      "Calibration: informal service relationships and bandwidth constraints slow immediate automation displacement",
    ],
    automationCalibration: "Low bandwidth, shared devices, informal service relationships, and physical repair work reduce immediate replacement risk, but routine records and simple digital tasks can still be augmented quickly.",
    digitalConstraints: ["Shared mobile connection", "Intermittent access", "Low-cost smartphone first", "Needs printable or copyable profile"],
    limitations: ["Ghana STEP is 2013 and used for skills-context only.", "Enterprise Survey evidence is formal-firm evidence, not a full informal-economy map."],
  },
  BGD: {
    code: "BGD",
    countryName: "Bangladesh",
    region: "South Asia",
    contextLabel: "Rural and semi-rural agricultural / informal economy",
    persona: {
      name: "Ayesha",
      age: 21,
      countryCode: "BGD",
      educationLevel: "Lower secondary with informal family enterprise experience",
      informalExperience: "I help my family sell crops, use mobile payments, sort produce, repair small tools, and sometimes help with garment piecework.",
      demonstratedCompetencies: "Crop sorting, customer bargaining, mobile wallet use, basic machine care, seasonal planning, simple record keeping.",
      constraints: {
        sharedDevice: true,
        lowBandwidth: true,
        incompleteCredentials: true,
      },
    },
    educationTaxonomy: ["Primary", "Lower secondary", "SSC/equivalent", "Informal apprenticeship", "Community assessment badge"],
    languageLabels: {
      passport: "Skill record",
      opportunity: "Reachable pathway",
      verification: "Community evidence",
    },
    localizationChanges: [
      "Persona: Ayesha, rural/semi-rural agricultural and informal work",
      "Signals: Bangladesh Enterprise Survey, ILOSTAT population export, Data360 Bangladesh rows",
      "Opportunities: agro-processing, farm marketplace support, equipment repair, garment entry pathway",
      "Calibration: agriculture and physical work remain context-dependent; digital marketplaces and records are augmentable",
    ],
    automationCalibration: "Agricultural and informal household tasks depend on local conditions and physical work, while mobile records, marketplace listings, and repetitive production tasks have more exposure to digital tools.",
    digitalConstraints: ["Shared smartphone", "Patchy rural connectivity", "Seasonal income pressure", "Needs role-specific local partner referrals"],
    limitations: ["Bangladesh has no STEP household file in this prototype.", "Bangladesh configuration is a reconfiguration proof, lighter than Ghana."],
  },
};
