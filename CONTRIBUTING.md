# Contributing to Pulseboard

Thanks for your interest! Pulseboard is a small project and every contribution
helps, from fixing a typo to adding a feature.

## Getting started

1. Fork the repository and clone your fork.
2. Install the dependencies and set up your token, as described in the
   [README](README.md#getting-started).
3. Create a branch for your change: `git switch -c feat/sort-projects`.

## Before opening a pull request

```bash
pnpm lint
pnpm test
pnpm build
```

All three must pass. If you change logic in `src/lib`, add or update a test
next to it.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(dashboard): add sort by visitors`
- `fix(api): handle missing referrer`
- `docs: explain the Turso setup`
- `test: cover the date range edge cases`

## Where to start

Issues labelled
[`good first issue`](https://github.com/DiegoLSdev/pulseboard/labels/good%20first%20issue)
are small and self-contained. Comment on one before starting, so two people
do not work on the same thing.

## Questions

Open an issue. There are no silly questions.