import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { Loader } from '../components/Loader';
import { Link } from 'react-router-dom';
import { Utensils, Dumbbell, Droplet, Moon, Flame, Scale, AlertCircle } from 'lucide-react';

const fetchRecommendations = async () => {
  const { data } = await axiosInstance.get('/recommendations');
  return data;
};

export const Recommendations = () => {
  const [activeTab, setActiveTab] = useState('diet');

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl glass-card min-h-[50vh]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 mb-6 shadow-2xs animate-pulse">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Recommendations Found</h2>
        <p className="max-w-md text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Please fill in your physical parameters in your Health Profile to generate personalized diet, exercise, hydration, and sleep suggestions.
        </p>
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-brand-500/10 hover:bg-brand-600 transition-all focus:outline-none"
        >
          Setup Health Profile
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'diet', label: 'Diet & Nutrition', icon: Utensils, color: 'text-orange-500 bg-orange-500/10 dark:bg-orange-950/20' },
    { id: 'exercise', label: 'Fitness & Exercise', icon: Dumbbell, color: 'text-brand-500 bg-brand-500/10 dark:bg-brand-950/20' },
    { id: 'hydration', label: 'Hydration Intake', icon: Droplet, color: 'text-blue-500 bg-blue-500/10 dark:bg-blue-950/20' },
    { id: 'sleep', label: 'Sleep Hygiene', icon: Moon, color: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-950/20' },
  ];

  const getActiveTabContent = () => {
    switch (activeTab) {
      case 'diet':
        return {
          title: 'Dietary & Nutrition Guidelines',
          desc: `Based on your body parameters, your daily calorie target is ${recommendations.dailyCalorieEstimate} kcal.`,
          list: recommendations.diet,
        };
      case 'exercise':
        return {
          title: 'Physical Activity & Workouts',
          desc: 'Recommended training models targeting your physical fitness objectives and joint safety.',
          list: recommendations.exercise,
        };
      case 'hydration':
        return {
          title: 'Hydration Guidelines',
          desc: `Your targeted daily water intake is ${recommendations.dailyWaterIntake} Liters.`,
          list: recommendations.hydration,
        };
      case 'sleep':
        return {
          title: 'Sleep & Recovery Rules',
          desc: 'Optimize sleep hygiene to aid muscle building, recovery, and hormonal regulation.',
          list: recommendations.sleep,
        };
      default:
        return null;
    }
  };

  const activeContent = getActiveTabContent();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Your Health Recommendations</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review dynamic guidelines created by our engine for your specific anthropometric profile.
        </p>
      </div>

      {/* Target stats indicators */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-white/50 p-4 dark:border-slate-800 dark:bg-[#151c2c]/50 flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950/20 text-orange-500 shadow-3xs">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-450 dark:text-slate-550 uppercase tracking-wider font-bold">Daily Calories</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{recommendations.dailyCalorieEstimate} kcal</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white/50 p-4 dark:border-slate-800 dark:bg-[#151c2c]/50 flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/20 text-blue-500 shadow-3xs">
            <Droplet className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-450 dark:text-slate-550 uppercase tracking-wider font-bold">Daily Fluids</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{recommendations.dailyWaterIntake} L</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white/50 p-4 dark:border-slate-800 dark:bg-[#151c2c]/50 flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/20 text-emerald-500 shadow-3xs">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-450 dark:text-slate-550 uppercase tracking-wider font-bold">BMI Category</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{recommendations.bmi} ({recommendations.bmiCategory})</span>
          </div>
        </div>
      </div>

      {/* Selector and recommendations content panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Navigation tabs column */}
        <div className="flex flex-col gap-2 rounded-2xl glass-card p-4 h-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-left transition-all focus:outline-none ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/15'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-850/40 dark:hover:text-white'
                }`}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isActive ? 'bg-white/20 text-white' : tab.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Selected tab content */}
        <div className="lg:col-span-3 rounded-2xl glass-card p-6">
          {activeContent && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-850 dark:text-slate-200">{activeContent.title}</h2>
                <p className="text-2xs text-slate-450 dark:text-slate-500 mt-1">{activeContent.desc}</p>
              </div>

              <ul className="space-y-3 pt-2">
                {activeContent.list.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/20 dark:border-slate-800 dark:bg-slate-900/10 p-3.5 text-xs text-slate-650 dark:text-slate-350 leading-relaxed shadow-3xs"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-500 font-bold text-2xs mt-0.5 shadow-2xs">
                      {index + 1}
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
