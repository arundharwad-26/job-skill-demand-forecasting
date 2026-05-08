import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  TrendingUp, ArrowLeft, Upload, FileText,
  CheckCircle, XCircle, AlertCircle, Star
} from "lucide-react"

const MARKET_KEYWORDS = [
  { word: "Python",           category: "Language",    jobs: 420, importance: "Critical" },
  { word: "SQL",              category: "Language",    jobs: 380, importance: "Critical" },
  { word: "JavaScript",       category: "Language",    jobs: 310, importance: "High"     },
  { word: "Java",             category: "Language",    jobs: 280, importance: "High"     },
  { word: "Machine Learning", category: "AI/ML",       jobs: 290, importance: "Critical" },
  { word: "Deep Learning",    category: "AI/ML",       jobs: 130, importance: "High"     },
  { word: "TensorFlow",       category: "AI/ML",       jobs: 110, importance: "Medium"   },
  { word: "PyTorch",          category: "AI/ML",       jobs: 95,  importance: "Medium"   },
  { word: "AWS",              category: "Cloud",       jobs: 265, importance: "Critical" },
  { word: "Azure",            category: "Cloud",       jobs: 160, importance: "High"     },
  { word: "Docker",           category: "DevOps",      jobs: 240, importance: "Critical" },
  { word: "Kubernetes",       category: "DevOps",      jobs: 185, importance: "High"     },
  { word: "Git",              category: "Tools",       jobs: 350, importance: "Critical" },
  { word: "React",            category: "Frontend",    jobs: 220, importance: "High"     },
  { word: "Node",             category: "Backend",     jobs: 190, importance: "High"     },
  { word: "FastAPI",          category: "Backend",     jobs: 95,  importance: "Medium"   },
  { word: "MongoDB",          category: "Database",    jobs: 120, importance: "Medium"   },
  { word: "PostgreSQL",       category: "Database",    jobs: 140, importance: "Medium"   },
  { word: "Data Engineering", category: "Data",        jobs: 210, importance: "Critical" },
  { word: "Power BI",         category: "Analytics",   jobs: 175, importance: "High"     },
  { word: "Tableau",          category: "Analytics",   jobs: 140, importance: "High"     },
  { word: "Pandas",           category: "Data",        jobs: 160, importance: "High"     },
  { word: "NumPy",            category: "Data",        jobs: 140, importance: "Medium"   },
  { word: "Spark",            category: "Data",        jobs: 130, importance: "Medium"   },
  { word: "Kafka",            category: "Data",        jobs: 100, importance: "Medium"   },
  { word: "Developed",        category: "Action",      jobs: 500, importance: "High"     },
  { word: "Implemented",      category: "Action",      jobs: 480, importance: "High"     },
  { word: "Designed",         category: "Action",      jobs: 420, importance: "High"     },
  { word: "Optimized",        category: "Action",      jobs: 380, importance: "High"     },
  { word: "Collaborated",     category: "Soft Skill",  jobs: 350, importance: "Medium"   },
  { word: "Leadership",       category: "Soft Skill",  jobs: 300, importance: "Medium"   },
  { word: "Agile",            category: "Methodology", jobs: 260, importance: "High"     },
  { word: "REST API",         category: "Backend",     jobs: 220, importance: "High"     },
  { word: "CI/CD",            category: "DevOps",      jobs: 200, importance: "High"     },
  { word: "Microservices",    category: "Backend",     jobs: 180, importance: "High"     },
]

const IMPORTANCE_COLOR = {
  Critical: "text-red-400 bg-red-400/10 border-red-400/20",
  High:     "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Medium:   "text-sky-400 bg-sky-400/10 border-sky-400/20",
}

const CATEGORY_COLOR = {
  "Language":    "bg-violet-400/10 text-violet-300",
  "AI/ML":       "bg-pink-400/10 text-pink-300",
  "Cloud":       "bg-sky-400/10 text-sky-300",
  "DevOps":      "bg-orange-400/10 text-orange-300",
  "Tools":       "bg-slate-400/10 text-slate-300",
  "Frontend":    "bg-cyan-400/10 text-cyan-300",
  "Backend":     "bg-emerald-400/10 text-emerald-300",
  "Database":    "bg-yellow-400/10 text-yellow-300",
  "Data":        "bg-blue-400/10 text-blue-300",
  "Analytics":   "bg-rose-400/10 text-rose-300",
  "Action":      "bg-teal-400/10 text-teal-300",
  "Soft Skill":  "bg-purple-400/10 text-purple-300",
  "Methodology": "bg-lime-400/10 text-lime-300",
}

function getScoreInfo(score) {
  if (score >= 80) return { label: "Excellent Resume 🏆", color: "text-emerald-400", bg: "bg-emerald-400" }
  if (score >= 60) return { label: "Good Resume 👍",       color: "text-sky-400",     bg: "bg-sky-400"     }
  if (score >= 40) return { label: "Needs Improvement 📝", color: "text-amber-400",   bg: "bg-amber-400"   }
  return                  { label: "Needs Major Work 🔧",   color: "text-red-400",     bg: "bg-red-400"     }
}

