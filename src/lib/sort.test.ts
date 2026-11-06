import { describe, expect, it } from "vitest";
import { compareBy, parseSort } from "./sort";

describe("parseSort", () => {
  it("accepts every known option", () => {
    expect(parseSort("pageviews")).toBe("pageviews");
    expect(parseSort("trend")).toBe("trend");
    expect(parseSort("name")).toBe("name");
  });

  it("falls back to visitors when missing or unknown", () => {
    expect(parseSort(undefined)).toBe("visitors");
    expect(parseSort("banana")).toBe("visitors");
  });
});

describe("compareBy", () => {
  const alpha = { name: "alpha", visitors: 10, pageViews: 50, previousVisitors: 20 };
  const beta = { name: "Beta", visitors: 30, pageViews: 40, previousVisitors: 10 };
  const gamma = { name: "gamma", visitors: 20, pageViews: 60, previousVisitors: null };
  const names = (sort: Parameters<typeof compareBy>[0]) =>
    [alpha, beta, gamma].sort(compareBy(sort)).map((project) => project.name);

  it("sorts by visitors, most first", () => {
    expect(names("visitors")).toEqual(["Beta", "gamma", "alpha"]);
  });

  it("sorts by page views, most first", () => {
    expect(names("pageviews")).toEqual(["gamma", "alpha", "Beta"]);
  });

  it("sorts by growth and puts projects without a comparison last", () => {
    expect(names("trend")).toEqual(["Beta", "alpha", "gamma"]);
  });

  it("sorts by name, ignoring case", () => {
    expect(names("name")).toEqual(["alpha", "Beta", "gamma"]);
  });
});