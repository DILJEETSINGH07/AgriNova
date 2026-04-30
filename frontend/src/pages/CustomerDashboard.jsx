import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, CheckCircle, Store, ShoppingCart, User, Package } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('shop');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const { cartItems, toggleCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Herbs'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch {
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          const res = await api.get('/orders/myorders');
          setOrders(res.data);
        } catch (err) {
          console.error('Failed to fetch orders', err);
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  const filteredProducts = category === 'All'
    ? products
    : products.filter(p => p.category === category);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 mt-1">Browse fresh produce from local farmers.</p>
        </div>
        <button
          onClick={toggleCart}
          className="relative flex items-center gap-2 bg-agrigreen-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-agrigreen-700 transition-colors shadow-md"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Cart</span>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
          {cartTotal > 0 && (
            <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-sm">₹{cartTotal.toFixed(0)}</span>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 border-b border-gray-200">
        {[
          { id: 'shop', icon: Store, label: 'Shop' },
          { id: 'orders', icon: Package, label: 'My Orders' },
          { id: 'profile', icon: User, label: 'Profile' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-agrigreen-500 text-agrigreen-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* SHOP TAB */}
      {activeTab === 'shop' && (
        <div>
          {/* Category Filter */}
          <div className="flex gap-3 mb-8 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  category === cat
                    ? 'bg-agrigreen-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-agrigreen-400 hover:text-agrigreen-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-gray-100">
                  <div className="bg-gray-200 h-48 rounded-t-2xl"></div>
                  <div className="p-5">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {ordersLoading ? (
            <div className="text-center py-8 text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
              <p className="text-gray-400 mb-6">Head to the shop tab and place your first order!</p>
              <button
                onClick={() => setActiveTab('shop')}
                className="bg-agrigreen-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-agrigreen-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">#{order._id.substring(0, 8).toUpperCase()}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {' · '}{order.products.length} item{order.products.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                      {order.status === 'shipped' && <Truck className="w-3 h-3" />}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                {order.products?.length > 0 && (
                  <div className="mt-4 flex gap-3 flex-wrap">
                    {order.products.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 text-sm text-gray-600">
                        {item.product?.imageUrl && (
                          <img src={item.product.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        )}
                        <span className="font-medium">{item.product?.name || 'Product'}</span>
                        <span className="text-gray-400">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="max-w-md">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-agrigreen-100 flex items-center justify-center">
                <User className="h-8 w-8 text-agrigreen-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <span className="inline-block mt-1 px-3 py-0.5 bg-agrigreen-100 text-agrigreen-700 text-xs font-semibold rounded-full capitalize">{user?.role}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-3 text-sm text-gray-600">
              <p><span className="font-semibold text-gray-700">Email:</span> {user?.email}</p>
              <p><span className="font-semibold text-gray-700">Role:</span> {user?.role}</p>
              <p><span className="font-semibold text-gray-700">Location:</span> {user?.location || 'Not set'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const FALLBACK_PRODUCTS = [
  { _id: 'f1', name: 'Organic Tomatoes', price: 40, unit: 'kg', category: 'Vegetables', description: 'Freshly picked, sun-ripened tomatoes.', imageUrl: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&auto=format&fit=crop', farmer: { name: 'Ramesh Singh' } },
  { _id: 'f2', name: 'Alphonso Mangoes', price: 150, unit: 'kg', category: 'Fruits', description: 'Sweet and juicy, the king of fruits.', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop', farmer: { name: 'Suresh Kumar' } },
  { _id: 'f3', name: 'Crispy Carrots', price: 30, unit: 'kg', category: 'Vegetables', description: 'Sweet and crunchy farm-fresh carrots.', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop', farmer: { name: 'Ramesh Singh' } },
  { _id: 'f4', name: 'Fresh Strawberries', price: 80, unit: 'box', category: 'Fruits', description: 'Plump and sweet strawberries.', imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&auto=format&fit=crop', farmer: { name: 'Suresh Kumar' } },
  { _id: 'f5', name: 'Free-Range Eggs', price: 80, unit: 'dozen', category: 'Dairy', description: 'Farm fresh eggs from happy, pasture-raised hens.', imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&auto=format&fit=crop', farmer: { name: 'Ramesh Singh' } },
  { _id: 'f6', name: 'Fresh Spinach', price: 20, unit: 'bunch', category: 'Vegetables', description: 'Nutrient-rich spinach leaves, farm fresh.', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop', farmer: { name: 'Ramesh Singh' } },
  { _id: 'f7', name: 'Green Apples', price: 120, unit: 'kg', category: 'Fruits', description: 'Crisp green apples, perfect for a healthy snack.', imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&auto=format&fit=crop', farmer: { name: 'Suresh Kumar' } },
  { _id: 'f8', name: 'Fresh Basil', price: 20, unit: 'bunch', category: 'Herbs', description: 'Aromatic basil perfect for pesto or garnish.', imageUrl: 'https://images.unsplash.com/photo-1629385701021-fcd568a743a8?w=400&auto=format&fit=crop', farmer: { name: 'Suresh Kumar' } },
];
