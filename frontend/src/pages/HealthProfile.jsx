import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { Loader } from '../components/Loader';
import toast from 'react-hot-toast';
import { Save, UserSquare2, Scale, Ruler, Sparkles, Trophy } from 'lucide-react';

const fetchProfile = async () => {
  const { data } = await axiosInstance.get('/profile');
  return data;
};

const saveProfile = async ({ profileData, exists }) => {
  const method = exists ? 'put' : 'post';
  const { data } = await axiosInstance[method]('/profile', profileData);
  return data;
};

export const HealthProfile = () => {
  const queryClient = useQueryClient();

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [fitnessGoal, setFitnessGoal] = useState('general_fitness');

  // Load existing profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (profile) {
      setAge(profile.age);
      setGender(profile.gender);
      setWeight(profile.weight);
      setHeight(profile.height);
      setActivityLevel(profile.activityLevel);
      setFitnessGoal(profile.fitnessGoal);
    }
  }, [profile]);

  // Mutation to create/update profile
  const mutation = useMutation({
    mutationFn: saveProfile,
    onSuccess: (data) => {
      toast.success('Health profile saved successfully!');
      // Invalidate queries to refresh dashboard and recommendations
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!age || !weight || !height) {
      return toast.error('Please fill in all physical parameters.');
    }

    const profileData = {
      age: parseInt(age, 10),
      gender,
      weight: parseFloat(weight),
      height: parseFloat(height),
      activityLevel,
      fitnessGoal,
    };

    mutation.mutate({ profileData, exists: !!profile });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Health Profile</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure your physical metrics and goals to get tailor-made health recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form Container */}
        <div className="lg:col-span-2 rounded-2xl glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200/60 pb-2 dark:border-slate-800">
              Physical Attributes
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Age */}
              <div>
                <label className="block text-3xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
                  Age (years)
                </label>
                <div className="relative">
                  <UserSquare2 className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 28"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-xs focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/40"
                  />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-3xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
                  Weight (kg)
                </label>
                <div className="relative">
                  <Scale className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="number"
                    step="0.1"
                    required
                    min="10"
                    max="400"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-xs focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/40"
                  />
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-3xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
                  Height (cm)
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="number"
                    step="0.1"
                    required
                    min="50"
                    max="300"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-xs focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/40"
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-3xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">
                Gender
              </label>
              <div className="flex gap-4">
                {['male', 'female', 'other'].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={gender === g}
                      onChange={(e) => setGender(e.target.value)}
                      className="h-4 w-4 text-brand-500 border-slate-300 focus:ring-brand-500 dark:border-slate-800 dark:bg-slate-900"
                    />
                    <span className="capitalize text-slate-650 dark:text-slate-300">{g}</span>
                  </label>
                ))}
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200/60 pb-2 dark:border-slate-800 pt-4">
              Lifestyle & Targets
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Activity Level */}
              <div>
                <label className="block text-3xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
                  Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 px-4 text-xs focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300"
                >
                  <option value="sedentary">Sedentary (Little/no exercise)</option>
                  <option value="lightly_active">Lightly Active (1-3 days/week exercise)</option>
                  <option value="moderately_active">Moderately Active (3-5 days/week exercise)</option>
                  <option value="very_active">Very Active (6-7 days/week heavy exercise)</option>
                </select>
              </div>

              {/* Fitness Goal */}
              <div>
                <label className="block text-3xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
                  Fitness Goal
                </label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 px-4 text-xs focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300"
                >
                  <option value="weight_loss">Weight Loss</option>
                  <option value="weight_gain">Weight Gain</option>
                  <option value="muscle_building">Muscle Building</option>
                  <option value="general_fitness">General Fitness</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-brand-500/10 hover:bg-brand-600 disabled:opacity-50 transition-all focus:outline-none"
            >
              <Save className="h-4.5 w-4.5" />
              {mutation.isPending ? 'Saving profile...' : 'Save Profile Settings'}
            </button>
          </form>
        </div>

        {/* Sidebar Info Card */}
        <div className="rounded-2xl glass-card p-6 flex flex-col justify-between h-fit space-y-4">
          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 mb-4 shadow-2xs">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Why complete your profile?</h3>
            <p className="text-2xs text-slate-450 dark:text-slate-550 mt-1 mb-4 leading-relaxed">
              MediCure uses your exact physical attributes (Age, Weight, Height, Gender) and activity ratios to determine your BMR and TDEE using MSJ equations.
            </p>
            <div className="space-y-2 border-t border-slate-200/60 dark:border-slate-800 pt-3">
              <div className="flex items-center gap-2 text-2xs text-slate-600 dark:text-slate-400">
                <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Custom Target Calories set daily</span>
              </div>
              <div className="flex items-center gap-2 text-2xs text-slate-600 dark:text-slate-400">
                <Trophy className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Hydration indices tailored to workout load</span>
              </div>
              <div className="flex items-center gap-2 text-2xs text-slate-600 dark:text-slate-400">
                <Trophy className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Diet models adjusted for fitness outcomes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfile;
