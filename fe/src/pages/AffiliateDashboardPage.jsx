import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2, TrendingUp, Users, Gift, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const [affiliateCode, setAffiliateCode] = useState('');
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalSales: 0,
    referralLink: '',
    commissionRate: 10
  });
  const [affiliateStats, setAffiliateStats] = useState([]);
  const [copied, setCopied] = useState('');
  const [bundles, setBundles] = useState([]);
  const [selectedBundle, setSelectedBundle] = useState('all');

  useEffect(() => {
    // Check if user is logged in, if not auto-create guest account
    let userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      const guestToken = `guest_${Date.now()}`;
      localStorage.setItem('token', guestToken);
      localStorage.setItem('userEmail', 'guest@emprios.com');
      localStorage.setItem('userName', 'Guest Affiliate');
      userEmail = 'guest@emprios.com';
    }

    // Generate or retrieve affiliate code
    let code = localStorage.getItem('affiliateCode');
    if (!code) {
      code = `EMPRIOS${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      localStorage.setItem('affiliateCode', code);
    }
    setAffiliateCode(code);

    // Load affiliate stats
    const stats = JSON.parse(localStorage.getItem('affiliateStats') || '[]');
    setAffiliateStats(stats);

    // Calculate total earnings
    const total = stats.reduce((sum, stat) => sum + stat.totalEarnings, 0);
    const totalSales = stats.reduce((sum, stat) => sum + stat.totalSales, 0);

    setStats({
      totalEarnings: total,
      totalSales: totalSales,
      referralLink: `${window.location.origin}?ref=${code}`,
      commissionRate: 10
    });

    // Load mock bundles for stats
    const { mockBundles } = require('../api/mockData');
    setBundles(mockBundles || []);
  }, []);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const getReferralLink = (bundleId) => {
    return `${window.location.origin}/bundle/${bundleId}?ref=${affiliateCode}`;
  };

  const getShareMessage = (bundleTitle) => {
    return `Check out this amazing bundle "${bundleTitle}" - Get instant access to premium resources! Use my referral link to get the best deal.`;
  };

  const shareToWhatsApp = (link, message) => {
    const text = `${message} ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToTwitter = (link, message) => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message + ' ' + link)}`, '_blank');
  };

  const filteredStats = selectedBundle === 'all' 
    ? affiliateStats 
    : affiliateStats.filter(stat => stat.bundleId === selectedBundle);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Affiliate Dashboard</h1>
        <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Earn commissions by referring bundles</p>
      </motion.div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="glass-pod p-8 rounded-3xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl">💰</span>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <div>
            <p className="text-xs opacity-60 uppercase tracking-widest">Total Earnings</p>
            <p className="text-4xl font-black mt-2">₹{stats.totalEarnings}</p>
          </div>
          <p className="text-xs opacity-50">10% commission on each sale</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-pod p-8 rounded-3xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl">📊</span>
            <Users className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="text-xs opacity-60 uppercase tracking-widest">Total Sales</p>
            <p className="text-4xl font-black mt-2">{stats.totalSales}</p>
          </div>
          <p className="text-xs opacity-50">Referrals converted to sales</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-pod p-8 rounded-3xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl">🎯</span>
            <Gift className="text-purple-500" size={24} />
          </div>
          <div>
            <p className="text-xs opacity-60 uppercase tracking-widest">Commission Rate</p>
            <p className="text-4xl font-black mt-2">{stats.commissionRate}%</p>
          </div>
          <p className="text-xs opacity-50">On every purchase</p>
        </motion.div>
      </div>

      {/* Affiliate Code Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-pod p-8 rounded-3xl space-y-6"
      >
        <h2 className="text-2xl font-black uppercase">🔗 Your Affiliate Code</h2>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
          <div>
            <p className="text-xs opacity-60 uppercase tracking-widest mb-2">Affiliate Code</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 font-mono text-lg font-bold text-blue-300">
                {affiliateCode}
              </code>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(affiliateCode, 'code')}
                className="p-3 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied === 'code' ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <Copy size={20} />
                )}
              </motion.button>
            </div>
          </div>

          <div>
            <p className="text-xs opacity-60 uppercase tracking-widest mb-2">Your Referral Link</p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={stats.referralLink}
                readOnly
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-sm font-mono text-blue-300 overflow-hidden truncate"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(stats.referralLink, 'link')}
                className="p-3 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied === 'link' ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <Copy size={20} />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4">
          <p className="text-xs text-green-300">
            💡 Share your referral link with friends and earn ₹{Math.ceil(0 * 0.1)} commission on each bundle purchase!
          </p>
        </div>
      </motion.div>

      {/* Bundle Referral Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-pod p-8 rounded-3xl space-y-6"
      >
        <h2 className="text-2xl font-black uppercase">📦 Share Bundle Links</h2>

        <div className="space-y-3">
          {bundles.map((bundle, index) => (
            <motion.div
              key={bundle._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-base">{bundle.title}</h3>
                  <p className="text-xs opacity-60 mt-1">
                    Price: ₹{bundle.price} • Earn: ₹{Math.ceil(bundle.price * 0.1)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => copyToClipboard(getReferralLink(bundle._id), `link-${bundle._id}`)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                    title="Copy link"
                  >
                    {copied === `link-${bundle._id}` ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <Copy size={18} />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => shareToWhatsApp(getReferralLink(bundle._id), getShareMessage(bundle.title))}
                    className="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-green-400"
                    title="Share on WhatsApp"
                  >
                    <Share2 size={18} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => shareToTwitter(getReferralLink(bundle._id), getShareMessage(bundle.title))}
                    className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                    title="Share on Twitter"
                  >
                    <Share2 size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sales Tracking */}
      {affiliateStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-pod p-8 rounded-3xl space-y-6"
        >
          <h2 className="text-2xl font-black uppercase">📈 Recent Sales</h2>

          <div className="space-y-3">
            {affiliateStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex-1">
                  <p className="font-bold text-sm">Sale #{index + 1}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {new Date(stat.lastSaleDate).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-green-400">+₹{stat.totalEarnings}</p>
                  <p className="text-xs opacity-60">{stat.totalSales} sales</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Marketing Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-pod p-8 rounded-3xl space-y-6"
      >
        <h2 className="text-2xl font-black uppercase">💡 Marketing Tips</h2>

        <div className="space-y-3">
          <div className="flex gap-4">
            <span className="text-2xl flex-shrink-0">📱</span>
            <div>
              <p className="font-bold text-sm">Share on Social Media</p>
              <p className="text-xs opacity-70">Use WhatsApp, Twitter, LinkedIn, or other social platforms. Our buttons make sharing easy!</p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="text-2xl flex-shrink-0">👥</span>
            <div>
              <p className="font-bold text-sm">Target Your Audience</p>
              <p className="text-xs opacity-70">Share bundle links with people interested in that subject matter (developers for Web Dev, students for Interview Prep, etc.)</p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="text-2xl flex-shrink-0">🔗</span>
            <div>
              <p className="font-bold text-sm">Use Short Links</p>
              <p className="text-xs opacity-70">Copy and share the bundle links directly. Each link includes your affiliate code automatically.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="text-2xl flex-shrink-0">💬</span>
            <div>
              <p className="font-bold text-sm">Write Reviews</p>
              <p className="text-xs opacity-70">Share your honest feedback about bundles. People trust recommendations from real users.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/bundles')}
        className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold uppercase tracking-widest transition-colors"
      >
        ← Back to Bundles
      </motion.button>
    </div>
  );
}
