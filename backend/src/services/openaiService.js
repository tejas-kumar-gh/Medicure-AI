import openai from '../config/openai.js';

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

  // Format messages into OpenAI format
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...historyMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Service Error:', error.message);
    throw new Error(`AI Chatbot service is temporarily unavailable: ${error.message}`);
  }
};
