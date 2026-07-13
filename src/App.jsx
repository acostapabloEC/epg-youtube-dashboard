import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const weeklyData = [
  { week: "Jan 05", engagements: 17,  likes: 15,  comments: 0, shares: 2,   views: 1232,  posts: 3  },
  { week: "Jan 12", engagements: 3,   likes: 3,   comments: 0, shares: 0,   views: 63,    posts: 1  },
  { week: "Jan 19", engagements: 1,   likes: 1,   comments: 0, shares: 0,   views: 323,   posts: 3  },
  { week: "Jan 26", engagements: 7,   likes: 5,   comments: 0, shares: 2,   views: 1584,  posts: 3  },
  { week: "Feb 02", engagements: 10,  likes: 4,   comments: 2, shares: 4,   views: 668,   posts: 2  },
  { week: "Feb 09", engagements: 10,  likes: 5,   comments: 1, shares: 4,   views: 506,   posts: 3  },
  { week: "Feb 16", engagements: 11,  likes: 8,   comments: 1, shares: 2,   views: 287,   posts: 3  },
  { week: "Feb 23", engagements: 18,  likes: 10,  comments: 0, shares: 8,   views: 497,   posts: 7  },
  { week: "Mar 02", engagements: 143, likes: 121, comments: 4, shares: 18,  views: 11943, posts: 20 },
  { week: "Mar 09", engagements: 145, likes: 111, comments: 1, shares: 33,  views: 9977,  posts: 15 },
  { week: "Mar 16", engagements: 167, likes: 139, comments: 4, shares: 24,  views: 11944, posts: 20 },
  { week: "Mar 23", engagements: 231, likes: 207, comments: 7, shares: 17,  views: 44852, posts: 23 },
  { week: "Mar 30", engagements: 144, likes: 124, comments: 3, shares: 17,  views: 22005, posts: 20 },
  { week: "Apr 06", engagements: 69,  likes: 62,  comments: 0, shares: 7,   views: 10284, posts: 20 },
  { week: "Apr 13", engagements: 675, likes: 526, comments: 8, shares: 141, views: 22589, posts: 22 },
  { week: "Apr 20", engagements: 79,  likes: 65,  comments: 1, shares: 13,  views: 14063, posts: 23 },
  { week: "Apr 27", engagements: 61,  likes: 52,  comments: 0, shares: 9,   views: 12029, posts: 23 },
  { week: "May 04", engagements: 61,  likes: 59,  comments: 0, shares: 2,   views: 17142, posts: 23 },
  { week: "May 11", engagements: 53,  likes: 49,  comments: 1, shares: 3,   views: 8593,  posts: 17 },
  { week: "May 18", engagements: 15,  likes: 10,  comments: 0, shares: 5,   views: 1276,  posts: 8  },
  { week: "May 25", engagements: 20,  likes: 16,  comments: 0, shares: 4,   views: 3480,  posts: 18 },
  { week: "Jun 01", engagements: 14,  likes: 11,  comments: 0, shares: 3,   views: 3098,  posts: 8  },
  { week: "Jun 08", engagements: 26,  likes: 21,  comments: 0, shares: 5,   views: 6007,  posts: 26 },
  { week: "Jun 15", engagements: 58,  likes: 54,  comments: 1, shares: 3,   views: 6193,  posts: 11 },
  { week: "Jun 22", engagements: 37,  likes: 30,  comments: 1, shares: 6,   views: 2886,  posts: 11 },
  { week: "Jul 01", engagements: 7,   likes: 5,   comments: 0, shares: 2,   views: 668,   posts: 5  },
  { week: "Jul 07", engagements: 30,  likes: 30,  comments: 0, shares: 0,   views: 2486,  posts: 5  },
];

const monthlyData = [
  { month: "Jan",  engagements: 30,  likes: 25,  comments: 0,  shares: 5,   views: 3333,  posts: 11 },
  { month: "Feb",  engagements: 48,  likes: 26,  comments: 4,  shares: 18,  views: 1876,  posts: 14 },
  { month: "Mar",  engagements: 738, likes: 625, comments: 19, shares: 94,  views: 86278, posts: 85 },
  { month: "Apr",  engagements: 948, likes: 761, comments: 9,  shares: 178, views: 67840, posts: 93 },
  { month: "May",  engagements: 308, likes: 255, comments: 1,  shares: 52,  views: 44525, posts: 75 },
  { month: "Jun",  engagements: 208, likes: 192, comments: 4,  shares: 12,  views: 23963, posts: 55 },
  { month: "Jul",  engagements: 37,  likes: 35,  comments: 0,  shares: 2,   views: 3154,  posts: 10 },
];

