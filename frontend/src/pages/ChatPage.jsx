import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Search, Circle, CheckCheck,
  Image, Smile, ArrowLeft, Phone, MoreVertical, User, Package
} from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EMOJIS = ['👍', '❤️', '😊', '🌱', '✅', '🙏'];

export default function ChatPage() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const messagesEndRef = useRef(null);

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
    {
      _id: 'c3',
      otherUser: { name: 'Suresh Kumar', role: 'farmer', _id: 'u3' },
      lastMessage: { content: 'Price is ₹40/kg, minimum 2kg order.', createdAt: new Date(Date.now() - 2 * 3600000) },
      unreadCount: 1,
    },
  ];

  const demoMessages = {
    c1: [
      { _id: 'm1', sender: { _id: 'u1', name: 'Ramesh Singh' }, content: 'Hello! Are you interested in fresh tomatoes?', createdAt: new Date(Date.now() - 30 * 60000) },
      { _id: 'm2', sender: { _id: user?._id || 'me', name: user?.name }, content: 'Yes! How much per kg?', createdAt: new Date(Date.now() - 25 * 60000) },
      { _id: 'm3', sender: { _id: 'u1', name: 'Ramesh Singh' }, content: '₹45/kg, freshly harvested this morning. 🍅', createdAt: new Date(Date.now() - 20 * 60000) },
      { _id: 'm4', sender: { _id: user?._id || 'me', name: user?.name }, content: 'Great! I\'ll take 5kg. Can you deliver?', createdAt: new Date(Date.now() - 15 * 60000) },
      { _id: 'm5', sender: { _id: 'u1', name: 'Ramesh Singh' }, content: 'Yes, the tomatoes are ready for delivery!', createdAt: new Date(Date.now() - 3 * 60000) },
    ],
    c2: [
      { _id: 'm6', sender: { _id: 'u2', name: 'Priya Sharma' }, content: 'Hi! I saw your spinach listing.', createdAt: new Date(Date.now() - 2 * 3600000) },
      { _id: 'm7', sender: { _id: 'u2', name: 'Priya Sharma' }, content: 'Can I get 5kg of spinach?', createdAt: new Date(Date.now() - 25 * 60000) },
    ],
    c3: [
      { _id: 'm8', sender: { _id: 'u3', name: 'Suresh Kumar' }, content: 'Welcome! What are you looking for?', createdAt: new Date(Date.now() - 5 * 3600000) },
      { _id: 'm9', sender: { _id: user?._id || 'me', name: user?.name }, content: 'Do you have mangoes?', createdAt: new Date(Date.now() - 4 * 3600000) },
      { _id: 'm10', sender: { _id: 'u3', name: 'Suresh Kumar' }, content: 'Price is ₹40/kg, minimum 2kg order.', createdAt: new Date(Date.now() - 2 * 3600000) },
    ],
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations');
        setConversations(res.data.length ? res.data : demoConversations);
      } catch {
        setConversations(demoConversations);
      }
    };
    fetchConversations();
  }, []);

  const openChat = async (conv) => {
    setActiveChat(conv);
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
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !activeChat) return;
    const msg = {
      _id: `local-${Date.now()}`,
      sender: { _id: user?._id || 'me', name: user?.name },
      content: newMessage,
      createdAt: new Date(),
      isLocal: true,
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setShowEmojis(false);
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
            <MessageSquare className="h-5 w-5 text-green-600" /> Messages
          </h2>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 outline-none placeholder-gray-400 focus:ring-2 ring-green-400/50 transition-all"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConvs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            filteredConvs.map((conv) => (
              <button
                key={conv._id}
                onClick={() => openChat(conv)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800/50 text-left ${activeChat?._id === conv._id ? 'bg-green-50 dark:bg-green-900/20 border-r-2 border-r-green-500' : ''}`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {conv.otherUser?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{conv.otherUser?.name}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                      {conv.lastMessage?.createdAt ? formatTime(conv.lastMessage.createdAt) : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage?.content || 'Start a conversation'}</p>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 bg-green-500 text-white text-[10px] font-bold h-4.5 w-4.5 min-w-[1.1rem] rounded-full flex items-center justify-center px-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] capitalize mt-0.5 font-medium ${conv.otherUser?.role === 'farmer' ? 'text-green-600' : 'text-blue-500'}`}>
                    {conv.otherUser?.role}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3 shadow-sm">
              <button onClick={() => setActiveChat(null)} className="md:hidden p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                {activeChat.otherUser?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">{activeChat.otherUser?.name}</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'var(--chat-bg, #f0fdf4)' }}>
              {loadingMsgs ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
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
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-br-sm'
                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-gray-700'
                        }`}>
                          {msg.content}
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] text-gray-400 px-1 ${mine ? 'flex-row-reverse' : ''}`}>
                          <span>{formatTime(msg.createdAt)}</span>
                          {mine && <CheckCheck className="h-3 w-3 text-green-400" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="px-4 py-2 bg-white dark:bg-gray-900 flex gap-3 border-t border-gray-100 dark:border-gray-800"
                >
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => setNewMessage(m => m + e)} className="text-xl hover:scale-125 transition-transform">
                      {e}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                >
                  <Smile className="h-5 w-5" />
                </button>
                <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100 outline-none placeholder-gray-400"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center disabled:opacity-40 hover:shadow-md hover:shadow-green-400/30 transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
              <MessageSquare className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Start a Conversation</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs">Select a conversation from the left to start chatting with farmers and buyers.</p>
          </div>
        )}
      </div>
    </div>
  );
}
