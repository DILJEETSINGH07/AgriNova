import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Package, TrendingUp, IndianRupee, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', unit: 'kg', quantity: '', category: 'Vegetables', description: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        api.get('/products/farmer/myproducts'),
        api.get('/orders/farmerorders')
      ]);
      setProducts(prodRes.data);
      setOrders(ordRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const stats = [
    { name: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Active Listings', value: products.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Orders', value: orders.length, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });
      setShowAddForm(false);
      fetchData(); // Refresh list
    } catch (err) {
      alert('Failed to add product');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchData(); // Refresh list
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your farm, listings, and orders.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="mt-4 md:mt-0 flex items-center bg-agrigreen-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-agrigreen-700 transition-colors shadow-md"
        >
          {showAddForm ? 'Cancel' : <><PlusCircle className="h-5 w-5 mr-2" /> Add New Product</>}
        </button>
      </div>

      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-bold mb-4">Create New Listing</h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Product Name" required className="border p-3 rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="number" placeholder="Price (₹)" required className="border p-3 rounded-xl" onChange={e => setFormData({...formData, price: e.target.value})} />
            <select className="border p-3 rounded-xl" onChange={e => setFormData({...formData, unit: e.target.value})}>
              <option value="kg">per kg</option>
              <option value="lb">per lb</option>
              <option value="dozen">per dozen</option>
              <option value="bunch">per bunch</option>
            </select>
            <input type="number" placeholder="Quantity Available" required className="border p-3 rounded-xl" onChange={e => setFormData({...formData, quantity: e.target.value})} />
            <select className="border p-3 rounded-xl" onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Dairy</option>
              <option>Herbs</option>
            </select>
            <input type="text" placeholder="Description" required className="border p-3 rounded-xl" onChange={e => setFormData({...formData, description: e.target.value})} />
            <button type="submit" className="col-span-full bg-agrigreen-600 text-white py-3 rounded-xl font-bold">Submit Listing</button>
          </form>
        </motion.div>
      )}

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
              onClick={() => setActiveTab('products')}
              className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-agrigreen-500 text-agrigreen-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-agrigreen-500 text-agrigreen-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders Received
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? <p className="text-center text-gray-500">Loading data...</p> : (
            activeTab === 'products' ? (
              products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
                  <p className="mt-1 text-gray-500">Get started by creating your first listing.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map(p => (
                    <div key={p._id} className="border rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold">{p.name}</h4>
                        <p className="text-sm text-gray-500">₹{p.price} / {p.unit} • {p.quantity} in stock</p>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{p.category}</span>
                    </div>
                  ))}
                </div>
              )
            ) : (
              orders.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                  <p className="mt-1 text-gray-500">When customers place orders, they will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(o => (
                    <div key={o._id} className="border rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold">Order #{o._id.substring(0,8).toUpperCase()}</h4>
                        <span className="font-bold text-agrigreen-600">₹{o.totalAmount}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Customer: {o.customer?.name} ({o.customer?.email})</p>
                      <div className="flex justify-between items-center mt-4">
                         <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-full">Status: {o.status}</span>
                         {o.status === 'pending' && (
                           <button onClick={() => updateOrderStatus(o._id, 'shipped')} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">Mark as Shipped</button>
                         )}
                         {o.status === 'shipped' && (
                           <button onClick={() => updateOrderStatus(o._id, 'delivered')} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Mark as Delivered</button>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
