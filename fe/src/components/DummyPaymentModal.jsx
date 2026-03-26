import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader, AlertCircle } from 'lucide-react';

export default function DummyPaymentModal({ isOpen, bundle, onClose, onPaymentSuccess }) {
  const [step, setStep] = useState('details'); // details, processing, success, error
  const [formData, setFormData] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    upiId: '',
    amount: bundle?.price || 0
  });
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  // Safety check: if bundle is not provided, return nothing
  if (!bundle) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.upiId.trim()) {
      setError('UPI ID is required');
      return false;
    }
    if (!formData.upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g., name@upi)');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    try {
      setProcessing(true);
      setStep('processing');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate random success/failure (90% success rate for demo)
      const success = Math.random() < 0.9;

      if (success) {
        // Store purchase in localStorage
        const purchases = JSON.parse(localStorage.getItem('purchasedBundles') || '[]');
        const newPurchase = {
          bundleId: bundle._id,
          bundleTitle: bundle.title,
          purchaseDate: new Date().toISOString(),
          amount: bundle.price,
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        purchases.push(newPurchase);
        localStorage.setItem('purchasedBundles', JSON.stringify(purchases));

        setStep('success');
        setTimeout(() => {
          onPaymentSuccess(newPurchase);
        }, 1500);
      } else {
        setError('Payment declined by bank. Please try again.');
        setStep('error');
        setProcessing(false);
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setStep('error');
      setProcessing(false);
    }
  };

  const handleRetry = () => {
    setStep('details');
    setError('');
    setProcessing(false);
  };

  const handleClose = () => {
    if (step !== 'processing') {
      setStep('details');
      setError('');
      setProcessing(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-pod rounded-3xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Details Step */}
            {step === 'details' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black uppercase tracking-tight">💳 Checkout</h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Bundle Summary */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-xs opacity-60 uppercase tracking-widest mb-2">Order Summary</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{bundle?.title}</span>
                      <span className="font-black text-lg">₹{bundle?.price}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 mt-2 flex justify-between items-center font-black">
                      <span>Total</span>
                      <span className="text-2xl text-blue-400">₹{bundle?.price}</span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder-white/40 focus:outline-none focus:bg-white/20 focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder-white/40 focus:outline-none focus:bg-white/20 focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="yourname@upi"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder-white/40 focus:outline-none focus:bg-white/20 focus:border-blue-400 transition-colors"
                    />
                    <p className="text-xs opacity-50 mt-1">Try: test@okhdfcbank or test@ybl</p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 flex gap-3 items-start"
                  >
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}

                {/* Payment Methods Info */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Payment Methods</p>
                  <div className="space-y-2 text-xs">
                    <p className="opacity-70">✓ UPI (Instant)</p>
                    <p className="opacity-70">✓ Test Mode - No real charges</p>
                    <p className="opacity-70">✓ Money-back guarantee</p>
                  </div>
                </div>

                {/* Pay Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay ₹{bundle?.price}
                </motion.button>

                <p className="text-xs text-center opacity-50">
                  Secure transaction • No sensitive data stored • Test mode
                </p>
              </motion.div>
            )}

            {/* Processing Step */}
            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 space-y-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Loader size={48} className="text-blue-400" />
                </motion.div>
                <p className="text-lg font-bold uppercase tracking-tight">Processing Payment...</p>
                <p className="text-sm opacity-60">Please wait while we process your payment</p>
              </motion.div>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 space-y-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <Check size={64} className="text-green-400" />
                </motion.div>
                <p className="text-2xl font-black uppercase tracking-tight">Payment Successful!</p>
                <p className="text-sm opacity-60">Your bundle access is being activated...</p>
              </motion.div>
            )}

            {/* Error Step */}
            {step === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-center">
                  <AlertCircle size={48} className="text-red-400" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-black uppercase tracking-tight">Payment Failed</p>
                  <p className="text-sm opacity-60">{error}</p>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-xs text-red-300">
                    💡 Tip: Try using test UPI ID "test@okhdfcbank" with any 6-digit OTP
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRetry}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold uppercase tracking-wider hover:shadow-lg transition-all"
                  >
                    Try Again
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
