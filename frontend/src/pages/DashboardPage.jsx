import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { TrendingUp, LogOut, User, Briefcase, Code, BookOpen, Bell } from "lucide-react"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("http://localhost:8000/api/profile/me")
        setProfile(res.data)
      } catch {
        // No profile yet
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  function handleLogout() {
    logout()
    navigate("/login")
  }

  const skills = profile?.current_skills || []

  const menuItems = [
    { icon: User,       label: "My Profile",        desc: "View & edit your details",        color: "text-sky-400",     bg: "bg-sky-400/10",     border: "border-sky-400/20",    path: "/profile-setup" },
    { icon: TrendingUp, label: "Demand Forecast", desc: "See trending skills this week", color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20", path: "/demand-forecast" },
    { icon: Code,       label: "Skill Gap Analyzer",desc: "Find what you're missing",        color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20",path: "/skill-gap" },
    { icon: BookOpen, label: "Learning Path", desc: "Free courses for your goals", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", path: "/learning-path" },
    { icon: Briefcase, label: "Job Listings", desc: "Live jobs matching your profile", color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20", path: "/jobs" },
    { icon: Bell,       label: "Alerts",            desc: "Get notified on skill spikes",    color: "text-orange-400",  bg: "bg-orange-400/10",  border: "border-orange-400/20", path: "/dashboard" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07101f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

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
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm hidden md:block">{user?.email}</span>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm transition-colors">
            <LogOut size={16}/> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0c1a2e] to-[#0d2137] border border-[#1a3050] rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="relative">
            <p className="text-sky-400 font-mono text-xs uppercase tracking-widest mb-2">Welcome back</p>
            <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              {profile?.full_name || user?.email} 👋
            </h1>
            <p className="text-slate-400 text-sm">
              {profile
                ? `${profile.employment_status} · ${profile.city || "Location not set"} · Target: ${profile.target_role || "Not set"}`
                : "Complete your profile to get personalized insights"}
            </p>
            {!profile && (
              <button onClick={() => navigate("/profile-setup")}
                className="mt-4 bg-sky-400 text-[#07101f] font-bold px-6 py-2 rounded-xl text-sm hover:bg-sky-300 transition-all">
                Complete Profile →
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Your Skills",    value: skills.length || 0,               sub: "selected" },
            { label: "Jobs Available", value: "3,847",                           sub: "this week" },
            { label: "Top Skill",      value: skills[0] || "—",                 sub: "your best skill" },
            { label: "Profile",        value: profile ? "100%" : "Incomplete",  sub: "complete" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-[#0c1a2e] border border-[#1a3050] rounded-xl p-5">
              <div className="font-mono text-sky-400 text-xl font-bold">{value}</div>
              <div className="text-slate-500 text-xs mt-1 uppercase tracking-wider">{label}</div>
              <div className="text-slate-600 text-xs mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Your Skills */}
        {skills.length > 0 && (
          <div className="bg-[#0c1a2e] border border-[#1a3050] rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Code size={16} className="text-sky-400" />
              <span className="font-mono text-xs text-sky-400 uppercase tracking-widest">Your Current Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.filter(s => s).map(skill => (
                <span key={skill}
                  className="px-4 py-1.5 bg-sky-400/10 border border-sky-400/20 text-sky-300 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Feature Cards — all clickable now */}
        <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-4">Features</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map(({ icon: Icon, label, desc, color, bg, border, path }) => (
            <div key={label}
              onClick={() => navigate(path)}
              className={`${bg} border ${border} rounded-2xl p-6 cursor-pointer hover:scale-[1.02] transition-all group`}>
              <div className={`w-10 h-10 ${bg} border ${border} rounded-xl flex items-center justify-center mb-4`}>
                <Icon size={20} className={color} />
              </div>
              <h3 className="text-white font-semibold mb-1">{label}</h3>
              <p className="text-slate-500 text-sm">{desc}</p>
              <div className={`mt-4 text-xs font-mono ${color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                Open →
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-700 text-xs font-mono mt-10">
          SKILLFORECAST · Built with Python + React · Job Skill Demand Forecasting
        </p>
      </div>
    </div>
  )
}