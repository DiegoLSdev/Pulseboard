import "server-only";
import {
  MAX_DAYS,
  getDateRange,
  getVisits,
  type DailyVisits,
  type VisitsSummary,
} from "./analytics";
import { db, ensureSchema } from "./db";
import type { Project } from "./projects";
import type { RangeKey } from "./ranges";


/** The most a Hobby account can read back from Vercel. */
const BACKFILL_DAYS = 31;

/** Saves the visits of each day, replacing any value already stored for that day. */
async function saveDays(projectId: string, days: DailyVisits[]) {
  await db.batch(
    days.map((day) => ({
      sql: `INSERT INTO daily_visits (project_id, date, visitors, page_views)
            VALUES (?, ?, ?, ?)
            ON CONFLICT (project_id, date)
            DO UPDATE SET visitors = excluded.visitors, page_views = excluded.page_views`,
      args: [projectId, day.date, day.visitors, day.pageViews],
    })),
    "write",
  );
}

export async function syncHistory(projects: Project[]) {
  await ensureSchema();

  const today = new Date().toISOString().slice(0, 10);
  const done = await db.execute({
    sql: "SELECT 1 FROM sync_log WHERE date = ?",
    args: [today],
  });
  if (done.rows.length > 0) return;

  for (const project of projects) {
    const { days } = await getVisits(project.id, BACKFILL_DAYS);
    await saveDays(project.id, days);
  }

  await db.execute({ sql: "INSERT INTO sync_log (date) VALUES (?)", args: [today] });
  console.log(`History synced for ${projects.length} projects`);
}

const FIXED_DAYS = { "7d": 7, "30d": 30, "90d": 90 } as const;

/**
 * How many days a range covers. "All time" goes back to the first day in the
 * local history, and is never shorter than what Vercel itself keeps.
 */
export async function resolveDays(key: RangeKey): Promise<number> {
  if (key !== "all") return FIXED_DAYS[key];

  await ensureSchema();
  const result = await db.execute("SELECT MIN(date) AS first FROM daily_visits");
  const first = result.rows[0]?.first;
  if (typeof first !== "string") return MAX_DAYS;

  const today = Date.parse(new Date().toISOString().slice(0, 10));
  const days = Math.round((today - Date.parse(first)) / 86_400_000) + 1;
  return Math.max(days, MAX_DAYS);
}

/**
 * Like getVisits, but for ranges longer than Vercel keeps: the last 31 days
 * come live from Vercel and anything older comes from the local history.
 */
export async function getVisitsWithHistory(
  projectId: string,
  numberOfDays: number,
): Promise<VisitsSummary> {
  if (numberOfDays <= MAX_DAYS) return getVisits(projectId, numberOfDays);

  const recent = await getVisits(projectId, MAX_DAYS);
  const { since } = getDateRange(numberOfDays);
  const recentSince = getDateRange(MAX_DAYS).since;

  await ensureSchema();
  const stored = await db.execute({
    sql: `SELECT date, visitors, page_views FROM daily_visits
          WHERE project_id = ? AND date >= ? AND date < ?
          ORDER BY date`,
    args: [projectId, since, recentSince],
  });

  const olderDays: DailyVisits[] = stored.rows.map((row) => ({
    date: String(row.date),
    visitors: Number(row.visitors),
    pageViews: Number(row.page_views),
  }));

  const days = [...olderDays, ...recent.days];

  return {
    days,
    visitors: days.reduce((sum, day) => sum + day.visitors, 0),
    pageViews: days.reduce((sum, day) => sum + day.pageViews, 0),
    previousVisitors: null,
  };
}