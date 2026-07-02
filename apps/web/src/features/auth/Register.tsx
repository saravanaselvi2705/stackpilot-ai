import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/UI';
import type { UserRole } from '../../../../../packages/shared/types';

export const Register: React.FC = () => {
  const { register, error } = useAuth();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<UserRole>('Developer');
  const [loading, setLoading] = useState<boolean>(false);
  const [regErr, setRegErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    setRegErr(null);
    try {
      await register(name, email, role);
      navigate('/dashboard');
    } catch (err: any) {
      setRegErr(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const roles: UserRole[] = [
    'Super Admin',
    'Admin',
    'Project Manager',
    'Business Analyst',
    'Developer',
    'Tester',
    'SEO Executive',
    'Finance',
    'Client'
  ];

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
          <h2 className="text-2xl font-black font-display text-white mb-1">Create Account</h2>
          <p className="text-xs text-slate-400">Start setting up your company profile.</p>
        </div>

        <div className="glass p-8 rounded-3xl border border-slate-800/80 bg-slate-900/10">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                placeholder="Marcus Aurelius"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                placeholder="marcus@stackpilot.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/20 transition-all cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r} value={r} className="bg-slate-950 text-slate-100">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {(regErr || error) && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-relaxed">
                {regErr || error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full text-xs py-3.5 bg-[#22C55E] hover:bg-[#1db053] text-white">
              Create Account & Log In
            </Button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#22C55E] hover:text-[#1db053] font-bold decoration-[#22C55E]/20 hover:decoration-[#22C55E] underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Register;
