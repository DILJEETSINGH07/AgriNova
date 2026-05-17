const express = require('express');
const router = express.Router();

// POST /api/ai/chat
// Body: { message: string, history: [{ role: 'user'|'assistant', content: string }] }
router.post('/chat', async (req, res) => {
  const { message, prompt, history = [] } = req.body;
  const userMessage = message || prompt;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const geminiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

  // ── Fallback mock if no API key ─────────────────────────────────────────────
  if (!geminiKey) {
    console.log('⚠️  GEMINI_API_KEY not set — returning mock AI response.');
    return setTimeout(() => {
      res.json({
        reply: `🌱 AgriNova AI (Demo): You asked — "${userMessage}". To enable real AI responses, add your GEMINI_API_KEY to backend/.env\n\nGet a free key at: https://aistudio.google.com/app/apikey`,
      });
    }, 800);
  }

  const systemInstruction = `You are AgriNova AI — a professional, friendly agricultural assistant for Indian farmers and buyers.
Your expertise includes:
- Crop recommendations based on season, region, and soil
- Pest and disease identification with organic/chemical treatment options
- Irrigation and water management best practices
- Fertilizer and soil health advice
- Current market prices and selling strategies
- Indian government schemes for farmers (PM-Kisan, PMFBY, KCC, etc.)
- Weather-based farming advice

Always respond in the same language the user writes in (Hindi, Punjabi, or English).
Be concise, practical, and empathetic. Use emojis sparingly to make responses friendly.
If you don't know something, say so honestly and suggest where to find the information.`;

  // Build Gemini conversation history
  const geminiHistory = history
    .filter(m => m.role === 'user' || m.role === 'assistant' || m.role === 'model')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const requestBody = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents: [
      ...geminiHistory,
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  // Try models in order of preference
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData?.error?.message || response.statusText;
        // If model not found, try next
        if (response.status === 404 || errMsg.includes('not found')) continue;
        throw new Error(`Gemini API Error (${model}): ${errMsg}`);
      }

      const data = await response.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't process that request.";

      return res.json({ reply });
    } catch (error) {
      if (model === models[models.length - 1]) {
        // Last model failed — return error
        console.error('❌ Gemini Error:', error.message);
        return res.status(500).json({ error: `Failed to generate AI response. Error: ${error.message}` });
      }
      // Otherwise try next model
      console.warn(`⚠️ Model ${model} failed, trying next...`);
    }
  }
});

module.exports = router;
