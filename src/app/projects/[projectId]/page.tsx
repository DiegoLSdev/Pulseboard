import Link from "next/link";
import { notFound } from "next/navigation";
import { BreakdownList } from "@/components/breakdown-list";
import { Sparkline } from "@/components/sparkline";
import { getBreakdown, getVisits } from "@/lib/analytics";
import { listProjects } from "@/lib/projects";
import { Trend } from "@/components/trend";

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
  const numberOfDays = range === "30d" ? 30 : 7;

  // Only show projects from this account with Web Analytics enabled.
  const projects = await listProjects();
  const project = projects.find((item) => item.id === projectId);
  if (!project || !project.analyticsEnabled) notFound();

  // The four requests are independent, so they run at the same time.
  const [visits, pages, referrers, countries] = await Promise.all([
    getVisits(project.id, numberOfDays),
    getBreakdown(project.id, "route", numberOfDays),
    getBreakdown(project.id, "referrerHostname", numberOfDays),
    getBreakdown(project.id, "country", numberOfDays),
  ]);

  const rangeQuery = numberOfDays === 30 ? "?range=30d" : "";


  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <Link href={`/${rangeQuery}`} className="text-sm opacity-70 hover:opacity-100">
        ← All projects
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <nav
          aria-label="Time range"
          className="inline-flex rounded-lg border border-black/10 p-1 dark:border-white/15"
        >
          {[
            { days: 7, href: `/projects/${project.id}`, label: "Last 7 days" },
            { days: 30, href: `/projects/${project.id}?range=30d`, label: "Last 30 days" },
          ].map((option) => (
            <Link
              key={option.days}
              href={option.href}
              aria-current={option.days === numberOfDays ? "page" : undefined}
              className={
                option.days === numberOfDays
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

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <BreakdownList title="Top pages" rows={pages} />
        <BreakdownList title="Referrers" rows={referrers} formatValue={referrerName} />
        <BreakdownList title="Countries" rows={countries} formatValue={countryName} />
      </div>
    </main>
  );
}