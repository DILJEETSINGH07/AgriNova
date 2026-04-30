import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CartDrawer() {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const [paymentStep, setPaymentStep] = useState(null); // 'processing', 'success'

  const handleCheckout = async () => {
    if (!user) {
      toggleCart();
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    setPaymentStep('processing');
    
    try {
      // Simulate payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentStep('success');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const orderData = {
        products: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: user.location || '123 Main St, Default City' // Simplification for now
      };

      await api.post('/orders', orderData);
      clearCart();
      toggleCart();
      navigate('/customer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
      setPaymentStep(null);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold flex items-center">
                <ShoppingBag className="mr-2" /> Your Cart
              </h2>
              <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  Your cart is empty.
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-4">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                        <p className="text-agrigreen-600 font-bold">₹{item.price}</p>
                        <div className="flex items-center mt-2 space-x-3">
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <div className="flex justify-between items-center mb-4 text-lg font-bold">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || loading}
                className={`w-full text-white py-4 rounded-xl font-bold transition-colors disabled:opacity-50 ${paymentStep === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-agrigreen-600 hover:bg-agrigreen-700'}`}
              >
                {paymentStep === 'processing' ? 'Processing Payment...' : 
                 paymentStep === 'success' ? 'Payment Successful!' : 
                 (user ? 'Proceed to Checkout' : 'Login to Checkout')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
