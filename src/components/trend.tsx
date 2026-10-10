import { getChange } from "@/lib/trend";

/**
 * Change against the previous period, e.g. "▲ 25% vs previous 7 days".
 * The arrow and the sign carry the direction, so it does not rely on colour.
 */
export function Trend({
  current,
  previous,
  numberOfDays,
}: {
  current: number;
  previous: number | null;
  numberOfDays: number;
}) {
  const change = getChange(current, previous);
  if (change.kind === "none") return null;

  const label = <span className="opacity-70">vs previous {numberOfDays} days</span>;

  if (change.kind === "same") {
    return <p className="mt-1 text-xs opacity-70">= 0% {label}</p>;
  }

  if (change.kind === "new") {
    return (
      <p className="mt-1 text-xs text-green-700 dark:text-green-400">▲ New {label}</p>
    );
  }

  return change.kind === "up" ? (
    <p className="mt-1 text-xs text-green-700 dark:text-green-400">
      ▲ {change.percent}% {label}
    </p>
  ) : (
    <p className="mt-1 text-xs text-red-700 dark:text-red-400">
      ▼ {change.percent}% {label}
    </p>
  );
}