function analyzeResume(text) {
  const lower   = text.toLowerCase()
  const found   = []
  const missing = []

  MARKET_KEYWORDS.forEach(kw => {
    if (lower.includes(kw.word.toLowerCase())) found.push(kw)
    else                                        missing.push(kw)
  })

  const maxScore = MARKET_KEYWORDS.reduce((sum, kw) =>
    sum + (kw.importance === "Critical" ? 4 : kw.importance === "High" ? 2 : 1), 0)

  const gotScore = found.reduce((sum, kw) =>
    sum + (kw.importance === "Critical" ? 4 : kw.importance === "High" ? 2 : 1), 0)

  const score           = Math.round((gotScore / maxScore) * 100)
  const criticalMissing = missing.filter(k => k.importance === "Critical")
  const highMissing     = missing.filter(k => k.importance === "High")

  return { found, missing, score, criticalMissing, highMissing }
}

export default function ResumeMatcherPage() {
  const navigate = useNavigate()
  const [resumeText,   setResumeText]   = useState("")
  const [fileName,     setFileName]     = useState("")
  const [analyzing,    setAnalyzing]    = useState(false)
  const [results,      setResults]      = useState(null)
  const [dragOver,     setDragOver]     = useState(false)
  const [activeFilter, setActiveFilter] = useState("All")

  async function extractTextFromPDF(file) {
    const pdfjsLib = await import("pdfjs-dist")
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString()
    const arrayBuffer = await file.arrayBuffer()
    const pdf         = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let   fullText    = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      const page    = await pdf.getPage(i)
      const content = await page.getTextContent()
      fullText += content.items.map(item => item.str).join(" ") + " "
    }
    return fullText
  }

  async function handleFile(file) {
    if (!file) return
    if (!file.type.includes("pdf") && !file.type.includes("text")) {
      alert("Please upload a PDF or TXT file.")
      return
    }
    setFileName(file.name)
    setAnalyzing(true)
    setResults(null)
    try {
      let text = file.type.includes("pdf")
        ? await extractTextFromPDF(file)
        : await file.text()
      setResumeText(text)
      await new Promise(r => setTimeout(r, 1000))
      setResults(analyzeResume(text))
    } catch (err) {
      console.error(err)
      alert("Could not read PDF. Please paste your resume text below instead.")
    } finally {
      setAnalyzing(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  function handleManualAnalyze() {
    if (!resumeText.trim()) return
    setAnalyzing(true)
    setTimeout(() => {
      setResults(analyzeResume(resumeText))
      setAnalyzing(false)
      setFileName("Pasted text")
    }, 800)
  }

  const categories      = ["All", ...new Set(MARKET_KEYWORDS.map(k => k.category))]
  const filteredFound   = results?.found.filter(k => activeFilter === "All" || k.category === activeFilter) || []
  const filteredMissing = results?.missing.filter(k => activeFilter === "All" || k.category === activeFilter) || []
  const scoreInfo       = results ? getScoreInfo(results.score) : null

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

        <div className="mb-8">
          <p className="font-mono text-xs text-pink-400 uppercase tracking-widest mb-2">Resume Keyword Matcher</p>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Does your resume match the market?
          </h1>
          <p className="text-slate-400 mt-2">
            Upload your resume and we'll check it against {MARKET_KEYWORDS.length} trending job keywords.
          </p>
        </div>

        {/* Upload Area */}
        {!results && (
          <div className="space-y-6">
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("resumeInput").click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                dragOver ? "border-pink-400 bg-pink-400/5" : "border-[#1a3050] hover:border-pink-400/40"
              }`}>
              <input id="resumeInput" type="file" accept=".pdf,.txt"
                className="hidden" onChange={e => handleFile(e.target.files[0])} />
              <div className="w-16 h-16 bg-pink-400/10 border border-pink-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload size={28} className="text-pink-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">
                {analyzing ? "Analyzing your resume..." : "Drop your resume here"}
              </h3>
              <p className="text-slate-500 text-sm mb-4">Supports PDF and TXT files</p>
              {analyzing
                ? <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-pink-400 text-sm">Reading {fileName}...</span>
                  </div>
                : <span className="bg-pink-400/10 border border-pink-400/20 text-pink-400 text-sm px-6 py-2 rounded-xl">
                    Browse File
                  </span>
              }
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#1a3050]" />
              <span className="text-slate-600 text-xs font-mono">OR PASTE RESUME TEXT</span>
              <div className="flex-1 h-px bg-[#1a3050]" />
            </div>

            <div>
              <textarea
                value={resumeText} onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your resume text here and click Analyze..."
                rows={8}
                className="w-full bg-[#0c1a2e] border border-[#1a3050] rounded-2xl p-5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-pink-400 transition-colors resize-none font-mono"
              />
              <button onClick={handleManualAnalyze}
                disabled={!resumeText.trim() || analyzing}
                className="mt-3 w-full bg-pink-400/10 hover:bg-pink-400/20 border border-pink-400/20 text-pink-400 font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                {analyzing ? "Analyzing..." : "Analyze Resume Text →"}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div>
            {/* Score Card */}
            <div className="bg-gradient-to-r from-[#0c1a2e] to-[#0d2137] border border-[#1a3050] rounded-2xl p-8 mb-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center flex-shrink-0">
                  <div className={`text-8xl font-bold font-mono ${scoreInfo.color}`}>{results.score}</div>
                  <div className="text-slate-400 text-sm mt-1">out of 100</div>
                  <div className={`mt-2 font-bold ${scoreInfo.color}`}>{scoreInfo.label}</div>
                </div>
                <div className="flex-1 w-full">
                  <div className="w-full bg-[#111f33] rounded-full h-3 mb-6 overflow-hidden">
                    <div className={`h-3 rounded-full transition-all duration-1000 ${scoreInfo.bg}`}
                      style={{ width: `${results.score}%` }} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { val: results.found.length,           label: "Keywords Found",   color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
                      { val: results.missing.length,         label: "Keywords Missing", color: "text-red-400",     bg: "bg-red-400/10 border-red-400/20"         },
                      { val: results.criticalMissing.length, label: "Critical Missing", color: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/20"     },
                    ].map(({ val, label, color, bg }) => (
                      <div key={label} className={`border rounded-xl p-4 text-center ${bg}`}>
                        <div className={`text-2xl font-bold font-mono ${color}`}>{val}</div>
                        <div className="text-xs text-slate-500 mt-1">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText size={14} className="text-slate-500" />
                    <span className="text-slate-500 text-xs">{fileName}</span>
                    <button onClick={() => { setResults(null); setResumeText(""); setFileName("") }}
                      className="ml-auto text-xs text-pink-400 hover:text-pink-300 border border-pink-400/20 px-3 py-1 rounded-lg transition-colors">
                      Try Another Resume
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Alert */}
            {results.criticalMissing.length > 0 && (
              <div className="bg-red-400/10 border border-red-400/20 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={16} className="text-red-400" />
                  <span className="font-mono text-xs text-red-400 uppercase tracking-widest">
                    Critical Keywords Missing — Add These Immediately
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.criticalMissing.map(k => (
                    <span key={k.word} className="px-3 py-1.5 bg-red-400/10 border border-red-400/30 text-red-300 rounded-full text-sm font-medium">
                      + {k.word}
                    </span>
                  ))}
                </div>
                <p className="text-slate-500 text-xs mt-3">
                  Adding these keywords could increase your interview callbacks by up to 60%
                </p>
              </div>
            )}

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeFilter === cat
                      ? "bg-pink-400/20 border-pink-400/40 text-pink-300"
                      : "bg-[#0c1a2e] border-[#1a3050] text-slate-400 hover:text-white"
                  }`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Found + Missing */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {[
                { title: `Found in Resume (${filteredFound.length})`,   icon: CheckCircle, color: "text-emerald-400", items: filteredFound,   iconColor: "text-emerald-400", emptyMsg: "No matches in this category" },
                { title: `Missing Keywords (${filteredMissing.length})`, icon: XCircle,     color: "text-red-400",     items: filteredMissing.sort((a,b) => ({Critical:0,High:1,Medium:2}[a.importance] - {Critical:0,High:1,Medium:2}[b.importance])), iconColor: "text-red-400", emptyMsg: "All keywords found! 🎉" },
              ].map(({ title, icon: Icon, color, items, iconColor, emptyMsg }) => (
                <div key={title} className="bg-[#0c1a2e] border border-[#1a3050] rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Icon size={16} className={color} />
                    <span className={`font-mono text-xs uppercase tracking-widest ${color}`}>{title}</span>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {items.length === 0
                      ? <p className="text-slate-600 text-sm text-center py-4">{emptyMsg}</p>
                      : items.map(kw => (
                          <div key={kw.word} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#08131f] border border-[#1a2d45]">
                            <div className="flex items-center gap-2">
                              <Icon size={13} className={iconColor} />
                              <span className="text-white text-sm">{kw.word}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded-md font-mono ${CATEGORY_COLOR[kw.category] || "text-slate-400"}`}>
                                {kw.category}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${IMPORTANCE_COLOR[kw.importance]}`}>
                                {kw.importance}
                              </span>
                            </div>
                          </div>
                        ))
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-[#0c1a2e] border border-[#1a3050] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} className="text-amber-400" />
                <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
                  How to Improve Your Resume Score
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-400">
                <div className="space-y-2">
                  <p>✅ Add missing Critical keywords in your experience section</p>
                  <p>✅ Use exact spellings — "Docker" not "docker"</p>
                  <p>✅ Add a dedicated Skills section listing all tools</p>
                </div>
                <div className="space-y-2">
                  <p>✅ Use action words — "Developed", "Implemented", "Optimized"</p>
                  <p>✅ Mention "Agile", "CI/CD", "Microservices" if applicable</p>
                  <p>✅ Aim for 70+ score before applying to jobs</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}