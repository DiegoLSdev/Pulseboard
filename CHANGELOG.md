# Changelog

## 0.2.0

### Added

- Password protection with `DASHBOARD_PASSWORD`, required when deployed
- Project detail page with top pages, referrers and countries
- Change against the previous 7 days, per project and in total
- Local history in `pulseboard.db`, synced once a day
- 90-day and all-time ranges, combining live data with the history
- Automatic refresh every 5 minutes while the tab is visible
- Loading and error screens

## 0.1.0

First usable version.

- Overview of every project with Web Analytics enabled
- Visitors, page views and a sparkline per project
- Totals across projects
- 7-day and 30-day ranges
- 5-minute cache for Vercel API responses