const topPosts = [
  { date: "Apr 19", engagements: 581, likes: 459, views: 10597, title: "What a privilege to be tired from the work you once begged for" },
  { date: "Mar 27", engagements: 91,  likes: 87,  views: 23860, title: "Ferrari 458 — the one car a real enthusiast would pick" },
  { date: "May 6",  engagements: 76,  likes: 60,  views: 5457,  title: "Frank sits down with Mike Durbin, CEO of Cetera, for a candid inside baseball look at one of the largest independent firms" },
];

// ── Derived from data arrays (update by adding rows to weeklyData/monthlyData) ──
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DATA_YEAR   = 2026;

const latestWeek  = weeklyData[weeklyData.length - 1];
const prevWeek    = weeklyData[weeklyData.length - 2];
const latestMonth = monthlyData[monthlyData.length - 1];
const prevMonth   = monthlyData[monthlyData.length - 2];

const _wStartDay  = parseInt(latestWeek.week.split(" ")[1]);
const _wMon       = latestWeek.week.split(" ")[0];
const _wEndDay    = _wStartDay + 6;
const weekLabel   = `${_wMon} ${_wStartDay}–${_wEndDay}`;          // "Jul 7–13"
const dateRangeLabel = `Jan 2025 – ${_wMon} ${_wEndDay}, ${DATA_YEAR}`; // "Jan 2025 – Jul 13, 2026"

const last4Months = monthlyData.slice(-4);

const GOLD     = "#c9a84c";
const GOLD_DIM = "rgba(201,168,76,0.15)";
const GREEN    = "#3fb950";
const GREEN_DIM= "rgba(63,185,80,0.12)";
const RED      = "#f85149";
const RED_DIM  = "rgba(248,81,73,0.12)";
const BLUE     = "#58a6ff";
const BLUE_DIM = "rgba(88,166,255,0.1)";
const YT_RED   = "#ff4444";
const YT_DIM   = "rgba(255,68,68,0.12)";
const MUTED    = "#8892a4";
const BORDER   = "rgba(255,255,255,0.07)";
const SURFACE  = "#111827";

function parseHMS(s) {
  if (!s) return 0;
  const parts = String(s).split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function formatMonth(ym) {
  const [y, m] = ym.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[parseInt(m) - 1]} '${y.slice(2)}`;
}

function videoTitle(message) {
  if (!message || message.trim() === "") return "(No description available)";
  const first = message.split("\n")[0].trim();
  return first.length > 72 ? first.slice(0, 72) + "…" : first;
}

function fmtSec(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function KpiCard({ source, label, value, delta, deltaLabel, accent, large, sub }) {
  const isUp = delta > 0;
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent || YT_RED, borderRadius: "12px 12px 0 0" }} />
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: MUTED, textTransform: "uppercase", marginBottom: 8 }}>{source}</div>
      <div style={{ fontSize: 13, color: "#a0aab4", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: large ? 52 : 40, fontWeight: 700, color: "#f0f6fc", lineHeight: 1, marginBottom: 10 }}>{value}</div>
      {delta !== undefined && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: isUp ? GREEN_DIM : RED_DIM, color: isUp ? GREEN : RED, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, width: "fit-content" }}>
          {isUp ? "↑" : "↓"} {Math.abs(delta)}%
        </div>
      )}
      {deltaLabel && <div style={{ fontSize: 11, color: MUTED, marginTop: 5 }}>{deltaLabel}</div>}
      {sub && <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a2235", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, color: p.color, marginBottom: 2 }}>{p.name}: <strong>{p.value?.toLocaleString()}</strong></div>
      ))}
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const h = time.getHours() % 12 || 12;
  const m = String(time.getMinutes()).padStart(2, "0");
  const ampm = time.getHours() >= 12 ? "PM" : "AM";
  return <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "#f0f6fc", letterSpacing: 1 }}>{h}:{m} {ampm}</span>;
}

