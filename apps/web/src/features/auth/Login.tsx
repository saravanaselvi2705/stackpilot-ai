import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/UI';
import { IoSparklesSharp, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

export const Login: React.FC = () => {
  const { login, error } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setLoginErr(null);
    try {
      await login(email);
      navigate('/dashboard');
    } catch (err: any) {
      setLoginErr(err.message || 'Incorrect email address.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (testEmail: string) => {
    setEmail(testEmail);
    setLoginErr(null);
  };

  const demoAccounts = [
    { name: 'Super Admin', email: 'alex@stackpilot.ai' },
    { name: 'Project Manager', email: 'sarah@stackpilot.ai' },
    { name: 'Lead Developer', email: 'marcus@stackpilot.ai' },
    { name: 'Finance Lead', email: 'tony@stackpilot.ai' },
    { name: 'Client Account', email: 'guillermo@vercel.com' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center text-center">
          <div 
            onClick={() => navigate('/')}
            className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#22C55E] to-emerald-600 flex items-center justify-center font-display font-black text-2xl text-slate-950 shadow-lg shadow-[#22C55E]/20 mb-4 cursor-pointer"
          >
            S
          </div>
          <h2 className="text-2xl font-black font-display text-white mb-1">Welcome back to StackPilot</h2>
          <p className="text-xs text-slate-400">Enter your email and password to log in.</p>
        </div>

        {/* Card */}
        <div className="glass p-8 rounded-3xl border border-slate-800/80 bg-slate-900/10">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                placeholder="alex@stackpilot.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/20 transition-all"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-[10px] text-[#22C55E] hover:text-[#1db053] font-bold uppercase tracking-wider">Forgot?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-4 pr-12 py-3 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/20 transition-all opacity-80"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#22C55E] cursor-pointer flex items-center justify-center"
                >
                  {showPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                </button>
              </div>
            </div>

            {/* Error notifications */}
            {(loginErr || error) && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-relaxed">
                {loginErr || error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full text-xs py-3.5 bg-[#22C55E] hover:bg-[#1db053] text-white">
              Log In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-x-0 top-2.5 h-[1px] bg-slate-800" />
            <span className="relative bg-[#0b0f19] px-3.5 text-[10px] font-bold uppercase text-slate-500 tracking-widest">
              Demo Quick-Fill
            </span>
          </div>

          {/* Quick-fill accounts */}
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleAutofill(acc.email)}
                className="px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 hover:text-white rounded-xl text-[10px] font-bold transition-all text-left truncate cursor-pointer flex items-center gap-1.5"
              >
                <IoSparklesSharp size={10} className="text-[#22C55E] shrink-0" />
                <span className="truncate">{acc.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#22C55E] hover:text-[#1db053] font-bold decoration-[#22C55E]/20 hover:decoration-[#22C55E] underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
