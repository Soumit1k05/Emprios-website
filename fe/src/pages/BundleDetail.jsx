import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Loader, Check, AlertCircle } from 'lucide-react';
import { bundleAPI } from '../api/client';
import DummyPaymentModal from '../components/DummyPaymentModal';

export default function BundleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBundleData = async () => {
      try {
        setLoading(true);
        const data = await bundleAPI.getBundleById(id);
        setBundle(data);
        
        // Check if user has already purchased this bundle
        const purchaseData = await bundleAPI.checkPurchase(id);
        setAlreadyPurchased(purchaseData.isPurchased);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBundleData();
  }, [id]);

  const handlePurchaseClick = () => {
    if (!token) {
      alert('Please login to purchase');
      navigate('/login');
      return;
    }

    if (alreadyPurchased) {
      navigate(`/bundle/${id}/success`);
      return;
    }

    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setPaymentModalOpen(false);
    setAlreadyPurchased(true);
    // Redirect to success page after a short delay
    setTimeout(() => {
      navigate(`/bundle/${id}/success`);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="animate-spin text-blue-500" size={40} />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left side - Bundle Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 space-y-6"
        >
          {/* Bundle Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-80 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg"
          >
            <img
              src={bundle.image}
              alt={bundle.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
              }}
            />
          </motion.div>

          <div className="glass-pod p-8 rounded-3xl space-y-4">
            <h1 className="text-4xl font-black uppercase tracking-tight">{bundle.title}</h1>
            <p className="text-base opacity-70">{bundle.description}</p>
          </div>

          <div className="glass-pod p-8 rounded-3xl space-y-4">
            <h2 className="text-2xl font-black uppercase">📦 Included Items ({bundle.items.length})</h2>
            <div className="space-y-3">
              {bundle.items.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm">{item.name}</p>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs opacity-60 mt-1">{item.description}</p>
                  </div>
                  <ExternalLink className="opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right side - Purchase Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1"
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

            {alreadyPurchased && (
              <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4">
                <p className="text-sm font-bold text-green-400">✓ Already Purchased</p>
                <p className="text-xs opacity-70 mt-1">You have access to this bundle</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePurchaseClick}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              {alreadyPurchased ? '👁️ View Content' : '💳 Buy Now'}
            </motion.button>

            <p className="text-xs text-center opacity-50">
              ✓ Instant access • ✓ Test mode • ✓ No real charges
            </p>
          </div>
        </motion.div>
      </div>

      {/* Dummy Payment Modal */}
      <DummyPaymentModal
        isOpen={paymentModalOpen}
        bundle={bundle}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
