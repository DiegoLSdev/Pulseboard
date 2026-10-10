import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Every test runs as if today were 9 October 2026.
beforeEach(() => {
  vi.useFakeTimers({ now: new Date("2026-10-09T12:00:00Z"), toFake: ["Date"] });
  vi.stubEnv("VERCEL_TOKEN", "test-token");
  // A fresh database that lives only in memory, so tests never touch pulseboard.db.
  vi.stubEnv("DATABASE_URL", ":memory:");
  vi.resetModules();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

/** Loads the modules after the env is set, so db.ts sees DATABASE_URL. */
async function load() {
  const history = await import("./history");
  const { db, ensureSchema } = await import("./db");
  await ensureSchema();
  return { ...history, db };
}

/** Vercel answers every request with 1 visitor per day for the requested days. */
function mockVercel() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const params = new URL(url).searchParams;
      const rows = [];
      for (
        let t = Date.parse(params.get("since")!);
        t <= Date.parse(params.get("until")!);
        t += 86_400_000
      ) {
        rows.push({ timestamp: new Date(t).toISOString(), visitors: 1, pageviews: 2 });
      }
      return Response.json({ data: rows });
    }),
  );
}

describe("getVisitsWithHistory", () => {
  it("uses only Vercel for ranges it can serve", async () => {
    mockVercel();
    const { getVisitsWithHistory } = await load();

    const visits = await getVisitsWithHistory("prj_1", 30);

    expect(visits.days).toHaveLength(30);
  });

  it("adds older days from the database before the last 31 days", async () => {
    mockVercel();
    const { getVisitsWithHistory, db } = await load();
    // Two stored days older than what Vercel keeps, with 10 visitors each.
    await db.execute(
      "INSERT INTO daily_visits VALUES ('prj_1', '2026-08-01', 10, 20), ('prj_1', '2026-08-02', 10, 20)",
    );

    const visits = await getVisitsWithHistory("prj_1", 90);

    expect(visits.days).toHaveLength(33);
    expect(visits.days[0].date).toBe("2026-08-01");
    expect(visits.visitors).toBe(20 + 31);
    expect(visits.previousVisitors).toBeNull();
  });

  it("does not count a day twice when it is both stored and live", async () => {
    mockVercel();
    const { getVisitsWithHistory, db } = await load();
    // A recent day that the sync already saved; Vercel also returns it.
    await db.execute("INSERT INTO daily_visits VALUES ('prj_1', '2026-10-01', 99, 99)");

    const visits = await getVisitsWithHistory("prj_1", 90);

    expect(visits.days.filter((day) => day.date === "2026-10-01")).toHaveLength(1);
    expect(visits.visitors).toBe(31);
  });

  it("ignores other projects", async () => {
    mockVercel();
    const { getVisitsWithHistory, db } = await load();
    await db.execute("INSERT INTO daily_visits VALUES ('prj_2', '2026-08-01', 10, 20)");

    const visits = await getVisitsWithHistory("prj_1", 90);

    expect(visits.days).toHaveLength(31);
  });
});

describe("resolveDays", () => {
  it("uses fixed lengths for the fixed ranges", async () => {
    const { resolveDays } = await load();
    expect(await resolveDays("90d")).toBe(90);
  });

  it("goes back to the first stored day for all time", async () => {
    const { resolveDays, db } = await load();
    await db.execute("INSERT INTO daily_visits VALUES ('prj_1', '2026-06-01', 1, 1)");

    // 1 June to 9 October, both included.
    expect(await resolveDays("all")).toBe(131);
  });

  it("never goes below the 31 days Vercel keeps", async () => {
    const { resolveDays } = await load();
    expect(await resolveDays("all")).toBe(31);
  });
});