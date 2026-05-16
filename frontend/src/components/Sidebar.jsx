import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Settings, Compass, Phone, HelpCircle, 
  User, LayoutDashboard, MessageSquare, LogOut, ChevronRight,
  ShieldCheck, Bell, Info
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Explore', icon: Compass, path: '/#products' },
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Contact Us', icon: Phone, path: '/contact' },
    { label: 'Help Center', icon: HelpCircle, path: '/help' },
  ];

  const dashboardPath = user?.role === 'admin' 
    ? '/admin-dashboard' 
    : (user?.role === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard');

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-950 z-[101] shadow-2xl flex flex-col border-r border-gray-100 dark:border-gray-800"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-50 dark:border-gray-900">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-agrigreen-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-agrigreen-500/20">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white leading-tight">
                    {user ? user.name : 'Guest User'}
                  </h3>
                  <p className="text-[10px] font-bold text-agrigreen-600 dark:text-agrigreen-400 uppercase tracking-widest">
                    {user ? user.role : 'Welcome to AgriNova'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu Sections */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
              {/* Primary Navigation */}
              <div>
                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Navigation</p>
                <div className="space-y-1">
                  {user && (
                    <Link
                      to={dashboardPath}
                      onClick={onClose}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-agrigreen-50 dark:hover:bg-agrigreen-900/10 text-gray-600 dark:text-gray-300 hover:text-agrigreen-600 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <LayoutDashboard className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="font-bold">Dashboard</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  )}
                  <Link
                    to="/chat"
                    onClick={onClose}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-agrigreen-50 dark:hover:bg-agrigreen-900/10 text-gray-600 dark:text-gray-300 hover:text-agrigreen-600 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="font-bold">Messages</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                </div>
              </div>

              {/* Discover & Support */}
              <div>
                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Discover & Support</p>
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={onClose}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform text-gray-400 group-hover:text-agrigreen-600" />
                        <span className="font-bold">{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Security & System */}
              <div>
                 <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Account Security</p>
                 <div className="space-y-1 px-2">
                    <div className="flex items-center gap-3 px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                       <ShieldCheck className="h-4 w-4 text-agrigreen-600" />
                       End-to-end encrypted
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                       <Bell className="h-4 w-4" />
                       Smart Notifications
                    </div>
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-50 dark:border-gray-900">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                  <LogOut className="h-5 w-5" />
                  Logout Securely
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-agrigreen-600 text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-agrigreen-500/20"
                >
                  Join AgriNova
                </Link>
              )}
              <div className="mt-6 flex items-center justify-center gap-4 text-gray-400 dark:text-gray-600">
                 <Info className="h-4 w-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Version 2.0.4-beta</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
