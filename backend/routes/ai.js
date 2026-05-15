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

  const groqApiKey = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : null;

  // ── Fallback mock if no API key ─────────────────────────────────────────────
  if (!groqApiKey) {
    console.log('⚠️  GROQ_API_KEY not set — returning mock AI response.');
    return setTimeout(() => {
      res.json({
        reply: `🤖 Mock AI: You asked — "${userMessage}". To enable real AI responses, add your GROQ_API_KEY to backend/.env\n\nGet a free key at: https://console.groq.com/keys`,
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

    // Build chat history for Groq (OpenAI format)
    const messages = [
      systemPrompt,
      ...history.map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Groq API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "Sorry, I couldn't process that.";

    res.json({ reply });
  } catch (error) {
    console.error('❌ Groq AI Error:', error.message);

    if (error.message?.includes('Invalid API Key') || error.message?.includes('401')) {
      const isGeminiKey = groqApiKey && groqApiKey.startsWith('AIza'); if (isGeminiKey) { return res.status(500).json({ error: 'You are still using a Google Gemini key! You need a Groq key that starts with "gsk_". Please replace the GROQ_API_KEY secret in GitHub.' }); } return res.status(500).json({ error: "Invalid Groq API key (Your key starts with: ""...). Ensure you copied the full "gsk_..." key." });
    }
    if (error.message?.includes('rate limit') || error.message?.includes('429')) {
      return res.status(429).json({ error: 'Groq API rate limit reached. Please wait a moment and try again.' });
    }

    res.status(500).json({ error: `Failed to generate AI response. Error: ${error.message}` });
  }
});

module.exports = router;

