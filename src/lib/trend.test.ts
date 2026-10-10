import { describe, expect, it } from "vitest";
import { getChange } from "./trend";

describe("getChange", () => {
  it("shows nothing when there is no previous period", () => {
    expect(getChange(10, null)).toEqual({ kind: "none" });
  });

  it("shows nothing when both periods are empty", () => {
    expect(getChange(0, 0)).toEqual({ kind: "none" });
  });

  it("does not divide by zero when growing from nothing", () => {
    expect(getChange(5, 0)).toEqual({ kind: "new" });
  });

  it("rounds to whole percentages", () => {
    expect(getChange(4, 3)).toEqual({ kind: "up", percent: 33 });
  });

  it("reports drops as a positive percentage", () => {
    expect(getChange(5, 10)).toEqual({ kind: "down", percent: 50 });
  });

  it("treats changes that round to 0% as no change", () => {
    expect(getChange(1001, 1000)).toEqual({ kind: "same" });
  });
});