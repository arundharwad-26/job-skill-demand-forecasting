import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { TrendingUp, ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Market demanded skills with job count data
const MARKET_DEMAND = [
  { skill: "Python",           jobs: 420, trend: "rising",   priority: "High" },
  { skill: "SQL",              jobs: 380, trend: "stable",   priority: "High" },
  { skill: "Machine Learning", jobs: 290, trend: "rising",   priority: "High" },
  { skill: "AWS",              jobs: 265, trend: "rising",   priority: "High" },
  { skill: "Docker",           jobs: 240, trend: "rising",   priority: "High" },
  { skill: "Kubernetes",       jobs: 185, trend: "rising",   priority: "Medium" },
  { skill: "Data Engineering", jobs: 210, trend: "rising",   priority: "High" },
  { skill: "Power BI",         jobs: 175, trend: "stable",   priority: "Medium" },
  { skill: "Tableau",          jobs: 140, trend: "stable",   priority: "Medium" },
  { skill: "Azure",            jobs: 160, trend: "rising",   priority: "Medium" },
  { skill: "Deep Learning",    jobs: 130, trend: "rising",   priority: "High" },
  { skill: "React",            jobs: 220, trend: "stable",   priority: "Medium" },
  { skill: "FastAPI",          jobs: 95,  trend: "rising",   priority: "Medium" },
  { skill: "JavaScript",       jobs: 310, trend: "stable",   priority: "High" },
  { skill: "Git",              jobs: 350, trend: "stable",   priority: "High" },
  { skill: "MongoDB",          jobs: 120, trend: "stable",   priority: "Low" },
  { skill: "Java",             jobs: 280, trend: "declining", priority: "Medium" },
  { skill: "Node.js",          jobs: 190, trend: "stable",   priority: "Medium" },
]

const TREND_COLOR = {
  rising:   "text-emerald-400",
  stable:   "text-sky-400",
  declining:"text-red-400",
}

const PRIORITY_COLOR = {
  High:   "bg-red-400/10 text-red-400 border-red-400/20",
  Medium: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  Low:    "bg-slate-400/10 text-slate-400 border-slate-400/20",
}

export default function SkillGapPage() {
  const navigate         = useNavigate()
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [targetRole, setTargetRole] = useState("")

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("http://localhost:8000/api/profile/me")
        setProfile(res.data)
        setTargetRole(res.data.target_role || "")
      } catch {
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07101f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const userSkills   = (profile?.current_skills || []).map(s => s.trim().toLowerCase())
  const marketSkills = MARKET_DEMAND

  // Skills user HAS that market wants
  const matched = marketSkills.filter(m =>
    userSkills.includes(m.skill.toLowerCase())
  )

  // Skills market wants but user DOESN'T have
  const missing = marketSkills.filter(m =>
    !userSkills.includes(m.skill.toLowerCase())
  )

  // Match score
  const matchScore = Math.round((matched.length / marketSkills.length) * 100)

  // Score color
  const scoreColor =
    matchScore >= 70 ? "text-emerald-400" :
    matchScore >= 40 ? "text-amber-400"   : "text-red-400"

  const scoreLabel =
    matchScore >= 70 ? "Strong Match 💪" :
    matchScore >= 40 ? "Getting There 📈" : "Needs Work 🎯"

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

      <div className="max-w-5xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs text-sky-400 uppercase tracking-widest mb-2">Skill Gap Analyzer</p>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            How ready are you for the market?
          </h1>
          <p className="text-slate-400 mt-2">
            Comparing your skills against {marketSkills.length} in-demand market skills
          </p>
        </div>

        {/* Match Score Card */}
        <div className="bg-gradient-to-r from-[#0c1a2e] to-[#0d2137] border border-[#1a3050] rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8">

          {/* Big Score */}
          <div className="text-center">
            <div className={`text-7xl font-bold font-mono ${scoreColor}`}>
              {matchScore}%
            </div>
            <div className="text-slate-400 text-sm mt-2">{scoreLabel}</div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 w-full">
            {/* Progress bar */}
            <div className="w-full bg-[#111f33] rounded-full h-3 mb-6">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  matchScore >= 70 ? "bg-emerald-400" :
                  matchScore >= 40 ? "bg-amber-400"   : "bg-red-400"
                }`}
                style={{ width: `${matchScore}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold font-mono text-emerald-400">{matched.length}</div>
                <div className="text-xs text-slate-500 mt-1">Skills matched</div>
              </div>
              <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold font-mono text-red-400">{missing.length}</div>
                <div className="text-xs text-slate-500 mt-1">Skills missing</div>
              </div>
              <div className="bg-sky-400/10 border border-sky-400/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold font-mono text-sky-400">{marketSkills.length}</div>
                <div className="text-xs text-slate-500 mt-1">Total tracked</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Skills You HAVE ✅ */}
          <div className="bg-[#0c1a2e] border border-[#1a3050] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle size={16} className="text-emerald-400" />
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest">
                Skills You Have ({matched.length})
              </span>
            </div>
            <div className="space-y-3">
              {matched.map(({ skill, jobs, trend, priority }) => (
                <div key={skill} className="flex items-center justify-between py-2 border-b border-[#1a2d45] last:border-0">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-white text-sm">{skill}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">{jobs} jobs</span>
                    <span className={`text-xs ${TREND_COLOR[trend]}`}>
                      {trend === "rising" ? "↑" : trend === "declining" ? "↓" : "→"}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_COLOR[priority]}`}>
                      {priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills You're MISSING ❌ */}
          <div className="bg-[#0c1a2e] border border-[#1a3050] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <XCircle size={16} className="text-red-400" />
              <span className="font-mono text-xs text-red-400 uppercase tracking-widest">
                Skills to Learn ({missing.length})
              </span>
            </div>
            <div className="space-y-3">
              {missing
                .sort((a, b) => b.jobs - a.jobs)  // Sort by most jobs first
                .map(({ skill, jobs, trend, priority }) => (
                <div key={skill} className="flex items-center justify-between py-2 border-b border-[#1a2d45] last:border-0">
                  <div className="flex items-center gap-3">
                    <XCircle size={14} className="text-red-400 flex-shrink-0" />
                    <span className="text-white text-sm">{skill}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">{jobs} jobs</span>
                    <span className={`text-xs ${TREND_COLOR[trend]}`}>
                      {trend === "rising" ? "↑" : trend === "declining" ? "↓" : "→"}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_COLOR[priority]}`}>
                      {priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Recommendation */}
        {missing.length > 0 && (
          <div className="mt-6 bg-amber-400/10 border border-amber-400/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-amber-400" />
              <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
                Top Recommendation
              </span>
            </div>
            <p className="text-white text-sm">
              Focus on learning{" "}
              <span className="text-amber-400 font-bold">
                {missing.sort((a, b) => b.jobs - a.jobs)[0]?.skill}
              </span>{" "}
              first —{" "}
              <span className="text-amber-400 font-bold">
                {missing.sort((a, b) => b.jobs - a.jobs)[0]?.jobs} jobs
              </span>{" "}
              are actively hiring for it this week and demand is{" "}
              <span className="text-amber-400 font-bold">
                {missing.sort((a, b) => b.jobs - a.jobs)[0]?.trend}
              </span>.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}