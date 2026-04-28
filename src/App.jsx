import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const weeklyData = [
  { week: "Jan 05", engagements: 17,  likes: 15,  comments: 0, shares: 2,  views: 1231,  posts: 3  },
  { week: "Jan 12", engagements: 2,   likes: 2,   comments: 0, shares: 0,  views: 60,    posts: 1  },
  { week: "Jan 19", engagements: 1,   likes: 1,   comments: 0, shares: 0,  views: 320,   posts: 3  },
  { week: "Jan 26", engagements: 7,   likes: 5,   comments: 0, shares: 2,  views: 1582,  posts: 3  },
  { week: "Feb 02", engagements: 10,  likes: 4,   comments: 2, shares: 4,  views: 656,   posts: 2  },
  { week: "Feb 09", engagements: 10,  likes: 5,   comments: 1, shares: 4,  views: 500,   posts: 3  },
  { week: "Feb 16", engagements: 11,  likes: 8,   comments: 1, shares: 2,  views: 281,   posts: 3  },
  { week: "Feb 23", engagements: 18,  likes: 10,  comments: 0, shares: 8,  views: 495,   posts: 7  },
  { week: "Mar 02", engagements: 146, likes: 124, comments: 4, shares: 18, views: 11934, posts: 20 },
  { week: "Mar 09", engagements: 143, likes: 110, comments: 1, shares: 32, views: 9975,  posts: 15 },
  { week: "Mar 16", engagements: 166, likes: 139, comments: 4, shares: 23, views: 11934, posts: 20 },
  { week: "Mar 23", engagements: 227, likes: 204, comments: 7, shares: 16, views: 42329, posts: 23 },
  { week: "Mar 30", engagements: 125, likes: 112, comments: 3, shares: 10, views: 17421, posts: 20 },
  { week: "Apr 06", engagements: 8,   likes: 6,   comments: 0, shares: 2,  views: 1089,  posts: 9  },
];

const monthlyData = [
  { month: "Jan",  engagements: 29,  likes: 24,  comments: 0,  shares: 5,  views: 3324,  posts: 11 },
  { month: "Feb",  engagements: 48,  likes: 26,  comments: 4,  shares: 18, views: 1850,  posts: 14 },
  { month: "Mar",  engagements: 734, likes: 624, comments: 19, shares: 91, views: 83714, posts: 85 },
  { month: "Apr*", engagements: 82,  likes: 72,  comments: 0,  shares: 10, views: 11050, posts: 23 },
];

const topPosts = [
  { date: "Mar 27", engagements: 91, likes: 87, views: 23784, title: "Ferrari 458 — the one car a real enthusiast would pick" },
  { date: "Mar 03", engagements: 22, likes: 22, views: 1589,  title: "Range Rover SV vs Lamborghini Urus" },
  { date: "Mar 03", engagements: 22, likes: 22, views: 903,   title: "3 types of financial advisors on social media" },
];

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
  const engMoM   = Math.round(((734 - 48) / 48) * 100);
  const viewsMoM = Math.round(((83714 - 1850) / 1850) * 100);
  const likesMoM = Math.round(((624 - 26) / 26) * 100);
  const aprEng   = 82;
  const aprPosts = 23;

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

        const totalSubscribers  = lastRow[10]; // Page subscribers – Overall aggregated
        const subscribersGained = lastRow[11]; // Page subscribers gained – Overall aggregated
        const totalWatchHrs     = Math.round(parseHMS(lastRow[1]) / 3600); // Page watch time – Overall
        const avgViewDurSec     = parseHMS(lastRow[2]); // Page average view duration – Overall

        const monthMap = {};
        for (let i = 3; i < raw.length; i++) {
          const r   = raw[i];
          const mon = String(r[0]).slice(0, 7);
          if (!monthMap[mon]) monthMap[mon] = { watchSec: 0, subsLast: 0 };
          monthMap[mon].watchSec += parseHMS(r[13]); // Col13: daily watch time
          if (r[9] !== "" && r[9] !== 0) monthMap[mon].subsLast = r[9]; // Col9: running sub count
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
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: "uppercase" }}>Advisor Talk with Frank LaRosa · Jan–Apr 9, 2026</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", background: YT_DIM, color: YT_RED, padding: "5px 12px", borderRadius: 6, border: `1px solid rgba(255,68,68,0.2)` }}>Jan – Apr 9, 2026</div>
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
            <div style={{ fontSize: 13, color: YT_RED, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>⚡ March Breakout</div>
            <div style={{ fontSize: 13, color: MUTED }}>
              Engagements surged from <span style={{ color: "#f0f6fc", fontWeight: 600 }}>48</span> in Feb to <span style={{ color: YT_RED, fontWeight: 600 }}>734</span> in March — a <span style={{ color: GREEN, fontWeight: 600 }}>+{engMoM.toLocaleString()}%</span> jump · 85 videos published in March vs 14 in Feb
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {[{ label: "Jan", val: "29", sub: "11 videos" }, { label: "Feb", val: "48", sub: "14 videos" }, { label: "Mar", val: "734", sub: "85 videos" }, { label: "Apr*", val: "82", sub: "23 videos" }].map((g) => (
              <div key={g.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>{g.label} Eng</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: g.label === "Mar" ? YT_RED : "#f0f6fc" }}>{g.val}</div>
                <div style={{ fontSize: 10, color: MUTED }}>{g.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 1: KPI CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
          <KpiCard source="YouTube · Advisor Talk" label="Total Engagements (Mar)" value="734" delta={engMoM} deltaLabel="vs Feb (48)" accent={YT_RED} large />
          <KpiCard source="YouTube · Advisor Talk" label="Total Likes (Mar)" value="624" delta={likesMoM} deltaLabel="vs Feb (26)" accent={YT_RED} />
          <KpiCard source="YouTube · Advisor Talk" label="Total Video Views (Mar)" value="83,714" delta={viewsMoM} deltaLabel="vs Feb (1,850)" accent={BLUE} />
          <KpiCard source="YouTube · Advisor Talk" label="April (partial · 9 days)" value="82 eng" accent={GREEN} sub={`${aprPosts} videos · 11,050 views`} />
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
              💡 Only 3 top posts returned by Hootsuite — Ferrari content drove the March spike
            </div>
          </div>

          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>March Engagement Breakdown</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 20 }}>Best month of Q1 · 734 total engagements</div>
            {[
              { label: "Likes",    val: 624, total: 734, color: YT_RED },
              { label: "Shares",   val: 91,  total: 734, color: BLUE   },
              { label: "Comments", val: 19,  total: 734, color: GOLD   },
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
                Hootsuite Export · Jan 2025 – Apr 2026 · 16-Month View
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
                    ↑ +{ytData.subscribersGained.toLocaleString()} gained over 16 months
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
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: MUTED, textTransform: "uppercase", marginBottom: 12 }}>Watch Time · Jan 2025 – Apr 2026</div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                    {[
                      { label: "Total Watch Hours", val: ytData.totalWatchHrs.toLocaleString(), unit: "hrs", color: BLUE },
                      { label: "Avg Per Day", val: Math.round(ytData.totalWatchHrs / 481).toLocaleString(), unit: "hrs/day", color: GOLD },
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
        <span>Source: Hootsuite YouTube Export · Jan 1 – Apr 26, 2026</span>
        <span>110 Q1 videos · 104,764 total views · Apr partial: 23 videos</span>
      </div>
    </div>
  );
}
