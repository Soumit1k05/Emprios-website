import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Loader } from 'lucide-react';
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
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black uppercase tracking-tighter italic">Our Bundles</h2>
        <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Curated collections of resources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
        {bundles.map((bundle, index) => (
          <motion.div
            key={bundle._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-pod p-8 rounded-3xl flex flex-col gap-6 hover:shadow-2xl transition-shadow"
          >
            <div className="w-full h-40 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <img
                src={bundle.image}
                alt={bundle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tight">{bundle.title}</h3>
              <p className="text-xs opacity-70 line-clamp-2">{bundle.description}</p>
            </div>

            <div className="space-y-2 flex-1">
              <p className="text-2xl font-black">₹{bundle.price}</p>
              <p className="text-xs opacity-50">{bundle.items.length} items included</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = `/bundle/${bundle._id}`}
              className="w-full py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={14} /> View & Purchase
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
