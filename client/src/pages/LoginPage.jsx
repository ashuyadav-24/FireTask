import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 items-center justify-center text-white shadow-md shadow-emerald-500/20 mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back to HostelCart
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Log in to coordinate quick-commerce orders in your hostel
          </p>
        </div>

        {/* Demo Accounts Helper Card */}
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Quick Demo Login (Pre-configured NIT JSR Students):
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('aman.kumar@nitjsr.ac.in')}
              className="p-2 text-left bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all font-medium text-slate-700"
            >
              <div className="font-bold text-emerald-900">Aman Kumar</div>
              <div className="text-[11px] text-slate-500">B.Tech 4th Yr • Hostel K</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('ashutosh.yadav@nitjsr.ac.in')}
              className="p-2 text-left bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all font-medium text-slate-700"
            >
              <div className="font-bold text-emerald-900">Ashutosh Yadav</div>
              <div className="text-[11px] text-slate-500">MCA 2nd Yr • Hostel J</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('siddharth@nitjsr.ac.in')}
              className="p-2 text-left bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all font-medium text-slate-700"
            >
              <div className="font-bold text-emerald-900">Siddharth</div>
              <div className="text-[11px] text-slate-500">B.Tech 3rd Yr • Hostel J</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('priyaranjan@nitjsr.ac.in')}
              className="p-2 text-left bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all font-medium text-slate-700"
            >
              <div className="font-bold text-emerald-900">Priyaranjan</div>
              <div className="text-[11px] text-slate-500">M.Tech 1st Yr • Hostel L</div>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              College Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@nitjsr.ac.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition-all disabled:opacity-50 text-sm shadow-sm"
          >
            {loading ? 'Logging in...' : 'Sign In to HostelCart'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">Don't have an account yet? </span>
            <Link to="/register" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
