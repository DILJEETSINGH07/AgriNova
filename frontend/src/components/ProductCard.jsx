import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Leaf, Star, ShieldCheck, Zap, User, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const getImageUrl = (url, name) => {
    if (!url || url.includes('unsplash.com') || url.includes('placeholder.com')) {
      const lowerName = name?.toLowerCase() || '';
      if (lowerName.includes('tomato')) return '/images/tomatoes.png';
      if (lowerName.includes('carrot')) return '/images/carrots.png';
      if (lowerName.includes('spinach')) return '/images/spinach.png';
      if (lowerName.includes('mango')) return '/images/mangoes.png';
      if (lowerName.includes('apple')) return '/images/apples.png';
      if (lowerName.includes('strawberr')) return '/images/strawberries.png';
      if (lowerName.includes('potato')) return '/images/potatoes.png';
      if (lowerName.includes('egg')) return '/images/eggs.png';
      if (lowerName.includes('basil')) return '/images/basil.png';
      if (lowerName.includes('banana')) return '/images/bananas.png';
      if (lowerName.includes('onion')) return '/images/onions.png';
      if (lowerName.includes('milk')) return '/images/milk.png';
      return '/images/default.png';
    }
    return url;
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product);
    navigate('/customer-dashboard'); // Redirect to checkout/orders
  };

  return (
    <motion.div 
      whileHover={{ y: -12 }}
      className="group bg-white dark:bg-forest-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-black/50 hover:shadow-agrigreen-500/10 transition-all duration-500 overflow-hidden border border-gray-50 dark:border-forest-800 flex flex-col h-full relative"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={getImageUrl(product.imageUrl, product.name)} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-5 left-5 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-2xl text-[10px] font-black text-agrigreen-700 dark:text-agrigreen-400 shadow-xl flex items-center gap-1.5 uppercase tracking-widest border border-white/20">
          <Leaf className="h-3 w-3" />
          {product.category}
        </div>

        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToCart}
          className={`absolute top-5 right-5 p-3 rounded-2xl shadow-2xl transition-all duration-300 z-10 ${
            isAdding ? 'bg-agrigreen-500 text-white scale-110' : 'bg-white/90 dark:bg-black/80 text-gray-900 dark:text-white hover:bg-agrigreen-600 hover:text-white'
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
        </motion.button>
        
        <div className="absolute bottom-6 left-6 right-6 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 flex gap-2">
           {product.farmer?.phone && (
             <button
               onClick={(e) => {
                 e.stopPropagation();
                 const message = `Hi ${product.farmer.name}, I am interested in your ${product.name} listed on AgriNova.`;
                 window.open(`https://wa.me/${product.farmer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
               }}
               className="bg-[#25D366] text-white p-3 rounded-xl flex items-center justify-center hover:bg-[#1ebd5a] transition-all shadow-xl"
               title="Chat on WhatsApp"
             >
               <MessageCircle className="h-5 w-5" />
             </button>
           )}
           <button 
             onClick={handleBuyNow}
             className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-agrigreen-500 hover:text-white transition-all shadow-xl"
           >
             Quick Buy
           </button>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-agrigreen-600 transition-colors tracking-tight">{product.name}</h3>
        </div>
        
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
          ))}
          <span className="text-[10px] text-gray-400 font-bold ml-2">4.8 (84)</span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed font-medium">
          {product.description}
        </p>
        
        <div className="mt-auto flex justify-between items-end pt-6 border-t border-gray-50 dark:border-forest-800">
          <div>
            <div className="flex items-baseline gap-1">
               <span className="text-2xl font-black text-agrigreen-600 dark:text-agrigreen-400 tracking-tighter">₹{product.price}</span>
               <span className="text-xs text-gray-400 dark:text-gray-500 font-bold tracking-normal uppercase">/ {product.unit}</span>
            </div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 flex items-center gap-1.5">
               <span className="h-4 w-4 rounded-full bg-gray-200 dark:bg-forest-800 flex items-center justify-center overflow-hidden">
                  <User className="h-2.5 w-2.5 text-gray-500" />
               </span>
               By <span className="text-gray-700 dark:text-gray-300 underline underline-offset-2 decoration-agrigreen-500/30 hover:text-agrigreen-600 transition-colors">{product.farmer?.name || 'Ramesh Singh'}</span>
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="group/badge relative"
          >
             <div className="h-12 w-12 rounded-2xl bg-agrigreen-50 dark:bg-agrigreen-900/20 flex items-center justify-center border border-agrigreen-100 dark:border-agrigreen-800 transition-colors cursor-help">
                <ShieldCheck className="h-6 w-6 text-agrigreen-600" />
             </div>
             <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-[10px] font-bold rounded-xl whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none shadow-2xl">
                AgriNova Verified Organic
             </div>
          </motion.div>
        </div>
      </div>

      {/* Instant Tag */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-amber-400 text-amber-950 px-4 py-1 rounded-b-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
         <Zap className="h-3 w-3 fill-current" />
         Best Seller
      </div>
    </motion.div>
  );
}
