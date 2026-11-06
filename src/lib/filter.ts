/** Keeps the items whose name contains the query, ignoring case and extra spaces. */
export function filterByName<T extends { name: string }>(items: T[], query: string): T[] {
  const needle = query.trim().toLowerCase();
  if (needle === "") return items;
  return items.filter((item) => item.name.toLowerCase().includes(needle));
}