function VideoCard({ video }) {
  const thumb = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
  const url   = `https://www.youtube.com/watch?v=${video.id}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,68,68,0.4)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
        <div style={{ position: "relative", paddingTop: "56.25%", background: "#0a0f1e" }}>
          <img src={thumb} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ padding: "10px 12px 12px" }}>
          <div style={{ fontSize: 12, color: "#f0f6fc", lineHeight: 1.4, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {videoTitle(video.message)}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: BLUE }}>{video.views.toLocaleString()} views</span>
            {video.likes > 0 && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: YT_RED }}>{video.likes.toLocaleString()} likes</span>}
            {video.comments > 0 && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: GOLD }}>{video.comments} cmts</span>}
          </div>
          <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>{video.date}</div>
        </div>
      </div>
    </a>
  );
}

export default function App() {
  const engMoM   = Math.round(((latestWeek.engagements - prevWeek.engagements) / prevWeek.engagements) * 100);
  const viewsMoM = Math.round(((latestWeek.views - prevWeek.views) / prevWeek.views) * 100);
  const likesMoM = Math.round(((latestWeek.likes - prevWeek.likes) / prevWeek.likes) * 100);

  const [ytData, setYtData] = useState(null);
  const [topRange, setTopRange] = useState("all");

  useEffect(() => {
    fetch("/data/youtube_hootsuite_export.xlsx")
      .then(r => r.arrayBuffer())
      .then(buf => {
        const wb = XLSX.read(buf);

        // ── Account Metrics ──────────────────────────────────────────────
        const s1 = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(s1, { header: 1, defval: "" });
        const lastRow = raw[raw.length - 1];

        const totalSubscribers  = lastRow[13]; // Page subscribers – Overall aggregated
        const subscribersGained = lastRow[2];  // Page subscribers gained – Overall aggregated
        const totalWatchHrs     = Math.round(parseHMS(lastRow[12]) / 3600); // Page watch time – Overall
        const avgViewDurSec     = parseHMS(lastRow[8]); // Page average view duration – Overall

        const monthMap = {};
        for (let i = 3; i < raw.length; i++) {
          const r   = raw[i];
          const mon = String(r[0]).slice(0, 7);
          if (!monthMap[mon]) monthMap[mon] = { watchSec: 0, subsLast: 0 };
          monthMap[mon].watchSec += parseHMS(r[9]);  // Col9: daily watch time
          if (r[14] !== "" && r[14] !== 0) monthMap[mon].subsLast = r[14]; // Col14: running sub count
        }

        const monthKeys   = Object.keys(monthMap).sort();
        const monthlyWatch = monthKeys.map(k => ({
          month: formatMonth(k),
          watchHrs: parseFloat((monthMap[k].watchSec / 3600).toFixed(1)),
        }));

        // Net subscriber gain per month (diff of running totals)
        const monthlySubGain = [];
        for (let i = 1; i < monthKeys.length; i++) {
          const prev = monthMap[monthKeys[i - 1]].subsLast;
          const curr = monthMap[monthKeys[i]].subsLast;
          if (prev > 0 && curr > 0) {
            monthlySubGain.push({ month: formatMonth(monthKeys[i]), gain: curr - prev });
          }
        }

        // ── Posts table ──────────────────────────────────────────────────
        const s2    = wb.Sheets[wb.SheetNames[1]];
        const praw  = XLSX.utils.sheet_to_json(s2, { header: 1, defval: "" });
        const posts = praw.slice(1).map(r => ({
          date:     String(r[0]).slice(0, 10),
          id:       String(r[2]),
          message:  String(r[4]),
          likes:    Number(r[8])  || 0,
          comments: Number(r[9])  || 0,
          shares:   Number(r[10]) || 0,
          views:    Number(r[11]) || 0,
        })).filter(p => p.id && p.id !== "");

        posts.sort((a, b) => b.views - a.views);

        const cutoff90 = new Date();
        cutoff90.setDate(cutoff90.getDate() - 90);
        const top10All = posts.slice(0, 10);
        const top10_90 = posts
          .filter(p => new Date(p.date) >= cutoff90)
          .slice(0, 10);

        setYtData({
          totalSubscribers,
          subscribersGained,
          totalWatchHrs,
          avgViewDurSec,
          monthlyWatch,
          monthlySubGain,
          top10All,
          top10_90,
        });
      });
  }, []);

  const topVideos = ytData
    ? (topRange === "90d" ? ytData.top10_90 : ytData.top10All)
    : [];

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#f0f6fc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #2a3445; border-radius: 3px; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
      `}</style>

      {/* HEADER */}
      <div style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 36, height: 36, background: YT_RED, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff" }}>▶</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Elite Partners Group — YouTube Performance</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: "uppercase" }}>Advisor Talk with Frank LaRosa · {dateRangeLabel}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", background: YT_DIM, color: YT_RED, padding: "5px 12px", borderRadius: 6, border: `1px solid rgba(255,68,68,0.2)` }}>{dateRangeLabel}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: MUTED }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, animation: "pulse 2s infinite" }} />
            Live Dashboard
          </div>
          <Clock />
        </div>
      </div>

      <div style={{ padding: "24px 28px", maxWidth: 1600, margin: "0 auto" }}>

        {/* MARCH BREAKOUT BANNER */}
        <div style={{ background: "linear-gradient(135deg, #1a0000 0%, #0f0808 100%)", border: `1px solid rgba(255,68,68,0.25)`, borderRadius: 12, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 13, color: YT_RED, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>⚡ {latestMonth.month} Update</div>
            <div style={{ fontSize: 13, color: MUTED }}>
              <span style={{ color: "#f0f6fc", fontWeight: 600 }}>{latestWeek.engagements}</span> engagements across <span style={{ color: "#f0f6fc", fontWeight: 600 }}>{latestWeek.posts}</span> videos {weekLabel}; {prevMonth.month} closed at <span style={{ color: "#f0f6fc", fontWeight: 600 }}>{prevMonth.engagements}</span> eng / {prevMonth.posts} videos (March peak: <span style={{ color: YT_RED, fontWeight: 600 }}>738</span>)
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {last4Months.map((m) => ({ label: m.month, val: String(m.engagements), sub: `${m.posts} videos` })).map((g) => (
              <div key={g.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>{g.label} Eng</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: g.label === "Jul" ? YT_RED : "#f0f6fc" }}>{g.val}</div>
                <div style={{ fontSize: 10, color: MUTED }}>{g.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 1: KPI CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
          <KpiCard source="YouTube · Advisor Talk" label={`Total Engagements (${weekLabel})`} value={latestWeek.engagements.toLocaleString()} delta={engMoM} deltaLabel={`vs prior week (${prevWeek.engagements})`} accent={YT_RED} large />
          <KpiCard source="YouTube · Advisor Talk" label={`Total Likes (${weekLabel})`} value={latestWeek.likes.toLocaleString()} delta={likesMoM} deltaLabel={`vs prior week (${prevWeek.likes})`} accent={YT_RED} />
          <KpiCard source="YouTube · Advisor Talk" label={`Total Video Views (${weekLabel})`} value={latestWeek.views.toLocaleString()} delta={viewsMoM} deltaLabel={`vs prior week (${prevWeek.views.toLocaleString()})`} accent={BLUE} />
          <KpiCard source="YouTube · Advisor Talk" label="Subscribers" value="2,160" accent={GREEN} sub={`${_wMon} ${_wEndDay}, ${DATA_YEAR} · +10 this week`} />
        </div>

        {/* ROW 2: CHARTS */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>

          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Weekly Engagements & Views — Advisor Talk YouTube</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 12 }}>Jan–Apr 2026 · Likes + Comments + Shares</div>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={weeklyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={YT_RED} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={YT_RED} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BLUE} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="week" tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: MUTED }} />
                <Area yAxisId="left" type="monotone" dataKey="engagements" name="Engagements" stroke={YT_RED} strokeWidth={2.5} fill="url(#engGrad)" dot={false} activeDot={{ r: 5, fill: YT_RED }} />
                <Area yAxisId="right" type="monotone" dataKey="views" name="Views" stroke={BLUE} strokeWidth={1.5} fill="url(#viewsGrad)" strokeDasharray="5 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>

            <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 16, paddingTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 8 }}>
                Videos Published Per Week
                <span style={{ fontWeight: 400, fontSize: 10, marginLeft: 8 }}>quality vs. quantity context</span>
              </div>
              <ResponsiveContainer width="100%" height={95}>
                <BarChart data={weeklyData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="posts" name="Videos" fill={YT_RED} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Monthly Engagement Breakdown</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 16 }}>Likes · Comments · Shares · Jan–Apr 2026</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: MUTED }} />
                <Bar dataKey="likes" name="Likes" fill={YT_RED} radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="comments" name="Comments" fill={GOLD} radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="shares" name="Shares" fill={BLUE} radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 14, padding: "10px 14px", background: YT_DIM, border: `1px solid rgba(255,68,68,0.15)`, borderRadius: 8, fontSize: 11, color: YT_RED, lineHeight: 1.5 }}>
              ⚡ 90% of Q1 engagements happened in March — 85 videos published
            </div>
          </div>
        </div>

        {/* ROW 3: BOTTOM */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Q1 + Apr 2026 Summary</div>
            {[
              { label: "Total Engagements (Q1)", val: "811",    color: YT_RED },
              { label: "Total Likes (Q1)",        val: "699",    color: YT_RED },
              { label: "Total Comments (Q1)",     val: "23",     color: GOLD   },
              { label: "Total Shares (Q1)",       val: "114",    color: BLUE   },
              { label: "Total Video Views (Q1)",  val: "104,764",color: BLUE   },
              { label: "Videos Published (Q1)",   val: "110",    color: MUTED  },
              { label: "April Engagements",       val: "82",     color: GREEN  },
              { label: "April Videos",            val: "23",     color: MUTED  },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 12, color: MUTED }}>{item.label}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: item.color }}>{item.val}</span>
              </div>
            ))}
          </div>

          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Top Posts by Engagements</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 14 }}>Q1 2026 · Top 3 · Hootsuite export</div>
            {topPosts.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px", borderRadius: 8, background: i === 0 ? YT_DIM : "rgba(255,255,255,0.02)", marginBottom: 8, border: i === 0 ? `1px solid rgba(255,68,68,0.2)` : "1px solid transparent" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: i === 0 ? YT_RED : MUTED, width: 16, flexShrink: 0, paddingTop: 1 }}>#{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: "#f0f6fc", lineHeight: 1.4, marginBottom: 3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.title}</div>
                  <div style={{ fontSize: 10, color: MUTED }}>{p.date} · {p.views.toLocaleString()} views · {p.likes} likes</div>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: i === 0 ? YT_RED : GREEN, flexShrink: 0 }}>{p.engagements}</div>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: "10px 14px", background: BLUE_DIM, border: `1px solid rgba(88,166,255,0.15)`, borderRadius: 8, fontSize: 11, color: BLUE, lineHeight: 1.5 }}>
              💡 Top videos by lifetime views (Hootsuite export)
            </div>
          </div>

          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{prevMonth.month} Engagement Breakdown</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 20 }}>{prevMonth.engagements} total engagements · {prevMonth.posts} videos</div>
            {[
              { label: "Likes",    val: prevMonth.likes,    total: prevMonth.engagements, color: YT_RED },
              { label: "Shares",   val: prevMonth.shares,   total: prevMonth.engagements, color: BLUE   },
              { label: "Comments", val: prevMonth.comments, total: prevMonth.engagements, color: GOLD   },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: MUTED }}>{item.label}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: item.color, fontWeight: 600 }}>
                    {item.val} <span style={{ color: MUTED, fontWeight: 400 }}>({Math.round((item.val / item.total) * 100)}%)</span>
                  </span>
                </div>
                <div style={{ height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, width: `${(item.val / item.total) * 100}%`, background: item.color }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: "10px 14px", background: YT_DIM, border: `1px solid rgba(255,68,68,0.15)`, borderRadius: 8, fontSize: 11, color: YT_RED, lineHeight: 1.5 }}>
              ⚡ Volume tripled in March (85 videos) — same question as LinkedIn: quality or quantity?
            </div>
          </div>

        </div>

        {/* ── FRANK LAROSA SECTIONS ──────────────────────────────────────── */}
        <div style={{ borderTop: `1px solid ${BORDER}`, margin: "32px 0 24px", paddingTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 4, height: 28, background: YT_RED, borderRadius: 2 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Frank LaRosa · Channel Deep Dive</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>
                Hootsuite Export · Jan 2025 – Jun 28, 2026 · 18-Month View
              </div>
            </div>
          </div>

          {!ytData && (
            <div style={{ padding: "40px 0", textAlign: "center", color: MUTED, fontSize: 13 }}>
              Loading channel data…
            </div>
          )}

          {ytData && (
            <>
              {/* ── SECTION 1 + 3: SUBSCRIBERS + WATCH TIME SIDE BY SIDE ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14, marginBottom: 14 }}>

                {/* Subscriber Card */}
                <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: GREEN, borderRadius: "12px 12px 0 0" }} />
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: MUTED, textTransform: "uppercase", marginBottom: 8 }}>Subscribers · All-Time</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 4 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 56, fontWeight: 700, color: "#f0f6fc", lineHeight: 1 }}>
                      {ytData.totalSubscribers.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: GREEN_DIM, color: GREEN, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, marginBottom: 16 }}>
                    ↑ +{ytData.subscribersGained.toLocaleString()} gained over 17 months
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 8 }}>Net Subscriber Gain · Monthly</div>
                  <ResponsiveContainer width="100%" height={130}>
                    <BarChart data={ytData.monthlySubGain} margin={{ top: 0, right: 4, left: -24, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
                      <YAxis tick={{ fill: MUTED, fontSize: 9 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="gain" name="Net Gain" fill={GREEN} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Watch Time Card */}
                <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: BLUE, borderRadius: "12px 12px 0 0" }} />
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: MUTED, textTransform: "uppercase", marginBottom: 12 }}>Watch Time · Jan 2025 – May 2026</div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                    {[
                      { label: "Total Watch Hours", val: ytData.totalWatchHrs.toLocaleString(), unit: "hrs", color: BLUE },
                      { label: "Avg Per Day", val: Math.round(ytData.totalWatchHrs / 493).toLocaleString(), unit: "hrs/day", color: GOLD },
                      { label: "Avg View Duration", val: fmtSec(ytData.avgViewDurSec), unit: "min:sec", color: YT_RED },
                    ].map(s => (
                      <div key={s.label} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: `1px solid ${BORDER}` }}>
                        <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{s.label}</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: MUTED, marginTop: 4 }}>{s.unit}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 8 }}>Monthly Watch Hours</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={ytData.monthlyWatch} margin={{ top: 5, right: 4, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="watchGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={BLUE} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                      <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
                      <YAxis tick={{ fill: MUTED, fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}h`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="watchHrs" name="Watch Hrs" stroke={BLUE} strokeWidth={2} fill="url(#watchGrad)" dot={false} activeDot={{ r: 4, fill: BLUE }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ── SECTION 2: TOP VIDEOS ── */}
              <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Top Videos by Views</div>
                    <div style={{ fontSize: 11, color: MUTED }}>Advisor Talk with Frank LaRosa · Hootsuite export</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[["all", "All Time"], ["90d", "Last 90 Days"]].map(([v, label]) => (
                      <button key={v} onClick={() => setTopRange(v)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, padding: "5px 12px", borderRadius: 6, border: `1px solid ${topRange === v ? YT_RED : BORDER}`, background: topRange === v ? YT_DIM : "transparent", color: topRange === v ? YT_RED : MUTED, cursor: "pointer", letterSpacing: 0.5 }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {topVideos.length === 0 ? (
                  <div style={{ padding: "24px 0", textAlign: "center", color: MUTED, fontSize: 13 }}>No videos found for this range.</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                    {topVideos.map((v, i) => (
                      <div key={v.id} style={{ position: "relative" }}>
                        <div style={{ position: "absolute", top: 8, left: 8, zIndex: 2, fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, color: i === 0 ? "#fff" : MUTED, background: i === 0 ? YT_RED : "rgba(0,0,0,0.6)", padding: "2px 7px", borderRadius: 4 }}>#{i + 1}</div>
                        <VideoCard video={v} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── SECTION 4: TRAFFIC SOURCES PLACEHOLDER ── */}
              <div style={{ background: SURFACE, border: `1px solid rgba(255,255,255,0.05)`, borderRadius: 12, padding: "28px 24px", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🔭</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f6fc", marginBottom: 4 }}>Traffic Sources Breakdown</div>
                  <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
                    Coming soon — pending YouTube Studio data. Hootsuite does not export traffic source attribution (search, suggested, browse, external). We&apos;ll add this once Studio access is confirmed.
                  </div>
                </div>
                <div style={{ marginLeft: "auto", flexShrink: 0, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: MUTED, background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, padding: "6px 12px", borderRadius: 6 }}>
                  v2
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "12px 32px", display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono', monospace", fontSize: 10, color: MUTED, marginTop: 24 }}>
        <span>Elite Partners Group · YouTube Dashboard · Advisor Talk with Frank LaRosa</span>
        <span>Source: Hootsuite YouTube Export · {dateRangeLabel}</span>
        <span>{prevMonth.month}: {prevMonth.posts} videos · {prevMonth.views.toLocaleString()} views</span>
      </div>
    </div>
  );
}
