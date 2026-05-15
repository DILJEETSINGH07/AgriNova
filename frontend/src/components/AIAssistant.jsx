import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, X, Send, Mic, MicOff, Sparkles, Leaf, ChevronDown,
  Volume2, VolumeX, RotateCcw
} from 'lucide-react';
import api from '../services/api';

const QUICK_PROMPTS = [
  { label: '🌱 Crop Tips', text: 'What crops should I grow this season in India?' },
  { label: '🐛 Pest Help', text: 'My tomato leaves have yellow spots. What pest or disease could it be?' },
  { label: '💧 Irrigation', text: 'How often should I water wheat in dry weather?' },
  { label: '🌾 Fertilizer', text: 'What fertilizer is best for rice cultivation?' },
  { label: '💰 Market Prices', text: 'What are current market prices for vegetables in India?' },
  { label: '🏛️ Schemes', text: 'What government schemes are available for Indian farmers in 2024?' },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! 🙏 I\'m your AI farming assistant. I can help with crop recommendations, pest detection, irrigation advice, market prices, and government schemes. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Setup speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [language]);

  const speak = (text) => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const sendMessage = async (text) => {
    const userText = text || input;
    if (!userText.trim()) return;

    const userMsg = { role: 'user', content: userText };
    // Snapshot current messages BEFORE adding the new user message to history
    const currentHistory = [...messages];
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const langInstruction = language === 'hi'
        ? 'Please respond in Hindi.'
        : language === 'pa'
        ? 'Please respond in Punjabi.'
        : 'Please respond in English.';

      const res = await api.post('/ai/chat', {
        // message field — matches backend
        message: `${langInstruction} ${userText}`,
        // Pass conversation history for multi-turn memory
        history: currentHistory.map(m => ({
          role: m.role,   // 'user' or 'assistant' — backend maps 'assistant' → 'model'
          content: m.content,
        })),
      });

      const assistantMsg = { role: 'assistant', content: res.data.reply };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorText = err.response?.data?.error || '⚠️ I\'m having trouble connecting right now. Please check your API key and try again.';
      const errorMsg = { role: 'assistant', content: errorText };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared! How can I help you with farming today? 🌱',
    }]);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        id="ai-assistant-btn"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-green-400/40 hover:scale-105 transition-all font-semibold ${isOpen ? 'hidden' : 'flex'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="h-5 w-5" />
        <span>AI Farming Assistant</span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-assistant-panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[390px] max-h-[85vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-black/30 dark:shadow-black/60 border border-white/20 dark:border-white/5"
            style={{ background: 'var(--chat-bg, white)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">AgriNova AI Assistant</h3>
                  <p className="text-green-100 text-xs flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-300 inline-block animate-pulse" />
                    Online • Agriculture Expert
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="flex items-center gap-1 bg-white/20 text-white text-xs px-2.5 py-1.5 rounded-full hover:bg-white/30 transition-colors"
                  >
                    {LANGUAGES.find(l => l.code === language)?.label}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {showLangMenu && (
                    <div className="absolute top-9 right-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden w-32 z-10">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                          className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${language === lang.code ? 'text-green-600 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={clearChat} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <RotateCcw className="h-3.5 w-3.5 text-white" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2.5 bg-gray-50 dark:bg-gray-900/80 flex gap-2 overflow-x-auto scrollbar-none">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => sendMessage(p.text)}
                  className="flex-shrink-0 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full hover:border-green-400 hover:text-green-600 dark:hover:text-green-400 transition-colors whitespace-nowrap"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-950">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md">
                      <Leaf className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className={`group relative max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-tr-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => speak(msg.content)}
                        className="opacity-0 group-hover:opacity-100 self-start p-1 text-gray-400 hover:text-green-500 transition-all"
                      >
                        {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md flex-shrink-0">
                    <Leaf className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1.5 items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-2 border border-gray-200 dark:border-gray-700 focus-within:border-green-400 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask me about farming..."
                  className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100 outline-none placeholder-gray-400"
                  disabled={loading}
                />
                <button
                  onClick={toggleListening}
                  className={`p-1.5 rounded-full transition-colors ${isListening ? 'text-red-500 bg-red-100 animate-pulse' : 'text-gray-400 hover:text-green-600'}`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full disabled:opacity-40 hover:shadow-md transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
