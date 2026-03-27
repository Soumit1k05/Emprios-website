import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Twitter, Facebook, Instagram, Youtube,
  ArrowLeft, Check, Zap
} from 'lucide-react';
import BundleList from './pages/BundleList';
import BundleDetail from './pages/BundleDetail';
import BundleSuccess from './pages/BundleSuccess';
import AffiliateDashboardPage from './pages/AffiliateDashboardPage';
import AccountPage from './pages/AccountPage';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import Dashboard from './pages/Dashboard';
import Logo from './components/Logo';
import { useAuth } from './context/AuthContext';





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

const BundleCard = ({ name, price, features, popular }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className={`glass-pod p-8 relative flex flex-col gap-6 ${popular ? 'border-blue-400 ring-2 ring-blue-400/20' : ''}`}
  >
    {popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</div>}
    <div className="space-y-1">
      <h3 className="text-xl font-black uppercase tracking-tighter">{name}</h3>
      <div className="text-3xl font-black">{price}<span className="text-xs opacity-40 font-bold">/mo</span></div>
    </div>
    <ul className="space-y-3 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-[10px] font-bold opacity-70">
          <Check size={12} className="text-blue-500" /> {f}
        </li>
      ))}
    </ul>
    <button className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${popular ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/10 hover:bg-white/20'}`}>
      Select {name}
    </button>
  </motion.div>
);

function AppContent() {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : false;
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', JSON.stringify(isDark));
  }, [isDark]);

  const handleBack = () => {
    if (location.pathname !== '/') {
      navigate(-1);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-2 lg:p-8 relative">

      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>

      <motion.div layout className="hub-main w-full max-w-7xl flex flex-col min-h-[95vh]">

        {/* Header */}
        <header className="h-[75px] px-8 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={handleBack} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div onClick={() => navigate('/')}>
               <Logo />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <NavItem active={location.pathname === '/'} onClick={() => navigate('/')}>Home</NavItem>
            <NavItem active={location.pathname === '/bundles'} onClick={() => navigate('/bundles')}>Bundles</NavItem>
            <NavItem active={location.pathname === '/affiliate'} onClick={() => navigate('/affiliate')}>Affiliate</NavItem>
            <NavItem active={location.pathname === '/dashboard'} onClick={() => navigate('/dashboard')}>Dashboard</NavItem>
            {user ? (
               <NavItem active={location.pathname === '/account'} onClick={() => navigate('/account')}>Account</NavItem>
            ) : (
               <NavItem active={location.pathname === '/login'} onClick={() => navigate('/login')}>Login</NavItem>
            )}

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
        <main className="flex-1 p-6 lg:p-12">

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                  <div className="rounded-[45px] glass-pod text-center p-12 lg:p-20 max-w-2xl mx-auto backdrop-blur-3x">
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] mb-6">Introducing Empiros</motion.div>
                    <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight tracking-tighter">EMPIROS</h1>
                    <p className="text-sm lg:text-lg font-bold mb-10 opacity-70 tracking-tight lowercase">Build your network today</p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <button onClick={() => navigate('/bundles')} className="px-10 py-5 bg-green-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:scale-105 transition-transform">Get Started</button>
                      <button onClick={() => navigate('/bundles')} className="px-10 py-5 bg-white/10 border border-white/5 rounded-3xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md hover:bg-white/20 transition-all">Browse Bundles</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <FeatureCard icon="🚀" title="Instant Start" desc="Sign up and start earning in minutes." delay={1} />
                    <FeatureCard icon="💸" title="60% Payout" desc="Industry leading commissions." delay={2} />
                    <FeatureCard icon="📈" title="Live Stats" desc="Track your progress in real-time." delay={3} />
                    <FeatureCard icon="🎓" title="Free Gear" desc="Get exclusive bundle resources." delay={4} />
                  </div>

                  {/* Why Join Us Section */}
                  <div className="mt-20 glass-pod p-8 lg:p-16 space-y-10">
                    <div className="text-left space-y-3">
                      <h2 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase">Why Choose Empiros?</h2>
                      <p className="text-sm opacity-50 font-bold uppercase tracking-widest">The ecosystem built for modern digital marketers.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                             <Check size={20} />
                          </div>
                          <h3 className="text-lg font-black uppercase">Automated Payouts</h3>
                        </div>
                        <p className="text-sm opacity-60 font-medium leading-relaxed">No more waiting for weeks. Our system processes affiliate payouts with precision and speed, ensuring you get your hard-earned money faster than anywhere else.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                             <Zap size={20} />
                          </div>
                          <h3 className="text-lg font-black uppercase">High-Quality Bundles</h3>
                        </div>
                        <p className="text-sm opacity-60 font-medium leading-relaxed">Promote products you can actually stand behind. Our course bundles and digital resources are curated by industry experts to provide genuine value to your referrals.</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-12">
                     <p className="text-xs font-bold opacity-30 uppercase tracking-[0.5em]">Trusted by 10,000+ Affiliates Worldwide</p>
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

              <Route path="/affiliate" element={
                <motion.div key="affiliate" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                  <AffiliateDashboardPage />
                </motion.div>
              } />

              <Route path="/dashboard" element={
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Dashboard />
                </motion.div>
              } />


              <Route path="/account" element={
                <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AccountPage onLogout={() => navigate('/')} />
                </motion.div>
              } />


              <Route path="/register" element={
                <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <RegistrationPage />
                </motion.div>
              } />

              <Route path="/login" element={
                <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <LoginPage />
                </motion.div>
              } />
            </Routes>

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

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
