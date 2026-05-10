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

  // Helper to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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
      // 1. Load script
      const res = await loadRazorpayScript();
      if (!res) {
        setError('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        setPaymentStep(null);
        return;
      }

      // 2. Create order on backend
      const result = await api.post('/orders/razorpay/create', { amount: totalAmount });
      if (!result.data) {
        throw new Error('Server error. Are you online?');
      }

      const { amount, id: order_id, currency } = result.data;

      // 3. Open Razorpay widget
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock', 
        amount: amount.toString(),
        currency: currency,
        name: 'AgriNova',
        description: 'Direct Farm-to-Table Payment',
        image: '/images/agrinova_logo.png',
        order_id: order_id,
        handler: async function (response) {
          try {
            setPaymentStep('processing');
            // 4. Verify Payment on Backend
            await api.post('/orders/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setPaymentStep('success');
            await new Promise(r => setTimeout(r, 1000));

            // 5. Create AgriNova order
            const orderData = {
              products: cartItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price
              })),
              shippingAddress: user.location || '123 Main St, Default City'
            };

            await api.post('/orders', orderData);
            clearCart();
            toggleCart();
            navigate('/customer-dashboard');
          } catch (verifyError) {
            setError('Payment verification failed');
            setPaymentStep(null);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: '9999999999',
        },
        theme: {
          color: '#16a34a',
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        setError(response.error.description || 'Payment Failed');
        setPaymentStep(null);
      });

      paymentObject.open();

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
