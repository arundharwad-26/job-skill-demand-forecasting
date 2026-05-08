import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { TrendingUp, ArrowLeft, Flame, TrendingDown, Minus } from "lucide-react"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"

// ── 12 weeks historical + 4 weeks forecast data ──────────────
const WEEKS = ["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12","F1","F2","F3","F4"]

const SKILL_DATA = {
  Python:           [65,67,70,72,71,74,76,75,78,80,82,85,87,89,91,94],
  SQL:              [60,61,62,63,62,64,65,64,66,67,68,70,71,72,73,74],
  "Machine Learning":[45,47,50,52,55,54,57,59,62,64,67,70,73,76,79,82],
  AWS:              [50,52,53,55,54,56,58,57,60,62,63,65,67,69,71,73],
  Docker:           [40,42,44,45,47,49,51,53,55,57,60,63,66,69,72,75],
  Kubernetes:       [30,31,33,34,36,37,39,41,43,45,47,50,52,54,57,60],
  React:            [55,56,55,57,56,58,57,59,58,60,59,61,62,62,63,64],
  JavaScript:       [70,70,71,70,72,71,73,72,74,73,75,74,75,75,76,76],
  "Deep Learning":  [35,37,39,41,43,45,47,49,52,54,57,60,63,66,69,72],
  Azure:            [38,39,41,42,44,45,47,48,50,52,54,57,59,62,64,67],
}

const COLORS = [
  "#38bdf8","#818cf8","#22c55e","#fb923c",
  "#f472b6","#a78bfa","#34d399","#fbbf24","#60a5fa","#f87171"
]

// Build chart data — each week as one object
function buildChartData(selectedSkills) {
  return WEEKS.map((week, i) => {
    const point = { week, forecast: i >= 12 }
    selectedSkills.forEach(skill => {
      point[skill] = SKILL_DATA[skill]?.[i] ?? 0
    })
    return point
  })
}

// Top 5 skills by growth (last value - first value)
const TOP_SKILLS = Object.entries(SKILL_DATA)
  .map(([skill, data]) => ({
    skill,
    current:  data[11],
    forecast: data[15],
    growth:   data[15] - data[0],
    trend:    data[15] > data[11] ? "rising" : data[15] < data[11] ? "declining" : "stable",
    change:   ((data[15] - data[11]) / data[11] * 100).toFixed(1)
  }))
  .sort((a, b) => b.growth - a.growth)

// Bar chart — current week job scores
const BAR_DATA = Object.entries(SKILL_DATA)
  .map(([skill, data]) => ({ skill: skill.length > 10 ? skill.slice(0,10)+"…" : skill, score: data[11] }))
  .sort((a, b) => b.score - a.score)

