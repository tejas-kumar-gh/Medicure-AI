import asyncHandler from '../utils/asyncHandler.js';
import Chat from '../models/Chat.js';
import Profile from '../models/Profile.js';
import { getAIResponse } from '../services/geminiService.js';

// @desc    Send a message and get AI response
// @route   POST /api/chat/message
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    res.status(400);
    throw new Error('Message content cannot be empty.');
  }

  // 1. Fetch user profile to enrich prompt context (if profile exists)
  const profile = await Profile.findOne({ userId: req.user._id });
  let contextPrompt = '';
  if (profile) {
    contextPrompt = `[User Details: Age ${profile.age}, Gender ${profile.gender}, Weight ${profile.weight}kg, Height ${profile.height}cm, Activity Level: ${profile.activityLevel}, Goal: ${profile.fitnessGoal.replace('_', ' ')}. Maintain suggestions that fit this demographic, but don't explicitly list this system data unless requested.] `;
  }

  // 2. Fetch or initialize chat document
  let chat = await Chat.findOne({ userId: req.user._id });
  if (!chat) {
    chat = new Chat({ userId: req.user._id, messages: [] });
  }

  // 3. Keep chat history to last 15 messages for context length
  const recentMessages = chat.messages.slice(-15);
  const aiHistory = recentMessages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Combine context with current user query
  const queryWithContext = contextPrompt + message;

  // 4. Request Gemini response
  const aiResponse = await getAIResponse(aiHistory, queryWithContext);

  // 5. Save the plain user message and assistant reply to DB
  chat.messages.push({ role: 'user', content: message });
  chat.messages.push({ role: 'assistant', content: aiResponse });
  await chat.save();

  res.status(200).json({
    role: 'assistant',
    content: aiResponse,
    timestamp: new Date(),
  });
});

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
export const getChatHistory = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ userId: req.user._id });

  if (chat) {
    res.status(200).json(chat.messages);
  } else {
    res.status(200).json([]);
  }
});

// @desc    Clear chat history
// @route   DELETE /api/chat/history
// @access  Private
export const deleteChatHistory = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ userId: req.user._id });

  if (chat) {
    chat.messages = [];
    await chat.save();
    res.status(200).json({ message: 'Conversation history cleared successfully.' });
  } else {
    res.status(200).json({ message: 'No conversation history found.' });
  }
});
