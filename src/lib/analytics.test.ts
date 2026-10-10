import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getDateRange, getVisits } from "./analytics";

// Every test runs as if today were 9 October 2026 at noon.
beforeEach(() => {
  vi.useFakeTimers({ now: new Date("2026-10-09T12:00:00Z"), toFake: ["Date"] });
  vi.stubEnv("VERCEL_TOKEN", "test-token");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

/** Replaces fetch with a fake that answers with the given rows. */
function mockVercel(rows: { timestamp: string; visitors: number; pageviews: number }[]) {
  const fetchMock = vi.fn(async (url: string) => {
    void url; // the tests read it from fetchMock.mock.calls
    return Response.json({ data: rows });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

/** One row per day between two dates, with the same numbers every day. */
function daysBetween(first: string, last: string, visitors: number) {
  const rows = [];
  for (let t = Date.parse(first); t <= Date.parse(last); t += 86_400_000) {
    rows.push({ timestamp: new Date(t).toISOString(), visitors, pageviews: visitors * 2 });
  }
  return rows;
}

describe("getDateRange", () => {
  it("counts today as one of the days", () => {
    expect(getDateRange(7)).toEqual({ since: "2026-10-03", until: "2026-10-09" });
  });

  it("crosses into the previous month", () => {
    expect(getDateRange(30).since).toBe("2026-09-10");
  });
});

describe("getVisits", () => {
  it("asks Vercel for twice the days so it can compare", async () => {
    const fetchMock = mockVercel([]);

    await getVisits("prj_1", 7);

    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.searchParams.get("since")).toBe("2026-09-26");
    expect(url.searchParams.get("until")).toBe("2026-10-09");
    expect(url.searchParams.get("by")).toBe("day");
  });

  it("splits the days into this period and the previous one", async () => {
    // 7 days at 1 visitor, then 7 days at 3 visitors.
    mockVercel([
      ...daysBetween("2026-09-26", "2026-10-02", 1),
      ...daysBetween("2026-10-03", "2026-10-09", 3),
    ]);

    const visits = await getVisits("prj_1", 7);

    expect(visits.days).toHaveLength(7);
    expect(visits.days[0].date).toBe("2026-10-03");
    expect(visits.visitors).toBe(21);
    expect(visits.pageViews).toBe(42);
    expect(visits.previousVisitors).toBe(7);
  });

  it("does not compare when the range is too long for Hobby", async () => {
    mockVercel(daysBetween("2026-09-10", "2026-10-09", 1));

    const visits = await getVisits("prj_1", 30);

    expect(visits.days).toHaveLength(30);
    expect(visits.previousVisitors).toBeNull();
  });
});