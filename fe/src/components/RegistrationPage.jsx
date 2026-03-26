import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/Empiros_Logo.jpeg';

const InputField = ({ icon: Icon, label, name, type = 'text', placeholder, value, onChange, required = false, minLength }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black uppercase tracking-widest opacity-50">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={15} />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        value={value}
        onChange={onChange}
        className="w-full bg-white/10 border border-white/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all placeholder:opacity-30"
      />
    </div>
  </div>
);

export default function AuthPage({ onSuccess }) {
  const { login } = useAuth();
  const [tab, setTab] = useState('register');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', company: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const endpoint = tab === 'register'
      ? 'http://localhost:5000/api/auth/register'
      : 'http://localhost:5000/api/auth/login';

    const body = tab === 'register'
      ? { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone, company: formData.company }
      : { email: formData.email, password: formData.password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        login(data);
        onSuccess();
      } else {
        setMessage({ type: 'error', text: data.message || 'Something went wrong.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Cannot reach server. Make sure backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    setFormData({ name: '', email: '', password: '', phone: '', company: '' });
    setMessage({ type: '', text: '' });
  };

  return (
    <motion.div
      key="auth"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto"
    >
      <div className="glass-pod p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={Logo} alt="Empiros Logo" className="w-20 h-20 rounded-2xl mx-auto mb-4 shadow-xl shadow-blue-500/20" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            {tab === 'register' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-[10px] font-bold opacity-40 mt-1.5 uppercase tracking-widest">
            {tab === 'register' ? 'Join the Empiros ecosystem today' : 'Sign in to your Empiros account'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
          {['register', 'login'].map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'opacity-40 hover:opacity-70'
              }`}
            >
              {t === 'register' ? 'Sign Up' : 'Sign In'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {tab === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <InputField icon={User}      label="Full Name"    name="name"    placeholder="John Doe"         value={formData.name}    onChange={handleChange} required />
                <InputField icon={Phone}     label="Phone Number" name="phone"   placeholder="+1 234 567 8900"  value={formData.phone}   onChange={handleChange} />
                <InputField icon={Building2} label="Company"      name="company" placeholder="Acme Corp (optional)" value={formData.company} onChange={handleChange} />
              </motion.div>
            )}
          </AnimatePresence>

          <InputField icon={Mail} label="Email Address" name="email" type="email" placeholder="name@company.com" value={formData.email} onChange={handleChange} required />
          <InputField icon={Lock} label="Password"      name="password" type="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required minLength={6} />

          {/* Message */}
          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-2xl text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20"
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 text-[10px] uppercase tracking-widest mt-2"
          >
            {loading
              ? <Loader2 className="animate-spin" size={18} />
              : <>{tab === 'register' ? 'Create Account' : 'Sign In'} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} /></>
            }
          </button>
        </form>

        <p className="text-center mt-6 text-[10px] font-bold opacity-40">
          {tab === 'register' ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => switchTab(tab === 'register' ? 'login' : 'register')}
            className="text-blue-400 font-black hover:underline opacity-100"
          >
            {tab === 'register' ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </motion.div>
  );
}
