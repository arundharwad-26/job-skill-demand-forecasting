import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  TrendingUp, ArrowLeft, Briefcase, MapPin,
  Clock, Building, ExternalLink, Search, Filter, Wifi
} from "lucide-react"

// Demo job listings — in real project these come from JSearch API
const DEMO_JOBS = [
  {
    id: 1,
    title:       "Machine Learning Engineer",
    company:     "Google",
    location:    "Bengaluru, India",
    type:        "Full-time",
    remote:      true,
    posted:      "2 days ago",
    salary:      "₹18L - ₹35L/yr",
    skills:      ["Python", "Machine Learning", "TensorFlow", "Docker", "AWS"],
    description: "Build and deploy ML models at scale. Work with large datasets and cutting-edge AI research.",
    logo:        "G",
    logoColor:   "bg-blue-500",
    applyUrl:    "https://careers.google.com",
    match:       95,
  },
  {
    id: 2,
    title:       "Data Engineer",
    company:     "Microsoft",
    location:    "Hyderabad, India",
    type:        "Full-time",
    remote:      true,
    posted:      "1 day ago",
    salary:      "₹15L - ₹28L/yr",
    skills:      ["Python", "SQL", "Azure", "Spark", "Data Engineering"],
    description: "Design and maintain data pipelines for Azure cloud platform. Work with petabyte-scale data.",
    logo:        "M",
    logoColor:   "bg-sky-600",
    applyUrl:    "https://careers.microsoft.com",
    match:       88,
  },
  {
    id: 3,
    title:       "AI/ML Engineer",
    company:     "Amazon",
    location:    "Bengaluru, India",
    type:        "Full-time",
    remote:      false,
    posted:      "3 days ago",
    salary:      "₹20L - ₹40L/yr",
    skills:      ["Python", "Deep Learning", "AWS", "Docker", "Kubernetes"],
    description: "Develop AI solutions for Amazon's recommendation and logistics systems at massive scale.",
    logo:        "A",
    logoColor:   "bg-orange-500",
    applyUrl:    "https://amazon.jobs",
    match:       91,
  },
  {
    id: 4,
    title:       "Full Stack Developer",
    company:     "Flipkart",
    location:    "Bengaluru, India",
    type:        "Full-time",
    remote:      false,
    posted:      "Today",
    salary:      "₹12L - ₹22L/yr",
    skills:      ["React", "Node", "MongoDB", "SQL", "Git"],
    description: "Build scalable web applications for India's largest e-commerce platform.",
    logo:        "F",
    logoColor:   "bg-yellow-500",
    applyUrl:    "https://www.flipkartcareers.com",
    match:       82,
  },
  {
    id: 5,
    title:       "Data Scientist",
    company:     "Swiggy",
    location:    "Bengaluru, India",
    type:        "Full-time",
    remote:      true,
    posted:      "4 days ago",
    salary:      "₹14L - ₹26L/yr",
    skills:      ["Python", "Machine Learning", "SQL", "Pandas", "Tableau"],
    description: "Use data science to optimize delivery routes, predict demand and improve customer experience.",
    logo:        "S",
    logoColor:   "bg-orange-600",
    applyUrl:    "https://bytes.swiggy.com/careers",
    match:       87,
  },
  {
    id: 6,
    title:       "MLOps Engineer",
    company:     "Razorpay",
    location:    "Bengaluru, India",
    type:        "Full-time",
    remote:      true,
    posted:      "5 days ago",
    salary:      "₹16L - ₹30L/yr",
    skills:      ["Python", "Docker", "Kubernetes", "AWS", "CI/CD"],
    description: "Build and maintain ML infrastructure and deployment pipelines for fintech products.",
    logo:        "R",
    logoColor:   "bg-blue-600",
    applyUrl:    "https://razorpay.com/jobs",
    match:       79,
  },
  {
    id: 7,
    title:       "Backend Developer",
    company:     "Zepto",
    location:    "Mumbai, India",
    type:        "Full-time",
    remote:      false,
    posted:      "2 days ago",
    salary:      "₹10L - ₹20L/yr",
    skills:      ["Python", "FastAPI", "PostgreSQL", "Docker", "Git"],
    description: "Build high-performance APIs for India's fastest growing quick commerce startup.",
    logo:        "Z",
    logoColor:   "bg-purple-600",
    applyUrl:    "https://www.zepto.com/careers",
    match:       84,
  },
  {
    id: 8,
    title:       "Data Analyst",
    company:     "CRED",
    location:    "Bengaluru, India",
    type:        "Full-time",
    remote:      true,
    posted:      "Today",
    salary:      "₹8L - ₹16L/yr",
    skills:      ["SQL", "Python", "Power BI", "Tableau", "Excel"],
    description: "Analyze user behavior data and build dashboards to drive product decisions at CRED.",
    logo:        "C",
    logoColor:   "bg-slate-700",
    applyUrl:    "https://careers.cred.club",
    match:       76,
  },
  {
    id: 9,
    title:       "Software Development Engineer",
    company:     "Infosys",
    location:    "Multiple Cities",
    type:        "Full-time",
    remote:      false,
    posted:      "1 week ago",
    salary:      "₹6L - ₹12L/yr",
    skills:      ["Java", "SQL", "Git", "Agile", "REST API"],
    description: "Work on enterprise software projects for global clients across multiple domains.",
    logo:        "I",
    logoColor:   "bg-teal-600",
    applyUrl:    "https://www.infosys.com/careers",
    match:       70,
  },
  {
    id: 10,
    title:       "Junior ML Engineer",
    company:     "Fractal Analytics",
    location:    "Mumbai, India",
    type:        "Full-time",
    remote:      true,
    posted:      "3 days ago",
    salary:      "₹8L - ₹15L/yr",
    skills:      ["Python", "Machine Learning", "SQL", "Pandas", "Git"],
    description: "Great opportunity for freshers! Work on real ML projects for Fortune 500 clients.",
    logo:        "FA",
    logoColor:   "bg-emerald-600",
    applyUrl:    "https://fractal.ai/careers",
    match:       90,
    fresher:     true,
  },
  {
    id: 11,
    title:       "React Developer",
    company:     "Myntra",
    location:    "Bengaluru, India",
    type:        "Full-time",
    remote:      false,
    posted:      "2 days ago",
    salary:      "₹10L - ₹18L/yr",
    skills:      ["React", "JavaScript", "Node", "MongoDB", "Git"],
    description: "Build beautiful, performant UI for India's leading fashion e-commerce platform.",
    logo:        "My",
    logoColor:   "bg-pink-600",
    applyUrl:    "https://www.myntra.com/careers",
    match:       78,
  },
  {
    id: 12,
    title:       "Cloud Engineer",
    company:     "TCS",
    location:    "Pan India",
    type:        "Full-time",
    remote:      true,
    posted:      "5 days ago",
    salary:      "₹7L - ₹14L/yr",
    skills:      ["AWS", "Azure", "Docker", "Kubernetes", "Python"],
    description: "Work on cloud migration and infrastructure projects for global enterprise clients.",
    logo:        "T",
    logoColor:   "bg-blue-700",
    applyUrl:    "https://ibegin.tcs.com/iBegin",
    match:       73,
  },
]

