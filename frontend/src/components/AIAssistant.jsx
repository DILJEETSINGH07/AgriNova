import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, X, Send, Mic, MicOff, Sparkles, Leaf, ChevronDown,
  Volume2, VolumeX, RotateCcw, BrainCircuit
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
      content: 'Namaste! 🙏 I\'m your AgriNova Intelligence. I can help with crop optimization, pest detection, and real-time market analytics. How can I assist your farm today?',
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
      <motion.button
        id="ai-assistant-btn"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-forest-900 text-white px-6 py-4 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(16,185,129,0.4)] hover:shadow-agrigreen-500/60 hover:scale-105 transition-all font-black uppercase tracking-widest text-xs border border-agrigreen-500/30 ${isOpen ? 'hidden' : 'flex'} ai-glow`}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <BrainCircuit className="h-5 w-5 text-agrigreen-400" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-agrigreen-500 animate-ping" />
        </div>
        <span>AgriNova Intelligence</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-assistant-panel"
            initial={{ opacity: 0, scale: 0.95, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: 40, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-8 right-8 z-50 w-[420px] max-h-[85vh] flex flex-col rounded-[2.5rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 backdrop-blur-3xl bg-white/90 dark:bg-forest-950/90"
          >
            <div className="bg-forest-900 p-6 flex items-center justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-agrigreen-500/10 blur-3xl rounded-full -mr-10 -mt-10" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-agrigreen-400 to-emerald-600 flex items-center justify-center shadow-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg tracking-tight">AgriNova AI</h3>
                  <p className="text-agrigreen-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-agrigreen-500 inline-block animate-pulse" />
                    Neural Active • Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="flex items-center gap-1.5 bg-white/10 text-white text-[10px] font-black uppercase px-3 py-2 rounded-xl hover:bg-white/20 transition-colors border border-white/10"
                  >
                    {LANGUAGES.find(l => l.code === language)?.label}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {showLangMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-11 right-0 bg-white dark:bg-forest-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-forest-800 overflow-hidden w-36 z-50"
                    >
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                          className={`w-full px-4 py-3 text-xs text-left hover:bg-agrigreen-50 dark:hover:bg-agrigreen-900/30 transition-colors font-bold ${language === lang.code ? 'text-agrigreen-600 bg-agrigreen-50 dark:bg-agrigreen-900/20' : 'text-gray-600 dark:text-gray-300'}`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2.5 bg-white/10 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all text-white border border-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50/50 dark:bg-black/20 flex gap-2 overflow-x-auto scrollbar-none border-b border-gray-100 dark:border-forest-800">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => sendMessage(p.text)}
                  className="flex-shrink-0 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-forest-900 border border-gray-200 dark:border-forest-800 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-xl hover:border-agrigreen-500 hover:text-agrigreen-600 dark:hover:text-agrigreen-400 transition-all whitespace-nowrap shadow-sm hover:shadow-md"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 h-9 w-9 rounded-2xl bg-gradient-to-br from-agrigreen-400 to-emerald-600 flex items-center justify-center shadow-lg border border-white/20">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className={`group relative max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                    <div className={`px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-forest-900 text-white rounded-tr-none'
                        : 'bg-white dark:bg-forest-900 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-forest-800 shadow-xl shadow-black/5'
                    }`}>
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {msg.role === 'assistant' && (
                        <>
                          <button onClick={() => speak(msg.content)} className="p-1.5 text-gray-400 hover:text-agrigreen-500 hover:bg-agrigreen-50 dark:hover:bg-agrigreen-900/20 rounded-lg transition-all">
                            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </button>
                          <button onClick={() => sendMessage('Tell me more about this.')} className="text-[10px] font-black uppercase text-gray-400 hover:text-agrigreen-500 tracking-widest">More Details</button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-agrigreen-400 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-forest-900 px-6 py-4 rounded-[1.5rem] rounded-tl-none border border-gray-100 dark:border-forest-800 shadow-xl shadow-black/5">
                    <div className="flex gap-2 items-center">
                      <div className="h-2 w-2 rounded-full bg-agrigreen-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 rounded-full bg-agrigreen-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 rounded-full bg-agrigreen-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white/50 dark:bg-black/20 border-t border-gray-100 dark:border-forest-800">
              <div className="flex items-center gap-3 bg-white dark:bg-forest-900 rounded-2xl px-5 py-3 border border-gray-200 dark:border-forest-800 shadow-xl focus-within:border-agrigreen-500 focus-within:ring-4 focus-within:ring-agrigreen-500/10 transition-all duration-300">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask AgriNova Intelligence..."
                  className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100 outline-none placeholder-gray-400 font-medium"
                  disabled={loading}
                />
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-xl transition-all ${isListening ? 'text-red-500 bg-red-500/10 animate-pulse' : 'text-gray-400 hover:text-agrigreen-600 hover:bg-agrigreen-50 dark:hover:bg-agrigreen-900/20'}`}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="p-2.5 bg-forest-900 text-white rounded-xl disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-agrigreen-500/20"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Powered by Gemini Pro</p>
                 <button onClick={clearChat} className="flex items-center gap-1.5 text-[9px] font-black uppercase text-gray-400 hover:text-red-500 transition-colors">
                    <RotateCcw className="h-3 w-3" />
                    Reset Neural Link
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
