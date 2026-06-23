import express from 'express';
import { sendMessage, getChatHistory, deleteChatHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(protect); // All chat routes require authentication

router.post('/message', apiLimiter, sendMessage);
router.get('/history', getChatHistory);
router.delete('/history', deleteChatHistory);

export default router;
