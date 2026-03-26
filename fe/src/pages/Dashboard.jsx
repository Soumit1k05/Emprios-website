import React, { useState } from 'react';
import { MoreVertical, ArrowUp, ArrowDown, ChevronDown, Copy, Check, Users, DollarSign, BarChart3, ExternalLink } from 'lucide-react';

const Widget = ({ children, className = '' }) => (
  <div className={`bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-6 ${className}`}>
    {children}
  </div>
);

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const affiliateId = "AFF-001"; // Mock affiliate ID
  const referralLink = `${window.location.origin}?ref=${affiliateId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6 pb-20 space-y-8">
      {/* Header section with Link Generator */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Affiliate Hub</h2>
          <p className="text-sm font-bold opacity-50">Welcome back, Partner. You're earning 60% on every sale.</p>
        </div>
        
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4 bg-blue-500/10 p-3 pr-4 rounded-3xl border border-blue-500/20">
          <div className="flex flex-col px-4 text-left">
            <span className="text-[10px] font-black uppercase text-blue-500 opacity-60">Personal Referral Link</span>
            <span className="text-xs font-bold truncate max-w-[200px]">{referralLink}</span>
          </div>
          <button 
            onClick={copyToClipboard}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shrink-0"
          >
            {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Link</>}
          </button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Widget className="flex flex-col justify-between h-44 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="flex justify-between items-start opacity-80">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Total Earnings</h3>
            <DollarSign size={20} />
          </div>
          <div>
             <div className="text-4xl font-black italic">₹84,290</div>
             <div className="flex items-center gap-1 mt-3 text-[10px] font-bold opacity-80">
                <ArrowUp size={14} className="text-green-400" />
                <span className="text-green-400">+12.5%</span>
                this week
             </div>
          </div>
        </Widget>

        <Widget className="flex flex-col justify-between h-44">
           <div className="flex justify-between items-start">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Referrals</h3>
            <Users size={20} className="text-blue-500" />
          </div>
          <div>
             <div className="text-4xl font-black text-slate-800 tracking-tighter">1,284</div>
             <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-slate-500">
                <ArrowUp size={14} className="text-green-500" />
                <span className="text-green-500">+8</span>
                new today
             </div>
          </div>
        </Widget>

        <Widget className="flex flex-col justify-between h-44">
           <div className="flex justify-between items-start">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Conversion Rate</h3>
            <BarChart3 size={20} className="text-blue-500" />
          </div>
          <div>
             <div className="text-4xl font-black text-slate-800 tracking-tighter">6.82%</div>
             <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-slate-500">
                <ArrowDown size={14} className="text-red-500" />
                <span className="text-red-500">-0.4%</span>
                vs avg.
             </div>
          </div>
        </Widget>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Widget className="col-span-2 relative h-80 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Earnings History</h3>
            <div className="flex items-center gap-4 text-[9px] font-black">
              <button className="text-blue-600 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest">30 Days</button>
              <button className="opacity-40 uppercase tracking-widest">Prev. Quarter</button>
            </div>
          </div>
          <div className="flex-1 w-full flex items-end relative overflow-hidden px-2">
             <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
               <path d="M0,35 Q10,32 20,38 T40,25 T60,10 T80,18 T100,2" fill="none" stroke="#2563eb" strokeWidth="2" />
               <path d="M0,35 Q10,32 20,38 T40,25 T60,10 T80,18 T100,2 V40 H0 Z" fill="url(#gradient-blue)" />
               <defs>
                 <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2"/>
                   <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
                 </linearGradient>
               </defs>
             </svg>
          </div>
          <div className="flex justify-between text-[9px] font-black text-slate-400 mt-4 px-2 tracking-widest uppercase">
            {['1 Mar','5 Mar','10 Mar','15 Mar','20 Mar','25 Mar','Today'].map(m => <span key={m}>{m}</span>)}
          </div>
        </Widget>

        {/* Traffic Breakdown */}
        <Widget className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Referral Sources</h3>
            <div className="text-[10px] font-black uppercase text-blue-600">Views</div>
          </div>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {[
              { label: 'Instagram Ads', val: '14,382', pct: '75%', color: 'bg-blue-500' },
              { label: 'YouTube Review', val: '8,974', pct: '50%', color: 'bg-indigo-500' },
              { label: 'Twitter X', val: '4,211', pct: '25%', color: 'bg-blue-400' },
              { label: 'Facebook Groups', val: '1,893', pct: '12%', color: 'bg-blue-300' }
            ].map((t,i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-black uppercase italic text-slate-600">
                  <span>{t.label}</span>
                  <span>{t.val}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${t.color} rounded-full`} style={{ width: t.pct }}></div>
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {/* Recent Referrals Table */}
         <Widget className="flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Recent Sales Activity</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-blue-600">Export Report</button>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                    <th className="pb-4 px-4">TXN ID</th>
                    <th className="pb-4 px-4">Bundle</th>
                    <th className="pb-4 px-4">Customer</th>
                    <th className="pb-4 px-4">Date</th>
                    <th className="pb-4 px-4 text-right">Amount</th>
                    <th className="pb-4 px-4 text-right">Commission (60%)</th>
                    <th className="pb-4 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-bold text-slate-700">
                  {[
                    { id: '#EM-P952', bundle: 'Web Dev Masterclass', name: 'Ayush K.', date: '26 Mar, 10:45', amount: '₹4,999', comm: '₹2,999', status: 'PAID' },
                    { id: '#EM-P951', bundle: 'AI & ML Bundle', name: 'Sneha R.', date: '25 Mar, 18:20', amount: '₹5,999', comm: '₹3,599', status: 'PAID' },
                    { id: '#EM-P950', bundle: 'Interview Prep', name: 'Tanmay S.', date: '25 Mar, 14:12', amount: '₹2,999', comm: '₹1,799', status: 'PAID' },
                    { id: '#EM-P949', bundle: 'Web Dev Masterclass', name: 'Priya M.', date: '24 Mar, 09:30', amount: '₹4,999', comm: '₹2,999', status: 'PAID' },
                    { id: '#EM-P948', bundle: 'AI & ML Bundle', name: 'Rahul V.', date: '23 Mar, 22:15', amount: '₹5,999', comm: '₹3,599', status: 'PAID' }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50/50 transition-colors border-b border-slate-50 last:border-0">
                      <td className="py-5 px-4 font-mono text-[10px] opacity-40">{row.id}</td>
                      <td className="py-5 px-4 font-black uppercase text-[10px] tracking-tighter">{row.bundle}</td>
                      <td className="py-5 px-4">{row.name}</td>
                      <td className="py-5 px-4 text-slate-400">{row.date}</td>
                      <td className="py-5 px-4 text-right">₹{row.amount.replace('₹','')}</td>
                      <td className="py-5 px-4 text-right font-black text-blue-600">₹{row.comm.replace('₹','')}</td>
                      <td className="py-5 px-4 text-center">
                        <span className="px-3 py-1 rounded-full text-[8px] font-black bg-green-500/10 text-green-600 tracking-widest">COMPLETE</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </Widget>
      </div>
    </div>
  );
}

