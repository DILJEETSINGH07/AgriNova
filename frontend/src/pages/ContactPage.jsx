import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Linkedin } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setStatus] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(true);
    setTimeout(() => setStatus(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-agrigreen-600 font-black uppercase tracking-[0.3em] text-xs">Get in Touch</span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mt-4 tracking-tighter">We'd love to hear from you.</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-6 max-w-2xl mx-auto text-lg">Have questions about our platform or want to partner with us? Our team is here to help.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            {[
              { icon: Mail, label: 'Email', value: 'diljeet7500@gmail.com', desc: 'Direct support team' },
              { icon: Phone, label: 'Phone', value: '+91 88949 43125', desc: 'Mon-Fri from 9am to 6pm' },
              { icon: MapPin, label: 'Office', value: 'Bangalore, Karnataka', desc: 'AgriNova Innovation Hub' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 p-6 rounded-[2rem] bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800"
              >
                <div className="h-14 w-14 rounded-2xl bg-agrigreen-50 dark:bg-agrigreen-900/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6 text-agrigreen-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white mt-1">{item.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-[2.5rem] bg-gradient-to-br from-agrigreen-500 to-emerald-700 text-white shadow-2xl relative overflow-hidden group"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
               <h3 className="text-2xl font-black mb-4 relative z-10">Live Chat</h3>
               <p className="text-white/80 mb-6 relative z-10">Instant support from our AI and support specialists.</p>
               <button className="bg-white text-agrigreen-700 px-6 py-3 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2">
                 <MessageSquare className="h-4 w-4" />
                 Start Chat
               </button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl"
            >
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-5">Follow Us</h3>
              <div className="flex flex-col gap-4">
                <a
                  href="https://www.instagram.com/diljeetsinghh79?igsh=MWx6aWNodjVnOHhwYg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 transition-all group/social"
                >
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg group-hover/social:scale-110 transition-transform">
                    <Instagram className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 dark:text-white text-sm">Instagram</p>
                    <p className="text-xs text-gray-400">@diljeetsinghh79</p>
                  </div>
                </a>
                <a
                  href="https://www.linkedin.com/in/diljeet-singh-1a814a304"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 transition-all group/social"
                >
                  <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg group-hover/social:scale-110 transition-transform">
                    <Linkedin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 dark:text-white text-sm">LinkedIn</p>
                    <p className="text-xs text-gray-400">Diljeet Singh</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="h-20 w-20 rounded-full bg-agrigreen-100 dark:bg-agrigreen-900/30 flex items-center justify-center mb-6">
                  <Send className="h-10 w-10 text-agrigreen-600 animate-bounce" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Message Sent!</h2>
                <p className="text-gray-500 dark:text-gray-400">Thanks for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Full Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 px-6 py-4 rounded-2xl outline-none focus:border-agrigreen-500 transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Email Address</label>
                    <input required type="email" placeholder="john@example.com" className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 px-6 py-4 rounded-2xl outline-none focus:border-agrigreen-500 transition-all font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Subject</label>
                  <select className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 px-6 py-4 rounded-2xl outline-none focus:border-agrigreen-500 transition-all font-medium appearance-none">
                    <option>General Inquiry</option>
                    <option>Farmer Partnership</option>
                    <option>Technical Issue</option>
                    <option>Media & Press</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Message</label>
                  <textarea required rows={6} placeholder="How can we help you today?" className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 px-6 py-4 rounded-2xl outline-none focus:border-agrigreen-500 transition-all font-medium resize-none" />
                </div>
                <button type="submit" className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-5 rounded-2xl font-black text-lg hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl flex items-center justify-center gap-3">
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
