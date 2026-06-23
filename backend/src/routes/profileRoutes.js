import express from 'express';
import { getProfile, createProfile, updateProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { profileValidationRules, validateResult } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect); // All profile routes require authentication

router.get('/', getProfile);
router.post('/', profileValidationRules, validateResult, createProfile);
router.put('/', profileValidationRules, validateResult, updateProfile);

export default router;
