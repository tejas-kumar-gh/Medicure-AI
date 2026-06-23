export const calculateBMI = (weight, height) => {
  // Height in cm, weight in kg
  const heightInMeters = height / 100;
  if (heightInMeters <= 0) return { bmi: 0, category: 'Unknown' };
  const bmi = weight / (heightInMeters * heightInMeters);
  const roundedBmi = Math.round(bmi * 10) / 10;

  let category = 'Normal';
  if (roundedBmi < 18.5) {
    category = 'Underweight';
  } else if (roundedBmi >= 18.5 && roundedBmi < 25) {
    category = 'Normal';
  } else if (roundedBmi >= 25 && roundedBmi < 30) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  return { bmi: roundedBmi, category };
};

export const calculateWaterIntake = (weight, activityLevel) => {
  // Base water requirement: 0.033 L per kg
  let baseWater = weight * 0.033;

  // Add activity offsets
  switch (activityLevel) {
    case 'lightly_active':
      baseWater += 0.3;
      break;
    case 'moderately_active':
      baseWater += 0.6;
      break;
    case 'very_active':
      baseWater += 1.0;
      break;
    default:
      break; // sedentary
  }

  return Math.round(baseWater * 10) / 10;
};

export const calculateCalories = (weight, height, age, gender, activityLevel, fitnessGoal) => {
  // BMR (Mifflin-St Jeor Equation)
  let bmr = 0;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    // Average of male and female for other
    bmr = 10 * weight + 6.25 * height - 5 * age - 78;
  }

  // TDEE Activity Multipliers
  let multiplier = 1.2;
  switch (activityLevel) {
    case 'lightly_active':
      multiplier = 1.375;
      break;
    case 'moderately_active':
      multiplier = 1.55;
      break;
    case 'very_active':
      multiplier = 1.725;
      break;
    default:
      break;
  }

  const tdee = bmr * multiplier;

  // Goal adjustments
  let dailyCalories = tdee;
  switch (fitnessGoal) {
    case 'weight_loss':
      dailyCalories = tdee - 500;
      break;
    case 'weight_gain':
      dailyCalories = tdee + 500;
      break;
    case 'muscle_building':
      dailyCalories = tdee + 300;
      break;
    default:
      break; // general_fitness
  }

  // Keep calories at a safe minimum (1200 kcal)
  return Math.max(1200, Math.round(dailyCalories));
};
