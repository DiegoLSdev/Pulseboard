import type { BreakdownRow } from "@/lib/analytics";

export function BreakdownList({
  title,
  rows,
  formatValue = (value) => value,
}: {
  title: string;
  rows: BreakdownRow[];
  formatValue?: (value: string) => string;
}) {
  const max = Math.max(...rows.map((row) => row.visitors), 0);

  return (
    <section className="rounded-xl border border-black/10 p-5 dark:border-white/15">
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold">{title}</h2>
        <span className="text-xs opacity-70">Visitors</span>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm opacity-70">No data for this period.</p>
      ) : (
        <ol className="mt-4 flex flex-col gap-1">
          {rows.map((row) => (
            <li key={row.value} className="relative">
              <div
                className="absolute inset-y-0 left-0 rounded bg-[#2a78d6]/10 dark:bg-[#3987e5]/15"
                style={{ width: `${max === 0 ? 0 : (row.visitors / max) * 100}%` }}
                aria-hidden="true"
              />
              <div className="relative flex items-center justify-between gap-4 px-2 py-1.5 text-sm">
                <span className="truncate" title={row.value}>
                  {formatValue(row.value)}
                </span>
                <span className="font-medium tabular-nums">{row.visitors}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}