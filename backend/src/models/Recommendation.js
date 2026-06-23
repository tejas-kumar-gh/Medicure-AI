import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    bmi: {
      type: Number,
      required: true,
    },
    bmiCategory: {
      type: String,
      required: true,
    },
    dailyWaterIntake: {
      type: Number,
      required: true, // in Liters
    },
    dailyCalorieEstimate: {
      type: Number,
      required: true, // in kcal
    },
    diet: {
      type: [String],
      default: [],
    },
    exercise: {
      type: [String],
      default: [],
    },
    hydration: {
      type: [String],
      default: [],
    },
    sleep: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;
