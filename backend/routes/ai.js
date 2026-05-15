const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini — reloads on each request so hot-reload of .env works
const getGenAI = () =>
  process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// POST /api/ai/chat
// Body: { message: string, history: [{ role: 'user'|'assistant', content: string }] }
router.post('/chat', async (req, res) => {
  // Support both 'message' (new frontend) and 'prompt' (legacy) field names
  const { message, prompt, history = [] } = req.body;
  const userMessage = message || prompt;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const genAI = getGenAI();

  // ── Fallback mock if no API key ─────────────────────────────────────────────
  if (!genAI) {
    console.log('⚠️  GEMINI_API_KEY not set — returning mock AI response.');
    return setTimeout(() => {
      res.json({
        reply: `🤖 Mock AI: You asked — "${userMessage}". To enable real AI responses, add your GEMINI_API_KEY to backend/.env\n\nGet a free key at: https://aistudio.google.com/app/apikey`,
      });
    }, 800);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build multi-turn chat history for Gemini
    const chatHistory = history
      .filter(m => m.role === 'user' || m.role === 'assistant' || m.role === 'model')
      .map(m => ({
        role: (m.role === 'assistant' || m.role === 'model') ? 'model' : m.role,
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
      systemInstruction: {
        parts: [{
          text: `You are AgriNova AI — a professional, friendly agricultural assistant for Indian farmers and buyers.
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
If you don't know something, say so honestly and suggest where to find the information.`,
        }],
      },
    });

    const result = await chat.sendMessage(userMessage);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error('❌ Gemini AI Error:', error.message);

    // Give a helpful error based on what went wrong
    if (error.message?.includes('API_KEY_INVALID')) {
      return res.status(500).json({ error: 'Invalid Gemini API key. Check your GEMINI_API_KEY in .env' });
    }
    if (error.message?.includes('QUOTA_EXCEEDED') || error.status === 429) {
      return res.status(429).json({ error: 'Gemini API rate limit reached. Please wait a moment and try again.' });
    }

    res.status(500).json({ error: `Failed to generate AI response. Error: ${error.message}` });
  }
});

module.exports = router;
