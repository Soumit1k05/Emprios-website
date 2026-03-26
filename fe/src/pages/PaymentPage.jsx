import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, CreditCard, Wallet, Smartphone, ChevronRight } from 'lucide-react';
import { bundleAPI } from '../api/client';

export default function PaymentPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const bundle = location.state?.bundle;
  
  // Extract referral ID from URL
  const searchParams = new URLSearchParams(location.search);
  const referralId = searchParams.get('ref') || localStorage.getItem('affiliate_ref');

  // Store referral in local storage if present
  useEffect(() => {
    if (searchParams.get('ref')) {
      localStorage.setItem('affiliate_ref', searchParams.get('ref'));
    }
  }, [searchParams]);

  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('selection'); // selection, processing
  
  // Calculate potential affiliate commission (60%)
  const commission = Math.round((bundle?.price || 0) * 0.6);

  if (!bundle) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
        <h2 className="text-2xl font-black">Bundle Information Missing</h2>
        <button onClick={() => navigate('/bundles')} className="text-blue-500 font-bold uppercase tracking-widest border-b border-blue-500">Back to Bundles</button>
      </div>
    );
  }

  const handlePayment = async () => {
    if (method === 'upi' && !upiId.includes('@')) {
      alert('Please enter a valid UPI ID');
      return;
    }

    setStep('processing');
    setLoading(true);

    try {
      // Create a dummy purchase record on the server (mocked)
      // We pass the referralId to trigger the commission logic
      const result = await bundleAPI.initiatePurchase(id, referralId);
      
      // Simulate real transaction delay + verification
      setTimeout(async () => {
        try {
          await bundleAPI.handlePaymentSuccess(result.purchase._id, 'UPI_TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase());
          navigate(`/bundle/${id}/success`, { state: { bundle, referralId } });
        } catch (err) {
          alert('Verification failed. Re-initiating...');
          setStep('selection');
          setLoading(false);
        }
      }, 4000);
    } catch (err) {
      alert('Network Error: ' + err.message);
      setStep('selection');
      setLoading(false);
    }
  };

  // Mocking QR Code Display for UPI
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tight">Secure Payment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {step === 'selection' ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="glass-pod p-6 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest opacity-60">Select Payment Method</h3>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => setMethod('upi')}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${method === 'upi' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === 'upi' ? 'bg-blue-500 text-white' : 'bg-white/10'}`}>
                          <Smartphone size={20} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">UPI (Google Pay, PhonePe, BHIM)</p>
                          <p className="text-[10px] opacity-60">Instant & zero processing fees</p>
                        </div>
                      </div>
                      {method === 'upi' && <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />}
                    </button>

                    <button 
                      onClick={() => setMethod('card')}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${method === 'card' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === 'card' ? 'bg-blue-500 text-white' : 'bg-white/10'}`}>
                          <CreditCard size={20} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">Card (Visa, Master, RuPay)</p>
                          <p className="text-[10px] opacity-60">All major debit and credit cards</p>
                        </div>
                      </div>
                      {method === 'card' && <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />}
                    </button>

                    <button 
                      onClick={() => setMethod('wallet')}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${method === 'wallet' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === 'wallet' ? 'bg-blue-500 text-white' : 'bg-white/10'}`}>
                          <Wallet size={20} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">Wallets</p>
                          <p className="text-[10px] opacity-60">PayTM, Amazon Pay, Mobikwik</p>
                        </div>
                      </div>
                      {method === 'wallet' && <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />}
                    </button>
                  </div>
                </div>

                <div className="glass-pod p-6 space-y-4">
                  {method === 'upi' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-6"
                    >
                      <div className="flex bg-white/5 p-1 rounded-xl">
                        <button 
                          onClick={() => setShowQR(false)}
                          className={`flex-1 py-3 text-[10px] font-black uppercase rounded-lg transition-all ${!showQR ? 'bg-blue-600 text-white' : 'hover:bg-white/5'}`}
                        >
                          UPI ID
                        </button>
                        <button 
                          onClick={() => setShowQR(true)}
                          className={`flex-1 py-3 text-[10px] font-black uppercase rounded-lg transition-all ${showQR ? 'bg-blue-600 text-white' : 'hover:bg-white/5'}`}
                        >
                          Scan QR
                        </button>
                      </div>

                      {showQR ? (
                        <div className="flex flex-col items-center gap-4 py-4">
                          <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-xl overflow-hidden">
                            <img src="/upi_qr.png" alt="UPI QR Code" className="w-full h-full object-contain" />
                          </div>
                          <p className="text-[10px] font-bold opacity-60">Scan with GPay, PhonePe, or Any UPI App</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold opacity-50 uppercase ml-1">UPI ID (e.g. user@okaxis)</label>
                          <input 
                            type="text" 
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {method === 'card' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <h3 className="text-xs font-black uppercase tracking-widest opacity-60">Card Details</h3>
                      <div className="space-y-4">
                        <input type="text" placeholder="Card Number" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold outline-none" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="MM/YY" className="h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold outline-none" />
                          <input type="text" placeholder="CVV" className="h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold outline-none" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <button 
                    onClick={handlePayment}
                    className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl shadow-blue-500/20 hover:scale-[1.02] transition-transform"
                  >
                    Pay ₹{bundle.price} <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-pod p-20 flex flex-col items-center justify-center text-center space-y-8"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 rounded-full border-4 border-t-blue-500 border-white/10"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Smartphone size={32} className="text-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase">Confirm on App</h2>
                  <p className="text-sm opacity-60 max-w-xs mx-auto">Please open your UPI app and approve the request for ₹{bundle.price}</p>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase opacity-40">Timer</div>
                  <div className="text-xl font-mono font-bold tracking-widest">04:59</div>
                </div>
                <button 
                  onClick={() => setStep('selection')}
                  className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                >
                  Cancel Transaction
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="glass-pod p-8 rounded-3xl space-y-8 sticky top-24">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-60">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shrink-0">
                  {bundle.title.charAt(0)}
                </div>
                <div className="space-y-1">
                  <h4 className="font-black uppercase text-sm leading-tight">{bundle.title}</h4>
                  <p className="text-[10px] font-bold opacity-60">{bundle.items.length} Premium Resources Included</p>
                  <p className="text-blue-500 text-xs font-bold">Lifetime Access</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-xs font-bold opacity-60">
                  <span>Price</span>
                  <span>₹{bundle.price}</span>
                </div>
                {referralId && (
                  <div className="flex justify-between text-[10px] font-black uppercase text-blue-400 py-1 border-y border-blue-500/10">
                    <span>Affiliate Share (60%)</span>
                    <span>₹{commission} / shared</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-bold text-green-500">
                  <span>Tax (Included)</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-xl font-black uppercase pt-2">
                  <span>Total</span>
                  <span>₹{bundle.price}</span>
                </div>
              </div>
            </div>


            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
                <ShieldCheck className="text-blue-500 shrink-0" size={24} />
                <div className="text-[10px] font-bold opacity-70">
                  Your transaction is protected by 256-bit bank grade encryption.
                </div>
              </div>
              <div className="flex justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all">
                <div className="h-6 flex items-center font-black italic">VISA</div>
                <div className="h-6 flex items-center font-black italic">UPI</div>
                <div className="h-6 flex items-center font-black italic">PAYTM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
