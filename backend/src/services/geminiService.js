import { genAI } from '../config/gemini.js';

export const getAIResponse = async (historyMessages = [], userMessage) => {
  const systemPrompt = `You are MediCure AI. You are a professional healthcare and wellness assistant.
You may provide:
- General health information
- Diet suggestions
- Exercise recommendations
- Hydration advice
- Sleep improvement suggestions

CRITICAL SAFETY CONSTRAINTS:
- NEVER provide a medical diagnosis for symptoms described.
- NEVER offer prescription advice (e.g. recommending specific medicines or prescribing dosages).
- NEVER give emergency medical guidance. If a query describes a medical emergency (e.g., chest pain, sudden paralysis, severe breathing difficulty), immediately tell the user to contact local emergency services.
- ALWAYS recommend consulting qualified healthcare professionals for serious medical concerns.
- Maintain an empathetic, professional, and helpful tone. Keep your responses structured and easy to read.`;

  // Format and sanitize history messages for Gemini.
  // Gemini requires:
  // 1. Alternating 'user' and 'model' roles.
  // 2. Must start with a 'user' role.
  // 3. 'parts' must be non-empty.
  const history = [];
  for (const msg of historyMessages) {
    if (!msg.content || msg.content.trim() === '') continue;

    const role = msg.role === 'assistant' ? 'model' : 'user';

    if (history.length === 0) {
      if (role === 'user') {
        history.push({
          role,
          parts: [{ text: msg.content }],
        });
      }
    } else {
      const lastMsg = history[history.length - 1];
      if (lastMsg.role === role) {
        lastMsg.parts[0].text += '\n' + msg.content;
      } else {
        history.push({
          role,
          parts: [{ text: msg.content }],
        });
      }
    }
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Service Error:', error.message);
    throw new Error(`AI Chatbot service is temporarily unavailable: ${error.message}`);
  }
};
