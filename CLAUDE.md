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

YouTube data comes from **Hootsuite** YouTube export (not from YouTube Studio directly). The column layout differs from a raw YouTube export — confirm columns before mapping. Usually a ZIP file that unzips to CSVs.

Weekly workflow:
1. Unzip the Hootsuite YouTube export
2. Find the overview/summary CSV with views, likes, comments, shares per day
3. Sum each field for the week (Mon–Sun)
4. Append to `weeklyData`
5. Update `monthlyData` for the current month
6. Update `topPosts` with this week's top 3 videos

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
