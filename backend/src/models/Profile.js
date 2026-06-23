import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Age must be positive'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['male', 'female', 'other'],
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'], // in kg
      min: [1, 'Weight must be positive'],
    },
    height: {
      type: Number,
      required: [true, 'Height is required'], // in cm
      min: [1, 'Height must be positive'],
    },
    activityLevel: {
      type: String,
      required: [true, 'Activity level is required'],
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active'],
    },
    fitnessGoal: {
      type: String,
      required: [true, 'Fitness goal is required'],
      enum: ['weight_loss', 'weight_gain', 'muscle_building', 'general_fitness'],
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
