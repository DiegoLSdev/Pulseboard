"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkline } from "@/components/sparkline";
import { Trend } from "@/components/trend";
import type { Project } from "@/lib/projects";
import type { VisitsSummary } from "@/lib/analytics";

export type ProjectCardData = {
  project: Project;
  visits: VisitsSummary;
};

export function filterProjects<T extends { project: { name: string } }>(
  cards: T[],
  query: string,
): T[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return cards;
  return cards.filter((card) =>
    card.project.name.toLowerCase().includes(trimmed),
  );
}

export function ProjectList({
  cards,
  numberOfDays,
  rangeQuery,
}: {
  cards: ProjectCardData[];
  numberOfDays: number;
  rangeQuery: string;
}) {
  const [query, setQuery] = useState("");

  const filteredCards = useMemo(
    () => filterProjects(cards, query),
    [cards, query],
  );

  return (
    <section aria-label="Projects">
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>
        <div className="relative w-full sm:w-64">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter projects by name..."
            aria-label="Filter projects by name"
            className="w-full rounded-lg border border-black/10 bg-transparent px-3 py-1.5 text-sm placeholder:opacity-50 focus:border-black/30 focus:outline-none dark:border-white/15 dark:focus:border-white/40"
          />
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <p className="mt-6 text-sm opacity-70">
          No projects match &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map(({ project, visits }) => (
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
      )}
    </section>
  );
}
