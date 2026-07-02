import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/UI';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="flex flex-col items-center text-center">
          <div 
            onClick={() => navigate('/')}
            className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#22C55E] to-emerald-600 flex items-center justify-center font-display font-black text-2xl text-slate-950 shadow-lg shadow-[#22C55E]/20 mb-4 cursor-pointer"
          >
            S
          </div>
          <h2 className="text-2xl font-black font-display text-white mb-1">Reset Password</h2>
          <p className="text-xs text-slate-400">Get a link to reset your account password.</p>
        </div>

        <div className="glass p-8 rounded-3xl border border-slate-800/80 bg-slate-900/10">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <Button type="submit" loading={loading} className="w-full text-xs py-3.5 bg-[#22C55E] hover:bg-[#1db053] text-white">
                Get Reset Link
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="p-3.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-xs font-semibold leading-relaxed">
                A password reset link has been sent to **{email}**.
              </div>
              <Button onClick={() => navigate('/login')} className="w-full text-xs py-3.5 bg-white hover:bg-slate-50 text-[#111827] border border-[#22C55E]" variant="secondary">
                Go to Log In
              </Button>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-slate-400">
          Remember credentials?{' '}
          <Link to="/login" className="text-[#22C55E] hover:text-[#1db053] font-bold decoration-[#22C55E]/20 hover:decoration-[#22C55E] underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
