import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Axios interceptor will handle displaying standard messages
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-[#f8fafc] dark:bg-[#0b0f19] overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-brand-500/5 dark:bg-brand-500/10 rounded-full glow-bg-primary pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full glow-bg-secondary pointer-events-none" />

      <div className="z-10 w-full max-w-md rounded-2xl glass-card p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
            MediCure
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your personal AI healthcare engine
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-3xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-xs focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-3xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-xs focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-xs font-semibold text-white shadow-md shadow-brand-500/20 hover:bg-brand-600 disabled:opacity-50 transition-all focus:outline-none"
          >
            {isSubmitting ? 'Verifying credentials...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-8 text-center text-2xs text-slate-500 dark:text-slate-450">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-500 hover:underline dark:text-brand-400">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
