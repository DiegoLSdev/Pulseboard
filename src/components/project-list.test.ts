import { describe, expect, it } from "vitest";
import { filterProjects } from "./project-list";

describe("filterProjects", () => {
  const sampleCards = [
    { project: { name: "Pulseboard" } },
    { project: { name: "Analytics Dashboard" } },
    { project: { name: "Personal Blog" } },
    { project: { name: "My-pulse-app" } },
  ];

  it("returns all projects when query is empty or whitespace", () => {
    expect(filterProjects(sampleCards, "")).toEqual(sampleCards);
    expect(filterProjects(sampleCards, "   ")).toEqual(sampleCards);
  });

  it("filters case-insensitively matching anywhere in project name", () => {
    const pulseMatches = filterProjects(sampleCards, "pulse");
    expect(pulseMatches.map((c) => c.project.name)).toEqual([
      "Pulseboard",
      "My-pulse-app",
    ]);

    const upperMatches = filterProjects(sampleCards, "BLOG");
    expect(upperMatches.map((c) => c.project.name)).toEqual(["Personal Blog"]);
  });

  it("returns empty array when nothing matches", () => {
    expect(filterProjects(sampleCards, "nonexistent")).toEqual([]);
  });
});
