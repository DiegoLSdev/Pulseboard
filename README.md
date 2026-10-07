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
- Totals across all projects
- 7-day and 30-day ranges
- List of the projects that do not have Web Analytics enabled yet

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

## How it works

- Every request to Vercel is made on the server with your token. The token is
  never sent to the browser.
- Responses are cached for 5 minutes, so reloading the page does not call the
  Vercel API again.
- On the Hobby plan Vercel keeps 31 days of data, so the longest range is 30
  days.

"Visitors" is the sum of each day's unique visitors. Someone who visits on two
different days is counted twice.

## Security note

**The dashboard has no login yet.** If you deploy it, anyone who knows the URL
can see your numbers. Until password protection lands, run Pulseboard locally
or keep the URL to yourself.

## Roadmap

- [x] Overview of every project with visitors and page views
- [ ] Password protection
- [ ] Project detail page: top pages, referrers, countries
- [ ] Optional history beyond the 30 days Hobby keeps

## License

[MIT](LICENSE)