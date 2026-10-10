export const SORTS = [
  { key: "visitors", label: "Visitors" },
  { key: "pageviews", label: "Page views" },
  { key: "trend", label: "Trend" },
  { key: "name", label: "Name" },
] as const;

export type SortKey = (typeof SORTS)[number]["key"];

/** Turns the ?sort= value from the URL into a known sort option, "visitors" by default. */
export function parseSort(value: string | undefined): SortKey {
  const match = SORTS.find((s) => s.key === value);
  return match ? match.key : "visitors";
}

/** Computes a sortable percentage trend (-Infinity to +Infinity). */
export function getTrendValue(current: number, previous: number | null): number {
  if (previous === null || (previous === 0 && current === 0)) return 0;
  if (previous === 0) return 100; // positive growth from zero
  return ((current - previous) / previous) * 100;
}
