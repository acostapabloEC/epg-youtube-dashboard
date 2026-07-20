# EPG YouTube Dashboard

React/Vite app tracking Frank LaRosa's YouTube channel performance.

- **Local:** `C:\Users\ECP\epg-youtube-dashboard\`
- **GitHub:** acostapabloEC/epg-youtube-dashboard
- **Vercel:** epg-youtube-dashboard.vercel.app ✓ auto-deploy on push
- **Password:** Elite2026

---

## The one file to edit

**`src/App.jsx`** — all data is hardcoded here.

| Constant | What it holds |
|---|---|
| `weeklyData` | One row per week: `{ week, engagements, likes, comments, shares, views, posts }` |
| `monthlyData` | Running monthly totals |
| `topPosts` | Top 3 posts: `{ date, title, views, likes, comments }` — note `title` field (not `preview`) |

---

## Data source

**Rewritten 2026-07-20 — no more browser scraping.** YouTube data comes from the real
Hootsuite Analytics API (OAuth2, requires the Advanced Analytics add-on). The client for
this lives in a different repo (shared machine, not this repo):
`C:\Users\ECP\epg-marketing-dashboard\scraper\youtube_report.mjs`

```
node youtube_report.mjs <startDate> <endDate>          # e.g. 2026-07-06 2026-07-12
node youtube_report.mjs <startDate> <endDate> --json   # machine-readable
```

No browser opens — this is a direct API call using saved OAuth tokens in `scraper\.env`
(`hootsuite_api.mjs` auto-refreshes them, shared with every other EPG platform script). If
tokens ever die, run `node hootsuite_oauth.mjs` once interactively to re-authorize (opens a
real browser for login).

**Why this is better than the old export-scraping approach:** the saved Hootsuite report only
retained a rolling window of recent videos (older ones fell off, requiring a local
`data/youtube_posts_archive.json` + `data/youtube_daily_archive.json` archive to survive) and
had an unstable duplicate-column export layout. The Analytics API takes an exact date range
natively and returns each metric once, under its own name — neither workaround exists anymore.
There's no archive and no `--no-scrape` mode; every run hits the live API.

**Metric gotchas (real, easy to get wrong):**
- `POST /v1/analytics/profiles`' engagement/views/likes/etc are a different, much larger
  metric than "sum of this week's videos' engagement/views" (on the sibling Instagram rewrite
  this read 6-13x larger) — `youtube_report.mjs` correctly sums per-video data from
  `POST /v1/analytics/posts` instead. Don't "simplify" this to the profile endpoint.
- Subscriber gain is computed from a `subscribers_count` snapshot delta (same pattern as
  Instagram's follower-growth fix), not summed from `subscribers_gained` — even though
  YouTube, unlike Instagram, does separately expose a `subscribers_lost` counterpart. Kept
  consistent with the verified Instagram methodology; trust the script's output.
- **`until` is exclusive on the posts endpoint** (found validating this rewrite) — a video
  posted on the `until` date itself is silently dropped. `youtube_report.mjs` queries with
  `until = endDate + 1 day` to compensate; the profile-metrics endpoint (subscriber snapshot)
  does NOT have this problem, so don't add the same +1 there.
- YouTube view/like counts and post visibility keep accruing for a few days after a video
  posts — a pull done right after the week closes can undercount it. Accepted tradeoff, not
  something this script tries to compensate for (see Monday 9am cadence below).

Weekly workflow:
1. Run `node youtube_report.mjs <mon> <sun> --json` from `epg-marketing-dashboard\scraper\` — gives engagements/likes/comments/shares/views/posts + top 3 videos + subscriber total/gain for the exact week
2. Append to `weeklyData`, roll into `monthlyData` for the current month
3. Replace `topPosts` with this week's top 3 by engagement
4. Update the Subscribers KPI card's `value`/`+N this week` text — still the one manually-maintained (non-array) field
5. Run `npm run build` to verify
6. `git add src/App.jsx && git commit -m "Data: Jul 06-12" && git push`
7. Vercel auto-deploys on push

This is now fully automated — scheduled task `epg-youtube-weekly-update`, Mondays 9am
(`C:\Users\ECP\.claude\scheduled-tasks\epg-youtube-weekly-update\SKILL.md`). This dashboard is
a fully separate session/automation from Instagram — must never touch `instagram_report.mjs`,
`epg-instagram-dashboard`, or any `instagram_*` file.

---

## Week labeling

Same convention as all EPG dashboards: Monday start date, `"Mon DD"` format.

---

## Gotchas

- `topPosts` uses `title` (not `preview` like the LinkedIn dashboard) — don't mix them up
- Views are typically the largest number; likes and comments are much smaller — sanity-check the scale
- After editing, run `npm run build` before deploying to catch syntax errors
- Git-connected to Vercel — `git push` auto-deploys the live site (verified Jul 14, 2026)
- The 18-month "Channel Deep Dive" section reads `public/data/youtube_hootsuite_export.xlsx` directly in-browser — this is a separate, less-frequent full-history export, NOT part of the weekly `weeklyData` update. Don't overwrite it with a weekly-window export.
