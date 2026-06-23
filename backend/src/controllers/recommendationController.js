import asyncHandler from '../utils/asyncHandler.js';
import Recommendation from '../models/Recommendation.js';

// @desc    Get current user's recommendations
// @route   GET /api/recommendations
// @access  Private
export const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await Recommendation.findOne({ userId: req.user._id });

  if (recommendations) {
    res.status(200).json(recommendations);
  } else {
    res.status(200).json(null);
  }
});
