interface LimitationsProps {
  limitations: string[];
}

export function Limitations({ limitations }: LimitationsProps) {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
      <h3 className="font-bold text-amber-950">Prototype limits</h3>
      <ul className="mt-2 space-y-1 text-sm text-amber-950">
        {limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
      </ul>
    </div>
  );
}
