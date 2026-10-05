import "server-only"
import { vercelFetch } from "./vercel"

export type DailyVisits = {
    date:       string;
    visitors:   number;
    pageViews:  number;
}

export type VisitsSummary =  {
    days:       DailyVisits[];
    visitors:   number;
    pageViews:  number; 
}

type ApiRow = {
  timestamp:    string;
  visitors:     number;
  pageviews:    number;
};

export async function getVisits(projectId: string): Promise<VisitsSummary> {
    
    // Dates calculations (prev 7 days)
    const untilDate = new Date();
    const sinceDate = new Date(untilDate);
    sinceDate.setDate(sinceDate.getDate() - 6);

    const until = untilDate.toISOString().slice(0, 10);
    const since = sinceDate.toISOString().slice(0, 10);
    
    // FETCH
    const data = await vercelFetch("/v1/query/web-analytics/visits/aggregate", 
    {   projectId, 
        since, 
        until, 
        by: "day"
    });

    // MAP
    const days: DailyVisits[] = data.data.map((item: ApiRow) => ({
        date:       item.timestamp.slice(0, 10),
        visitors:   item.visitors,
        pageViews:  item.pageviews,
    }));
    
    const visitors  =  days.reduce((sum, day) => sum + day.visitors, 0);
    const pageViews =  days.reduce((sum, day) => sum + day.pageViews, 0);
  
    return {days, visitors, pageViews};
}