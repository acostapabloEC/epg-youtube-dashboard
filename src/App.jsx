import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

// ── REAL DATA FROM YOUTUBE ANALYTICS Q1 2026 ─────────────────────────────
const weeklyData = [
  { week: "Jan 05", engagements: 17,  likes: 15,  comments: 0, shares: 2,  views: 1231  },
  { week: "Jan 12", engagements: 2,   likes: 2,   comments: 0, shares: 0,  views: 60    },
  { week: "Jan 19", engagements: 1,   likes: 1,   comments: 0, shares: 0,  views: 320   },
  { week: "Jan 26", engagements: 7,   likes: 5,   comments: 0, shares: 2,  views: 1582  },
  { week: "Feb 02", engagements: 10,  likes: 4,   comments: 2, shares: 4,  views: 656   },
  { week: "Feb 09", engagements: 10,  likes: 5,   comments: 1, shares: 4,  views: 500   },
  { week: "Feb 16", engagements: 11,  likes: 8,   comments: 1, shares: 2,  views: 281   },
  { week: "Feb 23", engagements: 18,  likes: 10,  comments: 0, shares: 8,  views: 495   },
  { week: "Mar 02", engagements: 147, likes: 125, comments: 4, shares: 18, views: 11930 },
  { week: "Mar 09", engagements: 144, likes: 111, comments: 1, shares: 32, views: 9972  },
  { week: "Mar 16", engagements: 166, likes: 139, comments: 4, shares: 23, views: 11930 },
  { week: "Mar 23", engagements: 227, likes: 204, comments: 7, shares: 16, views: 42216 },
  { week: "Mar 30", engagements: 81,  likes: 75,  comments: 3, shares: 3,  views: 12176 },
];

const monthlyData = [
  { month: "Jan", engagements: 29,  likes: 24,  comments: 0,  shares: 5,  views: 3324  },
  { month: "Feb", engagements: 48,  likes: 26,  comments: 4,  shares: 18, views: 1850  },
  { month: "Mar", engagements: 736, likes: 626, comments: 19, shares: 91, views: 83146 },
];

const topPosts = [
  { date: "Mar 27", engagements: 91, likes: 87, comments: 4, shares: 0,  views: 23784, title: "Ferrari 458 — the one car a real enthusiast would pick" },
  { date: "Mar 03", engagements: 23, likes: 22, comments: 0, shares: 1,  views: 903,   title: "3 types of financial advisors on social media" },
  { date: "Mar 03", engagements: 22, likes: 22, comments: 0, shares: 0,  views: 1589,  title: "Range Rover SV vs Lamborghini Urus" },
  { date: "Mar 14", engagements: 21, likes: 20, comments: 0, shares: 1,  views: 1258,  title: "Let me save you some money..." },
  { date: "Mar 13", engagements: 20, likes: 12, comments: 0, shares: 8,  views: 673,   title: "Words you use on a discovery call" },
];

const GOLD     = "#c9a84c";
const GOLD_DIM = "rgba(201,168,76,0.15)";
const GREEN    = "#3fb950";
const GREEN_DIM= "rgba(63,185,80,0.12)";
const RED      = "#f85149";
const RED_DIM  = "rgba(248,81,73,0.12)";
const BLUE     = "#58a6ff";
const YT_RED   = "#ff4444";
const YT_DIM   = "rgba(255,68,68,0.12)";
const MUTED    = "#8892a4";
const BORDER   = "rgba(255,255,255,0.07)";
const SURFACE  = "#111827";

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
        <div key={i} style={{ fontSize: 13, color: p.color, marginBottom: 2 }}>{p.name}: <strong>{p.value.toLocaleString()}</strong></div>
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

