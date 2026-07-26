import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/UI';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

const Login: React.FC = () => {
  const { login, error } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginErr, setLoginErr] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setLoginErr(null);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setLoginErr(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">

          <div
            onClick={() => navigate('/')}
            className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold cursor-pointer shadow-lg"
          >
            S
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Sign in using your registered office email.
          </p>

        </div>

        {/* Card */}

        <div className="bg-white rounded-3xl shadow-xl border p-8">

          <form onSubmit={handleLogin} className="space-y-5">

            <div>

              <label className="block text-xs font-semibold mb-2 text-slate-600">
                Office Email
              </label>

              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
              />

            </div>

            <div>

              <div className="flex justify-between items-center mb-2">

                <label className="text-xs font-semibold text-slate-600">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs text-green-600 hover:underline"
                >
                  Forgot Password?
                </Link>

              </div>

              <div className="relative">

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-green-500 outline-none"
                />

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </button>

              </div>

            </div>

            {(loginErr || error) && (

              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">

                {loginErr || error}

              </div>

            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3"
            >
              Sign In
            </Button>

          </form>

        </div>

        {/* Footer */}

        <div className="mt-6 text-center text-sm text-slate-500">

          Need an account?

          <br />

          Please contact your system administrator.

        </div>

      </div>

    </div>
  );
};

export default Login;