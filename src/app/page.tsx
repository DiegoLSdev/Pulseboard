import { listProjects } from "@/lib/projects";
import { getVisits } from "@/lib/analytics";
import { Sparkline } from "@/components/sparkline";
import { Trend } from "@/components/trend";
import { AutoRefresh } from "@/components/auto-refresh";
import { parseSort, getTrendValue, SORTS, type SortKey } from "@/lib/sort";
import Link from "next/link";
import { after } from "next/server";
import { syncHistory } from "@/lib/history";

const RANGES = [
  { days: 7, key: "7d", label: "Last 7 days" },
  { days: 30, key: "30d", label: "Last 30 days" },
];

function buildQuery(rangeKey: string, sortKey: SortKey): string {
  const params = new URLSearchParams();
  if (rangeKey === "30d") params.set("range", "30d");
  if (sortKey !== "visitors") params.set("sort", sortKey);
  const str = params.toString();
  return str ? `?${str}` : "";
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; sort?: string }>;
}) {
  const { range, sort } = await searchParams;
  const numberOfDays = range === "30d" ? 30 : 7;
  const currentRangeKey = numberOfDays === 30 ? "30d" : "7d";
  const currentSort = parseSort(sort);
  const rangeQuery = numberOfDays === 30 ? "?range=30d" : "";

  const allProjects = await listProjects();
  const projectsWithAnalytics = allProjects.filter((project) => project.analyticsEnabled);
  const pendingProjects = allProjects.filter((project) => !project.analyticsEnabled);
  
  after(() => syncHistory(projectsWithAnalytics).catch(console.error));
  
  const cards = await Promise.all(
    projectsWithAnalytics.map(async (project) => ({
      project,
      visits: await getVisits(project.id, numberOfDays),
    })),
  );

  cards.sort((a, b) => {
    switch (currentSort) {
      case "pageviews":
        return b.visits.pageViews - a.visits.pageViews;
      case "name":
        return a.project.name.localeCompare(b.project.name, undefined, { sensitivity: "base" });
      case "trend": {
        const trendA = getTrendValue(a.visits.visitors, a.visits.previousVisitors);
        const trendB = getTrendValue(b.visits.visitors, b.visits.previousVisitors);
        return trendB - trendA;
      }
      case "visitors":
      default:
        return b.visits.visitors - a.visits.visitors;
    }
  });

  const totalVisitors = cards.reduce((sum, card) => sum + card.visits.visitors, 0);
  const totalPageViews = cards.reduce((sum, card) => sum + card.visits.pageViews, 0);
  const totalPreviousVisitors = cards.every((card) => card.visits.previousVisitors !== null)
    ? cards.reduce((sum, card) => sum + (card.visits.previousVisitors ?? 0), 0)
    : null;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <AutoRefresh />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Pulseboard</h1>
        <nav
          aria-label="Time range"
          className="inline-flex rounded-lg border border-black/10 p-1 dark:border-white/15"
        >
          {RANGES.map((option) => {
            const isSelected = option.days === numberOfDays;
            const query = buildQuery(option.key, currentSort);
            const href = query ? `/${query}` : "/";
            return (
              <Link
                key={option.days}
                href={href}
                aria-current={isSelected ? "page" : undefined}
                className={
                  isSelected
                    ? "rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-black"
                    : "rounded-md px-3 py-1.5 text-sm opacity-70 hover:opacity-100"
                }
              >
                {option.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 p-5 dark:border-white/15">
          <dt className="text-sm opacity-70">Visitors</dt>
          <dd className="mt-1 text-3xl font-semibold">{totalVisitors}</dd>
          <Trend
            current={totalVisitors}
            previous={totalPreviousVisitors}
            numberOfDays={numberOfDays}
          />
        </div>
        <div className="rounded-xl border border-black/10 p-5 dark:border-white/15">
          <dt className="text-sm opacity-70">Page views</dt>
          <dd className="mt-1 text-3xl font-semibold">{totalPageViews}</dd>
        </div>
        <div className="rounded-xl border border-black/10 p-5 dark:border-white/15">
          <dt className="text-sm opacity-70">Projects tracked</dt>
          <dd className="mt-1 text-3xl font-semibold">{cards.length}</dd>
        </div>
      </dl>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-70">Sort by:</span>
          <nav
            aria-label="Sort projects"
            className="inline-flex rounded-lg border border-black/10 p-1 dark:border-white/15"
          >
            {SORTS.map((option) => {
              const isSelected = option.key === currentSort;
              const query = buildQuery(currentRangeKey, option.key);
              const href = query ? `/${query}` : "/";
              return (
                <Link
                  key={option.key}
                  href={href}
                  aria-current={isSelected ? "page" : undefined}
                  className={
                    isSelected
                      ? "rounded-md bg-black px-2.5 py-1 text-xs font-medium text-white dark:bg-white dark:text-black"
                      : "rounded-md px-2.5 py-1 text-xs opacity-70 hover:opacity-100"
                  }
                >
                  {option.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ project, visits }) => (
          <li key={project.id}>
            <Link
              href={`/projects/${project.id}${rangeQuery}`}
              className="block rounded-xl border border-black/10 p-5 transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/40"
            >
              <h3 className="truncate font-medium">{project.name}</h3>
              <Trend
                current={visits.visitors}
                previous={visits.previousVisitors}
                numberOfDays={numberOfDays}
              />
              <dl className="mt-4 flex gap-8">
                <div>
                  <dt className="text-xs opacity-70">Visitors</dt>
                  <dd className="text-2xl font-semibold">{visits.visitors}</dd>
                </div>
                <div>
                  <dt className="text-xs opacity-70">Page views</dt>
                  <dd className="text-2xl font-semibold">{visits.pageViews}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <Sparkline values={visits.days.map((day) => day.visitors)} />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-lg font-semibold">
        Without Web Analytics ({pendingProjects.length})
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {pendingProjects.map((project) => (
          <li
            key={project.id}
            className="rounded-md border border-black/10 px-2 py-1 text-sm opacity-70 dark:border-white/15"
          >
            {project.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
