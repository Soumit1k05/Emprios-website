import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RegistrationPage from './components/RegistrationPage';
import logo from './assets/Empiros_Logo.jpeg';
import {
  BarChart3,
  Sun, Moon, Twitter, Facebook, Instagram, Youtube,
  ArrowLeft, Search, Bell, Check, Zap, Star, Shield, Layers,
  UserPlus
} from 'lucide-react';
import { siteMetadata } from './config/content';

/* --- UI Components --- */

const NavItem = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${active ? 'text-blue-500 opacity-100' : 'text-inherit opacity-60 hover:opacity-100'}`}
  >
    {children}
  </button>
);

const FeatureCard = ({ icon, title, desc, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: delay * 0.05 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-pod feature-card w-full h-[140px] flex-shrink-0"
  >
    <div className="feature-icon">{icon}</div>
    <div className="feature-title">{title}</div>
    <div className="feature-desc px-2">{desc}</div>
  </motion.div>
);

const BundleCard = ({ name, price, features, color, popular, icon: Icon }) => (
  <motion.div 
    whileHover={{ y: -10, scale: 1.02 }}
    className={`glass-pod p-8 relative flex flex-col gap-6 overflow-hidden transition-all duration-500 ${popular ? 'border-blue-400 ring-2 ring-blue-400/20 bg-blue-500/5' : ''}`}
  >
    {popular && (
      <div className="absolute top-0 right-0 overflow-hidden w-24 h-24">
        <div className="absolute top-4 -right-8 bg-blue-500 text-white text-[8px] font-black px-10 py-1 uppercase rotate-45 tracking-widest shadow-lg">Popular</div>
      </div>
    )}
    
    <div className="flex justify-between items-start">
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-blue-500">
        <Icon size={24} />
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Monthly</p>
        <div className="text-3xl font-black">{price}<span className="text-xs opacity-40 font-bold">/mo</span></div>
      </div>
    </div>

    <div>
      <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{name}</h3>
      <div className="h-1 w-12 bg-blue-500 rounded-full mb-4 opacity-50"></div>
    </div>

    <ul className="space-y-4 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-[11px] font-bold opacity-80 group/item">
          <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center group-hover/item:bg-blue-500/20 transition-colors">
            <Check size={10} className="text-blue-500" />
          </div>
          {f}
        </li>
      ))}
    </ul>

    <div className="pt-4 flex flex-col gap-3">
      <button className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${popular ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/40 hover:bg-blue-700' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}>
        Select {name}
      </button>
      <button className="w-full py-2 text-[8px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity">
        View Full Details
      </button>
    </div>
    
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors"></div>
  </motion.div>
);

/* --- Main Application --- */

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [view, setView] = useState('home'); // views: home, bundles, prototype, register

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleBack = () => {
    if (view !== 'home') setView('home');
    else window.history.back();
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-2 lg:p-8 overflow-hidden relative">
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>

      <motion.div layout className="hub-main w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <header className="h-[75px] px-8 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={handleBack} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
               <motion.img 
                 whileHover={{ scale: 1.1 }}
                 src={logo} 
                 alt="Empiros Logo" 
                 className="w-10 h-10 rounded-xl shadow-lg border border-white/10 object-contain p-1 bg-white/5" 
               />
               <span className="text-sm font-black uppercase tracking-[0.3em] text-inherit group-hover:text-blue-500 transition-colors">EMPIROS</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <NavItem active={view === 'home'} onClick={() => setView('home')}>Home</NavItem>
            <NavItem active={view === 'bundles'} onClick={() => setView('bundles')}>Bundles</NavItem>
            <NavItem active={view === 'prototype'} onClick={() => setView('prototype')}>Dashboard</NavItem>
            <NavItem active={view === 'register'} onClick={() => setView('register')}>Account</NavItem>
          </nav>

          <div className="flex items-center gap-2">
            <div className="w-14 h-7 rounded-full bg-white/10 border border-white/20 p-1 flex items-center cursor-pointer relative" onClick={() => setIsDark(!isDark)}>
               <motion.div animate={{ x: isDark ? 28 : 0 }} className="absolute w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center">
                 {isDark ? <Moon size={10} className="text-indigo-900" /> : <Sun size={10} className="text-amber-500" />}
               </motion.div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-6 lg:p-12 custom-scroll overflow-y-auto">
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                <div className="rounded-[45px] glass-pod text-center p-12 lg:p-20 max-w-2xl mx-auto backdrop-blur-3x">
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Introducing {siteMetadata.title}</motion.div>
                  <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight tracking-tighter">{siteMetadata.title}</h1>
                  <p className="text-sm lg:text-ellipsis mb-10 opacity-80 uppercase tracking-wider">{siteMetadata.tagline}</p>

                  <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={() => setView('register')} className="px-10 py-5 bg-green-600 text-white rounded-3xl text-[12px] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:scale-105 transition-all">Get Started</button>
                    <button onClick={() => setView('bundles')} className="px-10 py-5 bg-white/10 border border-white/5 rounded-3xl text-[12px] font-black uppercase tracking-widest backdrop-blur-md hover:scale-105 transition-all">Select Bundle</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <FeatureCard icon="🌏" title="Global Reach" desc="Expand your horizons." delay={1} />
                  <FeatureCard icon="📊" title="Deep Data" desc="Analyze every metric." delay={2} />
                  <FeatureCard icon="⚡" title="Hyper Sync" desc="Real-time precision." delay={3} />
                </div>
              </motion.div>
            )}

            {view === 'bundles' && (
              <motion.div key="bundles" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-4 space-y-6">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-widest border border-blue-500/20">Pricing Plans</motion.div>
                    <h2 className="text-5xl font-black leading-none tracking-tighter italic">CHOOSE YOUR POWER</h2>
                    <p className="text-sm font-bold opacity-60 leading-relaxed">Unlock the full potential of global network scaling with our precision-engineered bundles.</p>
                    
                    <div className="glass-pod p-6 space-y-4 bg-white/5 border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500"><Zap size={20} fill="currentColor" /></div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest">Instant Setup</p>
                          <p className="text-[9px] font-bold opacity-40">Zero node latency</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500"><Shield size={20} fill="currentColor" /></div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest">Encrypted</p>
                          <p className="text-[9px] font-bold opacity-40">256-bit Node-to-Node</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="relative glass-pod p-10 h-[240px] overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent z-0"></div>
                      <div className="relative z-10 flex h-full items-center justify-between">
                        <div className="max-w-xs space-y-4">
                          <h4 className="text-xl font-black uppercase italic tracking-tight">Bundle Preview</h4>
                          <p className="text-[10px] font-bold opacity-60">Visualize your scaling potential before you commit. All bundles include our core NodeSync™ technology.</p>
                          <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Launch Preview</button>
                        </div>
                        <div className="w-48 h-full bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                          <Layers size={80} className="text-blue-500 opacity-20" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <BundleCard icon={Zap} name="Starter" price="$49" features={['5 Project Slots', 'Basic Analytics', '24/7 Support']} />
                      <BundleCard icon={Star} name="Enterprise" price="$149" features={['Unlimited Slots', 'Advance AI Insights', 'Dedicated Manager']} popular />
                      <BundleCard icon={Shield} name="Custom" price="Contact" features={['White-label API', 'Custom Node Sync', 'Global CDN']} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'prototype' && (
              <motion.div key="prototype" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="glass-pod p-10 h-[500px] flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:opacity-100 transition-opacity" />
                  <div className="text-center space-y-4 relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center mx-auto mb-6">
                       <Zap className="text-purple-500" size={40} />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic">Prototype Mode Active.</h3>
                    <p className="text-[11px] font-bold opacity-50 max-w-xs mx-auto">This represents the live scaling environment of Empiros. All nodes are ready for deployment.</p>
                    <button onClick={() => setView('home')} className="text-[10px] font-black uppercase tracking-widest text-blue-500 border-b-2 border-blue-500 pb-1">Exit Prototype</button>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'register' && (
              <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <RegistrationPage />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="h-[60px] px-8 flex items-center justify-between border-t border-white/10 shrink-0">
          <div className="flex gap-6 opacity-40 text-[9px] font-black uppercase tracking-widest">
            <span>Terms</span><span>Privacy</span><span>Contact</span>
          </div>
          <div className="flex gap-4 opacity-40 scale-90">
            <Twitter size={16} /> <Facebook size={16} /> <Instagram size={16} /> <Youtube size={16} />
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
