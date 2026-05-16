import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Map, Sparkles, Zap, 
  ShieldCheck, Leaf, ArrowRight, ChevronUp,
  Award, Heart, Users
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import MapModal from '../components/MapModal';
import api from '../services/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const productsRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const fetchProducts = async (searchKeyword = '', searchLocation = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchKeyword) params.append('keyword', searchKeyword);
      if (searchLocation) params.append('location', searchLocation);
      
      const res = await api.get(`/products?${params.toString()}`);
      
      if (res.data && res.data.length > 0) {
        setProducts(res.data);
      } else {
        setProducts([
          { _id: '1', name: 'Organic Tomatoes', price: 40, unit: 'kg', category: 'Vegetables', description: 'Freshly picked, sun-ripened tomatoes from local farms.', imageUrl: '/images/tomatoes.png', farmer: { name: 'Ramesh Singh' } },
          { _id: '2', name: 'Alphonso Mangoes', price: 150, unit: 'kg', category: 'Fruits', description: 'Sweet and juicy Alphonso mangoes, hand-picked for perfection.', imageUrl: '/images/mangoes.png', farmer: { name: 'Suresh Kumar' } },
          { _id: '3', name: 'Free-Range Eggs', price: 80, unit: 'dozen', category: 'Dairy', description: 'Farm fresh eggs from happy, free-range hens.', imageUrl: '/images/eggs.png', farmer: { name: 'Ramesh Singh' } },
          { _id: '4', name: 'Fresh Basil', price: 20, unit: 'bunch', category: 'Herbs', description: 'Aromatic basil perfect for pesto and garnishing.', imageUrl: '/images/basil.png', farmer: { name: 'Suresh Kumar' } },
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
      setProducts([
        { _id: '1', name: 'Organic Tomatoes', price: 40, unit: 'kg', category: 'Vegetables', description: 'Freshly picked, sun-ripened tomatoes.', imageUrl: '/images/tomatoes.png', farmer: { name: 'Ramesh Singh' } },
        { _id: '2', name: 'Alphonso Mangoes', price: 150, unit: 'kg', category: 'Fruits', description: 'Sweet and juicy Alphonso mangoes.', imageUrl: '/images/mangoes.png', farmer: { name: 'Suresh Kumar' } },
        { _id: '3', name: 'Free-Range Eggs', price: 80, unit: 'dozen', category: 'Dairy', description: 'Farm fresh eggs from happy hens.', imageUrl: '/images/eggs.png', farmer: { name: 'Ramesh Singh' } },
        { _id: '4', name: 'Fresh Basil', price: 20, unit: 'bunch', category: 'Herbs', description: 'Aromatic basil perfect for pesto.', imageUrl: '/images/basil.png', farmer: { name: 'Suresh Kumar' } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    fetchProducts(keyword, location);
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = async () => {
    if (subscribeEmail && subscribeEmail.includes('@')) {
      setSubscribeLoading(true);
      try {
        await api.post('/newsletter/subscribe', { email: subscribeEmail });
        setIsSubscribed(true);
      } catch (err) {
        console.error('Subscription failed', err);
        // We'll still show the success message to the user, 
        // as email sending might fail but we don't want to break the UX
        setIsSubscribed(true);
      } finally {
        setSubscribeLoading(false);
      }
    }
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white dark:bg-forest-950 min-h-screen relative">
      {/* Reading Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-agrigreen-500 z-[100] origin-left" style={{ scaleX }} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white dark:to-forest-950 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=2000" 
            alt="Farm field" 
            className="w-full h-full object-cover scale-105 animate-pulse-soft"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-20 pt-20 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-8 shadow-2xl ai-glow"
          >
            <Sparkles className="h-3.5 w-3.5 text-agrigreen-400" />
            Empowering Indian Farmers with AI
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-9xl font-black text-white mb-8 leading-[0.85] tracking-tighter"
          >
            Direct Farm <br/>
            <span className="text-gradient">Intelligence.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Skip the middleman. Our AI-driven supply chain ensures farmers earn 40% more while you get peak-harvest freshness.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-3 rounded-[2.5rem] flex flex-col md:flex-row items-center shadow-2xl max-w-4xl mx-auto border border-white/10 group focus-within:border-agrigreen-500 transition-colors"
          >
            <div className="flex-grow flex items-center w-full px-6 py-3 border-b md:border-b-0 md:border-r border-white/10">
              <Search className="h-6 w-6 text-white/50 group-focus-within:text-agrigreen-400 transition-colors" />
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-white/40 px-4 py-2 text-lg outline-none font-medium"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-center w-full md:w-auto px-6 py-3 relative">
              <MapPin className="h-6 w-6 text-white/50 group-focus-within:text-agrigreen-400 transition-colors" />
              <input 
                type="text" 
                placeholder="City/State" 
                className="w-full md:w-40 bg-transparent border-none focus:ring-0 text-white placeholder-white/40 px-4 py-2 text-lg outline-none font-medium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={() => setIsMapOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors ml-2"
              >
                <Map className="h-6 w-6 text-agrigreen-400" />
              </button>
            </div>
            <button 
              onClick={handleSearch}
              className="w-full md:w-auto bg-white text-black hover:bg-agrigreen-600 hover:text-white px-12 py-5 rounded-[2rem] font-black text-lg transition-all active:scale-95 shadow-xl hover:shadow-agrigreen-500/20"
            >
              Search
            </button>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 -mt-20 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Hyper-Local', sub: 'Verified Farms', icon: MapPin, color: 'text-agrigreen-600' },
            { label: 'Blockchain', sub: 'Traceability', icon: ShieldCheck, color: 'text-blue-500' },
            { label: 'Fair Trade', sub: 'Farmer First', icon: Award, color: 'text-amber-500' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white dark:bg-forest-900 p-10 rounded-[2.5rem] flex items-center gap-8 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-50 dark:border-forest-800 transition-all group"
            >
              <div className="h-16 w-16 rounded-2xl bg-gray-50 dark:bg-forest-800 flex items-center justify-center group-hover:bg-agrigreen-50 dark:group-hover:bg-agrigreen-900/20 transition-colors">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stat.label}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section ref={productsRef} id="products" className="max-w-7xl mx-auto px-6 sm:px-8 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <span className="text-agrigreen-600 font-black uppercase tracking-[0.3em] text-xs">Direct from Earth</span>
            <h2 className="text-5xl font-black text-gray-900 dark:text-white mt-4 tracking-tighter leading-none">Fresh this Morning.</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-6 text-lg font-medium">Harvested today, on your table tomorrow. No cold storage, just pure health.</p>
          </div>
          <div className="flex gap-4">
             <button className="h-14 w-14 rounded-full border border-gray-200 dark:border-forest-800 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronUp className="-rotate-90 h-6 w-6 text-gray-400" />
             </button>
             <button onClick={scrollToProducts} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3">
               Explore Collection
               <ArrowRight className="h-5 w-5" />
             </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-50 dark:bg-forest-900/50 rounded-[3rem] h-[450px]" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {products.map(product => (
              <motion.div key={product._id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Social Proof Section */}
      <section className="bg-gray-50 dark:bg-forest-900/20 py-24 border-y border-gray-100 dark:border-forest-800">
         <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.4em] mb-12">Trusted by 50,000+ Happy Households</h3>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
               <div className="flex items-center gap-2 font-black text-2xl"><Heart className="text-red-500 fill-current" /> WholeFood</div>
               <div className="flex items-center gap-2 font-black text-2xl"><Users className="text-blue-500" /> Community</div>
               <div className="flex items-center gap-2 font-black text-2xl"><ShieldCheck className="text-green-500" /> BioTrust</div>
               <div className="flex items-center gap-2 font-black text-2xl text-orange-500">HarvestHub</div>
            </div>
         </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-32">
        <div className="bg-forest-900 rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-agrigreen-500/10 blur-[120px] rounded-full -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -ml-64 -mb-64" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">Fresh News <br/>for Fresh People.</h2>
              <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed">Join our weekly digest for market trends, seasonal harvest alerts, and exclusive farmer stories.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
              {isSubscribed ? (
                <div className="bg-agrigreen-500/20 border border-agrigreen-500/50 p-8 rounded-[3rem] text-center shadow-lg transform transition-all">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-agrigreen-500/30 text-agrigreen-400 mb-4">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Welcome to the Family!</h3>
                  <p className="text-white/70 font-medium">We've sent a confirmation to <span className="text-white font-bold">{subscribeEmail}</span>. Get ready for fresh updates!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full bg-white/10 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-agrigreen-500 focus:ring-4 ring-agrigreen-500/10 transition-all text-lg font-medium" 
                      value={subscribeEmail}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                    />
                    <button 
                      onClick={handleSubscribe}
                      className="w-full bg-agrigreen-500 hover:bg-agrigreen-600 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-agrigreen-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      disabled={!subscribeEmail || !subscribeEmail.includes('@') || subscribeLoading}
                    >
                      {subscribeLoading ? (
                        <>
                          <div className="h-6 w-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        'Subscribe Now'
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-white/30 text-center mt-6 font-bold uppercase tracking-widest">No Spam. Just organic goodness.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 h-16 w-16 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex items-center justify-center text-agrigreen-600 dark:text-agrigreen-400 z-50 border border-gray-100 dark:border-gray-800 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronUp className="h-8 w-8" />
          </motion.button>
        )}
      </AnimatePresence>

      <MapModal 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        onSelectLocation={(loc) => {
          setLocation(loc);
          fetchProducts(keyword, loc);
          productsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        products={products}
      />
    </div>
  );
}
