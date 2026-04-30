import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ShoppingCart, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { toggleCart, cartItems } = useContext(CartContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-agrigreen-600" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">AgriNova</span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin-dashboard' : (user.role === 'farmer' ? '/farmer-dashboard' : '/customer-dashboard')}
                  className="text-gray-600 hover:text-agrigreen-600 font-medium"
                >
                  Dashboard
                </Link>
                {user.role === 'customer' && (
                  <button onClick={toggleCart} className="text-gray-600 hover:text-agrigreen-600 relative">
                    <ShoppingCart className="h-6 w-6" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-agrigreen-50 text-agrigreen-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-agrigreen-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={toggleCart} className="text-gray-600 hover:text-agrigreen-600 relative mr-4">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>
                <Link to="/login" className="text-gray-600 hover:text-agrigreen-600 font-medium">Login</Link>
                <Link to="/login?signup=true" className="bg-agrigreen-600 text-white px-5 py-2 rounded-full font-medium hover:bg-agrigreen-700 transition-colors shadow-md hover:shadow-lg">
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
