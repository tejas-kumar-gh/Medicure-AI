import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    setIsSubmitting(true);
    try {
      await register(name, email, password);
      // Direct new user to setup their health profile immediately
      navigate('/profile');
    } catch (err) {
      // Handled globally in Axios interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-[#f8fafc] dark:bg-[#0b0f19] overflow-hidden">
      {/* Decorative Blur Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-brand-500/5 dark:bg-brand-500/10 rounded-full glow-bg-primary pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full glow-bg-secondary pointer-events-none" />

      <div className="z-10 w-full max-w-md rounded-2xl glass-card p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
            MediCure
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Sign up to build your physical profile and consult our AI engine
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-3xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-xs focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-3xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
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
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
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

          <div>
            <label className="block text-3xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isSubmitting ? 'Registering account...' : 'Create Account'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-2xs text-slate-500 dark:text-slate-450">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-500 hover:underline dark:text-brand-400">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
