import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ExternalLink, ArrowLeft, Copy, Check } from 'lucide-react';
import { bundleAPI } from '../api/client';

export default function BundleSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bundleData, setBundleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    const fetchBundleItems = async () => {
      try {
        setLoading(true);
        const data = await bundleAPI.getBundleItems(id);
        setBundleData(data);
      } catch (err) {
        setError(err.message);

        // Fallback: Import mockBundles to show resources even if API fails
        try {
          const { mockBundles } = await import('../api/mockData');
          const bundle = mockBundles.find(b => b._id === id);

          if (bundle) {
            setBundleData({
              bundleTitle: bundle.title,
              items: bundle.items,
              purchaseDate: new Date().toISOString()
            });
            setError(null);
          }
        } catch (e) {
          console.error('Error loading bundle data:', e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBundleItems();
  }, [id]);

  const handleCopyLink = (url, index) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleOpenResource = (url) => {
    window.open(url, '_blank');
  };

  // 🔄 Loading UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CheckCircle size={40} className="text-blue-500" />
        </motion.div>
      </div>
    );
  }

  // ❌ Error UI
  if (error || !bundleData) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-500 text-lg font-bold">
          {error || 'Bundle not found'}
        </p>
        <button
          onClick={() => navigate('/bundles')}
          className="text-blue-500 hover:text-blue-600 font-bold"
        >
          Back to Bundles
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Back Button */}
      <motion.button
        onClick={() => navigate('/bundles')}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-bold"
      >
        <ArrowLeft size={16} /> Back to Bundles
      </motion.button>

      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-pod p-12 rounded-3xl text-center space-y-4"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center"
        >
          <CheckCircle className="text-green-500" size={64} />
        </motion.div>

        <h1 className="text-4xl font-black uppercase tracking-tight">
          🎉 Payment Successful!
        </h1>

        <p className="text-lg opacity-70">
          Your bundle is ready. Click any resource below to access it.
        </p>
      </motion.div>

      {/* Bundle Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-pod p-8 rounded-3xl space-y-4"
      >
        <h2 className="text-3xl font-black uppercase">
          {bundleData.bundleTitle}
        </h2>

        <div className="flex gap-4 text-sm opacity-60">
          <span>✓ Purchased on {new Date(bundleData.purchaseDate).toLocaleDateString()}</span>
          <span>✓ Lifetime access</span>
          <span>✓ No expiry</span>
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-pod p-8 rounded-3xl space-y-4"
      >
        <h3 className="text-2xl font-black uppercase mb-6">
          📚 Resources ({bundleData.items.length})
        </h3>

        <div className="space-y-3">
          {bundleData.items.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition group"
            >
              <div className="flex-1">
                <p className="font-bold">{item.name}</p>
                <p className="text-sm opacity-60 mt-1">{item.description}</p>
              </div>

              <div className="flex gap-2">
                {/* Copy */}
                <button
                  onClick={() => handleCopyLink(item.url, index)}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  {copiedIndex === index ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>

                {/* Open */}
                <button
                  onClick={() => handleOpenResource(item.url)}
                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                >
                  <ExternalLink size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700"
        >
          Go to Dashboard
        </button>

        <button
          onClick={() => navigate('/bundles')}
          className="py-4 bg-white/10 rounded-2xl font-bold hover:bg-white/20"
        >
          Browse More Bundles
        </button>
      </div>

    </div>
  );
}