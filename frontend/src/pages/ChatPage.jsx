import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Search, Circle, CheckCheck,
  Image, Smile, ArrowLeft, Phone, MoreVertical, User, Package,
  Sparkles, Bot, Mic, MicOff, Volume2, VolumeX, RotateCcw
} from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useLocation } from 'react-router-dom';

const EMOJIS = ['👍', '❤️', '😊', '🌱', '✅', '🙏'];
const QUICK_PROMPTS = [
  { label: '🌱 Crop Tips', text: 'What crops should I grow this season in India?' },
  { label: '🐛 Pest Help', text: 'My tomato leaves have yellow spots. What pest or disease could it be?' },
  { label: '🌾 Fertilizer', text: 'What fertilizer is best for rice cultivation?' },
  { label: '💰 Market Prices', text: 'What are current market prices for vegetables in India?' },
];

export default function ChatPage() {
  const { user } = useContext(AuthContext);
  const { socket } = useSocket();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // null, 'ai', or conversation object
  const [messages, setMessages] = useState([]);
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: 'Namaste! 🙏 I\'m your AgriNova Intelligence. How can I assist your farm today?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const autoOpenHandled = useRef(false);

  // Fallback demo conversations
  const demoConversations = [
    {
      _id: 'c1',
      otherUser: { name: 'Ramesh Singh', role: 'farmer', _id: 'u1' },
      lastMessage: { content: 'Yes, the tomatoes are ready for delivery!', createdAt: new Date(Date.now() - 3 * 60000) },
      unreadCount: 2,
    },
    {
      _id: 'c2',
      otherUser: { name: 'Priya Sharma', role: 'customer', _id: 'u2' },
      lastMessage: { content: 'Can I get 5kg of spinach?', createdAt: new Date(Date.now() - 25 * 60000) },
      unreadCount: 0,
    },
  ];

  const demoMessages = {
    c1: [
      { _id: 'm1', sender: { _id: 'u1', name: 'Ramesh Singh' }, content: 'Hello! Are you interested in fresh tomatoes?', createdAt: new Date(Date.now() - 30 * 60000) },
      { _id: 'm2', sender: { _id: user?._id || 'me', name: user?.name }, content: 'Yes! How much per kg?', createdAt: new Date(Date.now() - 25 * 60000) },
      { _id: 'm5', sender: { _id: 'u1', name: 'Ramesh Singh' }, content: 'Yes, the tomatoes are ready for delivery!', createdAt: new Date(Date.now() - 3 * 60000) },
    ],
    c2: [
      { _id: 'm6', sender: { _id: 'u2', name: 'Priya Sharma' }, content: 'Hi! I saw your spinach listing.', createdAt: new Date(Date.now() - 2 * 3600000) },
      { _id: 'm7', sender: { _id: 'u2', name: 'Priya Sharma' }, content: 'Can I get 5kg of spinach?', createdAt: new Date(Date.now() - 25 * 60000) },
    ],
  };

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?._id) return;
      try {
        const res = await api.get(`/chat/conversations?userId=${user._id}`);
        setConversations(res.data);
      } catch {
        setConversations([]);
      }
    };
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (conversations.length > 0 && location.state?.activeChatId && !autoOpenHandled.current) {
      const chat = conversations.find(c => c._id === location.state.activeChatId);
      if (chat) {
        autoOpenHandled.current = true;
        openChat(chat);
      }
    }
  }, [conversations, location.state]);

  useEffect(() => {
    if (!socket) return;
    
    const handleReceive = (data) => {
      if (activeChat && activeChat._id === data.chatId) {
        setMessages(prev => [...prev, data]);
      }
    };
    
    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [socket, activeChat]);

  const openChat = async (conv) => {
    if (conv === 'ai') {
      setActiveChat('ai');
      return;
    }
    setActiveChat(conv);
    if (socket) {
      socket.emit('join_room', conv._id);
    }
    setLoadingMsgs(true);
    try {
      const res = await api.get(`/chat/messages/${conv._id}`);
      setMessages(res.data.length ? res.data : (demoMessages[conv._id] || []));
    } catch {
      setMessages(demoMessages[conv._id] || []);
    } finally {
      setLoadingMsgs(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiMessages, activeChat]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    if (activeChat === 'ai') {
      const userMsg = { role: 'user', content: newMessage };
      const currentHistory = [...aiMessages];
      setAiMessages(prev => [...prev, userMsg]);
      setNewMessage('');
      setAiLoading(true);

      try {
        const res = await api.post('/ai/chat', {
          message: newMessage,
          history: currentHistory.map(m => ({ role: m.role, content: m.content })),
        });
        setAiMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
      } catch (err) {
        setAiMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Neural link interrupted. Please try again.' }]);
      } finally {
        setAiLoading(false);
      }
      return;
    }

    if (!activeChat) return;

    const msg = {
      _id: `local-${Date.now()}`,
      chatId: activeChat._id,
      sender: { _id: user?._id || 'me', name: user?.name },
      content: newMessage,
      createdAt: new Date(),
      isLocal: true,
    };
    
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setShowEmojis(false);
    
    if (socket) {
      socket.emit('send_message', msg);
    }
    
    try {
       await api.post('/chat/message', {
         chatId: activeChat._id,
         sender: user?._id,
         content: msg.content,
         messageType: 'text'
       });
    } catch (err) {
       console.error("Failed to send message", err);
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const filteredConvs = conversations.filter(c =>
    c.otherUser?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const isMe = (msg) => {
    const senderId = msg.sender?._id || msg.sender;
    return senderId === user?._id || senderId === 'me' || msg.isLocal;
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full md:w-80 lg:w-96 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-agrigreen-600" /> Messages
          </h2>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 outline-none placeholder-gray-400 focus:ring-2 ring-agrigreen-400/50 transition-all"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {/* AI SPECIAL SLOT */}
          <button
            onClick={() => openChat('ai')}
            className={`w-full flex items-center gap-3 p-4 hover:bg-agrigreen-50 dark:hover:bg-agrigreen-900/10 transition-colors border-b border-agrigreen-100 dark:border-agrigreen-900/30 text-left ${activeChat === 'ai' ? 'bg-agrigreen-50 dark:bg-agrigreen-900/20 border-r-4 border-r-agrigreen-500' : ''}`}
          >
            <div className="relative flex-shrink-0">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-agrigreen-400 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                <Bot className="h-6 w-6" />
              </div>
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-agrigreen-500 border-2 border-white dark:border-gray-900 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="font-black text-gray-900 dark:text-white text-sm tracking-tight flex items-center gap-1.5">
                  AgriNova AI
                  <span className="text-[8px] bg-agrigreen-100 dark:bg-agrigreen-900/40 text-agrigreen-600 dark:text-agrigreen-400 px-1.5 py-0.5 rounded font-black uppercase tracking-widest">Core</span>
                </p>
                <span className="text-[10px] text-agrigreen-500 font-bold uppercase tracking-widest">Active</span>
              </div>
              <p className="text-xs text-agrigreen-600 dark:text-agrigreen-400 truncate font-medium mt-0.5">Your intelligent farming partner</p>
            </div>
          </button>

          {filteredConvs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No other conversations yet</p>
            </div>
          ) : (
            filteredConvs.map((conv) => (
              <button
                key={conv._id}
                onClick={() => openChat(conv)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800/50 text-left ${activeChat?._id === conv._id ? 'bg-agrigreen-50 dark:bg-agrigreen-900/20 border-r-4 border-r-agrigreen-500' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg shadow-sm">
                    {conv.otherUser?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{conv.otherUser?.name}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                      {conv.lastMessage?.createdAt ? formatTime(conv.lastMessage.createdAt) : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage?.content || 'Start a conversation'}</p>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 bg-agrigreen-500 text-white text-[10px] font-bold h-4.5 w-4.5 min-w-[1.1rem] rounded-full flex items-center justify-center px-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat === 'ai' ? (
          <>
            {/* AI Header */}
            <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-agrigreen-500/5 blur-3xl rounded-full" />
               <button onClick={() => setActiveChat(null)} className="md:hidden p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-agrigreen-400 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                <Bot className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  AgriNova Intelligence
                  <Sparkles className="h-4 w-4 text-agrigreen-500" />
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-agrigreen-600 dark:text-agrigreen-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-agrigreen-500 animate-pulse" />
                  Neural Processor Online
                </p>
              </div>
            </div>

            {/* AI Quick Prompts */}
            <div className="px-4 py-3 bg-gray-50/50 dark:bg-black/20 flex gap-2 overflow-x-auto scrollbar-none border-b border-gray-100 dark:border-gray-800">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setNewMessage(p.text); handleSend(); }}
                  className="flex-shrink-0 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-xl hover:border-agrigreen-500 hover:text-agrigreen-600 dark:hover:text-agrigreen-400 transition-all shadow-sm"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* AI Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-950/50">
              {aiMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.role === 'assistant' && (
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-agrigreen-400 to-emerald-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                        <Bot className="h-5 w-5" />
                      </div>
                    )}
                    <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gray-900 text-white rounded-tr-none'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {aiLoading && (
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-xl bg-agrigreen-100 dark:bg-agrigreen-900/30 flex items-center justify-center text-agrigreen-600 flex-shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm flex gap-1.5">
                    <span className="h-2 w-2 bg-agrigreen-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 bg-agrigreen-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 bg-agrigreen-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        ) : activeChat ? (
          <>
            {/* P2P Header */}
            <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3 shadow-sm">
              <button onClick={() => setActiveChat(null)} className="md:hidden p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold shadow-sm">
                {activeChat.otherUser?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white">{activeChat.otherUser?.name}</p>
                <p className="text-[10px] text-agrigreen-500 font-black uppercase tracking-widest flex items-center gap-1">
                  <Circle className="h-2 w-2 fill-current" /> Online
                </p>
              </div>
              <div className="flex gap-2 text-gray-400">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <Phone className="h-4.5 w-4.5" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <MoreVertical className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* P2P Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-950">
              {loadingMsgs ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-agrigreen-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                messages.map((msg) => {
                  const mine = isMe(msg);
                  return (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${mine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                          mine
                            ? 'bg-agrigreen-600 text-white rounded-br-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm border border-transparent dark:border-gray-700'
                        }`}>
                          {msg.content}
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] text-gray-400 px-1 ${mine ? 'flex-row-reverse' : ''}`}>
                          <span>{formatTime(msg.createdAt)}</span>
                          {mine && <CheckCheck className="h-3 w-3 text-agrigreen-400" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-gray-950">
            <div className="h-24 w-24 rounded-3xl bg-agrigreen-100 dark:bg-agrigreen-900/20 flex items-center justify-center mb-6">
              <MessageSquare className="h-12 w-12 text-agrigreen-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Your Digital Marketplace Chat</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-8">Connect with farmers, buyers, or our AgriNova AI to optimize your farming journey.</p>
            <button
               onClick={() => openChat('ai')}
               className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-xl"
            >
              <Bot className="h-5 w-5" />
              Chat with AgriNova AI
            </button>
          </div>
        )}

        {/* Input Area (Shared) */}
        {activeChat && (
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              {!activeChat === 'ai' && (
                <button
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="p-2 text-gray-400 hover:text-agrigreen-500 transition-colors"
                >
                  <Smile className="h-6 w-6" />
                </button>
              )}
              <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 focus-within:ring-2 ring-agrigreen-500/20 transition-all">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={activeChat === 'ai' ? "Ask AgriNova Intelligence..." : "Type a message..."}
                  className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100 outline-none placeholder-gray-400 font-medium"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!newMessage.trim() || aiLoading}
                className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                  activeChat === 'ai' 
                    ? 'bg-agrigreen-600 text-white hover:shadow-agrigreen-500/30' 
                    : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                } disabled:opacity-40`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
