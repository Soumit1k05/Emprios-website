import React from 'react';
import { ShieldCheck, TrendingUp, Users, Settings } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[38px] border border-white/50 shadow-sm flex items-center gap-6">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} text-white shadow-lg`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
    </div>
  </div>
);

export default function ModeratorPortal() {
  return (
    <div className="flex-1 p-10 space-y-12 overflow-y-auto custom-scroll">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black text-slate-800 tracking-tighter italic">MODERATOR OPS</h1>
          <p className="text-slate-500 font-bold mt-2">Manage Emprios network and user growth.</p>
        </div>
        <div className="px-5 py-2.5 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20 flex items-center gap-2">
           <ShieldCheck size={14} /> System Healthy
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Active Affiliates" value="1,284" icon={Users} color="bg-blue-500" />
        <StatCard title="Monthly Scale" value="+28.4%" icon={TrendingUp} color="bg-indigo-500" />
        <StatCard title="Node Security" value="Level 4" icon={ShieldCheck} color="bg-purple-500" />
      </div>

      <section className="bg-slate-900/5 backdrop-blur-3xl rounded-[48px] p-12 border border-white/40 border-t-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/20 rounded-2xl"><Settings className="text-slate-800" /></div>
             <h2 className="text-2xl font-black italic uppercase">Critical Operations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <button className="px-8 py-6 bg-slate-800 text-white rounded-3xl text-sm font-bold shadow-xl hover:bg-slate-700 transition-all text-left group/btn relative overflow-hidden">
                <div className="relative z-10">Deploy New Node Clusters</div>
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 opacity-20"></div>
             </button>
             <button className="px-8 py-6 bg-white border border-slate-100 rounded-3xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all text-left">
                Audit Transactional Invoices
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}
