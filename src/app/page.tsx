import { listProjects } from "@/lib/projects";

export default async function HomePage() {
  const allProjects = await listProjects();
  const projectsWithAnalytics = allProjects.filter((project) => project.analyticsEnabled);
  const pendingProjects = allProjects.filter((project) => !project.analyticsEnabled);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Pulseboard</h1>
      <h2 className="mt-8 text-lg font-semibold">
        With Web Analytics ({projectsWithAnalytics.length})
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projectsWithAnalytics.map((project) => (
          <li key={project.id} className="rounded-xl border border-black/10 p-5 font-medium dark:border-white/15">
            {project.name}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-lg font-semibold">Without Web Analytics ({pendingProjects.length})</h2>
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
