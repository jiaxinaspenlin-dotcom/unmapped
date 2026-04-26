import { Globe2 } from "lucide-react";
import { CountryCode } from "../types/domain";

interface CountrySwitcherProps {
  value: CountryCode;
  onChange: (country: CountryCode) => void;
}

export function CountrySwitcher({ value, onChange }: CountrySwitcherProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-line bg-white p-1 shadow-sm">
      <Globe2 className="ml-2 h-4 w-4 text-ocean" aria-hidden="true" />
      {(["GHA", "BGD"] as CountryCode[]).map((country) => (
        <button
          type="button"
          className={`focus-ring rounded px-3 py-2 text-sm font-semibold ${value === country ? "bg-ocean text-white" : "text-slate-700 hover:bg-skywash"}`}
          onClick={() => onChange(country)}
          key={country}
        >
          {country === "GHA" ? "Ghana" : "Bangladesh"}
        </button>
      ))}
    </div>
  );
}
