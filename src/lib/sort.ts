/** The ways the overview can sort its projects. Visitors is the default. */
export const SORTS = [
  { key: "visitors", label: "Visitors" },
  { key: "pageviews", label: "Page views" },
  { key: "trend", label: "Trend" },
  { key: "name", label: "Name" },
] as const;

export type SortKey = (typeof SORTS)[number]["key"];

/** Turns the ?sort= value from the URL into a known option, visitors by default. */
export function parseSort(value: string | undefined): SortKey {
  const match = SORTS.find((sort) => sort.key === value);
  return match ? match.key : "visitors";
}

type Sortable = {
  name: string;
  visitors: number;
  pageViews: number;
  previousVisitors: number | null;
};

/** Growth against the previous period. Projects without a comparison go last. */
function growth({ visitors, previousVisitors }: Sortable): number {
  if (previousVisitors === null) return -Infinity;
  if (previousVisitors === 0) return visitors > 0 ? Infinity : 0;
  return (visitors - previousVisitors) / previousVisitors;
}

/** A compare function for Array.sort: biggest numbers first, names A to Z. */
export function compareBy(sort: SortKey): (a: Sortable, b: Sortable) => number {
  switch (sort) {
    case "pageviews":
      return (a, b) => b.pageViews - a.pageViews;
    case "trend":
      return (a, b) => growth(b) - growth(a) || b.visitors - a.visitors;
    case "name":
      return (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    default:
      return (a, b) => b.visitors - a.visitors;
  }
}