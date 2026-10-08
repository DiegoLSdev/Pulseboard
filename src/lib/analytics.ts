import "server-only"
import { vercelFetch } from "./vercel"

export type DailyVisits = {
    date: string;
    visitors: number;
    pageViews: number;
}

export type VisitsSummary = {
  days: DailyVisits[];
  visitors: number;
  pageViews: number;
  previousVisitors: number | null;
};

const MAX_DAYS = 31;

type ApiRow = {
    timestamp: string;
    visitors: number;
    pageviews: number;
};

type ApiBreakdownRow = {
  visitors: number;
  pageviews: number;
  [dimension: string]: string | number | null;
};

function getDateRange(numberOfDays: number) {
    const untilDate = new Date();
    const sinceDate = new Date(untilDate);
    sinceDate.setDate(sinceDate.getDate() - (numberOfDays - 1));

    return {
        since: sinceDate.toISOString().slice(0, 10),
        until: untilDate.toISOString().slice(0, 10),
    };
}

export async function getVisits(
    projectId: string,
    numberOfDays: number = 7,
    ): Promise<VisitsSummary> {

    const canCompare = numberOfDays * 2 <= MAX_DAYS;
    const { since, until } = getDateRange(canCompare ? numberOfDays * 2 : numberOfDays);
    const currentSince = getDateRange(numberOfDays).since;

    const data = await vercelFetch("/v1/query/web-analytics/visits/aggregate", {
        projectId,
        since,
        until,
        by: "day",
    });

    const allDays: DailyVisits[] = data.data.map((item: ApiRow) => ({
        date: item.timestamp.slice(0, 10),
        visitors: item.visitors,
        pageViews: item.pageviews,
    }));

    const days = allDays.filter((day) => day.date >= currentSince);
    const previousDays = allDays.filter((day) => day.date < currentSince);
    const visitors = days.reduce((sum, day) => sum + day.visitors, 0);
    const pageViews = days.reduce((sum, day) => sum + day.pageViews, 0);
    const previousVisitors = canCompare
    ? previousDays.reduce((sum, day) => sum + day.visitors, 0)
    : null;

  return { days, visitors, pageViews, previousVisitors };
}
export type Dimension = "route" | "referrerHostname" | "country";
export type BreakdownRow = {
    /** The page, the referrer or the country code, depending on the dimension. */
    value: string;
    visitors: number;
    pageViews: number;
};

export async function getBreakdown(
    projectId: string,
    dimension: Dimension,
    numberOfDays: number = 7,
): Promise<BreakdownRow[]> {
    const { since, until } = getDateRange(numberOfDays);

    const data = await vercelFetch("/v1/query/web-analytics/visits/aggregate", {
        projectId,
        since,
        until,
        by: dimension,
        limit: "10",
    });

    const rows: BreakdownRow[] = data.data.map((item: ApiBreakdownRow) => ({
        value: String(item[dimension] ?? ""),
        visitors: item.visitors,
        pageViews: item.pageviews,
    }));

    return rows.sort((a, b) => b.visitors - a.visitors);
}