export default function App() {
  // MoM: Feb vs Mar
  const engMoM  = Math.round(((736 - 48) / 48) * 100);   // +1433%
  const viewsMoM = Math.round(((83146 - 1850) / 1850) * 100);
  const likesMoM = Math.round(((626 - 26) / 26) * 100);
  const subGrowth = Math.round(((2030 - 1940) / 1940) * 100);

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
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: "uppercase" }}>Advisor Talk with Frank LaRosa · Q1 2026</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", background: YT_DIM, color: YT_RED, padding: "5px 12px", borderRadius: 6, border: `1px solid rgba(255,68,68,0.2)` }}>Jan – Apr 2026</div>
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
              Engagements surged from <span style={{ color: "#f0f6fc", fontWeight: 600 }}>48</span> in Feb to <span style={{ color: YT_RED, fontWeight: 600 }}>736</span> in March — a <span style={{ color: GREEN, fontWeight: 600 }}>+1,433%</span> jump driven by viral short-form content
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {[
              { label: "Jan Engagements", val: "29"  },
              { label: "Feb Engagements", val: "48"  },
              { label: "Mar Engagements", val: "736" },
            ].map((g) => (
              <div key={g.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>{g.label}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: g.label === "Mar Engagements" ? YT_RED : "#f0f6fc" }}>{g.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 1: KPI CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
          <KpiCard source="YouTube · Advisor Talk" label="Total Engagements (Mar)" value="736" delta={engMoM} deltaLabel="vs Feb (48)" accent={YT_RED} large />
          <KpiCard source="YouTube · Advisor Talk" label="Total Likes (Mar)" value="626" delta={likesMoM} deltaLabel="vs Feb (26)" accent={YT_RED} />
          <KpiCard source="YouTube · Advisor Talk" label="Total Video Views (Mar)" value="83,146" delta={viewsMoM} deltaLabel="vs Feb (1,850)" accent={BLUE} />
          <KpiCard source="YouTube · Advisor Talk" label="Channel Subscribers" value="2,030" delta={subGrowth} deltaLabel="Q1 gain: +116 subs" sub="Started Q1 at 1,940" accent={GREEN} />
        </div>

        {/* ROW 2: CHARTS */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 20 }}>

          {/* Weekly Engagements Chart */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Weekly Engagements — Advisor Talk YouTube</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 16 }}>Q1 2026 · Likes + Comments + Shares</div>
            <ResponsiveContainer width="100%" height={220}>
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
          </div>

          {/* Monthly Bar Chart */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Monthly Engagement Breakdown</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 16 }}>Likes · Comments · Shares · Q1 2026</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: MUTED }} />
                <Bar dataKey="likes" name="Likes" fill={YT_RED} radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="comments" name="Comments" fill={GOLD} radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="shares" name="Shares" fill={BLUE} radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 3: BOTTOM CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

          {/* Q1 Summary */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Q1 2026 Summary</div>
            {[
              { label: "Total Engagements", val: "813",    color: YT_RED },
              { label: "Total Likes",        val: "705",    color: YT_RED },
              { label: "Total Comments",     val: "23",     color: GOLD   },
              { label: "Total Shares",       val: "115",    color: BLUE   },
              { label: "Total Video Views",  val: "93,480", color: BLUE   },
              { label: "New Subscribers",    val: "+116",   color: GREEN  },
              { label: "Videos Published",   val: "122",    color: MUTED  },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 13, color: MUTED }}>{item.label}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600, color: item.color }}>{item.val}</span>
              </div>
            ))}
          </div>

          {/* Top Posts */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Top Posts by Engagements</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 16 }}>Q1 2026 · Top 5</div>
            {topPosts.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", borderRadius: 8, background: i === 0 ? YT_DIM : "transparent", marginBottom: 6 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: i === 0 ? YT_RED : MUTED, width: 16 }}>#{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#f0f6fc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{p.date} · {p.views.toLocaleString()} views</div>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: i === 0 ? YT_RED : GREEN, flexShrink: 0 }}>{p.engagements} eng</div>
              </div>
            ))}
          </div>

          {/* Engagement Breakdown */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>March Engagement Breakdown</div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 20 }}>Best month of Q1 · 736 total engagements</div>
            {[
              { label: "Likes",    val: 626, total: 736, color: YT_RED },
              { label: "Shares",   val: 91,  total: 736, color: BLUE   },
              { label: "Comments", val: 19,  total: 736, color: GOLD   },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: MUTED }}>{item.label}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: item.color, fontWeight: 600 }}>
                    {item.val} <span style={{ color: MUTED, fontWeight: 400 }}>({Math.round((item.val / item.total) * 100)}%)</span>
                  </span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, width: `${(item.val / item.total) * 100}%`, background: item.color }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(255,68,68,0.06)", border: `1px solid rgba(255,68,68,0.15)`, borderRadius: 8, fontSize: 11, color: YT_RED, lineHeight: 1.5 }}>
              ⚡ 91% of Q1 engagements happened in March alone
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "12px 32px", display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono', monospace", fontSize: 10, color: MUTED, marginTop: 24 }}>
        <span>Elite Partners Group · YouTube Dashboard · Advisor Talk with Frank LaRosa</span>
        <span>Source: Hootsuite YouTube Export · Q1 2026 · Jan 1 – Apr 5</span>
        <span>122 videos published · 93,480 total views · 2,030 subscribers</span>
      </div>
    </div>
  );
}
