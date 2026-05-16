import { motion } from 'framer-motion';
import { 
  User, Bell, Shield, Eye, Palette, 
  Globe, CreditCard, LogOut, ChevronRight, 
  Camera, Check, Mail
} from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function SettingsPage() {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  const sections = [
    { id: 'profile', label: 'Public Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Password & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Payments', icon: CreditCard },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage your account preferences and system configuration.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 space-y-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeSection === section.id
                    ? 'bg-white dark:bg-gray-900 text-agrigreen-600 shadow-xl shadow-gray-200/50 dark:shadow-black/20 ring-1 ring-gray-100 dark:ring-gray-800'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="h-5 w-5" />
                  <span>{section.label}</span>
                </div>
                {activeSection === section.id && <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800"
            >
              {activeSection === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-8">
                    <div className="relative group">
                       <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-agrigreen-100 to-agrigreen-200 dark:from-agrigreen-900/40 dark:to-agrigreen-800/40 flex items-center justify-center border-2 border-dashed border-agrigreen-300 dark:border-agrigreen-700 overflow-hidden">
                          <User className="h-10 w-10 text-agrigreen-600" />
                       </div>
                       <button className="absolute -bottom-2 -right-2 p-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl shadow-lg hover:scale-110 transition-transform">
                          <Camera className="h-4 w-4" />
                       </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">Profile Photo</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">PNG, JPG up to 5MB. Recommended: 400x400px.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Display Name</label>
                       <input defaultValue={user?.name} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-agrigreen-500/20 transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Email Address</label>
                       <div className="relative">
                          <input disabled defaultValue={user?.email} className="w-full bg-gray-100 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 px-6 py-4 rounded-2xl outline-none text-gray-400 font-medium cursor-not-allowed" />
                          <Mail className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Bio / Description</label>
                     <textarea rows={4} placeholder="Tell us about your farm or interests..." className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-agrigreen-500/20 transition-all font-medium resize-none" />
                  </div>

                  <div className="flex justify-end pt-4">
                     <button 
                        onClick={handleSave}
                        className="bg-agrigreen-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-agrigreen-500/30 hover:bg-agrigreen-700 transition-all active:scale-95 flex items-center gap-2"
                     >
                        {saved ? <Check className="h-5 w-5 animate-pulse" /> : null}
                        {saved ? 'Changes Saved' : 'Save Changes'}
                     </button>
                  </div>
                </div>
              )}

              {activeSection !== 'profile' && (
                 <div className="h-64 flex flex-col items-center justify-center text-center opacity-50">
                    <Eye className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-bold">Coming Soon</h3>
                    <p className="text-sm">This setting module is currently under development.</p>
                 </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
