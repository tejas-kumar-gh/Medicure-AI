import express from 'express';
import { registerUser, authUser, logoutUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { registerValidationRules, loginValidationRules, validateResult } from '../middleware/validationMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidationRules, validateResult, registerUser);
router.post('/login', authLimiter, loginValidationRules, validateResult, authUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getUserProfile);

export default router;
