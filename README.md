# Pulseboard

One dashboard for the Web Analytics of all your Vercel projects.

> Pulseboard is a community project and is not affiliated with Vercel.

## Why

Vercel shows Web Analytics one project at a time. If you have a handful of
sites, checking how they are doing means opening each one. Pulseboard reads the
public Web Analytics API and puts every project on a single page.

## Features

- Every project with Web Analytics enabled on one page, busiest first
- Visitors, page views and a sparkline of daily visitors per project
- Change against the previous 7 days
- A page per project with its top pages, referrers and countries
- 7-day, 30-day, 90-day and all-time ranges
- Your own history, so you keep data after Vercel drops it
- Refreshes itself every 5 minutes while the tab is open

## Getting started

You need Node.js 20 or newer and [pnpm](https://pnpm.io).

1. Create a Vercel access token at
   [vercel.com/account/tokens](https://vercel.com/account/tokens).
2. Clone the repository and install the dependencies:

```bash
   git clone https://github.com/DiegoLSdev/pulseboard.git
   cd pulseboard
   pnpm install
```

3. Copy the example environment file and paste your token into it:

```bash
   cp .env.example .env.local
```

4. Start the app and open [http://localhost:3000](http://localhost:3000):

```bash
   pnpm dev
```

Only projects with Web Analytics enabled show numbers. To enable it, open a
project in the Vercel dashboard, go to **Analytics** and click **Enable**.

### Environment variables

| Name | Required | Description |
| --- | --- | --- |
| `VERCEL_TOKEN` | Yes | Vercel access token. Only used on the server. |
| `DASHBOARD_PASSWORD` | When deployed | Password to open the dashboard. |
| `DATABASE_URL` | When deployed | Where the history is stored. Defaults to `pulseboard.db`. |
| `DATABASE_AUTH_TOKEN` | With Turso | Token for a remote Turso database. |

## How it works

- Every request to Vercel is made on the server with your token. The token is
  never sent to the browser.
- Responses are cached for 5 minutes, so reloading the page does not call the
  Vercel API again.
- Vercel keeps 31 days of data on the Hobby plan. The first time you open the
  dashboard each day, Pulseboard copies the last 31 days of every project into
  a local SQLite file, `pulseboard.db`. Open it at least once a month and the
  history has no gaps.
- Ranges longer than 31 days combine live data for the last 31 days with your
  stored history for anything older. They only go back as far as the day you
  started using Pulseboard.
- Pages, referrers and countries are always limited to the last 31 days,
  because only daily totals are stored.

"Visitors" is the sum of each day's unique visitors. Someone who visits on two
different days is counted twice.

## Deploying (optional)

Pulseboard is meant to run on your own machine, but you can deploy it to your
own Vercel account if you want to check it from anywhere.

1. Create a free database at [turso.tech](https://turso.tech). The local file
   does not work on Vercel, because each deployment starts with an empty disk.
2. Import the repository in Vercel (**Add New → Project**).
3. Add `VERCEL_TOKEN`, `DASHBOARD_PASSWORD`, `DATABASE_URL` and
   `DATABASE_AUTH_TOKEN` under **Environment Variables**, then deploy.

Without a database, the 90-day and all-time ranges will not work when deployed.

Do not enable Web Analytics on the Pulseboard project itself: it would show up
in its own list and use your monthly events.

## Security

- Your token is only used on the server and never reaches the browser.
- When deployed, the dashboard is locked until `DASHBOARD_PASSWORD` is set.
  Running locally without it skips the login.
- There is no limit on login attempts, so use a long password.
- `pulseboard.db` holds your analytics history and is ignored by git.

## Roadmap

- [x] Overview of every project with visitors and page views
- [x] Password protection
- [x] Project detail page: top pages, referrers, countries
- [x] History beyond the 31 days Vercel keeps
- [ ] Sort and filter projects
- [ ] Store pages, referrers and countries in the history too

## License

[MIT](LICENSE)