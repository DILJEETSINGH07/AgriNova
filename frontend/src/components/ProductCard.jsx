import { motion } from 'framer-motion';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-agrigreen-700 shadow-sm">
          {product.category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-black text-agrigreen-600">
              ₹{product.price}
              <span className="text-sm text-gray-500 font-normal"> / {product.unit}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">By {product.farmer?.name || 'Farmer'}</p>
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="bg-gray-900 hover:bg-agrigreen-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-md"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
