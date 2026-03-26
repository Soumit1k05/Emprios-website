import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, Twitter, Facebook, Instagram, Youtube,
  ArrowLeft, Check, User
} from 'lucide-react';
import BundleList from './pages/BundleList';
import BundleDetail from './pages/BundleDetail';
import BundleSuccess from './pages/BundleSuccess';
import PaymentPage from './pages/PaymentPage';
import './App.css';

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

function AppContent() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleBack = () => {
    if (location.pathname !== '/') navigate(-1);
    else window.history.back();
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-2 lg:p-4 overflow-hidden relative">
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>

      <motion.div layout className="hub-main w-full max-h-[95vh] flex flex-col bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="h-[80px] px-8 flex items-center justify-between border-b border-white/5 shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={handleBack} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
              <img src={Logo} alt="Empiros Logo" className="w-10 h-10 rounded-xl shadow-lg border border-white/10 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:block text-xs font-black uppercase tracking-[0.4em] opacity-80 group-hover:opacity-100 transition-opacity">EMPIROS</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <NavItem active={location.pathname === '/'} onClick={() => navigate('/')}>Home</NavItem>
            <NavItem active={location.pathname === '/bundles'} onClick={() => navigate('/bundles')}>Bundles</NavItem>
            <NavItem active={location.pathname === '/dashboard'} onClick={() => navigate('/dashboard')}>Dashboard</NavItem>
            {user && (
              <NavItem active={location.pathname === '/affiliate'} onClick={() => navigate('/affiliate')}>Affiliates</NavItem>
            )}
            <NavItem active={location.pathname === '/account'} onClick={() => navigate(user ? '/account' : '/auth')}>
              {user ? 'Account' : 'Sign In'}
            </NavItem>
          </nav>

          <div className="flex items-center gap-4">
            <div className="w-12 h-6 rounded-full bg-white/10 border border-white/20 p-1 flex items-center cursor-pointer relative" onClick={() => setIsDark(!isDark)}>
              <motion.div animate={{ x: isDark ? 24 : 0 }} className="absolute w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center">
                {isDark ? <Moon size={8} className="text-indigo-900" /> : <Sun size={8} className="text-amber-500" />}
              </motion.div>
            </div>
            {user && (
              <button onClick={() => navigate('/account')} className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-600/30 transition-all">
                <User size={18} />
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-6 lg:p-10 custom-scroll overflow-y-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                  <div className="rounded-[45px] glass-pod text-center p-12 lg:p-20 max-w-2xl mx-auto backdrop-blur-3xl border border-white/20">
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-500/20">Empowering Your Agency</motion.div>
                    <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight tracking-tighter bg-gradient-to-b from-inherit to-inherit/50 bg-clip-text">EMPIROS</h1>
                    <p className="text-sm lg:text-lg font-bold mb-12 opacity-50 tracking-tight max-w-md mx-auto leading-relaxed">The ultimate hub for high-performance marketing and affiliate networking.</p>
                    <div className="flex flex-wrap justify-center gap-5">
                      <button onClick={() => navigate('/bundles')} className="px-10 py-5 bg-blue-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all">Get Started</button>
                      <button onClick={() => navigate('/bundles')} className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md hover:bg-white/15 active:scale-95 transition-all">Explore Bundles</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <FeatureCard icon="🌏" title="Global Scale" desc="Expand your reach instantly." delay={1} />
                    <FeatureCard icon="📊" title="Analytics" desc="Precision data tracking." delay={2} />
                    <FeatureCard icon="⚡" title="Turbo Flow" desc="Automated revenue streams." delay={3} />
                  </div>
                </motion.div>
              } />

              <Route path="/bundles" element={
                <motion.div key="bundles" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                  <BundleList />
                </motion.div>
              } />

              <Route path="/bundle/:id" element={
                <motion.div key="bundle-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <BundleDetail />
                </motion.div>
              } />

              <Route path="/bundle/:id/success" element={
                <motion.div key="bundle-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <BundleSuccess />
                </motion.div>
              } />

              <Route path="/payment/:id" element={
                <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PaymentPage />
                </motion.div>
              } />


              <Route path="/dashboard" element={
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <div className="glass-pod p-10 h-[500px] flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:opacity-100 transition-opacity" />
                    <div className="text-center space-y-4 relative z-10">
                      <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center mx-auto mb-6">
                        <Zap className="text-blue-500" size={40} />
                      </div>
                      <h3 className="text-2xl font-black uppercase italic">Prototype Mode Active.</h3>
                      <p className="text-[11px] font-bold opacity-50 max-w-xs mx-auto">This represents the live scaling environment of Empiros. All nodes are ready for deployment.</p>
                      <button onClick={() => navigate('/')} className="text-[10px] font-black uppercase tracking-widest text-blue-500 border-b-2 border-blue-500 pb-1">Exit Prototype</button>
                    </div>
                  </div>
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="h-[65px] px-8 flex items-center justify-between border-t border-white/5 shrink-0 bg-black/5">
          <div className="flex gap-8 opacity-40 text-[9px] font-black uppercase tracking-widest">
            <span className="hover:opacity-100 cursor-pointer transition-opacity">Terms</span>
            <span className="hover:opacity-100 cursor-pointer transition-opacity">Privacy</span>
            <span className="hover:opacity-100 cursor-pointer transition-opacity">Support</span>
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-20">© 2026 EMPIROS PLATFORM</p>
          <div className="flex gap-5 opacity-40 scale-90">
            <Twitter size={16} className="hover:text-blue-400 cursor-pointer transition-colors" />
            <Instagram size={16} className="hover:text-pink-400 cursor-pointer transition-colors" />
            <Youtube size={16} className="hover:text-red-500 cursor-pointer transition-colors" />
          </div>
        </footer>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
