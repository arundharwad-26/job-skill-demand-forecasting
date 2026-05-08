import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate(data.profile_complete ? "/dashboard" : "/profile-setup");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07101f] flex">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-[#1a3050]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sky-400 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-[#07101f]" />
          </div>
          <span className="font-mono text-sky-400 font-semibold tracking-widest text-sm">SKILLFORECAST</span>
        </div>

        <div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "'Syne', sans-serif" }}>
            Know what skills<br />
            <span className="text-sky-400">the market needs</span><br />
            before others do.
          </h1>
          <p className="text-slate-400 text-lg">
            AI-powered job skill demand forecasting. Stop guessing what to learn next.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[["3,800+","Job postings"],["12","Skills tracked"],["4 wks","Ahead forecast"]].map(([val, lbl]) => (
            <div key={lbl} className="bg-[#0c1a2e] border border-[#1a3050] rounded-xl p-4">
              <div className="font-mono text-sky-400 text-xl font-bold">{val}</div>
              <div className="text-slate-500 text-xs mt-1">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-sky-400 rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-[#07101f]" />
            </div>
            <span className="font-mono text-sky-400 font-semibold text-sm tracking-widest">SKILLFORECAST</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            Sign in
          </h2>
          <p className="text-slate-500 mb-8">Welcome back. Let's check today's demand.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-slate-400 font-mono uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" name="email" required
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-[#0c1a2e] border border-[#1a3050] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-400 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-mono uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type={show ? "text" : "password"} name="password" required
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#0c1a2e] border border-[#1a3050] rounded-xl pl-11 pr-12 py-3.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-400 transition-colors" />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-sky-400 hover:bg-sky-300 text-[#07101f] font-bold py-3.5 rounded-xl transition-all text-sm tracking-wide disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-sky-400 hover:text-sky-300 font-medium">Create one free</Link>
          </p>

          <div className="mt-8 p-4 bg-[#0c1a2e] border border-[#1a3050] rounded-xl">
            <p className="text-xs text-slate-500 text-center">
              🔒 Passwords are encrypted. Account locks after 5 failed attempts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}