// Custom tooltip
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0c1a2e] border border-[#1a3050] rounded-xl p-3 text-xs">
      <p className="text-slate-400 font-mono mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="font-mono font-bold" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function DemandForecastPage() {
  const navigate = useNavigate()
  const allSkills = Object.keys(SKILL_DATA)
  const [selected, setSelected] = useState(["Python", "Machine Learning", "Docker", "Deep Learning"])
  const [activeTab, setActiveTab] = useState("trend")   // trend | bar | ranking

  function toggleSkill(skill) {
    setSelected(s =>
      s.includes(skill)
        ? s.length > 1 ? s.filter(x => x !== skill) : s  // keep at least 1
        : s.length < 5 ? [...s, skill] : s                // max 5
    )
  }

  const chartData = buildChartData(selected)

  return (
    <div className="min-h-screen bg-[#07101f]">

      {/* Navbar */}
      <nav className="border-b border-[#1a3050] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-400 rounded-lg flex items-center justify-center">
            <TrendingUp size={18} className="text-[#07101f]" />
          </div>
          <span className="font-mono text-sky-400 font-semibold text-sm tracking-widest">SKILLFORECAST</span>
        </div>
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={16}/> Back to Dashboard
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs text-violet-400 uppercase tracking-widest mb-2">Demand Forecast</p>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Skill demand trends & forecasts
          </h1>
          <p className="text-slate-400 mt-2">
            12 weeks historical data + 4 week AI forecast. Select up to 5 skills to compare.
          </p>
        </div>

        {/* Top 5 Ranking Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {TOP_SKILLS.slice(0, 5).map(({ skill, current, change, trend }, i) => (
            <div key={skill}
              className="bg-[#0c1a2e] border border-[#1a3050] rounded-xl p-4 cursor-pointer hover:border-violet-400/40 transition-all"
              onClick={() => toggleSkill(skill)}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-slate-500">#{i + 1}</span>
                {trend === "rising"
                  ? <Flame size={14} className="text-orange-400"/>
                  : trend === "declining"
                  ? <TrendingDown size={14} className="text-red-400"/>
                  : <Minus size={14} className="text-slate-400"/>
                }
              </div>
              <div className="font-bold text-white text-sm mb-1 truncate">{skill}</div>
              <div className="font-mono text-violet-400 text-lg font-bold">{current}</div>
              <div className={`text-xs mt-1 ${parseFloat(change) > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {parseFloat(change) > 0 ? "+" : ""}{change}% forecast
              </div>
            </div>
          ))}
        </div>

        {/* Skill Selector */}
        <div className="bg-[#0c1a2e] border border-[#1a3050] rounded-2xl p-5 mb-6">
          <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-3">
            Select Skills to Compare (max 5)
          </p>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill, i) => {
              const isSelected = selected.includes(skill)
              return (
                <button key={skill} onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isSelected
                      ? "border-transparent text-[#07101f] font-bold"
                      : "bg-transparent border-[#1a3050] text-slate-400 hover:border-slate-500"
                  }`}
                  style={isSelected ? { background: COLORS[allSkills.indexOf(skill) % COLORS.length] } : {}}>
                  {skill}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "trend", label: "📈 Trend Lines" },
            { id: "bar",   label: "📊 Current Demand" },
            { id: "ranking", label: "🏆 Full Ranking" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-violet-400/20 border border-violet-400/40 text-violet-300"
                  : "bg-[#0c1a2e] border border-[#1a3050] text-slate-400 hover:text-white"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chart Panel */}
        <div className="bg-[#0c1a2e] border border-[#1a3050] rounded-2xl p-6 mb-6">

          {/* Trend Line Chart */}
          {activeTab === "trend" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-xs text-violet-400 uppercase tracking-widest">
                  12-Week History + 4-Week Forecast
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <div className="w-6 h-px bg-slate-500"/> Historical
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-6 h-px border-t-2 border-dashed border-violet-400"/> Forecast
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2d45" />
                  <XAxis dataKey="week" tick={{ fill: "#4b6280", fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fill: "#4b6280", fontSize: 11 }} tickLine={false} axisLine={false} domain={[20, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8", paddingTop: "16px" }} />
                  {/* Forecast region marker */}
                  {selected.map((skill, i) => (
                    <Line
                      key={skill}
                      type="monotone"
                      dataKey={skill}
                      stroke={COLORS[allSkills.indexOf(skill) % COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                      strokeDasharray={chartData.map(d => d.forecast ? "5 5" : "0").join(" ")}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-slate-600 text-center mt-2 font-mono">
                W1–W12 = Historical Data · F1–F4 = AI Forecast
              </p>
            </>
          )}

          {/* Bar Chart */}
          {activeTab === "bar" && (
            <>
              <p className="font-mono text-xs text-violet-400 uppercase tracking-widest mb-4">
                Current Week Demand Score (All Skills)
              </p>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={BAR_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2d45" vertical={false} />
                  <XAxis dataKey="skill" tick={{ fill: "#4b6280", fontSize: 10 }} tickLine={false} />
                  <YAxis tick={{ fill: "#4b6280", fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1a2d45" }} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}
                    fill="#818cf8"
                    background={{ fill: "#0a1424", radius: [6, 6, 0, 0] }} />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}

          {/* Full Ranking Table */}
          {activeTab === "ranking" && (
            <>
              <p className="font-mono text-xs text-violet-400 uppercase tracking-widest mb-4">
                All Skills Ranked by Forecast Demand
              </p>
              <div className="space-y-2">
                {TOP_SKILLS.map(({ skill, current, forecast, change, trend }, i) => (
                  <div key={skill}
                    className="flex items-center gap-4 p-3 rounded-xl bg-[#08131f] hover:bg-[#0d1f38] transition-colors">
                    <span className="font-mono text-slate-500 text-sm w-6">#{i + 1}</span>
                    <span className="text-white text-sm flex-1 font-medium">{skill}</span>
                    <div className="flex items-center gap-6 text-xs">
                      <div className="text-center">
                        <div className="font-mono text-slate-300">{current}</div>
                        <div className="text-slate-600">now</div>
                      </div>
                      <div className="text-center">
                        <div className="font-mono text-violet-400">{forecast}</div>
                        <div className="text-slate-600">4wk forecast</div>
                      </div>
                      <div className={`font-mono font-bold w-16 text-right ${
                        parseFloat(change) > 5  ? "text-emerald-400" :
                        parseFloat(change) > 0  ? "text-sky-400"     :
                        parseFloat(change) < 0  ? "text-red-400"     : "text-slate-400"
                      }`}>
                        {parseFloat(change) > 0 ? "+" : ""}{change}%
                      </div>
                      <div className="w-20">
                        {trend === "rising"
                          ? <span className="flex items-center gap-1 text-orange-400"><Flame size={12}/>Rising</span>
                          : trend === "declining"
                          ? <span className="flex items-center gap-1 text-red-400"><TrendingDown size={12}/>Falling</span>
                          : <span className="flex items-center gap-1 text-slate-400"><Minus size={12}/>Stable</span>
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bottom insight */}
        <div className="bg-violet-400/10 border border-violet-400/20 rounded-2xl p-5">
          <p className="text-xs text-slate-400 text-center">
            🔮 <span className="text-violet-400 font-bold">AI Forecast</span> is based on historical trend analysis ·
            Data updates weekly from live job postings ·
            <span className="text-violet-400 font-bold"> Machine Learning & Deep Learning</span> show strongest growth
          </p>
        </div>
      </div>
    </div>
  )
}