import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader, AlertCircle, Copy } from 'lucide-react';

export default function RazorpayPaymentModal({ isOpen, bundle, onClose, onPaymentSuccess, affiliateCode }) {
  const [step, setStep] = useState('details'); // details, processing, success, error
  const [formData, setFormData] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    phoneNumber: localStorage.getItem('userPhone') || '',
    upiId: '',
  });
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [affiliateCommission, setAffiliateCommission] = useState(0);
  const [copied, setCopied] = useState(false);

  // Safety check: if bundle is not provided, return nothing
  if (!bundle) {
    return null;
  }

  // Calculate affiliate commission (10% if affiliate code used)
  useEffect(() => {
    if (affiliateCode) {
      setAffiliateCommission(Math.ceil(bundle.price * 0.1));
    }
  }, [bundle.price, affiliateCode]);

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
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
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

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return;

    try {
      setProcessing(true);
      setStep('processing');

      // In production, you would call Razorpay API here
      // For now, we simulate the payment with 95% success rate
      await new Promise(resolve => setTimeout(resolve, 2000));

      const success = Math.random() < 0.95;

      if (success) {
        // Generate transaction ID
        const txnId = `TXN${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        setTransactionId(txnId);

        // Store purchase in localStorage (for affiliate commission tracking ONLY)
        // Do NOT use to check if purchase was made - always show buy button on refresh
        const purchases = JSON.parse(localStorage.getItem('purchasedBundles') || '[]');
        const newPurchase = {
          bundleId: bundle._id,
          bundleTitle: bundle.title,
          purchaseDate: new Date().toISOString(),
          amount: bundle.price,
          transactionId: txnId,
          customerEmail: formData.email,
          customerPhone: formData.phoneNumber,
          upiId: formData.upiId,
          affiliateCode: affiliateCode || null,
          affiliateCommission: affiliateCommission,
          status: 'completed'
        };
        purchases.push(newPurchase);
        localStorage.setItem('purchasedBundles', JSON.stringify(purchases));

        // If affiliate code used, track commission
        if (affiliateCode) {
          const affiliateStats = JSON.parse(localStorage.getItem('affiliateStats') || '[]');
          const existingAffiliate = affiliateStats.find(a => a.code === affiliateCode);
          if (existingAffiliate) {
            existingAffiliate.totalEarnings += affiliateCommission;
            existingAffiliate.totalSales += 1;
            existingAffiliate.lastSaleDate = new Date().toISOString();
          } else {
            affiliateStats.push({
              code: affiliateCode,
              totalEarnings: affiliateCommission,
              totalSales: 1,
              createdDate: new Date().toISOString(),
              lastSaleDate: new Date().toISOString()
            });
          }
          localStorage.setItem('affiliateStats', JSON.stringify(affiliateStats));
        }

        setStep('success');
        setTimeout(() => {
          onPaymentSuccess(newPurchase);
        }, 1500);
      } else {
        setError('Payment failed. UPI transaction was declined. Please try again with a different UPI ID.');
        setStep('error');
        setProcessing(false);
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
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

  const handleCopyTxnId = () => {
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                  <h2 className="text-2xl font-black uppercase tracking-tight">💳 UPI Payment</h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Affiliate Note */}
                {affiliateCode && (
                  <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4">
                    <p className="text-xs font-bold text-green-400 mb-1">🎉 Affiliate Commission Applied</p>
                    <p className="text-xs opacity-70">You'll earn ₹{affiliateCommission} from this sale</p>
                  </div>
                )}

                {/* Bundle Summary */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-xs opacity-60 uppercase tracking-widest mb-2">Order Summary</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{bundle?.title}</span>
                      <span className="font-black text-lg">₹{bundle?.price}</span>
                    </div>
                    {affiliateCode && (
                      <div className="flex justify-between items-center text-green-400">
                        <span className="text-xs">Your Commission (10%)</span>
                        <span className="font-bold">₹{affiliateCommission}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-2 mt-2 flex justify-between items-center font-black">
                      <span>Customer Pays</span>
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
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-blue-500 outline-none text-white placeholder-white/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-blue-500 outline-none text-white placeholder-white/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-blue-500 outline-none text-white placeholder-white/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
                      UPI ID (for payment)
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="yourname@upi or yourname@okhdfcbank"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-blue-500 outline-none text-white placeholder-white/50 transition-colors"
                    />
                    <p className="text-xs opacity-50 mt-1">Use: yourname@upi, @okhdfcbank, @ybl, @airtel, @ibl</p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 flex gap-3">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300">{error}</p>
                  </div>
                )}

                {/* Payment Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRazorpayPayment}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                >
                  💳 Pay ₹{bundle?.price} via UPI
                </motion.button>

                <p className="text-xs text-center opacity-50 leading-relaxed">
                  ✓ Secured by Razorpay • ✓ Instant confirmation • ✓ Lifetime access
                </p>
              </motion.div>
            )}

            {/* Processing Step */}
            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex justify-center"
                >
                  <Loader className="text-blue-500" size={48} />
                </motion.div>
                <div>
                  <h3 className="text-xl font-black uppercase">Processing Payment</h3>
                  <p className="text-sm opacity-70 mt-2">Please wait while we process your UPI payment...</p>
                </div>
              </motion.div>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex justify-center"
                >
                  <Check className="text-green-500" size={64} />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">✨ Payment Successful!</h2>
                  <p className="text-sm opacity-70 mt-2">Your transaction has been completed</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                  <p className="text-xs opacity-60 uppercase tracking-widest">Transaction ID</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-sm font-mono text-blue-300">{transactionId}</code>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={handleCopyTxnId}
                      className="p-2 hover:bg-white/10 rounded transition-colors"
                    >
                      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </motion.button>
                  </div>
                </div>

                {affiliateCode && (
                  <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4">
                    <p className="text-xs font-bold text-green-400">🎉 Affiliate Commission Earned!</p>
                    <p className="text-sm font-black text-green-300 mt-1">₹{affiliateCommission}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Error Step */}
            {step === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-center"
              >
                <div className="flex justify-center">
                  <AlertCircle className="text-red-500" size={64} />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Payment Failed</h2>
                  <p className="text-sm opacity-70 mt-2">{error}</p>
                </div>

                <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4">
                  <p className="text-xs text-red-300">💡 Try using a different UPI ID or check your bank app</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRetry}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-widest transition-colors"
                >
                  🔄 Try Again
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black uppercase tracking-widest transition-colors"
                >
                  Close
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
