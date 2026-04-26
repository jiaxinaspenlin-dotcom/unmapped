import { BriefcaseBusiness, Building2, GraduationCap, HeartHandshake } from "lucide-react";
import { InstitutionRole } from "../types/domain";

interface RoleToggleProps {
  value: InstitutionRole;
  onChange: (role: InstitutionRole) => void;
}

const roles = [
  { id: "employer", label: "Employer", icon: BriefcaseBusiness },
  { id: "ngo", label: "Non-governmental organization", icon: HeartHandshake },
  { id: "government", label: "Government", icon: Building2 },
  { id: "trainingProvider", label: "Training", icon: GraduationCap },
] as const;

export function RoleToggle({ value, onChange }: RoleToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {roles.map(({ id, label, icon: Icon }) => (
        <button
          type="button"
          className={`focus-ring flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
            value === id ? "border-ocean bg-ocean text-white" : "border-line bg-white text-slate-700 hover:bg-skywash"
          }`}
          onClick={() => onChange(id)}
          key={id}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}
