import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Flame,
  Droplet,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  UserSquare2,
  BarChart3,
  MessageSquare,
  Zap,
  Shield,
  ChevronRight,
  Bot,
  Send,
} from 'lucide-react';

/* ─────────────────────────────────────────
   Tiny scroll-reveal hook
   ───────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

/* ─────────────────────────────────────────
   Reusable fade-in wrapper
   ───────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   Mock chat messages for AI spotlight
   ───────────────────────────────────────── */
const MOCK_CHAT = [
  { role: 'user', text: 'What should I eat to hit my calorie goal?' },
  {
    role: 'ai',
    text: "Based on your 2,100 kcal target, focus on lean proteins like chicken or tofu, complex carbs like oats and brown rice, and healthy fats from avocado or nuts. Aim for 5–6 small meals spread evenly throughout the day.",
  },
  { role: 'user', text: 'How much water do I need daily?' },
  {
    role: 'ai',
    text: 'Given your activity level, I recommend 3.2 L per day. Spread it across your meals and workouts — hydrating before and after exercise is especially important for recovery.',
  },
];

/* ═══════════════════════════════════════════
   HOME PAGE COMPONENT
   ═══════════════════════════════════════════ */
export const Home = () => {
  // Apply dark mode on mount (matching app default)
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (!stored) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (stored === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f8fafc] text-slate-800 dark:bg-[#0b0f19] dark:text-slate-100">

      {/* ── Ambient background glows ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[50rem] w-[50rem] rounded-full bg-brand-500/5 dark:bg-brand-500/10 glow-bg-primary" />
        <div className="absolute -bottom-40 -right-40 h-[50rem] w-[50rem] rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 glow-bg-secondary" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[30rem] w-[60rem] rounded-full bg-violet-500/3 dark:bg-violet-500/5 glow-bg-primary" />
      </div>

      {/* ══════════════════════════════════════
          NAVBAR
          ══════════════════════════════════════ */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between px-6 md:px-12 glass-panel">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-transparent">
            MediCure
          </span>
          <span className="hidden sm:inline-block rounded-full bg-brand-100/80 px-2.5 py-0.5 text-[10px] font-semibold text-brand-600 dark:bg-brand-950/60 dark:text-brand-300">
            AI Assistant
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors focus:outline-none"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-brand-500/20 hover:bg-brand-600 transition-colors focus:outline-none"
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </header>

      {/* ══════════════════════════════════════
          1. HERO SECTION
          ══════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center md:pt-32 md:pb-28">
        {/* Badge */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-brand-50/80 px-4 py-1.5 dark:border-brand-800/40 dark:bg-brand-950/40"
          style={{ animation: 'fadeIn 0.6s ease both' }}
        >
          <Sparkles className="h-3.5 w-3.5 text-brand-500" />
          <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-300">
            Powered by Gemini AI
          </span>
        </div>

        {/* Headline */}
        <h1
          className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
          style={{ animation: 'fadeIn 0.7s ease 0.1s both' }}
        >
          Your Personal{' '}
          <span className="bg-gradient-to-r from-brand-500 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            AI Health
          </span>{' '}
          Companion
        </h1>

        {/* Sub-headline */}
        <p
          className="mt-5 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base"
          style={{ animation: 'fadeIn 0.7s ease 0.2s both' }}
        >
          MediCure computes your BMI, daily calorie targets, and hydration goals — then delivers personalized wellness guidance through a Gemini-powered AI chatbot.
        </p>

        {/* CTA buttons */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ animation: 'fadeIn 0.7s ease 0.3s both' }}
        >
          <Link
            to="/register"
            id="hero-cta-register"
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 hover:shadow-brand-500/40 transition-all focus:outline-none"
          >
            Start for Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            id="hero-cta-login"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-white dark:border-slate-700/60 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:bg-slate-800/70 transition-all focus:outline-none"
          >
            Sign In
          </Link>
        </div>

        {/* Trust signals */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-5 text-[11px] text-slate-400 dark:text-slate-500"
          style={{ animation: 'fadeIn 0.7s ease 0.45s both' }}
        >
          {['Free to use', 'No credit card needed', 'Secured with JWT + HTTPS'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              {t}
            </span>
          ))}
        </div>

        {/* Hero stats bar */}
        <div
          className="mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-200/60 shadow-sm dark:border-slate-700/40 dark:bg-slate-700/30 max-w-lg w-full"
          style={{ animation: 'fadeIn 0.7s ease 0.55s both' }}
        >
          {[
            { label: 'BMI Analysis', icon: Activity, color: 'text-brand-500' },
            { label: 'Calorie Targets', icon: Flame, color: 'text-orange-500' },
            { label: 'Hydration Goals', icon: Droplet, color: 'text-blue-500' },
          ].map(({ label, icon: Icon, color }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 bg-white/80 py-4 dark:bg-[#0d1321]/80">
              <Icon className={`h-5 w-5 ${color}`} />
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. FEATURES SECTION
          ══════════════════════════════════════ */}
      <section id="features" className="relative z-10 px-6 py-20 md:px-12 lg:px-20">
        <Reveal className="mb-12 text-center">
          <span className="inline-block rounded-full border border-slate-200/60 bg-slate-100/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-400 mb-4">
            Features
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything you need to stay{' '}
            <span className="bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-transparent">
              healthy
            </span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm text-slate-500 dark:text-slate-400">
            One platform. Four health pillars. Fully personalized to your body and goals.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {[
            {
              icon: Activity,
              iconBg: 'bg-brand-100 dark:bg-brand-950/40',
              iconColor: 'text-brand-500',
              title: 'BMI Analysis',
              desc: 'Instantly calculate your Body Mass Index and understand your weight category with color-coded health indicators.',
              delay: 0,
            },
            {
              icon: Flame,
              iconBg: 'bg-orange-100 dark:bg-orange-950/30',
              iconColor: 'text-orange-500',
              title: 'Calorie Targeting',
              desc: 'Get a precise daily calorie goal computed from your BMR and TDEE, adjusted for your specific fitness objective.',
              delay: 80,
            },
            {
              icon: Droplet,
              iconBg: 'bg-blue-100 dark:bg-blue-950/30',
              iconColor: 'text-blue-500',
              title: 'Hydration Goals',
              desc: 'Receive a personalized daily water intake target that accounts for your body weight and activity level.',
              delay: 160,
            },
            {
              icon: Sparkles,
              iconBg: 'bg-violet-100 dark:bg-violet-950/30',
              iconColor: 'text-violet-500',
              title: 'AI Health Chat',
              desc: 'Ask our Gemini-powered AI anything about diet, workouts, sleep, or recovery and get instant expert-level answers.',
              delay: 240,
            },
          ].map(({ icon: Icon, iconBg, iconColor, title, desc, delay }) => (
            <Reveal key={title} delay={delay}>
              <div className="group relative h-full rounded-2xl glass-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} shadow-sm`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. HOW IT WORKS SECTION
          ══════════════════════════════════════ */}
      <section id="how-it-works" className="relative z-10 px-6 py-20 md:px-12 lg:px-20">
        {/* Section background accent */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-brand-500/[0.02] to-transparent dark:via-brand-500/[0.04]" />

        <Reveal className="mb-14 text-center">
          <span className="inline-block rounded-full border border-slate-200/60 bg-slate-100/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-400 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Up and running in{' '}
            <span className="bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-transparent">
              3 simple steps
            </span>
          </h2>
          <p className="mt-3 max-w-lg mx-auto text-sm text-slate-500 dark:text-slate-400">
            No complicated setup. Just create your account, fill in your profile, and let MediCure do the rest.
          </p>
        </Reveal>

        <div className="relative max-w-4xl mx-auto">
          {/* Connector line (desktop) */}
          <div className="absolute top-14 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] hidden h-px bg-gradient-to-r from-transparent via-brand-300/40 to-transparent dark:via-brand-700/30 lg:block" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                step: '01',
                icon: UserSquare2,
                iconBg: 'bg-brand-100 dark:bg-brand-950/40',
                iconColor: 'text-brand-500',
                title: 'Create Your Account',
                desc: 'Sign up in seconds with just your name, email, and a password. No credit card required.',
                delay: 0,
              },
              {
                step: '02',
                icon: BarChart3,
                iconBg: 'bg-emerald-100 dark:bg-emerald-950/30',
                iconColor: 'text-emerald-500',
                title: 'Set Up Your Health Profile',
                desc: 'Enter your age, height, weight, activity level, and fitness goal to personalize your experience.',
                delay: 120,
              },
              {
                step: '03',
                icon: Zap,
                iconBg: 'bg-orange-100 dark:bg-orange-950/30',
                iconColor: 'text-orange-500',
                title: 'Get Personalized Insights',
                desc: 'Instantly view your BMI, calorie targets, hydration goals, and AI-powered wellness recommendations.',
                delay: 240,
              },
            ].map(({ step, icon: Icon, iconBg, iconColor, title, desc, delay }) => (
              <Reveal key={step} delay={delay}>
                <div className="relative flex flex-col items-center text-center p-6 rounded-2xl glass-card hover:shadow-lg transition-all duration-300">
                  {/* Step number badge */}
                  <div className="absolute -top-3 left-6 rounded-full bg-brand-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md shadow-brand-500/30">
                    {step}
                  </div>
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} shadow-sm mt-3`}>
                    <Icon className={`h-7 w-7 ${iconColor}`} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. AI CHAT SPOTLIGHT SECTION
          ══════════════════════════════════════ */}
      <section id="ai-chat" className="relative z-10 px-6 py-20 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

          {/* Left: copy */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-50/80 px-3 py-1 text-[11px] font-semibold text-violet-600 dark:border-violet-800/40 dark:bg-violet-950/40 dark:text-violet-300 mb-5">
                <Bot className="h-3.5 w-3.5" />
                Gemini-Powered AI
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ask anything about{' '}
                <span className="bg-gradient-to-r from-violet-500 to-brand-400 bg-clip-text text-transparent">
                  your health
                </span>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                MediCure's AI chatbot is powered by Google Gemini. It has full context of your health profile — your BMI, calorie goals, and activity level — so every answer is tailored specifically to you.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <ul className="mt-6 space-y-3">
                {[
                  'Personalized diet and meal planning',
                  'Workout routines for your fitness goal',
                  'Sleep and recovery optimization tips',
                  'Hydration strategies for your activity level',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={320}>
              <Link
                to="/register"
                id="ai-cta-register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all focus:outline-none"
              >
                Try the AI Chatbot
                <Sparkles className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          {/* Right: mock chat UI */}
          <Reveal delay={100}>
            <div className="rounded-2xl glass-card overflow-hidden shadow-2xl">
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-slate-200/60 px-5 py-3.5 dark:border-slate-700/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/10 dark:bg-brand-500/20">
                  <Sparkles className="h-4 w-4 text-brand-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">MediCure AI</p>
                  <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                    Online
                  </p>
                </div>
              </div>

              {/* Chat messages */}
              <div className="space-y-4 p-5">
                {MOCK_CHAT.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-brand-500 text-white'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {msg.role === 'user' ? 'U' : <Bot className="h-3.5 w-3.5" />}
                    </div>
                    {/* Bubble */}
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[11px] leading-relaxed shadow-sm ${
                        msg.role === 'user'
                          ? 'rounded-br-sm bg-brand-500 text-white'
                          : 'rounded-bl-sm bg-white/70 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fake input bar */}
              <div className="flex items-center gap-3 border-t border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
                <input
                  readOnly
                  placeholder="Ask anything about your health…"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-[11px] text-slate-400 cursor-default dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => {}}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/20 hover:bg-brand-600 transition-colors focus:outline-none"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. FINAL CTA SECTION
          ══════════════════════════════════════ */}
      <section id="cta" className="relative z-10 px-6 py-20 md:px-12 lg:px-20">
        <Reveal>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-cyan-500 p-12 text-center shadow-2xl shadow-brand-500/20">
            {/* Decorative inner glows */}
            <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-sm">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Start your health journey today
              </h2>
              <p className="mt-4 max-w-lg mx-auto text-sm text-white/75 leading-relaxed">
                Join MediCure for free. Set up your health profile in under a minute and unlock personalized AI-powered wellness insights instantly.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/register"
                  id="final-cta-register"
                  className="flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-brand-600 shadow-lg hover:bg-brand-50 transition-all focus:outline-none"
                >
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  id="final-cta-login"
                  className="flex items-center gap-2 rounded-xl border-2 border-white/40 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all focus:outline-none"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-200/60 px-6 py-8 text-center dark:border-slate-800/60">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-bold bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-transparent">
            MediCure
          </span>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Built with React · Node.js · MongoDB Atlas · Google Gemini AI
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} MediCure. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Inline keyframes for initial hero fade */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Home;
