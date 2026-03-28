import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Copy, CheckCircle2, DollarSign, Users, Percent,
  TrendingUp, Link as LinkIcon, Wallet, Clock, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/apiClient';
import { toast } from 'react-hot-toast';

// Reusable Detail Row for Recent Activity
const ActivityRow = ({ icon: Icon, title, date, amount }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/10 last:border-0">
    <div className="flex items-start gap-4">
      <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={16} className="text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-0.5">{date}</p>
        <p className="text-sm font-bold truncate">{title}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-black text-green-400">+₹{amount}</p>
    </div>
  </div>
);

export default function AffiliateDashboard() {
  const { user } = useAuth(); // Get the currently logged-in user
  const [loading, setLoading] = useState(true);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Dashboard state for the specific user
  const [dashboard, setDashboard] = useState({
    earnings: 0,
    sales: 0,
    commissionRate: 60,
    affiliateCode: user?.affiliateCode || '', 
    recentActivity: []
  });

  // Construct the personal referral link dynamically
  const baseUrl = window.location.origin;
  const referralLink = dashboard.affiliateCode 
    ? `${baseUrl}/ref/${dashboard.affiliateCode}`
    : 'Generating link...';

  // 1. Fetch Affiliate Data on mount
  useEffect(() => {
    const fetchAffiliateData = async () => {
      if (!user?.token) return;
      try {
        // Replace with your actual endpoint
        const res = await api.get('/affiliate/my-dashboard'); 
        setDashboard(prev => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error('Failed to fetch affiliate data:', err);
        // Fallback dummy data if API isn't ready yet
        setDashboard(prev => ({
          ...prev,
          earnings: 12500,
          sales: 14,
          affiliateCode: user?.name ? user.name.split(' ')[0].toUpperCase() + '60' : 'EMP-2026',
          recentActivity: [
            { id: 1, title: 'Bundle Sale - Pro Tier', date: '2 hours ago', amount: 899 },
            { id: 2, title: 'Bundle Sale - Basic', date: '1 day ago', amount: 499 },
          ]
        }));
      } finally {
        setLoading(false);
      }
    };
    fetchAffiliateData();
  }, [user]);

  // 2. Handle Copy Button Logic
  const handleCopy = async (text, type) => {
    if (!text || text === 'Generating link...') return;
    
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
      toast.success(`${type === 'code' ? 'Promo code' : 'Referral link'} copied to clipboard!`);
    } catch (err) {
      toast.error('Failed to copy. Please try again.');
    }
  };

  // 3. Handle Payout Request Logic
  const handleRequestPayout = async () => {
    if (dashboard.earnings <= 0) {
      toast.error('You need to have earnings to request a payout.');
      return;
    }

    setRequestingPayout(true);
    try {
      // Replace with your actual payout request endpoint
      // await api.post('/affiliate/request-payout', { amount: dashboard.earnings });
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Payout request submitted successfully!');
      
      // Optionally reset earnings to 0 locally after request
      // setDashboard(prev => ({ ...prev, earnings: 0 }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit payout request.');
    } finally {
      setRequestingPayout(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto space-y-5 pb-10"
    >
      {/* ── Welcome Hero ── */}
      <div className="glass-pod p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-blue-500/20">
        <div className="text-center sm:text-left space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500/15 text-blue-400 border border-blue-500/20">
            Partner Dashboard
          </span>
          <h2 className="text-2xl font-black uppercase tracking-normal">Welcome back, {user?.name?.split(' ')[0] || 'Partner'}</h2>
          <p className="text-sm opacity-60 font-medium">Here's how your referral links are performing.</p>
        </div>
        
        <button 
          onClick={handleRequestPayout}
          disabled={requestingPayout || dashboard.earnings <= 0}
          className="shrink-0 bg-blue-600 text-white font-black py-3 px-6 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {requestingPayout ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
          {requestingPayout ? 'Processing...' : 'Request Payout'}
        </button>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Earnings', value: `₹${dashboard.earnings.toLocaleString()}`, icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Total Referrals', value: dashboard.sales, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Commission', value: `${dashboard.commissionRate}%`, icon: Percent, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-pod p-6 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <TrendingUp size={16} className="text-white/20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{stat.label}</p>
            <p className="text-2xl font-black">{loading ? '...' : stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Your Links ── */}
      <div className="glass-pod p-8 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <LinkIcon size={18} className="text-blue-400" />
          <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50">Sharing Tools</h3>
        </div>

        {/* Code Input */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-widest opacity-50">Your Promo Code</label>
          <div className="relative flex items-center">
            <input
              type="text"
              readOnly
              value={dashboard.affiliateCode}
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none transition-all text-white tracking-wider"
            />
            <button
              onClick={() => handleCopy(dashboard.affiliateCode, 'code')}
              className="absolute right-2 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              title="Copy Promo Code"
            >
              {copiedCode ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Link Input */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-widest opacity-50">Direct Referral Link</label>
          <div className="relative flex items-center">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none transition-all text-white/70 pr-12 truncate"
            />
            <button
              onClick={() => handleCopy(referralLink, 'link')}
              className="absolute right-2 w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all shadow-md shadow-blue-500/20"
              title="Copy Link"
            >
              {copiedLink ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-[9px] opacity-40 mt-1 pl-1">Share this link directly. Anyone who buys through it earns you {dashboard.commissionRate}%.</p>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="glass-pod p-8">
        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Recent Conversions</h3>
        
        {loading ? (
           <p className="text-sm font-bold opacity-30 py-4 text-center">Loading activity...</p>
        ) : dashboard.recentActivity.length > 0 ? (
          dashboard.recentActivity.map((activity) => (
            <ActivityRow 
              key={activity.id}
              icon={Clock} 
              title={activity.title} 
              date={activity.date} 
              amount={activity.amount} 
            />
          ))
        ) : (
          <div className="py-8 text-center border-b border-white/10 last:border-0">
            <p className="text-sm font-bold opacity-30">No referrals yet. Share your link to get started!</p>
          </div>
        )}
      </div>

    </motion.div>
  );
}