import Recommendation from '../models/Recommendation.js';
import { calculateBMI, calculateWaterIntake, calculateCalories } from '../utils/healthCalculator.js';

export const updateRecommendations = async (profile) => {
  const { userId, age, gender, weight, height, activityLevel, fitnessGoal } = profile;

  // 1. Calculate health metrics
  const { bmi, category: bmiCategory } = calculateBMI(weight, height);
  const dailyWaterIntake = calculateWaterIntake(weight, activityLevel);
  const dailyCalorieEstimate = calculateCalories(weight, height, age, gender, activityLevel, fitnessGoal);

  // 2. Generate customized suggestions
  const diet = [];
  const exercise = [];
  const hydration = [];
  const sleep = [];

  // --- Goal-Based Recommendations ---
  if (fitnessGoal === 'weight_loss') {
    diet.push('Maintain a daily calorie deficit of approximately 500 kcal from your TDEE.');
    diet.push('Prioritize lean protein sources (chicken breast, fish, tofu, egg whites, Greek yogurt) to help preserve lean muscle.');
    diet.push('Fill half your plate with non-starchy, fiber-rich vegetables (leafy greens, broccoli, zucchini) to promote fullness.');
    diet.push('Minimize intake of liquid calories, processed snacks, refined sugars, and high-calorie salad dressings.');

    exercise.push('Aim for 150-200 minutes of moderate-intensity cardiovascular exercise (e.g. brisk walking, cycling) per week.');
    exercise.push('Incorporate resistance/weight training 3 days a week to preserve calorie-burning muscle mass.');
    exercise.push('Consider adding 1-2 brief sessions of High-Intensity Interval Training (HIIT) to boost your metabolic rate.');
  } else if (fitnessGoal === 'weight_gain') {
    diet.push('Create a daily caloric surplus of 400-500 kcal above your calculated maintenance level.');
    diet.push('Focus on calorie-dense, nutrient-dense foods (avocados, nuts, seeds, nut butters, olive oil, dried fruits).');
    diet.push('Increase your feeding frequency to 5-6 smaller, calorie-packed meals instead of 3 large ones.');
    diet.push('Consume complex carbohydrates like oatmeal, sweet potatoes, quinoa, and brown rice to fuel your energy.');

    exercise.push('Prioritize progressive resistance training (lifting weights) 3-4 times per week to promote lean mass growth.');
    exercise.push('Limit heavy cardiovascular training to brief 10-15 minute warm-ups to avoid burning excess calories.');
    exercise.push('Emphasize compound weight-lifting exercises (squats, bench press, overhead press, rows) to engage major muscle groups.');
  } else if (fitnessGoal === 'muscle_building') {
    diet.push('Establish a moderate calorie surplus of 200-300 kcal daily to fuel muscle hypertrophy.');
    diet.push('Target a high protein intake of 1.6 to 2.2 grams of protein per kilogram of body weight (approx. 0.8-1g per lb).');
    diet.push('Consume fast-digesting carbohydrates and protein (e.g., banana and protein shake) within 1-2 hours post-workout.');
    diet.push('Incorporate essential fats (omega-3s from salmon, walnuts, chia seeds) to support recovery and hormone production.');

    exercise.push('Perform a structured resistance training routine 4-5 times per week using progressive overload.');
    exercise.push('Focus on compound movements and target each major muscle group 2 times per week for optimal stimulus.');
    exercise.push('Ensure adequate rest, allowing 48 hours of recovery for a specific muscle group before training it again.');
  } else {
    // general_fitness
    diet.push('Consume a balanced diet rich in whole foods, maintaining calories at your calculated TDEE.');
    diet.push('Incorporate a diverse range of colorful vegetables and fruits to secure essential micronutrients.');
    diet.push('Choose high-quality lean proteins, complex grains, and healthy fats (avocados, seeds, olive oil).');
    diet.push('Limit processed foods, trans fats, excessive sodium, and refined sugars.');

    exercise.push('Participate in at least 150 minutes of moderate-intensity aerobic exercise per week.');
    exercise.push('Incorporate full-body strength training exercises at least 2 days per week.');
    exercise.push('Engage in regular stretching or mobility drills to support joint health and prevent injury.');
  }

  // --- BMI-Based Refinements ---
  if (bmiCategory === 'Obese' || bmiCategory === 'Overweight') {
    exercise.push('Select low-impact exercises (swimming, cycling, elliptical, water aerobics) to protect knee and hip joints.');
    diet.push('Practice mindful portion sizing and eat slowly to recognize natural fullness cues.');
  } else if (bmiCategory === 'Underweight') {
    diet.push('Include healthy calorie-dense snacks between meals (e.g., a handful of almonds, apple slices with peanut butter).');
    exercise.push('Avoid prolonged cardiovascular sessions; prioritize low-volume, high-load weight training to stimulate bone and muscle growth.');
  }

  // --- Hydration Recommendations ---
  hydration.push(`Drink at least ${dailyWaterIntake} liters of water daily to match your calculated fluid requirements.`);
  hydration.push('Drink a glass of water immediately upon waking to rehydrate after sleeping.');
  hydration.push('Carry a reusable water bottle with you during the day to encourage consistent drinking.');
  if (activityLevel !== 'sedentary') {
    hydration.push('Drink 300-500ml of water 30 minutes before working out, and sip fluid regularly during physical exertion.');
  }
  if (fitnessGoal === 'weight_loss') {
    hydration.push('Drink a large glass of water 15 minutes before your main meals to promote natural satiety and portion control.');
  }

  // --- Sleep Recommendations ---
  sleep.push('Aim for 7 to 9 hours of high-quality, continuous sleep each night to maximize physical recovery and hormone balance.');
  sleep.push('Keep a consistent sleep schedule by waking up and going to bed at the same time, even on weekends.');
  sleep.push('Refrain from using screens (phones, tablets, TVs) at least 1 hour before bedtime; blue light disrupts melatonin production.');
  sleep.push('Create a cool, quiet, and pitch-black bedroom environment to encourage deep sleep stages.');

  // 3. Upsert into database
  let recommendation = await Recommendation.findOne({ userId });

  if (recommendation) {
    recommendation.bmi = bmi;
    recommendation.bmiCategory = bmiCategory;
    recommendation.dailyWaterIntake = dailyWaterIntake;
    recommendation.dailyCalorieEstimate = dailyCalorieEstimate;
    recommendation.diet = diet;
    recommendation.exercise = exercise;
    recommendation.hydration = hydration;
    recommendation.sleep = sleep;
    await recommendation.save();
  } else {
    recommendation = await Recommendation.create({
      userId,
      bmi,
      bmiCategory,
      dailyWaterIntake,
      dailyCalorieEstimate,
      diet,
      exercise,
      hydration,
      sleep,
    });
  }

  return recommendation;
};
