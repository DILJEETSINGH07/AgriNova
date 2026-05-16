import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PlusCircle, Package, TrendingUp, IndianRupee,
  CheckCircle, Truck, Clock, BarChart2, Leaf, AlertCircle, Sparkles, Bot, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

export default function FarmerDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', price: '', unit: 'kg', quantity: '', category: 'Vegetables', description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        api.get('/products/farmer/myproducts'),
        api.get('/orders/farmerorders'),
      ]);
      setProducts(prodRes.data);
      setOrders(ordRes.data);
    } catch { setProducts([]); setOrders([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const dayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === d.toDateString());
    return { day: label, revenue: dayOrders.reduce((s, o) => s + o.totalAmount, 0) };
  });

  const categoryData = ['Vegetables', 'Fruits', 'Dairy', 'Herbs'].map(cat => ({
    name: cat, value: products.filter(p => p.category === cat).length || 0,
  })).filter(d => d.value > 0);

  const stats = [
    { label: 'Revenue', value: `₹${totalRevenue.toFixed(0)}`, icon: IndianRupee, color: 'from-green-500 to-emerald-600' },
    { label: 'Listings', value: products.length, icon: Package, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Orders', value: orders.length, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'Pending', value: pendingOrders, icon: Clock, color: 'from-amber-400 to-orange-500' },
  ];

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', { ...formData, price: Number(formData.price), quantity: Number(formData.quantity) });
      setShowAddForm(false);
      setFormData({ name: '', price: '', unit: 'kg', quantity: '', category: 'Vegetables', description: '' });
      fetchData();
    } catch { alert('Failed to add product.'); }
  };

  const updateOrderStatus = async (id, status) => {
    try { await api.put(`/orders/${id}/status`, { status }); fetchData(); }
    catch { alert('Failed to update.'); }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Farmer Portal</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Welcome, <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👨‍🌾
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your farm, listings, and orders.</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-green-400/30 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            {showAddForm ? 'Cancel' : 'Add Product'}
          </motion.button>
        </motion.div>

        {/* AI INSIGHTS SLOT */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-[2rem] bg-forest-900 relative overflow-hidden shadow-2xl group border border-white/5"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-agrigreen-500/10 blur-3xl rounded-full -mr-20 -mt-20 group-hover:bg-agrigreen-500/20 transition-all duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="h-20 w-20 rounded-[1.5rem] bg-gradient-to-br from-agrigreen-400 to-emerald-600 flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-agrigreen-400" />
                <span className="text-[10px] font-black text-agrigreen-400 uppercase tracking-[0.3em]">Neural Intelligence</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">AgriNova AI Insights</h2>
              <p className="text-gray-400 text-sm mt-1 max-w-xl">Optimize your harvest with real-time analytics. "Should I harvest my tomatoes now or wait for market prices to rise?"</p>
            </div>
            <Link to="/chat" className="bg-white text-forest-900 px-8 py-4 rounded-2xl font-black hover:bg-agrigreen-500 hover:text-white transition-all shadow-xl flex items-center gap-2 group/btn">
              Consult AI
              <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Add Product Form */}
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-green-500" /> Create New Listing
            </h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[['name','Product Name','text'],['price','Price (₹)','number'],['quantity','Quantity','number'],['description','Description','text']].map(([field, ph, type]) => (
                <input key={field} type={type} placeholder={ph} required value={formData[field]}
                  onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                />
              ))}
              <select value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-green-400 transition-all">
                {['kg','lb','dozen','bunch','box','piece'].map(u => <option key={u}>{u}</option>)}
              </select>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-green-400 transition-all">
                {['Vegetables','Fruits','Dairy','Herbs','Grains'].map(c => <option key={c}>{c}</option>)}
              </select>
              <button type="submit" className="sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                Submit Listing
              </button>
            </form>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} custom={i} variants={cardVariants} initial="hidden" animate="visible"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`bg-gradient-to-br ${stat.color} p-5 rounded-2xl shadow-lg`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/80 text-xs font-medium">{stat.label}</p>
                <div className="p-2 bg-white/20 rounded-xl"><stat.icon className="h-4 w-4 text-white" /></div>
              </div>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

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

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 lg:col-span-2">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Revenue — Last 7 Days</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Daily earnings from all orders</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                  <Tooltip contentStyle={{ background: 'rgba(17,24,39,0.9)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 13 }} formatter={v => [`₹${v}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: '#22c55e', strokeWidth: 0, r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Products by Category</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Listing distribution</p>
              {categoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <AlertCircle className="h-8 w-8 mb-2 opacity-40" /><p className="text-sm">No products yet</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'rgba(17,24,39,0.9)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 mt-3">
                    {categoryData.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                          <span className="text-gray-600 dark:text-gray-400">{d.name}</span>
                        </div>
                        <span className="font-bold text-gray-800 dark:text-gray-200">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 lg:col-span-3">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
              {orders.slice(0, 4).length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">No orders yet. Keep your listings active!</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 4).map(o => (
                    <div key={o._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">#{o._id.substring(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{o.customer?.name}</p>
                      </div>
                      <p className="font-bold text-green-600 dark:text-green-400">₹{o.totalAmount}</p>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${o.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : o.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {o.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">No products yet</h3>
                <button onClick={() => setShowAddForm(true)} className="mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold">
                  Add First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p, i) => (
                  <motion.div key={p._id} custom={i} variants={cardVariants} initial="hidden" animate="visible" className="glass-card p-5 hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{p.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.description}</p>
                      </div>
                      <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-semibold">{p.category}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="text-xl font-black text-green-600 dark:text-green-400">₹{p.price}</p>
                        <p className="text-xs text-gray-400">per {p.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{p.quantity}</p>
                        <p className="text-xs text-gray-400">in stock</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loading ? (
              <div className="glass-card p-8 text-center text-gray-400">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <TrendingUp className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">No orders yet</h3>
                <p className="text-gray-400 text-sm">Orders will appear here when customers purchase.</p>
              </div>
            ) : (
              orders.map((o, i) => (
                <motion.div key={o._id} custom={i} variants={cardVariants} initial="hidden" animate="visible" className="glass-card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Order #{o._id.substring(0, 8).toUpperCase()}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{o.customer?.name} · {new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-black text-green-600 dark:text-green-400">₹{o.totalAmount}</p>
                      <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${o.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : o.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                      </span>
                      {o.status === 'pending' && (
                        <button onClick={() => updateOrderStatus(o._id, 'shipped')} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full font-bold hover:shadow transition-all">
                          Mark Shipped
                        </button>
                      )}
                      {o.status === 'shipped' && (
                        <button onClick={() => updateOrderStatus(o._id, 'delivered')} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full font-bold hover:shadow transition-all">
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
