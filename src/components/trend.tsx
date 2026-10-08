export function Trend({
  current,
  previous,
  numberOfDays,
}: {
  current: number;
  previous: number | null;
  numberOfDays: number;
}) {
  // No comparison available (30-day range) or no traffic in either period.
  if (previous === null || (previous === 0 && current === 0)) return null;

  const label = `vs previous ${numberOfDays} days`;

  // Growth from zero has no meaningful percentage.
  if (previous === 0) {
    return (
      <p className="mt-1 text-xs text-green-700 dark:text-green-400">
        ▲ New <span className="opacity-70">{label}</span>
      </p>
    );
  }

  const change = Math.round(((current - previous) / previous) * 100);

  if (change === 0) {
    return (
      <p className="mt-1 text-xs opacity-70">
        = 0% <span>{label}</span>
      </p>
    );
  }

  const up = change > 0;
  return (
    <p
      className={
        up
          ? "mt-1 text-xs text-green-700 dark:text-green-400"
          : "mt-1 text-xs text-red-700 dark:text-red-400"
      }
    >
      {up ? "▲" : "▼"} {Math.abs(change)}%{" "}
      <span className="opacity-70">{label}</span>
    </p>
  );
}