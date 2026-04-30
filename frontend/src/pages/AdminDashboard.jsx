import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, LayoutDashboard, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, productsRes] = await Promise.all([
        api.get('/auth/users'),
        api.get('/products')
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const farmersCount = users.filter(u => u.role === 'farmer').length;
  const customersCount = users.filter(u => u.role === 'customer').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  const stats = [
    { name: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Products', value: products.length, icon: Package, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Farmers / Customers', value: `${farmersCount} / ${customersCount}`, icon: LayoutDashboard, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center">
            <ShieldCheck className="h-8 w-8 mr-3 text-agrigreen-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">System overview and user management.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <motion.div 
            key={stat.name}
            whileHover={{ y: -3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} mr-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-agrigreen-500 text-agrigreen-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-agrigreen-500 text-agrigreen-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Products
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? <p className="text-center text-gray-500">Loading data...</p> : (
            activeTab === 'users' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(u => (
                      <tr key={u._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-red-100 text-red-800' : u.role === 'farmer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.location || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(p => (
                  <div key={p._id} className="border rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900">{p.name}</h4>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{p.category}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">By {p.farmer?.name || 'Unknown'}</p>
                      <p className="text-sm text-agrigreen-600 font-bold mb-2">₹{p.price} / {p.unit}</p>
                      <p className="text-sm text-gray-500">Stock: {p.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
