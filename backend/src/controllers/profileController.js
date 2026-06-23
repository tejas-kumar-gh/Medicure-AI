import asyncHandler from '../utils/asyncHandler.js';
import Profile from '../models/Profile.js';
import { updateRecommendations } from '../services/recommendationService.js';

// @desc    Get user health profile
// @route   GET /api/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user._id });

  if (profile) {
    res.status(200).json(profile);
  } else {
    // Return null in body so the frontend knows that profile is not created yet
    res.status(200).json(null);
  }
});

// @desc    Create user health profile
// @route   POST /api/profile
// @access  Private
export const createProfile = asyncHandler(async (req, res) => {
  const { age, gender, weight, height, activityLevel, fitnessGoal } = req.body;

  const profileExists = await Profile.findOne({ userId: req.user._id });

  if (profileExists) {
    res.status(400);
    throw new Error('Profile already exists. Use PUT endpoint to update it.');
  }

  const profile = await Profile.create({
    userId: req.user._id,
    age,
    gender,
    weight,
    height,
    activityLevel,
    fitnessGoal,
  });

  // Calculate and store health metrics and recommendations
  await updateRecommendations(profile);

  res.status(201).json(profile);
});

// @desc    Update user health profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { age, gender, weight, height, activityLevel, fitnessGoal } = req.body;

  let profile = await Profile.findOne({ userId: req.user._id });

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found. Please create a profile first.');
  }

  profile.age = age !== undefined ? age : profile.age;
  profile.gender = gender !== undefined ? gender : profile.gender;
  profile.weight = weight !== undefined ? weight : profile.weight;
  profile.height = height !== undefined ? height : profile.height;
  profile.activityLevel = activityLevel !== undefined ? activityLevel : profile.activityLevel;
  profile.fitnessGoal = fitnessGoal !== undefined ? fitnessGoal : profile.fitnessGoal;

  const updatedProfile = await profile.save();

  // Recalculate health metrics and recommendations
  await updateRecommendations(updatedProfile);

  res.status(200).json(updatedProfile);
});
