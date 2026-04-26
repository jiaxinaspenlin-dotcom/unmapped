interface LogoProps {
  variant?: "light" | "dark";
  onClick?: () => void;
}

export function Logo({ variant = "dark", onClick }: LogoProps) {
  const text = variant === "light" ? "text-white" : "text-slate-950";
  const subtitle = variant === "light" ? "text-white/60" : "text-slate-500";

  return (
    <button className="group inline-flex items-center gap-2.5 rounded-xl text-left" onClick={onClick} type="button">
      <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-[12px] bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/25 transition-transform duration-200 ease-out group-hover:scale-105">
        <svg viewBox="0 0 100 100" className="relative h-7 w-7" fill="none" aria-hidden="true">
          <polygon points="15,28 50,16 85,28 85,78 50,90 15,78" fill="none" stroke="white" strokeWidth="6" strokeLinejoin="round" />
          <line x1="50" y1="16" x2="50" y2="90" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <circle cx="65" cy="46" r="8" fill="white" />
          <circle cx="65" cy="46" r="2.8" fill="#2563eb" />
        </svg>
        <div className="absolute inset-0 rounded-[12px] ring-1 ring-white/25" />
        <div className="pointer-events-none absolute -inset-px rounded-[12px] bg-gradient-to-br from-white/20 to-transparent" />
      </div>
      <div className="leading-none">
        <div className={`font-sans text-lg font-extrabold tracking-tight ${text}`}>UNMAPPED</div>
        <div className={`text-[10px] uppercase tracking-[0.18em] ${subtitle}`}>Skills Passport</div>
      </div>
    </button>
  );
}
