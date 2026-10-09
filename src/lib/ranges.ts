/** The ranges the dashboard offers. The last two need the local history. */
export const RANGES = [
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "all", label: "All time" },
] as const;

export type RangeKey = (typeof RANGES)[number]["key"];

/** Turns the ?range= value from the URL into a known range, 7 days by default. */
export function parseRange(value: string | undefined): RangeKey {
  const match = RANGES.find((range) => range.key === value);
  return match ? match.key : "7d";
}

/** The query string for a range: "" for the default, "?range=30d" otherwise. */
export function rangeQuery(key: RangeKey): string {
  return key === "7d" ? "" : `?range=${key}`;
}