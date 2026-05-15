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

  const openAiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : null;

  // ── Fallback mock if no API key ─────────────────────────────────────────────
  if (!openAiKey) {
    console.log('⚠️  OPENAI_API_KEY not set — returning mock AI response.');
    return setTimeout(() => {
      res.json({
        reply: `🤖 Mock AI: You asked — "${userMessage}". To enable real AI responses, add your OPENAI_API_KEY to backend/.env\n\nGet a key at: https://platform.openai.com/api-keys`,
      });
    }, 800);
  }

  try {
    const systemPrompt = {
      role: 'system',
      content: `You are AgriNova AI — a professional, friendly agricultural assistant for Indian farmers and buyers.
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
If you don't know something, say so honestly and suggest where to find the information.`
    };

    // Build chat history for OpenAI format
    const messages = [
      systemPrompt,
      ...history.map(m => ({
        role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "Sorry, I couldn't process that.";

    res.json({ reply });
  } catch (error) {
    console.error('❌ OpenAI Error:', error.message);

    if (error.message?.includes('Incorrect API key') || error.message?.includes('invalid_api_key')) {
      const isGeminiKey = openAiKey.startsWith('AIza');
      if (isGeminiKey) {
        return res.status(500).json({ error: 'You are still using a Google Gemini key! You need an OpenAI key that starts with "sk-". Please replace the OPENAI_API_KEY secret in GitHub.' });
      }
      return res.status(500).json({ error: `Invalid OpenAI API key (Your key starts with: "${openAiKey.substring(0, 4)}..."). Ensure you copied the full "sk-..." key without spaces.` });
    }
    
    if (error.message?.includes('insufficient_quota') || error.message?.includes('429')) {
      return res.status(429).json({ error: 'OpenAI API quota exceeded or rate limit reached. Please check your OpenAI billing details.' });
    }

    res.status(500).json({ error: `Failed to generate AI response. Error: ${error.message}` });
  }
});

module.exports = router;
