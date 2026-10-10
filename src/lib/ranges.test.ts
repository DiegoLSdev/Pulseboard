import { describe, expect, it } from "vitest";
import { parseRange, rangeQuery } from "./ranges";

describe("parseRange", () => {
  it("accepts the known ranges", () => {
    expect(parseRange("30d")).toBe("30d");
    expect(parseRange("all")).toBe("all");
  });

  it("falls back to 7 days for anything else", () => {
    expect(parseRange(undefined)).toBe("7d");
    expect(parseRange("hola")).toBe("7d");
    expect(parseRange("")).toBe("7d");
  });
});

describe("rangeQuery", () => {
  it("leaves the default range out of the URL", () => {
    expect(rangeQuery("7d")).toBe("");
  });

  it("adds any other range to the URL", () => {
    expect(rangeQuery("90d")).toBe("?range=90d");
  });
});