import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { bundleAPI } from '../api/client';

export default function BundleList() {
  const [bundles, setBundle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        setLoading(true);
        const data = await bundleAPI.getAllBundles();
        setBundle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBundles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black uppercase tracking-tighter italic">Our Bundles</h2>
        <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Curated collections of resources • Instant access • Lifetime validity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">

        {bundles.map((bundle, index) => (
          <motion.div
            key={bundle._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-pod p-8 rounded-3xl flex flex-col gap-6 hover:shadow-2xl transition-shadow group cursor-pointer"
            onClick={() => window.location.href = `/bundle/${bundle._id}`}
          >
            <div className="w-full h-40 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <img
                src={bundle.image}
                alt={bundle.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"><span class="text-xs opacity-50">Image unavailable</span></div>';
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tight">{bundle.title}</h3>
              <p className="text-xs opacity-70 line-clamp-2">{bundle.description}</p>
            </div>

            <div className="space-y-2 flex-1">
              <p className="text-2xl font-black">₹{bundle.price}</p>
              <p className="text-xs opacity-50">{bundle.items.length} resources included</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = `/bundle/${bundle._id}`}
              className="w-full py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg"
            >
              <ShoppingCart size={14} /> View & Purchase
            </motion.button>
          </motion.div>
        ))}
      </div>

      {bundles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-opacity-70 mb-4">No bundles available yet</p>
          <button
            onClick={() => window.location.href = '/'}
            className="text-blue-500 hover:text-blue-600 font-bold"
          >
            Back to Home
          </button>
        </div>
      )}

      {/* Affiliate Partner Program CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-pod p-10 mt-12 mb-12 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
           <Zap className="text-blue-500" size={80} />
        </div>
        <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 relative z-10">Want to earn while you learn?</h3>
        <p className="text-sm font-bold opacity-60 max-w-lg mx-auto mb-8 uppercase tracking-widest leading-relaxed relative z-10">Join our partner ecosystem and earn <span className="text-blue-500">60% commission</span> for every successful referral.</p>
        <button
          onClick={() => window.location.href = '/affiliate'}
          className="px-12 py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-500/30 relative z-10"
        >
          Become an Affiliate Partner
        </button>
      </motion.div>

    </div>
  );
}
