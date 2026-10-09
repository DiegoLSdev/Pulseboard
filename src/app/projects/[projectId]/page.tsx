import Link from "next/link";
import { notFound } from "next/navigation";
import { AutoRefresh } from "@/components/auto-refresh";
import { BreakdownList } from "@/components/breakdown-list";
import { Sparkline } from "@/components/sparkline";
import { Trend } from "@/components/trend";
import { MAX_DAYS, getBreakdown } from "@/lib/analytics";
import { getVisitsWithHistory, resolveDays } from "@/lib/history";
import { listProjects } from "@/lib/projects";
import { RANGES, parseRange, rangeQuery } from "@/lib/ranges";

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

/** "US" -> "United States". Leaves anything it does not know as it is. */
function countryName(code: string): string {
  if (code === "Others") return code;
  try {
    return countryNames.of(code) ?? code;
  } catch {
    return code;
  }
}

/** Visits with no referrer come from typed URLs, bookmarks or apps. */
function referrerName(hostname: string): string {
  return hostname === "" ? "Direct / unknown" : hostname;
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { projectId } = await params;
  const { range } = await searchParams;
  const rangeKey = parseRange(range);
  const numberOfDays = await resolveDays(rangeKey);
  const query = rangeQuery(rangeKey);

  // Vercel only keeps 31 days of pages, referrers and countries.
  const breakdownDays = Math.min(numberOfDays, MAX_DAYS);

  // Only show projects from this account with Web Analytics enabled.
  const projects = await listProjects();
  const project = projects.find((item) => item.id === projectId);
  if (!project || !project.analyticsEnabled) notFound();

  // The four requests are independent, so they run at the same time.
  const [visits, pages, referrers, countries] = await Promise.all([
    getVisitsWithHistory(project.id, numberOfDays),
    getBreakdown(project.id, "route", breakdownDays),
    getBreakdown(project.id, "referrerHostname", breakdownDays),
    getBreakdown(project.id, "country", breakdownDays),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <AutoRefresh />

      <Link href={`/${query}`} className="text-sm opacity-70 hover:opacity-100">
        ← All projects
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <nav
          aria-label="Time range"
          className="inline-flex flex-wrap rounded-lg border border-black/10 p-1 dark:border-white/15"
        >
          {RANGES.map((option) => (
            <Link
              key={option.key}
              href={`/projects/${project.id}${rangeQuery(option.key)}`}
              aria-current={option.key === rangeKey ? "page" : undefined}
              className={
                option.key === rangeKey
                  ? "rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-black"
                  : "rounded-md px-3 py-1.5 text-sm opacity-70 hover:opacity-100"
              }
            >
              {option.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6 rounded-xl border border-black/10 p-5 dark:border-white/15">
        <dl className="flex gap-10">
          <div>
            <dt className="text-sm opacity-70">Visitors</dt>
            <dd className="mt-1 text-3xl font-semibold">{visits.visitors}</dd>
            <Trend
              current={visits.visitors}
              previous={visits.previousVisitors}
              numberOfDays={numberOfDays}
            />
          </div>
          <div>
            <dt className="text-sm opacity-70">Page views</dt>
            <dd className="mt-1 text-3xl font-semibold">{visits.pageViews}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <Sparkline values={visits.days.map((day) => day.visitors)} />
        </div>
      </div>

      {numberOfDays > MAX_DAYS && (
        <p className="mt-6 text-sm opacity-70">
          Pages, referrers and countries show the last {MAX_DAYS} days: Vercel
          does not keep them for longer.
        </p>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <BreakdownList title="Top pages" rows={pages} />
        <BreakdownList title="Referrers" rows={referrers} formatValue={referrerName} />
        <BreakdownList title="Countries" rows={countries} formatValue={countryName} />
      </div>
    </main>
  );
}