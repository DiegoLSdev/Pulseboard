"use client";

import { useState, type ReactNode } from "react";
import { filterByName } from "@/lib/filter";

type FilterableProject = {
  id: string;
  name: string;
  card: ReactNode;
};

/**
 * A search box above the project grid. The cards are still rendered on the
 * server; this component only hides the ones whose name does not match.
 */
export function ProjectFilter({ projects }: { projects: FilterableProject[] }) {
  const [query, setQuery] = useState("");
  const visible = filterByName(projects, query);

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Filter by name"
        aria-label="Filter projects by name"
        className="mt-4 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15 sm:w-64"
      />

      {visible.length === 0 && query.trim() !== "" ? (
        <p className="mt-4 text-sm opacity-70">No projects match “{query.trim()}”.</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <li key={project.id}>{project.card}</li>
          ))}
        </ul>
      )}
    </>
  );
}