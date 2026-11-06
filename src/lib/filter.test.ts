import { describe, expect, it } from "vitest";
import { filterByName } from "./filter";

const projects = [{ name: "Pulseboard" }, { name: "my-blog" }, { name: "Portfolio" }];

describe("filterByName", () => {
  it("returns every project when the query is empty or only spaces", () => {
    expect(filterByName(projects, "")).toEqual(projects);
    expect(filterByName(projects, "   ")).toEqual(projects);
  });

  it("matches anywhere in the name, ignoring case", () => {
    expect(filterByName(projects, "BLOG")).toEqual([{ name: "my-blog" }]);
    expect(filterByName(projects, "o")).toEqual(projects);
  });

  it("returns nothing when no name matches", () => {
    expect(filterByName(projects, "shop")).toEqual([]);
  });
});