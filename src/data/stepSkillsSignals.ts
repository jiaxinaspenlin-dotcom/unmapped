export const stepSkillsSignals = [
  {
    id: "ghana-step-informal",
    label: "STEP Ghana respondents with informal work variable marked",
    value: "83.7% among non-missing records",
    source: "Ghana STEP Household Survey 2013 working CSV",
    supports: "The prototype should capture informal work evidence instead of relying only on certificates.",
    limitation: "Computed from available non-missing prototype inspection; not used as a nationally weighted headline statistic.",
  },
  {
    id: "ghana-step-self-employment",
    label: "STEP Ghana respondents with self-employment variable marked",
    value: "59.5% among non-missing records",
    source: "Ghana STEP Household Survey 2013 working CSV",
    supports: "Microbusiness and self-employment pathways can be realistic for youth with informal work evidence.",
    limitation: "Simple inspection summary, not a full weighted STEP analysis.",
  },
  {
    id: "ghana-step-certificate",
    label: "STEP Ghana certificate variable",
    value: "7.2% among all inspected records",
    source: "Ghana STEP Household Survey 2013 working CSV",
    supports: "Incomplete formal credentials should not erase demonstrated skill.",
    limitation: "Used for design justification only.",
  },
  {
    id: "ghana-step-apprenticeship",
    label: "STEP Ghana apprenticeship variable",
    value: "28.1% among non-missing records",
    source: "Ghana STEP Household Survey 2013 working CSV",
    supports: "Informal and practical learning routes should be captured in the Skills Passport.",
    limitation: "Simple inspection summary, not a full labor-market claim.",
  },
];
