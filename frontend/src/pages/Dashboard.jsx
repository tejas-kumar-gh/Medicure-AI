import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { SkeletonLoader } from '../components/Loader';
import { Activity, Flame, Droplet, Heart, Sparkles, ArrowRight, UserSquare2 } from 'lucide-react';

const fetchProfile = async () => {
  const { data } = await axiosInstance.get('/profile');
  return data;
};

const fetchRecommendations = async () => {
  const { data } = await axiosInstance.get('/recommendations');
  return data;
};

export const Dashboard = () => {
  const { user } = useAuth();

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const { data: recommendations, isLoading: loadingRecs } = useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
    enabled: !!profile, // Retrieve recommendations only if the user has created their profile
  });

  const isLoading = loadingProfile || (profile && loadingRecs);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-44 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-2xl glass-card">
            <SkeletonLoader count={3} />
          </div>
          <div className="p-6 rounded-2xl glass-card">
            <SkeletonLoader count={3} />
          </div>
          <div className="p-6 rounded-2xl glass-card">
            <SkeletonLoader count={3} />
          </div>
        </div>
      </div>
    );
  }

  // Direct user to configure profile if not created
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl glass-card min-h-[50vh]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 mb-6 shadow-xs animate-pulse">
          <UserSquare2 className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Welcome to MediCure, {user?.name}!</h2>
        <p className="max-w-md text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          To get customized health assessments, calculate your BMI, and access recommendations, please complete your health profile first.
        </p>
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-brand-500/10 hover:bg-brand-600 transition-all focus:outline-none"
        >
          Setup Health Profile
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const getBmiColor = (category) => {
    switch (category) {
      case 'Normal':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Underweight':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Overweight':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Obese':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-slate-500 bg-slate-500/10 border-slate-550/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Hello, <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">{user?.name}</span> 👋
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Here is your personalized health overview based on your latest profile stats.
        </p>
      </div>

      {/* Main stats widgets */}
      {recommendations && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* BMI Widget */}
          <div className="rounded-2xl glass-card p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Body Mass Index (BMI)</span>
              <Activity className="h-5 w-5 text-brand-500" />
            </div>
            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">{recommendations.bmi}</span>
              <span className={`px-2 py-0.5 text-3xs font-bold rounded-full border ${getBmiColor(recommendations.bmiCategory)}`}>
                {recommendations.bmiCategory}
              </span>
            </div>
            <span className="text-3xs text-slate-400 dark:text-slate-500 mt-2">
              Height: {profile.height}cm & Weight: {profile.weight}kg.
            </span>
          </div>

          {/* Calorie Target Widget */}
          <div className="rounded-2xl glass-card p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Calorie Intake Target</span>
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div className="my-1.5 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">{recommendations.dailyCalorieEstimate}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold"> kcal / day</span>
            </div>
            <span className="text-3xs text-slate-400 dark:text-slate-500 mt-2">
              Adjusted for {profile.fitnessGoal.replace('_', ' ')}.
            </span>
          </div>

          {/* Water Target Widget */}
          <div className="rounded-2xl glass-card p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Hydration Target</span>
              <Droplet className="h-5 w-5 text-blue-500" />
            </div>
            <div className="my-1.5 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">{recommendations.dailyWaterIntake}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold"> Liters / day</span>
            </div>
            <span className="text-3xs text-slate-400 dark:text-slate-500 mt-2">
              Activity mode: {profile.activityLevel.replace('_', ' ')}.
            </span>
          </div>
        </div>
      )}

      {/* Direct link pathways */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Chatbot Pathway */}
        <div className="rounded-2xl glass-card p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 mb-4 shadow-2xs">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Consult MediCure AI</h3>
            <p className="text-2xs text-slate-400 dark:text-slate-500 mt-1 mb-6 leading-relaxed">
              Ask our dedicated AI agent regarding dynamic calorie guidelines, diet routines, exercise models, or sleep recovery.
            </p>
          </div>
          <Link
            to="/chat"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 hover:gap-2 transition-all focus:outline-none"
          >
            Launch Chatbot
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Recommendations Pathway */}
        <div className="rounded-2xl glass-card p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 mb-4 shadow-2xs">
              <Heart className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">View Wellness Recommendations</h3>
            <p className="text-2xs text-slate-400 dark:text-slate-500 mt-1 mb-6 leading-relaxed">
              Explore your calculated guidelines regarding fitness, nutritional focus, hydration, and sleep hygiene.
            </p>
          </div>
          <Link
            to="/recommendations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 hover:gap-2 transition-all focus:outline-none"
          >
            Check Recommendations
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
