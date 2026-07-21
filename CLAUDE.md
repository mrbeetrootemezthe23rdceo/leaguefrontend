# Project context

This is the frontend for a League of Legends match analytics project.
Backend/ingestion lives in a separate repo (`leaguepipeline`, Python),
which populates the same Postgres database this app reads from.
This app is read-only — never writes to the database.

## Known quirks
- `pg` returns COUNT/SUM results as strings, not numbers — convert
  with Number() before doing math or numeric sorting.
- `participants.role` can be an empty string for some queue types
  (e.g. blind pick) — filter these out or handle gracefully.
- Riot's role value is "UTILITY" for support — mapped to "Support"
  for display via ROLE_LABELS in the leaderboard table.
- `items` column is a Postgres int[] of item IDs (item0..item6 from
  Riot's API, collected into an array during ingestion).

## Site structure
- `/` — Main dashboard (real Postgres data, champion leaderboard, sortable table)
- `/about` — About page

## Working style
Go ahead and write/edit the frontend code directly — I'm fine with that.
Just explain your reasoning as you go (what you changed and why), since
I want to understand the codebase as it grows, not just have it work.