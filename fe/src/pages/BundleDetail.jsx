import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Loader2, Check, AlertCircle, Gift } from 'lucide-react';
import { bundleAPI } from '../api/client';
import RazorpayPaymentModal from '../components/RazorpayPaymentModal';

export default function BundleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState(null);
  const [affiliateInfo, setAffiliateInfo] = useState(null);

  useEffect(() => {
    // Check for affiliate code in URL params
    const refCode = searchParams.get('ref') || searchParams.get('affiliate');
    if (refCode) {
      setAffiliateCode(refCode);
      // Get affiliate info from localStorage
      const affiliateStats = JSON.parse(localStorage.getItem('affiliateStats') || '[]');
      const affiliate = affiliateStats.find(a => a.code === refCode);
      if (affiliate) {
        setAffiliateInfo(affiliate);
      }
    }

    const fetchBundleData = async () => {
      try {
        setLoading(true);
        const data = await bundleAPI.getBundleById(id);
        setBundle(data);
        // Do NOT check for previous purchases
        // Always show "Buy Now" button on every refresh
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBundleData();
  }, [id, searchParams]);

  const handlePurchaseClick = () => {
    // Auto-create guest session if not logged in
    const guestToken = `guest_${Date.now()}`;
    localStorage.setItem('token', guestToken);
    localStorage.setItem('userEmail', 'guest@emprios.com');
    localStorage.setItem('userName', 'Guest User');

    // Always show payment modal - no purchase status check
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setPaymentModalOpen(false);
    // Redirect to success page after a short delay
    setTimeout(() => {
      navigate(`/bundle/${id}/success`);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error && !bundle) {
    return (
      <div className="glass-pod p-8 rounded-3xl flex items-center gap-4 text-red-500">
        <AlertCircle size={24} />
        <div>
          <h3 className="font-bold">Error</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return <div className="text-red-500 text-center p-8">Bundle not found</div>;
  }

  return (
    <div className="space-y-8">
      <motion.button
        onClick={() => navigate('/bundles')}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-bold mb-4"
      >
        <ArrowLeft size={16} /> Back to Bundles
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left side - Bundle Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 space-y-6"
        >
          {/* Bundle Image / Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full aspect-video rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-4 border-white/50 relative group"
          >
            <img
              src={bundle.image}
              alt={bundle.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-2">
               <span className="px-4 py-1.5 rounded-full bg-blue-600/80 text-white text-[10px] font-black uppercase tracking-widest w-fit backdrop-blur-md">Full Bundle Pack</span>
               <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none italic">{bundle.title}</h1>
            </div>
          </motion.div>

          {/* Description */}
          <div className="glass-pod p-10 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
               <h2 className="text-2xl font-black uppercase tracking-tighter italic">About this Bundle</h2>
            </div>
            <p className="text-lg opacity-80 leading-relaxed font-medium">{bundle.description}</p>
          </div>

          {/* Side-by-Side Preview (Contents) */}
          <div className="glass-pod p-10 rounded-[2.5rem] space-y-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Check size={20} /></span> Contents Breakdown
              </h2>
              <span className="text-xs font-black uppercase tracking-widest opacity-40">{bundle.items.length} Premium Modules</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bundle.items.map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl transition-all duration-300 group"
                >
                   <div className="flex items-center justify-between mb-2">
                     <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase rounded-lg border border-blue-500/20">{item.type}</span>
                     <span className="text-[10px] font-black opacity-30 italic">Module {index + 1}</span>
                   </div>
                   <h3 className="font-black text-lg mb-1">{item.name}</h3>
                   <p className="text-xs opacity-60 line-clamp-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right side - Purchase Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 sticky top-8"
        >

          <div className="glass-pod p-8 rounded-3xl space-y-6 sticky top-24">
            <div className="space-y-2">
              <p className="text-xs opacity-60 uppercase tracking-widest">Total Price</p>
              <p className="text-5xl font-black">₹{bundle.price}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs opacity-60 uppercase tracking-widest">What You Get</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-green-500" />
                  {bundle.items.length} premium resources
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-green-500" />
                  Lifetime access
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-green-500" />
                  Direct links & downloads
                </li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePurchaseClick}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              💳 Buy Now
            </motion.button>

            <p className="text-xs text-center opacity-50">
              ✓ Secured Payment • ✓ Powered by Razorpay • ✓ Instant Access
            </p>

            {affiliateCode && (
              <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4 text-center">
                <p className="text-xs font-bold text-green-400">🎁 Affiliate Offer Applied</p>
                <p className="text-xs opacity-70 mt-1">Special price via referral code</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Razorpay UPI Payment Modal */}
      <RazorpayPaymentModal
        isOpen={paymentModalOpen}
        bundle={bundle}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        affiliateCode={affiliateCode}
      />
    </div>
  );
}
