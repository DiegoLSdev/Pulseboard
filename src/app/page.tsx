import { vercelFetch } from "@/lib/vercel";

export default async function HomePage() {
  const data = await vercelFetch("/v9/projects", { limit: "100" });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Pulseboard</h1>
      <ul className="mt-4">
        {data.projects.map((project: { id: string; name: string }) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </main>
  );
}
