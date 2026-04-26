interface BrandIconProps {
  className?: string;
  title?: string;
}

export function BrandIcon({ className = "h-9 w-9", title = "UNMAPPED" }: BrandIconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label={title} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="54" height="54" rx="17" fill="url(#brand-icon-fill)" />
      <rect x="5" y="5" width="54" height="54" rx="17" stroke="#1E3D7A" strokeWidth="2" opacity="0.85" />
      <path d="M20.5 22.5L32 18.4L43.5 22.5V42L32 46.2L20.5 42V22.5Z" stroke="white" strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M32 18.7V46" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="38.6" cy="27.8" r="2.6" stroke="white" strokeWidth="2.6" />
      <defs>
        <linearGradient id="brand-icon-fill" x1="12" y1="8" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C88DE" />
          <stop offset="1" stopColor="#2F63C7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
