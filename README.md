# UNMAPPED Skills Passport

UNMAPPED is a localizable skills-infrastructure MVP that turns informal experience into a portable skills profile, shows task-level AI exposure, and matches youth to realistic next steps using visible labor-market signals.

## Challenge Context

Built for the World Bank Youth Summit x Hack-Nation "UNMAPPED" challenge. The primary demo user is Amara, a 22-year-old outside Accra, Ghana, with phone repair, accessories sales, customer service, basic coding, shared mobile access, and incomplete formal credentials.

The second configuration is Bangladesh, represented by Ayesha, a rural/semi-rural youth profile around family farming, crop sales, mobile payments, basic machinery, and informal work.

## Three Modules

1. **Skills Signal Engine**: Converts informal experience into a human-readable Skills Passport with evidence, confidence, taxonomy mapping, verification status, and portability notes.
2. **AI Readiness & Displacement Risk Lens**: Shows task-level exposure using ILO GenAI framing, ISCO routine/non-routine task concepts, and a curated Frey-Osborne benchmark subset.
3. **Opportunity Matching & Econometric Dashboard**: Matches realistic stepping-stone opportunities and shows the labor-market signals used on each card.

## Data Sources Used

- Ghana STEP Household Survey 2013: youth-side skills context and design justification.
- Ghana Enterprise Survey 2023: employer/business constraints.
- Bangladesh Enterprise Survey 2022: Bangladesh employer/business constraints.
- `ILO_EMP.csv`: employment by economic activity, filtered to Ghana and Bangladesh where available.
- `WB_INFECDB.csv`: informality signals, filtered to Ghana and Bangladesh.
- `ITU_DH.csv`: digital access signals, filtered to Ghana and Bangladesh.
- `UNCTAD_DE.csv`: digitally deliverable services trade signals.
- Bangladesh ILOSTAT working-age population export.
- ILO Working Paper 140, 2025: main GenAI exposure framework.
- ILO Working Paper 96, 2023: earlier GenAI exposure methodology.
- ISCO-08 task mapping and routine/non-routine task papers.
- Frey-Osborne 2013: older occupation-level benchmark only.

Curated app-ready data lives in `src/data`. Raw PDFs and CSVs remain outside the frontend bundle.

## Safe AI/API Use

The app works without any API key. By default it uses `ruleBasedAnalyzeProfile()` from local data.

Optional server-side API route:

- Route: `/api/analyze-profile`
- Server-side env vars only: `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
- Optional frontend flag: `VITE_USE_LLM=true`

The server prompt tells the model to use only provided profile, country config, skills references, automation table, labor signals, and opportunity catalog. It must not invent statistics, automation scores, wage values, sources, or job guarantees. If API use fails, the route returns the local rule-based fallback.

## Low-Bandwidth and Shared-Device Design

- Mobile-first layout.
- Text-first cards and simple charts.
- No heavy media or animations.
- Skill evidence is readable and portable.
- Credentials are treated as incomplete evidence, not the only valid evidence.
- Outputs can be understood without a private account or long session.

## Localizability

Switching between Ghana and Bangladesh changes:

- Persona and work context.
- Labor-market signals.
- Employer constraints.
- Education taxonomy labels.
- Opportunity types.
- Language/readability labels.
- Automation calibration notes.
- Country-specific limitations.

Ghana is the full primary demo. Bangladesh is a lighter reconfiguration proof.

## Setup

```bash
npm install
npm run build
npm run dev
```

Then open the local Vite URL.

## Vercel Deployment

1. Set the build command to `npm run build`.
2. Set the output directory to `dist`.
3. Add `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` only if using the optional reasoning layer.
4. Add `VITE_USE_LLM=true` only when the server route should be called from the frontend.

## Limitations

- Enterprise Surveys cover formal non-agricultural private firms with 5+ employees, not informal microenterprises, agriculture, public services, or firms with fewer than 5 employees.
- Ghana STEP is 2013 and used for youth-side context, not current demand.
- Bangladesh has no STEP-style household skills microdata in this prototype.
- Automation exposure scores are curated MVP signals, not validated predictions for individual workers.
- Opportunity matches are not job guarantees.
- Some values are manually encoded from PDFs.
- Production would require local validation, stakeholder testing, and updated microdata.

## Demo Script

### 60 seconds

Start with Amara in Ghana. Show her intake, then the Skills Passport that converts phone repair, selling, customer help, and YouTube coding into portable skills. Move to AI readiness and point out task-level exposure: physical repair is more durable, simple coding and records are more exposed. Open opportunity matching and show visible signals on every card, such as informal employment, firm training, digital access, finance, and electricity constraints. End with Data Provenance & Limits.

### 3 minutes

Walk through Amara's intake and constraints first: shared device, low bandwidth, incomplete credentials. Show the Skills Passport evidence fields and taxonomy mappings. Explain that AI risk is not a replacement score; it is task-level exposure calibrated to Ghana's informal service context. Use the opportunity cards to show realistic pathways: repair microbusiness, ICT support assistant, technical customer support, digital services, and TVET bridge. Switch to the institutional dashboard and toggle Employer, NGO, Government, and Training Provider. Then switch to Bangladesh and show that persona, signals, opportunities, education labels, and limitations change through configuration rather than hardcoded Ghana logic.
