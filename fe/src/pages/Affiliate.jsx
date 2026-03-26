import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, DollarSign, Link as LinkIcon, ArrowUpRight, 
  Wallet, Clock, CheckCircle2, AlertCircle, Copy, 
  Plus, Loader2, Sparkles, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/Empiros_Logo.jpeg';

const StatCard = ({ icon: Icon, label, value, subvalue, color }) => (
  <div className="glass-pod p-6 flex flex-col gap-4 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 blur-3xl -mr-8 -mt-8 group-hover:bg-${color}-500/20 transition-all`} />
    <div className={`w-12 h-12 rounded-2xl bg-${color}-500/10 flex items-center justify-center text-${color}-400 shrink-0`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
        {subvalue && <span className="text-xs font-bold opacity-60">{subvalue}</span>}
      </div>
    </div>
  </div>
);

const PayoutRow = ({ amount, date, status, method }) => {
  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-inherit opacity-40">
          <Wallet size={18} />
        </div>
        <div>
          <p className="text-sm font-bold">${amount.toFixed(2)}</p>
          <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">{new Date(date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${statusColors[status]}`}>
          {status}
        </span>
        <span className="text-[9px] opacity-30 font-bold uppercase tracking-widest">{method}</span>
      </div>
    </div>
  );
};

export default function AffiliatePage() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const affiliateLink = `${window.location.origin}/bundles?ref=${user?.affiliateCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/affiliate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        setMessage({ type: 'success', text: 'Welcome to the Empiros Partner Program!' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Server error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePayoutRequest = async (e) => {
    e.preventDefault();
    if (!payoutAmount || !payoutMethod) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ amount: parseFloat(payoutAmount), method: payoutMethod }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        setPayoutAmount('');
        setPayoutMethod('');
        setMessage({ type: 'success', text: 'Payout request submitted successfully.' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Server error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user?.affiliateCode) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center space-y-8 py-12"
      >
        <div className="glass-pod p-12 lg:p-16 space-y-8 bg-gradient-to-b from-blue-500/5 to-transparent">
          <div className="relative inline-block">
             <div className="p-1 bg-white/5 rounded-3xl border border-white/10 relative z-10">
                <img src={Logo} alt="Logo" className="w-24 h-24 rounded-2xl shadow-2xl mx-auto" />
             </div>
             <motion.div 
               animate={{ rotate: 360, scale: [1, 1.1, 1] }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-[3px] border-dashed border-blue-500/10 rounded-[2.5rem] -m-6"
             />
          </div>

          
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tighter uppercase">Become an Affiliate</h2>
            <p className="text-sm font-bold opacity-60 leading-relaxed max-w-md mx-auto">
              Join the elite Empiros partners and earn <span className="text-green-500">60% commission</span> for every successful bundle referral.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              { icon: LinkIcon, title: "Share Link", desc: "Get unique links." },
              { icon: Users, title: "Refer Users", desc: "Grow your network." },
              { icon: DollarSign, title: "Earn Big", desc: "Weekly payouts." },
            ].map((f, i) => (
              <div key={i} className="space-y-2 opacity-80">
                <f.icon size={20} className="text-blue-400" />
                <h4 className="text-[10px] font-black uppercase tracking-widest">{f.title}</h4>
                <p className="text-[10px] opacity-60 font-medium leading-tight">{f.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerateCode}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-3xl text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><Sparkles size={18} /> Activate Partner Account</>}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20">Active Partner</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Code: {user.affiliateCode}</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Affiliate Hub</h1>
          <p className="text-sm font-bold opacity-40 tracking-tight">Track your performance and manage payouts</p>
        </div>
        
        <div className="glass-pod p-1.5 flex gap-1 bg-white/5 border border-white/10 shrink-0">
          <div className="px-4 py-2 bg-blue-500/10 rounded-2xl border border-blue-500/20 max-w-[200px] overflow-hidden">
            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Your Partner Link</p>
            <p className="text-xs font-bold truncate opacity-80">{affiliateLink}</p>
          </div>
          <button 
            onClick={handleCopyLink}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${copying ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
          >
            {copying ? <CheckCircle2 size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        <StatCard icon={DollarSign} label="Total Earnings" value={`$${user.earnings?.toFixed(2) || '0.00'}`} subvalue="Real-time" color="green" />
        <StatCard icon={Users} label="Total Referrals" value={user.referrals?.length || '0'} subvalue="users" color="blue" />
        <StatCard icon={TrendingUp} label="Conversion" value="12.5%" subvalue="+2.1%" color="purple" />
        <StatCard icon={Clock} label="Pending Payouts" value={`$${user.payouts?.filter(p => p.status === 'pending').reduce((a, b) => a + b.amount, 0).toFixed(2) || '0.00'}`} subvalue="Awaiting" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        {/* Payout Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-pod p-8 space-y-6 flex flex-col h-full bg-gradient-to-br from-white/10 to-transparent border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Wallet size={20} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter">Request Payout</h3>
            </div>

            <form onSubmit={handlePayoutRequest} className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest opacity-50">Amount to Withdraw</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-sm opacity-40">$</span>
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="10"
                    max={user.earnings}
                    className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-8 pr-4 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <p className="text-[9px] opacity-30 font-bold uppercase tracking-widest">Min. withdrawal: $10.00</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest opacity-50">Payout Method</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                >
                  <option value="" disabled>Select Method</option>
                  <option value="UPI">UPI / GPay</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="Crypto">Crypto (USDT)</option>
                </select>
              </div>

              <AnimatePresence>
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                      message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                    }`}
                  >
                    {message.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading || !payoutAmount || !payoutMethod}
                className="w-full bg-white text-black font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black mt-4"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Request Payout'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent History Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-pod p-8 space-y-6 bg-black/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Clock size={20} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Payout History</h3>
              </div>
              <button className="text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">View All</button>
            </div>

            <div className="space-y-1">
              {user.payouts && user.payouts.length > 0 ? (
                user.payouts.slice(-5).reverse().map((payout, i) => (
                  <PayoutRow key={i} {...payout} />
                ))
              ) : (
                <div className="py-12 text-center opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest">No past payouts found</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-pod p-6 flex items-center gap-4 bg-blue-600/10 border border-blue-500/20">
               <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                 <LinkIcon size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-black uppercase tracking-tighter">Marketing Assets</h4>
                  <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Download banners & assets</p>
               </div>
               <ArrowUpRight size={18} className="ml-auto opacity-30" />
            </div>
            
            <div className="glass-pod p-6 flex items-center gap-4 bg-green-600/10 border border-green-500/20">
               <div className="w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-lg shadow-green-500/30">
                 <Plus size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-black uppercase tracking-tighter">Campaigns</h4>
                  <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Create tracking links</p>
               </div>
               <ArrowUpRight size={18} className="ml-auto opacity-30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
