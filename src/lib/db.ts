import "server-only";
import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.DATABASE_URL || "file:pulseboard.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

let ready: Promise<void> | undefined;

export function ensureSchema(): Promise<void> {
  ready ??= db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS daily_visits (
      project_id TEXT    NOT NULL,
      date       TEXT    NOT NULL,
      visitors   INTEGER NOT NULL,
      page_views INTEGER NOT NULL,
      PRIMARY KEY (project_id, date)
    );

    CREATE TABLE IF NOT EXISTS sync_log (
      date TEXT PRIMARY KEY
    );
  `);
  return ready;
}