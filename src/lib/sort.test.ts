import { describe, expect, it } from "vitest";
import { getTrendValue, parseSort, SORTS } from "./sort";

describe("parseSort", () => {
  it("accepts known sort keys", () => {
    expect(parseSort("visitors")).toBe("visitors");
    expect(parseSort("pageviews")).toBe("pageviews");
    expect(parseSort("trend")).toBe("trend");
    expect(parseSort("name")).toBe("name");
  });

  it("falls back to visitors for undefined or invalid values", () => {
    expect(parseSort(undefined)).toBe("visitors");
    expect(parseSort("invalid")).toBe("visitors");
    expect(parseSort("")).toBe("visitors");
  });
});

describe("getTrendValue", () => {
  it("returns 0 when previous is null or both are 0", () => {
    expect(getTrendValue(10, null)).toBe(0);
    expect(getTrendValue(0, 0)).toBe(0);
  });

  it("handles growth from 0", () => {
    expect(getTrendValue(5, 0)).toBe(100);
  });

  it("calculates positive and negative percentage changes", () => {
    expect(getTrendValue(20, 10)).toBe(100);
    expect(getTrendValue(5, 10)).toBe(-50);
  });
});
