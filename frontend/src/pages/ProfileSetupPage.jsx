import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { TrendingUp, User, MapPin, GraduationCap, Briefcase, Code } from "lucide-react";

const ALL_SKILLS = ["Python","SQL","Machine Learning","AWS","React","Docker",
  "Kubernetes","Data Engineering","Power BI","Tableau","Azure","Deep Learning",
  "JavaScript","Java","Node.js","MongoDB","FastAPI","Git"];

const STEPS = ["Personal","Location","Education","Employment","Skills"];

export default function ProfileSetupPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [form,    setForm]    = useState({
    full_name: "", age: "", phone: "",
    city: "", state: "", country: "India",
    college_name: "", degree: "", graduation_year: "",
    employment_status: "unemployed", current_company: "",
    years_of_experience: 0, current_skills: [],
    target_role: "", preferred_location: ""
  });

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function toggleSkill(skill) {
    setForm(f => ({
      ...f,
      current_skills: f.current_skills.includes(skill)
        ? f.current_skills.filter(s => s !== skill)
        : [...f.current_skills, skill]
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/profile/setup", {
        ...form,
        age:             form.age ? parseInt(form.age) : null,
        graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
        years_of_experience: parseInt(form.years_of_experience) || 0,
      });
      toast.success("Profile saved! Welcome to SkillForecast 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full bg-[#0c1a2e] border border-[#1a3050] rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-400 transition-colors";
  const labelCls = "block text-xs text-slate-400 font-mono uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-[#07101f] flex items-center justify-center p-8">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-sky-400 rounded-lg flex items-center justify-center">
            <TrendingUp size={18} className="text-[#07101f]" />
          </div>
          <span className="font-mono text-sky-400 font-semibold text-sm tracking-widest">SKILLFORECAST</span>
        </div>

        <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
          Setup your profile
        </h2>
        <p className="text-slate-500 mb-8">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-sky-400" : "bg-[#1a3050]"}`} />
          ))}
        </div>

        {/* Step 0 — Personal */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sky-400 mb-4">
              <User size={18}/> <span className="font-mono text-sm uppercase tracking-widest">Personal Info</span>
            </div>
            <div>
              <label className={labelCls}>Full Name *</label>
              <input name="full_name" value={form.full_name} onChange={handleChange}
                placeholder="Your full name" className={inputCls} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Age</label>
                <input name="age" type="number" value={form.age} onChange={handleChange}
                  placeholder="22" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+91 9999999999" className={inputCls} />
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Location */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sky-400 mb-4">
              <MapPin size={18}/> <span className="font-mono text-sm uppercase tracking-widest">Location</span>
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input name="city" value={form.city} onChange={handleChange}
                placeholder="Bengaluru" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>State</label>
                <input name="state" value={form.state} onChange={handleChange}
                  placeholder="Karnataka" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <input name="country" value={form.country} onChange={handleChange}
                  placeholder="India" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Preferred Job Location</label>
              <input name="preferred_location" value={form.preferred_location} onChange={handleChange}
                placeholder="Remote / Bengaluru / Mumbai" className={inputCls} />
            </div>
          </div>
        )}

        {/* Step 2 — Education */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sky-400 mb-4">
              <GraduationCap size={18}/> <span className="font-mono text-sm uppercase tracking-widest">Education</span>
            </div>
            <div>
              <label className={labelCls}>College / University</label>
              <input name="college_name" value={form.college_name} onChange={handleChange}
                placeholder="VTU, Anna University..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Degree</label>
              <input name="degree" value={form.degree} onChange={handleChange}
                placeholder="B.Tech Computer Science" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Graduation Year</label>
              <input name="graduation_year" type="number" value={form.graduation_year} onChange={handleChange}
                placeholder="2025" className={inputCls} />
            </div>
          </div>
        )}

        {/* Step 3 — Employment */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sky-400 mb-4">
              <Briefcase size={18}/> <span className="font-mono text-sm uppercase tracking-widest">Employment</span>
            </div>
            <div>
              <label className={labelCls}>Employment Status *</label>
              <select name="employment_status" value={form.employment_status} onChange={handleChange}
                className={inputCls}>
                <option value="unemployed">Unemployed — Looking for work</option>
                <option value="employed">Employed</option>
                <option value="student">Student</option>
                <option value="freelancer">Freelancer</option>
              </select>
            </div>
            {form.employment_status === "employed" && (
              <div>
                <label className={labelCls}>Current Company</label>
                <input name="current_company" value={form.current_company} onChange={handleChange}
                  placeholder="Company name" className={inputCls} />
              </div>
            )}
            <div>
              <label className={labelCls}>Years of Experience</label>
              <select name="years_of_experience" value={form.years_of_experience} onChange={handleChange}
                className={inputCls}>
                {[0,1,2,3,4,5,6,7,8,9,10].map(y => (
                  <option key={y} value={y}>{y === 0 ? "Fresher (0 years)" : `${y} year${y>1?"s":""}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Target Job Role</label>
              <input name="target_role" value={form.target_role} onChange={handleChange}
                placeholder="Data Engineer, ML Engineer, SDE..." className={inputCls} />
            </div>
          </div>
        )}

        {/* Step 4 — Skills */}
        {step === 4 && (
          <div>
            <div className="flex items-center gap-2 text-sky-400 mb-4">
              <Code size={18}/> <span className="font-mono text-sm uppercase tracking-widest">Your Current Skills</span>
            </div>
            <p className="text-slate-500 text-sm mb-4">Select all skills you already know:</p>
            <div className="flex flex-wrap gap-2">
              {ALL_SKILLS.map(skill => {
                const selected = form.current_skills.includes(skill);
                return (
                  <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selected
                        ? "bg-sky-400 text-[#07101f] border-sky-400"
                        : "bg-[#0c1a2e] text-slate-400 border-[#1a3050] hover:border-sky-400"
                    }`}>
                    {skill}
                  </button>
                );
              })}
            </div>
            {form.current_skills.length > 0 && (
              <p className="text-emerald-400 text-xs mt-4 font-mono">
                ✓ {form.current_skills.length} skill{form.current_skills.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 border border-[#1a3050] text-slate-400 hover:text-white hover:border-slate-400 py-3 rounded-xl text-sm transition-all">
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={() => {
              if (step === 0 && !form.full_name) { toast.error("Full name is required!"); return; }
              setStep(s => s + 1);
            }}
              className="flex-1 bg-sky-400 hover:bg-sky-300 text-[#07101f] font-bold py-3 rounded-xl text-sm transition-all">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 bg-sky-400 hover:bg-sky-300 text-[#07101f] font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50">
              {loading ? "Saving..." : "Complete Profile 🎉"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}