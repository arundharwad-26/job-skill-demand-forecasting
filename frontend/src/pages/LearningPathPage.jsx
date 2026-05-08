import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { TrendingUp, ArrowLeft, BookOpen, Clock, ExternalLink, CheckCircle, Star } from "lucide-react"

const LEARNING_RESOURCES = {
  "Docker": [
    { title: "Docker for Beginners",         platform: "freeCodeCamp", duration: "4 hours",  level: "Beginner",     url: "https://www.youtube.com/watch?v=fqMOX6JJhGo", free: true },
    { title: "Docker & Kubernetes: Full Course", platform: "TechWorld",  duration: "3 hours",  level: "Beginner",     url: "https://www.youtube.com/watch?v=3c-iBn73dDE", free: true },
    { title: "Docker Official Docs",          platform: "Docker.com",   duration: "Self-paced",level: "All levels",   url: "https://docs.docker.com/get-started/",        free: true },
  ],
  "Kubernetes": [
    { title: "Kubernetes for Beginners",      platform: "freeCodeCamp", duration: "4 hours",  level: "Beginner",     url: "https://www.youtube.com/watch?v=X48VuDVv0do", free: true },
    { title: "Kubernetes Crash Course",       platform: "TechWorld",    duration: "1.5 hours", level: "Beginner",     url: "https://www.youtube.com/watch?v=s_o8dwzRlu4", free: true },
    { title: "Kubernetes Official Docs",      platform: "k8s.io",       duration: "Self-paced",level: "All levels",   url: "https://kubernetes.io/docs/tutorials/",       free: true },
  ],
  "Azure": [
    { title: "Azure Fundamentals AZ-900",     platform: "Microsoft",    duration: "6 hours",  level: "Beginner",     url: "https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/", free: true },
    { title: "Azure for Beginners",           platform: "freeCodeCamp", duration: "3 hours",  level: "Beginner",     url: "https://www.youtube.com/watch?v=NKEFWyqJ5XA", free: true },
    { title: "Azure Free Certification Path", platform: "Microsoft Learn",duration: "Self-paced",level: "All levels", url: "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/", free: true },
  ],
  "Python": [
    { title: "Python for Everybody",          platform: "Coursera",     duration: "8 hours",  level: "Beginner",     url: "https://www.coursera.org/specializations/python",             free: true },
    { title: "Python Full Course",            platform: "freeCodeCamp", duration: "4 hours",  level: "Beginner",     url: "https://www.youtube.com/watch?v=rfscVS0vtbw",                free: true },
  ],
  "SQL": [
    { title: "SQL for Beginners",             platform: "freeCodeCamp", duration: "4 hours",  level: "Beginner",     url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",               free: true },
    { title: "SQLZoo Interactive",            platform: "SQLZoo",       duration: "Self-paced",level: "Beginner",     url: "https://sqlzoo.net/",                                        free: true },
  ],
  "Machine Learning": [
    { title: "ML Crash Course",               platform: "Google",       duration: "15 hours", level: "Intermediate", url: "https://developers.google.com/machine-learning/crash-course", free: true },
    { title: "ML with Python",                platform: "freeCodeCamp", duration: "10 hours", level: "Intermediate", url: "https://www.youtube.com/watch?v=i_LwzRVP7bg",               free: true },
  ],
  "AWS": [
    { title: "AWS Cloud Practitioner",        platform: "freeCodeCamp", duration: "13 hours", level: "Beginner",     url: "https://www.youtube.com/watch?v=SOTamWNgDKc",               free: true },
    { title: "AWS Free Tier Training",        platform: "AWS",          duration: "Self-paced",level: "All levels",   url: "https://aws.amazon.com/training/learn-about/cloud-practitioner/", free: true },
  ],
  "Deep Learning": [
    { title: "Deep Learning Specialization",  platform: "Coursera",     duration: "3 months", level: "Intermediate", url: "https://www.coursera.org/specializations/deep-learning",     free: true },
    { title: "Neural Networks from Scratch",  platform: "freeCodeCamp", duration: "6 hours",  level: "Intermediate", url: "https://www.youtube.com/watch?v=Wo5dMEP_BbI",               free: true },
  ],
  "React": [
    { title: "React Full Course 2024",        platform: "freeCodeCamp", duration: "8 hours",  level: "Intermediate", url: "https://www.youtube.com/watch?v=CgkZ7MvWUAA",               free: true },
    { title: "React Official Docs",           platform: "React.dev",    duration: "Self-paced",level: "All levels",   url: "https://react.dev/learn",                                    free: true },
  ],
  "Data Engineering": [
    { title: "Data Engineering Zoomcamp",     platform: "DataTalks",    duration: "9 weeks",  level: "Intermediate", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp", free: true },
    { title: "Data Engineering Full Course",  platform: "freeCodeCamp", duration: "4 hours",  level: "Beginner",     url: "https://www.youtube.com/watch?v=ysEN5RaKOlA",               free: true },
  ],
}

const MARKET_DEMAND = [
  { skill: "Docker",      jobs: 240, trend: "rising",   priority: "High",   urgency: 1 },
  { skill: "Kubernetes",  jobs: 185, trend: "rising",   priority: "Medium", urgency: 2 },
  { skill: "Azure",       jobs: 160, trend: "rising",   priority: "Medium", urgency: 3 },
]

const LEVEL_COLOR = {
  "Beginner":     "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "Intermediate": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "All levels":   "text-sky-400 bg-sky-400/10 border-sky-400/20",
}

const PLATFORM_COLOR = {
  "freeCodeCamp":   "bg-[#0a2510] text-emerald-300",
  "Google":         "bg-[#1a1a2e] text-blue-300",
  "Microsoft":      "bg-[#0a1628] text-sky-300",
  "Microsoft Learn":"bg-[#0a1628] text-sky-300",
  "Coursera":       "bg-[#1a0f28] text-violet-300",
  "AWS":            "bg-[#1a1000] text-amber-300",
  "DataTalks":      "bg-[#0a1628] text-pink-300",
  "Docker.com":     "bg-[#0a1628] text-sky-300",
  "TechWorld":      "bg-[#0a1020] text-cyan-300",
  "k8s.io":         "bg-[#0a1020] text-blue-300",
  "SQLZoo":         "bg-[#1a1000] text-orange-300",
  "React.dev":      "bg-[#0a1628] text-cyan-300",
  "GitHub":         "bg-[#111] text-slate-300",
}

export default function LearningPathPage() {
  const navigate = useNavigate()
  const [profile,  setProfile]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [done,     setDone]     = useState({})

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("http://localhost:8000/api/profile/me")
        setProfile(res.data)
      } catch {
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  function toggleDone(key) {
    setDone(d => ({ ...d, [key]: !d[key] }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07101f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const userSkills = (profile?.current_skills || []).map(s => s.trim().toLowerCase())
  const missingSkills = MARKET_DEMAND.filter(m => !userSkills.includes(m.skill.toLowerCase()))
  const completedCount = Object.values(done).filter(Boolean).length

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

      <div className="max-w-4xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs text-amber-400 uppercase tracking-widest mb-2">Learning Path</p>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Your personalized learning path
          </h1>
          <p className="text-slate-400 mt-2">
            Based on your skill gap — here's exactly what to learn and where to learn it for free.
          </p>
        </div>

        {/* Progress Bar */}
        {missingSkills.length > 0 && (
          <div className="bg-[#0c1a2e] border border-[#1a3050] rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">Overall Progress</span>
              <span className="font-mono text-sky-400 text-sm">{completedCount} courses completed</span>
            </div>
            <div className="w-full bg-[#111f33] rounded-full h-2">
              <div className="h-2 bg-sky-400 rounded-full transition-all duration-500"
                style={{ width: completedCount === 0 ? "0%" : `${Math.min(100, (completedCount / (missingSkills.length * 2)) * 100)}%` }} />
            </div>
            <div className="flex gap-6 mt-4">
              {[
                { label: "Skills to learn", value: missingSkills.length, color: "text-red-400" },
                { label: "Free courses",    value: missingSkills.reduce((a, m) => a + (LEARNING_RESOURCES[m.skill]?.length || 0), 0), color: "text-emerald-400" },
                { label: "Est. total time", value: "~15 hrs",            color: "text-amber-400" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className={`font-mono font-bold text-lg ${color}`}>{value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No missing skills */}
        {missingSkills.length === 0 && (
          <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-2xl p-8 text-center mb-8">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-white font-bold text-xl mb-2">You have all tracked skills!</h2>
            <p className="text-slate-400 text-sm">Your profile matches 100% of our tracked market skills.</p>
          </div>
        )}

        {/* Learning Path Cards */}
        <div className="space-y-6">
          {missingSkills.map(({ skill, jobs, trend, priority, urgency }) => {
            const resources = LEARNING_RESOURCES[skill] || []
            const isOpen    = expanded === skill

            return (
              <div key={skill} className="bg-[#0c1a2e] border border-[#1a3050] rounded-2xl overflow-hidden">

                {/* Card Header — click to expand */}
                <div className="p-6 cursor-pointer hover:bg-[#0d1f38] transition-colors"
                  onClick={() => setExpanded(isOpen ? null : skill)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">

                      {/* Priority number */}
                      <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="font-mono font-bold text-amber-400">#{urgency}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-white font-bold text-lg">{skill}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            priority === "High"
                              ? "bg-red-400/10 text-red-400 border-red-400/20"
                              : "bg-amber-400/10 text-amber-400 border-amber-400/20"
                          }`}>{priority} Priority</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{jobs} jobs hiring this week</span>
                          <span className="text-emerald-400">↑ {trend}</span>
                          <span>{resources.length} free courses available</span>
                        </div>
                      </div>
                    </div>

                    {/* Expand arrow */}
                    <div className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      ▼
                    </div>
                  </div>
                </div>

                {/* Expanded Course List */}
                {isOpen && (
                  <div className="border-t border-[#1a3050] p-6 space-y-4">
                    <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-4">
                      Free Courses — Learn in this order:
                    </p>

                    {resources.map((res, idx) => {
                      const doneKey = `${skill}-${idx}`
                      const isDone  = done[doneKey]

                      return (
                        <div key={idx}
                          className={`border rounded-xl p-5 transition-all ${
                            isDone
                              ? "border-emerald-500/30 bg-emerald-400/5"
                              : "border-[#1a3050] bg-[#08131f]"
                          }`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">

                              {/* Step number */}
                              <div className="w-7 h-7 rounded-full bg-[#111f33] border border-[#1a3050] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="font-mono text-xs text-slate-400">{idx + 1}</span>
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <h4 className={`font-semibold text-sm ${isDone ? "line-through text-slate-500" : "text-white"}`}>
                                    {res.title}
                                  </h4>
                                  {res.free && (
                                    <span className="text-xs bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                                      FREE
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                                    PLATFORM_COLOR[res.platform] || "bg-[#111f33] text-slate-400"
                                  }`}>
                                    {res.platform}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full border ${LEVEL_COLOR[res.level]}`}>
                                    {res.level}
                                  </span>
                                  <span className="flex items-center gap-1 text-xs text-slate-500">
                                    <Clock size={11}/> {res.duration}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button onClick={() => toggleDone(doneKey)}
                                className={`p-2 rounded-lg transition-colors ${
                                  isDone
                                    ? "text-emerald-400 bg-emerald-400/10"
                                    : "text-slate-500 hover:text-emerald-400 bg-[#111f33]"
                                }`}
                                title={isDone ? "Mark as not done" : "Mark as done"}>
                                <CheckCircle size={18}/>
                              </button>
                              <a href={res.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/20 text-sky-400 text-xs px-3 py-2 rounded-lg transition-all"
                                onClick={e => e.stopPropagation()}>
                                Start <ExternalLink size={12}/>
                              </a>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Time estimate */}
                    <div className="mt-4 pt-4 border-t border-[#1a2d45] flex items-center gap-2 text-xs text-slate-500">
                      <Star size={12} className="text-amber-400"/>
                      Complete all {resources.length} resources to fully learn {skill} for job interviews
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom tip */}
        <div className="mt-8 p-5 bg-[#0c1a2e] border border-[#1a3050] rounded-2xl">
          <p className="text-xs text-slate-400 text-center font-mono">
            💡 All courses are 100% free · Complete in order for best results ·
            Check ✓ to track your progress
          </p>
        </div>
      </div>
    </div>
  )
}