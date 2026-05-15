import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ShoppingCart, User, Moon, Sun, MessageSquare } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { toggleCart, cartItems } = useContext(CartContext);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-agrigreen-500 dark:text-agrigreen-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">AgriNova</span>
          </Link>

          <div className="flex items-center space-x-6">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin-dashboard' : (user.role === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard')}
                  className="text-gray-600 dark:text-gray-300 hover:text-agrigreen-600 dark:hover:text-agrigreen-400 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/chat"
                  className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-agrigreen-600 dark:hover:text-agrigreen-400 font-medium"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Chat</span>
                </Link>
                {user.role === 'customer' && (
                  <button onClick={toggleCart} className="text-gray-600 dark:text-gray-300 hover:text-agrigreen-600 dark:hover:text-agrigreen-400 relative">
                    <ShoppingCart className="h-6 w-6" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-agrigreen-50 dark:bg-agrigreen-900/30 text-agrigreen-700 dark:text-agrigreen-400 px-4 py-2 rounded-full text-sm font-medium hover:bg-agrigreen-100 dark:hover:bg-agrigreen-900/50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={toggleCart} className="text-gray-600 dark:text-gray-300 hover:text-agrigreen-600 dark:hover:text-agrigreen-400 relative mr-4">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-agrigreen-600 dark:hover:text-agrigreen-400 font-medium">Login</Link>
                <Link to="/login?signup=true" className="bg-gradient-to-r from-agrigreen-500 to-agrigreen-600 text-white px-5 py-2 rounded-full font-medium hover:from-agrigreen-600 hover:to-agrigreen-700 transition-all shadow-md hover:shadow-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
