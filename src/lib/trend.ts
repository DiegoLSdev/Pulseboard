/** How a number changed against the previous period. */
export type Change =
  | { kind: "none" } // nothing to compare
  | { kind: "new" } // from zero to something
  | { kind: "same" }
  | { kind: "up"; percent: number }
  | { kind: "down"; percent: number };

export function getChange(current: number, previous: number | null): Change {
  // No comparison available, or no traffic in either period.
  if (previous === null || (previous === 0 && current === 0)) return { kind: "none" };

  // Growth from zero has no meaningful percentage.
  if (previous === 0) return { kind: "new" };

  const percent = Math.round(((current - previous) / previous) * 100);
  if (percent === 0) return { kind: "same" };
  return percent > 0 ? { kind: "up", percent } : { kind: "down", percent: -percent };
}