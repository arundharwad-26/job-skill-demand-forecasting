import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, TrendingUp, CheckCircle, XCircle } from "lucide-react";

function Rule({ met, text }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${met ? "text-emerald-400" : "text-slate-500"}`}>
      {met ? <CheckCircle size={12}/> : <XCircle size={12}/>} {text}
    </div>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "", confirm: "" });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);

  const pwd   = form.password;
  const rules = {
    length:    pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    number:    /[0-9]/.test(pwd),
    special:   /[!@#$%^&*]/.test(pwd),
    match:     pwd === form.confirm && pwd.length > 0,
  };
  const allValid = Object.values(rules).every(Boolean);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!allValid) { toast.error("Fix password requirements first."); return; }
    setLoading(true);
    try {
      await register(form.email, form.password);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07101f] flex items-center justify-center p-8">
      <div className="w-full max-w-md">

        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-sky-400 rounded-lg flex items-center justify-center">
            <TrendingUp size={18} className="text-[#07101f]" />
          </div>
          <span className="font-mono text-sky-400 font-semibold text-sm tracking-widest">SKILLFORECAST</span>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
          Create account
        </h2>
        <p className="text-slate-500 mb-8">Free forever. No credit card needed.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-slate-400 font-mono uppercase tracking-widest mb-2">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" name="email" required
                value={form.email} onChange={handleChange} placeholder="you@example.com"
                className="w-full bg-[#0c1a2e] border border-[#1a3050] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-400 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-mono uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type={show ? "text" : "password"} name="password" required
                value={form.password} onChange={handleChange} placeholder="Create a strong password"
                className="w-full bg-[#0c1a2e] border border-[#1a3050] rounded-xl pl-11 pr-12 py-3.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-400 transition-colors" />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {show ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
            {form.password && (
              <div className="mt-3 grid grid-cols-2 gap-1.5 p-3 bg-[#0a1420] rounded-lg border border-[#1a3050]">
                <Rule met={rules.length}    text="8+ characters" />
                <Rule met={rules.uppercase} text="Uppercase letter" />
                <Rule met={rules.number}    text="One number" />
                <Rule met={rules.special}   text="Special character" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-mono uppercase tracking-widest mb-2">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="password" name="confirm" required
                value={form.confirm} onChange={handleChange} placeholder="Re-enter password"
                className={`w-full bg-[#0c1a2e] border rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-slate-600 focus:outline-none transition-colors ${
                  form.confirm ? (rules.match ? "border-emerald-500" : "border-red-500") : "border-[#1a3050] focus:border-sky-400"
                }`} />
            </div>
          </div>

          <button type="submit" disabled={loading || !allValid}
            className="w-full bg-sky-400 hover:bg-sky-300 text-[#07101f] font-bold py-3.5 rounded-xl transition-all text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-400 hover:text-sky-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}