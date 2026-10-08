import "server-only";
import { getVisits, type DailyVisits } from "./analytics";
import { db, ensureSchema } from "./db";
import type { Project } from "./projects";

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