const MATCH_COLOR = score =>
  score >= 90 ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" :
  score >= 75 ? "text-sky-400 bg-sky-400/10 border-sky-400/20"             :
                "text-amber-400 bg-amber-400/10 border-amber-400/20"

export default function JobListingsPage() {
  const navigate = useNavigate()
  const [profile,    setProfile]    = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState("")
  const [filterType, setFilterType] = useState("All")     // All | Remote | Onsite
  const [sortBy,     setSortBy]     = useState("match")   // match | recent | salary
  const [saved,      setSaved]      = useState([])

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

  function toggleSave(id) {
    setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  // Filter + search + sort
  const userSkills = (profile?.current_skills || []).map(s => s.toLowerCase())

  const filtered = DEMO_JOBS
    .filter(job => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
      const matchesType =
        filterType === "All"    ? true :
        filterType === "Remote" ? job.remote :
        !job.remote
      return matchesSearch && matchesType
    })
    .sort((a, b) =>
      sortBy === "match"  ? b.match - a.match :
      sortBy === "recent" ? a.posted.localeCompare(b.posted) :
      b.salary.localeCompare(a.salary)
    )

  // Calculate real match based on user skills
  function calcMatch(job) {
    if (!userSkills.length) return job.match
    const matched = job.skills.filter(s => userSkills.includes(s.toLowerCase()))
    return Math.round((matched.length / job.skills.length) * 100)
  }

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
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={16}/> Back to Dashboard
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs text-pink-400 uppercase tracking-widest mb-2">Job Listings</p>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Jobs matched to your profile
          </h1>
          <p className="text-slate-400 mt-2">
            {filtered.length} jobs found · Sorted by skill match ·{" "}
            {profile?.city && <span className="text-sky-400">{profile.city}</span>}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Jobs",    value: DEMO_JOBS.length,                              color: "text-sky-400"     },
            { label: "Strong Match",  value: DEMO_JOBS.filter(j => calcMatch(j) >= 80).length, color: "text-emerald-400" },
            { label: "Remote Jobs",   value: DEMO_JOBS.filter(j => j.remote).length,        color: "text-violet-400"  },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#0c1a2e] border border-[#1a3050] rounded-xl p-5 text-center">
              <div className={`font-mono text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-slate-500 text-xs mt-1 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by role, company or skill..."
              className="w-full bg-[#0c1a2e] border border-[#1a3050] rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-400 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {["All", "Remote", "Onsite"].map(type => (
              <button key={type} onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                  filterType === type
                    ? "bg-sky-400/20 border-sky-400/40 text-sky-300"
                    : "bg-[#0c1a2e] border-[#1a3050] text-slate-400 hover:text-white"
                }`}>
                {type === "Remote" && <Wifi size={12} className="inline mr-1" />}
                {type}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="bg-[#0c1a2e] border border-[#1a3050] rounded-xl px-4 py-2 text-slate-300 text-sm focus:outline-none focus:border-sky-400">
            <option value="match">Sort: Best Match</option>
            <option value="recent">Sort: Most Recent</option>
            <option value="salary">Sort: Salary</option>
          </select>
        </div>

        {/* Saved filter */}
        {saved.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-slate-500 text-xs font-mono">
              ⭐ {saved.length} job{saved.length > 1 ? "s" : ""} saved
            </span>
          </div>
        )}

        {/* Job Cards */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Briefcase size={40} className="mx-auto mb-4 opacity-30" />
              <p>No jobs match your search. Try different keywords.</p>
            </div>
          )}

          {filtered.map(job => {
            const matchScore = calcMatch(job)
            const isSaved    = saved.includes(job.id)
            const matchedSkills  = job.skills.filter(s => userSkills.includes(s.toLowerCase()))
            const missingSkills  = job.skills.filter(s => !userSkills.includes(s.toLowerCase()))

            return (
              <div key={job.id}
                className="bg-[#0c1a2e] border border-[#1a3050] rounded-2xl p-6 hover:border-sky-400/30 transition-all group">

                <div className="flex items-start gap-4">

                  {/* Company Logo */}
                  <div className={`w-12 h-12 ${job.logoColor} rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm`}>
                    {job.logo}
                  </div>

                  <div className="flex-1 min-w-0">

                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-white font-bold text-lg">{job.title}</h3>
                          {job.fresher && (
                            <span className="text-xs bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                              Fresher OK
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Building size={13}/> {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={13}/> {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13}/> {job.posted}
                          </span>
                        </div>
                      </div>

                      {/* Match Score */}
                      <div className={`text-center px-3 py-2 rounded-xl border flex-shrink-0 ${MATCH_COLOR(matchScore)}`}>
                        <div className="font-mono font-bold text-lg">{matchScore}%</div>
                        <div className="text-xs opacity-70">match</div>
                      </div>
                    </div>

                    {/* Tags Row */}
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className={`text-xs px-3 py-1 rounded-full border ${
                        job.remote
                          ? "bg-violet-400/10 text-violet-300 border-violet-400/20"
                          : "bg-slate-400/10 text-slate-400 border-slate-400/20"
                      }`}>
                        {job.remote ? "🌐 Remote" : "🏢 Onsite"}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-[#111f33] text-slate-400 border border-[#1a2d45]">
                        {job.type}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 font-mono">
                        {job.salary}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{job.description}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map(skill => {
                        const has = userSkills.includes(skill.toLowerCase())
                        return (
                          <span key={skill}
                            className={`text-xs px-2 py-1 rounded-lg border ${
                              has
                                ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/20"
                                : "bg-red-400/10 text-red-300 border-red-400/20"
                            }`}>
                            {has ? "✓" : "✗"} {skill}
                          </span>
                        )
                      })}
                    </div>

                    {/* Skill summary */}
                    {userSkills.length > 0 && (
                      <p className="text-xs text-slate-500 mb-4">
                        You have <span className="text-emerald-400 font-bold">{matchedSkills.length}</span> of {job.skills.length} required skills
                        {missingSkills.length > 0 && (
                          <span> · Missing: <span className="text-red-400">{missingSkills.join(", ")}</span></span>
                        )}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-sky-400 hover:bg-sky-300 text-[#07101f] font-bold text-sm px-5 py-2 rounded-xl transition-all">
                        Apply Now <ExternalLink size={14}/>
                      </a>
                      <button onClick={() => toggleSave(job.id)}
                        className={`text-sm px-5 py-2 rounded-xl border transition-all ${
                          isSaved
                            ? "bg-amber-400/10 border-amber-400/20 text-amber-400"
                            : "bg-[#0c1a2e] border-[#1a3050] text-slate-400 hover:text-white hover:border-slate-400"
                        }`}>
                        {isSaved ? "⭐ Saved" : "Save Job"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-8 p-5 bg-[#0c1a2e] border border-[#1a3050] rounded-2xl">
          <p className="text-xs text-slate-500 text-center font-mono">
            💼 Jobs are matched based on your profile skills ·
            Green skills = you have it · Red skills = missing ·
            Connect JSearch API for live job data
          </p>
        </div>
      </div>
    </div>
  )
}