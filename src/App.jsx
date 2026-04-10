import { useState, useEffect } from "react";
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

export default function App() {
  const engMoM   = Math.round(((734 - 48) / 48) * 100);
  const viewsMoM = Math.round(((83714 - 1850) / 1850) * 100);
  const likesMoM = Math.round(((624 - 26) / 26) * 100);
  const aprEng   = 82;
  const aprPosts = 23;

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
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "12px 32px", display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono', monospace", fontSize: 10, color: MUTED, marginTop: 24 }}>
        <span>Elite Partners Group · YouTube Dashboard · Advisor Talk with Frank LaRosa</span>
        <span>Source: Hootsuite YouTube Export · Jan 1 – Apr 9, 2026</span>
        <span>110 Q1 videos · 104,764 total views · Apr partial: 23 videos</span>
      </div>
    </div>
  );
}
