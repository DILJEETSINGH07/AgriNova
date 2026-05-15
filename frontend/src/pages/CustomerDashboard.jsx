import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Truck, CheckCircle, Store, ShoppingCart,
  User, Package, Clock, Star, MapPin, Search, Filter
} from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07 } }),
};

const FALLBACK_PRODUCTS = [
  { _id: 'f1', name: 'Organic Tomatoes', price: 40, unit: 'kg', category: 'Vegetables', description: 'Sun-ripened, freshly picked.', imageUrl: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&auto=format&fit=crop', farmer: { name: 'Ramesh Singh' } },
  { _id: 'f2', name: 'Alphonso Mangoes', price: 150, unit: 'kg', category: 'Fruits', description: 'The king of fruits.', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop', farmer: { name: 'Suresh Kumar' } },
  { _id: 'f3', name: 'Crispy Carrots', price: 30, unit: 'kg', category: 'Vegetables', description: 'Sweet and crunchy.', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop', farmer: { name: 'Ramesh Singh' } },
  { _id: 'f4', name: 'Fresh Strawberries', price: 80, unit: 'box', category: 'Fruits', description: 'Plump and sweet.', imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&auto=format&fit=crop', farmer: { name: 'Suresh Kumar' } },
  { _id: 'f5', name: 'Free-Range Eggs', price: 80, unit: 'dozen', category: 'Dairy', description: 'From pasture-raised hens.', imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&auto=format&fit=crop', farmer: { name: 'Ramesh Singh' } },
  { _id: 'f6', name: 'Fresh Spinach', price: 20, unit: 'bunch', category: 'Vegetables', description: 'Nutrient-rich leaves.', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop', farmer: { name: 'Ramesh Singh' } },
  { _id: 'f7', name: 'Green Apples', price: 120, unit: 'kg', category: 'Fruits', description: 'Crisp and healthy.', imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&auto=format&fit=crop', farmer: { name: 'Suresh Kumar' } },
  { _id: 'f8', name: 'Fresh Basil', price: 20, unit: 'bunch', category: 'Herbs', description: 'Aromatic basil.', imageUrl: 'https://images.unsplash.com/photo-1629385701021-fcd568a743a8?w=400&auto=format&fit=crop', farmer: { name: 'Suresh Kumar' } },
];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('shop');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItems, toggleCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Herbs'];
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data?.length > 0 ? res.data : FALLBACK_PRODUCTS);
      } catch { setProducts(FALLBACK_PRODUCTS); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      const fetch = async () => {
        setOrdersLoading(true);
        try {
          const res = await api.get('/orders/myorders');
          setOrders(res.data);
        } catch { setOrders([]); }
        finally { setOrdersLoading(false); }
      };
      fetch();
    }
  }, [activeTab]);

  const filteredProducts = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const tabs = [
    { id: 'shop', label: 'Shop', icon: Store },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Customer Portal</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Fresh produce from local farmers, delivered to you.</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={toggleCart}
            className="relative flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-green-400/30 transition-all"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
            {cartTotal > 0 && (
              <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-sm">₹{cartTotal.toFixed(0)}</span>
            )}
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl mb-8 w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </button>
          ))}
        </div>

        {/* SHOP TAB */}
        {activeTab === 'shop' && (
          <div>
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      category === cat
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-400 hover:text-green-600 dark:hover:text-green-400'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse glass-card h-72">
                    <div className="bg-gray-200 dark:bg-gray-700 h-44 rounded-t-2xl" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No products found</h3>
                <p className="text-gray-400 text-sm mt-1">Try a different category or search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, i) => (
                  <motion.div key={product._id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="glass-card p-8 text-center text-gray-400">Loading your orders...</div>
            ) : orders.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No orders yet</h3>
                <p className="text-gray-400 mb-6">Head to the shop and place your first order!</p>
                <button onClick={() => setActiveTab('shop')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
                  Start Shopping
                </button>
              </div>
            ) : (
              orders.map((order, i) => (
                <motion.div key={order._id} custom={i} variants={cardVariants} initial="hidden" animate="visible" className="glass-card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">#{order._id.substring(0, 8).toUpperCase()}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {' · '}{order.products.length} item{order.products.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-black text-gray-900 dark:text-white">₹{order.totalAmount.toFixed(2)}</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {order.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                        {order.status === 'shipped' && <Truck className="w-3 h-3" />}
                        {order.status === 'pending' && <Clock className="w-3 h-3" />}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  {order.products?.length > 0 && (
                    <div className="mt-4 flex gap-2 flex-wrap pt-3 border-t border-gray-100 dark:border-gray-700">
                      {order.products.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md">
            <div className="glass-card overflow-hidden">
              {/* Profile Hero */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-4 shadow-xl">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white">{user?.name}</h2>
                <span className="mt-2 px-4 py-1 bg-white/20 text-white text-sm font-semibold rounded-full capitalize">{user?.role}</span>
              </div>
              {/* Details */}
              <div className="p-6 space-y-4">
                {[
                  { label: 'Email', value: user?.email, icon: '📧' },
                  { label: 'Role', value: user?.role, icon: '🎭' },
                  { label: 'Location', value: user?.location || 'Not set', icon: '📍' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{item.value}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-2 grid grid-cols-2 gap-3 text-center">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-2xl font-black text-green-600 dark:text-green-400">{orders.length || '—'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Orders</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{cartItems.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cart Items</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
