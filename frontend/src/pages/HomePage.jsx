import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        } else {
          // Fallback mock data if database is empty (since it's in-memory)
          setProducts([
            { _id: '1', name: 'Organic Tomatoes', price: 40, unit: 'kg', category: 'Vegetables', description: 'Freshly picked, sun-ripened tomatoes.', imageUrl: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&auto=format&fit=crop', farmer: { name: 'Ramesh Singh' } },
            { _id: '2', name: 'Alphonso Mangoes', price: 150, unit: 'kg', category: 'Fruits', description: 'Sweet and juicy Alphonso mangoes.', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop', farmer: { name: 'Suresh Kumar' } },
            { _id: '3', name: 'Free-Range Eggs', price: 80, unit: 'dozen', category: 'Dairy', description: 'Farm fresh eggs from happy hens.', imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&auto=format&fit=crop', farmer: { name: 'Ramesh Singh' } },
            { _id: '4', name: 'Fresh Basil', price: 20, unit: 'bunch', category: 'Herbs', description: 'Aromatic basil perfect for pesto.', imageUrl: 'https://images.unsplash.com/photo-1629385701021-fcd568a743a8?w=400&auto=format&fit=crop', farmer: { name: 'Suresh Kumar' } },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
        // Fallback mock data if backend is offline
        setProducts([
          { _id: '1', name: 'Organic Tomatoes', price: 40, unit: 'kg', category: 'Vegetables', description: 'Freshly picked, sun-ripened tomatoes.', imageUrl: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&auto=format&fit=crop', farmer: { name: 'Ramesh Singh' } },
          { _id: '2', name: 'Alphonso Mangoes', price: 150, unit: 'kg', category: 'Fruits', description: 'Sweet and juicy Alphonso mangoes.', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop', farmer: { name: 'Suresh Kumar' } },
          { _id: '3', name: 'Free-Range Eggs', price: 80, unit: 'dozen', category: 'Dairy', description: 'Farm fresh eggs from happy hens.', imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&auto=format&fit=crop', farmer: { name: 'Ramesh Singh' } },
          { _id: '4', name: 'Fresh Basil', price: 20, unit: 'bunch', category: 'Herbs', description: 'Aromatic basil perfect for pesto.', imageUrl: 'https://images.unsplash.com/photo-1629385701021-fcd568a743a8?w=400&auto=format&fit=crop', farmer: { name: 'Suresh Kumar' } },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-earth-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-agrigreen-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=2000" alt="Farm field" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Fresh from the farm,<br/> <span className="text-agrigreen-400">Direct to your table.</span>
            </h1>
            <p className="text-lg md:text-xl text-agrigreen-100 mb-10">
              Support local farmers and enjoy the freshest produce. No middlemen, just honest food.
            </p>
            
            <div className="bg-white p-2 rounded-full flex items-center shadow-2xl max-w-2xl mx-auto">
              <div className="flex-grow flex items-center pl-4">
                <Search className="h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for tomatoes, apples..." 
                  className="w-full bg-transparent border-none focus:ring-0 text-gray-900 px-3"
                />
              </div>
              <div className="hidden md:flex items-center border-l border-gray-200 pl-4 pr-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-500 text-sm ml-2">Nearby</span>
              </div>
              <button className="bg-agrigreen-600 hover:bg-agrigreen-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Fresh Arrivals</h2>
            <p className="text-gray-500 mt-2">Discover what's in season near you</p>
          </div>
          <button className="text-agrigreen-600 font-semibold hover:text-agrigreen-700">View All →</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-gray-100">
                <div className="bg-gray-200 h-48 rounded-t-2xl"></div>
                <div className="p-5">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
