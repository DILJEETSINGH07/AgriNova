import { motion } from 'framer-motion';
import { 
  HelpCircle, Search, Book, MessageSquare, 
  ChevronDown, ShoppingBag, Truck, ShieldCheck, 
  CreditCard, UserCheck, Zap, Instagram, Linkedin
} from 'lucide-react';
import { useState } from 'react';

export default function HelpPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "How does the AI assistant help farmers?",
      a: "Our AgriNova AI uses satellite data and local weather patterns to provide predictive analytics for planting, pest detection via image analysis, and real-time market price forecasting.",
      icon: Zap
    },
    {
      q: "Is the produce really organic?",
      a: "Yes, every farmer on our platform goes through a multi-step verification process. We use blockchain-traceability to ensure that every 'Organic' badge is backed by verified soil tests and farming practices.",
      icon: ShieldCheck
    },
    {
      q: "How long does delivery take?",
      a: "We prioritize local distribution. Most orders are delivered within 12-24 hours of harvest to ensure maximum freshness and nutritional value.",
      icon: Truck
    },
    {
      q: "How are payments handled?",
      a: "Payments are processed securely via our encrypted payment gateway. Farmers receive their payment as soon as delivery is confirmed by the buyer, ensuring fairness and transparency.",
      icon: CreditCard
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 bg-agrigreen-50 dark:bg-agrigreen-900/10 p-12 rounded-[3.5rem] border border-agrigreen-100 dark:border-agrigreen-800 shadow-inner"
        >
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">How can we help?</h1>
          <div className="mt-8 relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search help articles..." 
              className="w-full pl-16 pr-8 py-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl outline-none focus:border-agrigreen-500 transition-all text-lg font-medium"
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
             {['Delivery', 'Payments', 'Selling', 'AI Bot'].map(tag => (
               <span key={tag} className="px-4 py-1.5 bg-white dark:bg-gray-800 rounded-full text-xs font-bold text-gray-500 cursor-pointer hover:text-agrigreen-600 transition-colors shadow-sm">{tag}</span>
             ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: Book, title: 'Documentation', desc: 'Detailed guides for farmers and buyers.' },
            { icon: MessageSquare, title: 'Community', desc: 'Connect with other farmers in our forum.' },
            { icon: UserCheck, title: 'Verification', desc: 'Learn about our quality standards.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900 border border-transparent hover:border-agrigreen-200 transition-all group"
            >
               <div className="h-16 w-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center mb-6 shadow-lg group-hover:bg-agrigreen-500 group-hover:text-white transition-colors">
                 <item.icon className="h-8 w-8" />
               </div>
               <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{item.title}</h3>
               <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden"
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-agrigreen-50 dark:bg-agrigreen-900/20 text-agrigreen-600">
                      <faq.icon className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{faq.q}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`px-16 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-24 p-12 rounded-[3.5rem] bg-gray-900 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-agrigreen-500/10 blur-3xl rounded-full" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">Still need help?</h2>
          <p className="text-gray-400 mb-8 relative z-10">
            Our specialists are ready to assist you anytime.<br/>
            <span className="text-agrigreen-400 font-bold tracking-wide mt-2 inline-block">📞 8894943125 &nbsp; | &nbsp; ✉️ diljeet7500@gmail.com</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <a href="mailto:diljeet7500@gmail.com" className="bg-agrigreen-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-agrigreen-500/20 hover:scale-105 active:scale-95 transition-all inline-block">
              Email Support
            </a>
            <a href="tel:8894943125" className="bg-white/10 text-white border border-white/10 px-10 py-4 rounded-2xl font-black hover:bg-white/20 transition-all inline-block">
              Call Us
            </a>
          </div>
          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-8 relative z-10">
            <a
              href="https://www.instagram.com/diljeetsinghh79?igsh=MWx6aWNodjVnOHhwYg=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <Instagram className="h-4 w-4" />
              @diljeetsinghh79
            </a>
            <a
              href="https://www.linkedin.com/in/diljeet-singh-1a814a304"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 text-white font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <Linkedin className="h-4 w-4" />
              Diljeet Singh
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
