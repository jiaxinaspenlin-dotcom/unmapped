import { countryConfigs } from "../data/countryConfigs";
import { CountryCode } from "../types/domain";

interface LocalizabilityProps {
  countryCode: CountryCode;
}

export function Localizability({ countryCode }: LocalizabilityProps) {
  const active = countryConfigs[countryCode];
  const other = countryConfigs[countryCode === "GHA" ? "BGD" : "GHA"];
  return (
    <section id="localize" className="rounded-md border border-line bg-white p-4 shadow-soft sm:p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Country configuration</p>
      <h2 className="mt-1 text-2xl font-bold text-ink">Localizable by changing configuration, not rewriting the product</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {[active, other].map((country) => (
          <article className={`rounded-md border p-4 ${country.code === active.code ? "border-ocean bg-skywash" : "border-line bg-white"}`} key={country.code}>
            <p className="text-sm font-semibold text-ocean">{country.countryName} · {country.region}</p>
            <h3 className="mt-1 text-lg font-bold text-ink">{country.persona.name}: {country.contextLabel}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {country.localizationChanges.map((item) => <li key={item}>{item}</li>)}
              <li>Education labels: {country.educationTaxonomy.slice(0, 3).join(", ")}</li>
              <li>Language/readability labels: {country.languageLabels.passport}, {country.languageLabels.opportunity}, {country.languageLabels.verification}</li>
              <li>Digital constraints: {country.digitalConstraints.join("; ")}</li>
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
