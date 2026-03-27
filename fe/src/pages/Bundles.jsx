import React from 'react';
import { Layers, Zap, Star, Shield, Check } from 'lucide-react';

const Widget = ({ children, className = '' }) => (
  <div className={`bg-white/60 backdrop-blur-md rounded-[32px] shadow-sm border border-white/50 p-8 ${className}`}>
    {children}
  </div>
);

export default function Bundles() {
  const bundles = [
    { name: 'Basic', price: '$49', icon: Layers, features: ['5 Marketing Nodes', 'Standard Analytics', 'Email Support', 'Basic AI Templates'], tag: 'Starter' },
    { name: 'Pro', price: '$99', icon: Zap, features: ['20 Marketing Nodes', 'Deep Insights', 'Priority Chat', 'Custom Workflows'], tag: 'Most Popular', popular: true },
    { name: 'Premium', price: '$199', icon: Star, features: ['Unlimited Nodes', 'Global Sync', 'Account Manager', 'White-label Logic'], tag: 'Enterprise' },
    { name: 'Legendary', price: '$499', icon: Shield, features: ['Full Tech Stack', 'Private Hosting', 'Custom Feature Dev', '0% Fees'], tag: 'The Ultimate' }
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6 pb-20">
      <div className="text-left mb-10 px-4">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-3">Choose Your Power</h1>
        <p className="text-slate-500 font-medium text-lg">Select a bundle that fits your ambition.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bundles.map((bundle, i) => (
          <Widget key={i} className={`relative flex flex-col group hover:-translate-y-2 transition-transform duration-500 ${bundle.popular ? 'border-primary shadow-xl ring-2 ring-primary/10' : ''}`}>
            {bundle.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                Popular Choice
              </div>
            )}
            
            <div className="mb-6">
              <div className="w-16 h-16 rounded-[20px] bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg mb-6 group-hover:rotate-12 transition-transform">
                <bundle.icon size={28} />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{bundle.tag}</div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{bundle.name}</h3>
            </div>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black text-slate-800 tracking-normal">{bundle.price}</span>
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/mo</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {bundle.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 text-white">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-2xl text-sm font-bold shadow-md transition-colors ${bundle.popular ? 'bg-primary text-white hover:bg-blue-600' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-100'}`}>
              Select {bundle.name}
            </button>
          </Widget>
        ))}
      </div>
    </div>
  );
}
