import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ExternalLink, ArrowLeft } from 'lucide-react';
import { bundleAPI } from '../api/client';

export default function BundleSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [bundleItems, setBundleItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await bundleAPI.getBundleItems(id);
        setBundleItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [id]);

  const handleDownload = async (item) => {
    // Open the resource link in a new tab
    window.open(item.url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin text-blue-500">
          <CheckCircle size={40} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-500 text-lg font-bold">{error}</p>
        <button
          onClick={() => navigate('/bundles')}
          className="text-blue-500 hover:text-blue-600"
        >
          Back to Bundles
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
        <h1 className="text-4xl font-black uppercase tracking-tight">🎉 Payment Successful!</h1>
        <p className="text-lg opacity-70">Your bundle is ready to download. Click on any resource to access it.</p>
      </motion.div>

      {/* Bundle Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-pod p-8 rounded-3xl space-y-4"
      >
        <h2 className="text-3xl font-black uppercase">{bundleItems?.bundleTitle}</h2>
        <p className="text-sm opacity-60">
          Purchased on: {new Date(bundleItems?.purchaseDate).toLocaleDateString()}
        </p>
      </motion.div>

      {/* Resources List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-pod p-8 rounded-3xl space-y-4"
      >
        <h3 className="text-2xl font-black uppercase mb-6">📚 Your Resources</h3>
        <div className="space-y-3">
          {bundleItems?.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex-1">
                <p className="font-bold text-base">{item.name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    {item.type}
                  </span>
                  <p className="text-xs opacity-60">{item.description}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDownload(item)}
                className="ml-4 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold text-white"
              >
                <Download size={16} /> Access
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/bundles')}
          className="px-8 py-3 bg-white/10 border border-white/20 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={16} /> View More Bundles
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}
