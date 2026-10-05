import { listProjects } from "@/lib/projects";
import { getVisits } from "@/lib/analytics";


export default async function HomePage() {
  const allProjects = await listProjects();
  const projectsWithAnalytics = allProjects.filter((project) => project.analyticsEnabled);
  const pendingProjects = allProjects.filter((project) => !project.analyticsEnabled);

  const cards = await Promise.all(
    projectsWithAnalytics.map(async (project) => ({
      project,
      visits: await getVisits(project.id),
    })),
  );

  cards.sort((a, b) => Number(b.visits) - Number(a.visits));

  const { totalVisitors, totalPageViews } = cards.reduce(
    (acc, card) => {
      acc.totalVisitors += card.visits.visitors;
      acc.totalPageViews += card.visits.pageViews;
      return acc;
    },
    { totalVisitors: 0, totalPageViews: 0 }
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Pulseboard</h1>
      <p className="mt-1 text-sm opacity-70">Last 7 days</p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 p-5 dark:border-white/15">
          <dt className="text-sm opacity-70">Visitors</dt>
          <dd className="mt-1 text-3xl font-semibold">{totalVisitors}</dd>
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

      <h2 className="mt-10 text-lg font-semibold">Projects</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ project, visits }) => (
          <li
            key={project.id}
            className="rounded-xl border border-black/10 p-5 dark:border-white/15"
          >
            <h3 className="truncate font-medium">{project.name}</h3>
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
