import { Gauge, LockKeyhole, Smartphone } from "lucide-react";

export function LowBandwidthBanner() {
  const items = [
    { icon: Smartphone, label: "Mobile-first", text: "Readable on a shared phone." },
    { icon: Gauge, label: "Low bandwidth", text: "Text-first cards, simple charts, no heavy media." },
    { icon: LockKeyhole, label: "Shared device safe", text: "Outputs are portable and explainable without private accounts." },
  ];
  return (
    <div className="grid gap-3 rounded-md border border-blue-100 bg-skywash p-3 sm:grid-cols-3">
      {items.map(({ icon: Icon, label, text }) => (
        <div className="flex gap-2" key={label}>
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ocean" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-ink">{label}</p>
            <p className="text-xs text-slate-600">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
