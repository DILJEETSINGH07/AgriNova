import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Package, LayoutDashboard, ShieldCheck,
  TrendingUp, Activity, ArrowUpRight, BarChart2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import api from '../services/api';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [ur, pr] = await Promise.all([api.get('/auth/users'), api.get('/products')]);
        setUsers(ur.data);
        setProducts(pr.data);
      } catch { setUsers([]); setProducts([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const farmersCount = users.filter(u => u.role === 'farmer').length;
  const customersCount = users.filter(u => u.role === 'customer').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'Products Listed', value: products.length, icon: Package, color: 'from-green-500 to-emerald-600', change: '+8%' },
    { label: 'Farmers', value: farmersCount, icon: TrendingUp, color: 'from-purple-500 to-purple-600', change: '+5%' },
    { label: 'Customers', value: customersCount, icon: Activity, color: 'from-amber-400 to-orange-500', change: '+15%' },
  ];

  // Chart data
  const userRoleData = [
    { role: 'Farmers', count: farmersCount },
    { role: 'Customers', count: customersCount },
    { role: 'Admins', count: adminCount },
  ];

  const categoryData = ['Vegetables', 'Fruits', 'Dairy', 'Herbs', 'Grains'].map(cat => ({
    category: cat,
    count: products.filter(p => p.category === cat).length,
  }));

  // Simulated weekly signups
  const weeklyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
    day,
    users: Math.floor(Math.random() * 8) + 2,
    products: Math.floor(Math.random() * 5) + 1,
  }));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'users', label: 'All Users', icon: Users },
    { id: 'products', label: 'All Products', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">System Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor users, products, and platform activity.</p>
        </motion.div>

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
              <p className="text-3xl font-black text-white mb-1">{loading ? '—' : stat.value}</p>
              <div className="flex items-center gap-1 text-white/70 text-xs">
                <ArrowUpRight className="h-3 w-3" />{stat.change} this week
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl mb-8 w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Activity */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Weekly Activity</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">New users & products this week</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(17,24,39,0.9)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 13 }} />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} name="Users" />
                  <Line type="monotone" dataKey="products" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} name="Products" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Products by Category */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Products by Category</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Distribution across all listings</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(17,24,39,0.9)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 13 }} />
                  <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} name="Products" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* User Roles */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">User Roles Breakdown</h3>
              <div className="space-y-4">
                {[
                  { label: 'Farmers', count: farmersCount, total: users.length, color: 'bg-green-500' },
                  { label: 'Customers', count: customersCount, total: users.length, color: 'bg-blue-500' },
                  { label: 'Admins', count: adminCount, total: users.length, color: 'bg-red-500' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{item.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: item.total ? `${(item.count / item.total) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Users */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Signups</h3>
              {loading ? (
                <p className="text-gray-400 text-sm text-center py-6">Loading...</p>
              ) : (
                <div className="space-y-3">
                  {users.slice(0, 5).map(u => (
                    <div key={u._id} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{u.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        u.role === 'farmer' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loading ? (
                    <tr><td colSpan={4} className="text-center py-8 text-gray-400">Loading users...</td></tr>
                  ) : users.map((u, i) => (
                    <motion.tr key={u._id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          u.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          u.role === 'farmer' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{u.location || '—'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))
            ) : products.map((p, i) => (
              <motion.div key={p._id} custom={i} variants={cardVariants} initial="hidden" animate="visible" className="glass-card p-5 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">{p.name}</h4>
                  <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-semibold">{p.category}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">By {p.farmer?.name || 'Unknown Farmer'}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-lg font-black text-green-600 dark:text-green-400">₹{p.price}<span className="text-xs font-normal text-gray-400">/{p.unit}</span></p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Stock: <span className="font-bold text-gray-700 dark:text-gray-300">{p.quantity}</span></p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
