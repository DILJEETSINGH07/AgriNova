import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ShoppingCart, User, Moon, Sun, MessageSquare, Sparkles, Bot, Menu } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { toggleCart, cartItems } = useContext(CartContext);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 backdrop-blur-2xl border-b border-white/5 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMenuClick}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm active:shadow-inner"
            >
              <Menu className="h-6 w-6" />
            </motion.button>

            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-agrigreen-500 to-emerald-700 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 shadow-agrigreen-500/20">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">AgriNova</span>
                <span className="text-[10px] font-bold text-agrigreen-600 dark:text-agrigreen-400 tracking-[0.2em] uppercase flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  AI Powered
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
             <Link to="/" className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-agrigreen-600 dark:hover:text-agrigreen-400 transition-colors rounded-xl hover:bg-agrigreen-50 dark:hover:bg-agrigreen-900/10">Home</Link>
             <Link to="/#products" className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-agrigreen-600 dark:hover:text-agrigreen-400 transition-colors rounded-xl hover:bg-agrigreen-50 dark:hover:bg-agrigreen-900/10">Marketplace</Link>
             {user?.role === 'customer' && (
               <Link to="/customer-dashboard" className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-agrigreen-600 dark:hover:text-agrigreen-400 transition-colors rounded-xl hover:bg-agrigreen-50 dark:hover:bg-agrigreen-900/10">My Orders</Link>
             )}
             <Link to="/chat" className="px-4 py-2 text-sm font-black text-agrigreen-600 dark:text-agrigreen-400 flex items-center gap-2 hover:scale-105 transition-transform group bg-agrigreen-50 dark:bg-agrigreen-900/20 rounded-xl ml-4 border border-agrigreen-100 dark:border-agrigreen-800">
               <Bot className="h-4.5 w-4.5 group-hover:animate-bounce" />
               Ask AI
               <span className="bg-agrigreen-500 text-white text-[7px] px-1.5 py-0.5 rounded-full font-black animate-pulse">LIVE</span>
             </Link>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme} 
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-500" />}
            </motion.button>

            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/chat"
                    className="flex items-center gap-2 p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-agrigreen-50 dark:hover:bg-agrigreen-900/20 hover:text-agrigreen-600 transition-all border border-transparent hover:border-agrigreen-100 dark:hover:border-agrigreen-800 relative shadow-sm"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-agrigreen-500 animate-ping" />
                  </Link>
                </motion.div>

                {user.role === 'customer' && (
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleCart} 
                    className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all relative border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-tr from-agrigreen-500 to-emerald-600 text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-black shadow-lg">
                        {cartItems.length}
                      </span>
                    )}
                  </motion.button>
                )}

                <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block"></div>

                <Link 
                  to={user.role === 'admin' ? '/admin-dashboard' : (user.role === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard')}
                  className="flex items-center space-x-3 group pl-2"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-agrigreen-100 to-agrigreen-200 dark:from-agrigreen-900/50 dark:to-agrigreen-800/50 flex items-center justify-center border border-agrigreen-200 dark:border-agrigreen-700 group-hover:shadow-md transition-all shadow-sm">
                    <User className="h-5 w-5 text-agrigreen-700 dark:text-agrigreen-400" />
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-black text-gray-900 dark:text-white leading-none group-hover:text-agrigreen-600 transition-colors">{user.name}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mt-1">{user.role}</p>
                  </div>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-agrigreen-600 transition-colors px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">Login</Link>
                <Link to="/login?signup=true" className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-sm font-black hover:scale-105 transition-all shadow-xl hover:shadow-agrigreen-500/20 active:scale-95">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
