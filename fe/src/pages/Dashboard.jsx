import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MoreVertical, ArrowUp, ArrowDown, ChevronDown, Download, 
  RefreshCw, Settings, BarChart2, Activity, PieChart, 
  ShoppingCart, DollarSign, Target, Users
} from 'lucide-react';

// Reusable Action Menu adapted for the glass aesthetic
const ActionMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-8 right-0 z-20 w-36 glass-pod p-2 shadow-2xl overflow-hidden border border-white/20 bg-[#0f1021]/90 backdrop-blur-xl">
      <button onClick={onClose} className="w-full text-left px-3 py-2 text-[9px] font-black uppercase tracking-widest opacity-60 hover:bg-white/10 hover:opacity-100 rounded-lg flex items-center gap-2 transition-colors">
        <RefreshCw size={12} /> Refresh
      </button>
      <button onClick={onClose} className="w-full text-left px-3 py-2 text-[9px] font-black uppercase tracking-widest opacity-60 hover:bg-white/10 hover:opacity-100 rounded-lg flex items-center gap-2 transition-colors">
        <Settings size={12} /> Settings
      </button>
    </div>
  );
};

const chartDataMapping = {
  '12 MONTHS': [
    { label: 'Feb', val: 40, color: '#60a5fa' }, { label: 'Mar', val: 30, color: '#818cf8' }, 
    { label: 'Apr', val: 60, color: '#a78bfa' }, { label: 'May', val: 50, color: '#c084fc' }, 
    { label: 'Jun', val: 80, color: '#e879f9' }, { label: 'Jul', val: 45, color: '#f472b6' }, 
    { label: 'Aug', val: 70, color: '#fb7185' }, { label: 'Sep', val: 90, color: '#f87171' }, 
    { label: 'Oct', val: 65, color: '#fb923c' }, { label: 'Nov', val: 85, color: '#fbbf24' }, 
    { label: 'Dec', val: 100, color: '#facc15' }, { label: 'Jan', val: 75, color: '#a3e635' }
  ],
  '6 MONTHS': [
    { label: 'Aug', val: 35, color: '#fb7185' }, { label: 'Sep', val: 60, color: '#f87171' }, 
    { label: 'Oct', val: 45, color: '#fb923c' }, { label: 'Nov', val: 75, color: '#fbbf24' }, 
    { label: 'Dec', val: 95, color: '#facc15' }, { label: 'Jan', val: 80, color: '#a3e635' }
  ],
  '30 DAYS': [
    { label: 'Wk 1', val: 60, color: '#34d399' }, { label: 'Wk 2', val: 45, color: '#2dd4bf' }, 
    { label: 'Wk 3', val: 85, color: '#38bdf8' }, { label: 'Wk 4', val: 70, color: '#818cf8' }
  ],
  '7 DAYS': [
    { label: 'Mon', val: 30, color: '#ef4444' }, { label: 'Tue', val: 50, color: '#f97316' }, 
    { label: 'Wed', val: 75, color: '#f59e0b' }, { label: 'Thu', val: 40, color: '#84cc16' }, 
    { label: 'Fri', val: 90, color: '#10b981' }, { label: 'Sat', val: 100, color: '#06b6d4' },
    { label: 'Sun', val: 85, color: '#3b82f6' }
  ]
};

export default function Dashboard() {
  const glassIcons = ['📱', '💻', '🎧', '⌚', '🎮'];
  
  const [activeTimeFilter, setActiveTimeFilter] = useState('12 MONTHS');
  const [chartType, setChartType] = useState('Area'); 
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);

  const timeFilters = ['12 MONTHS', '6 MONTHS', '30 DAYS', '7 DAYS'];
  const totalPages = 12;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("PDF Exported Successfully!");
    }, 1500);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);

  const currentChartData = chartDataMapping[activeTimeFilter];

  const generateAreaPath = (data, isLineOnly = false) => {
    const w = 100;
    const h = 40;
    const step = w / (data.length - 1);
    
    let path = isLineOnly 
      ? `M0,${h - (data[0].val * 0.35)}` 
      : `M0,${h} L0,${h - (data[0].val * 0.35)}`;

    for (let i = 1; i < data.length; i++) {
      const x = i * step;
      const y = h - (data[i].val * 0.35);
      path += ` L${x},${y}`;
    }
    
    if (!isLineOnly) path += ` L${w},${h} Z`;
    return path;
  };

  const renderNativeChart = () => {
    if (chartType === 'Bar') {
      return (
        <div className="w-full h-full flex items-end justify-between gap-1 sm:gap-2 pt-4">
          {currentChartData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end items-center h-full group relative">
              <div 
                className="w-full rounded-t-md transition-all duration-500 cursor-pointer opacity-80 hover:opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                style={{ height: `${d.val}%`, backgroundColor: d.color }}
              ></div>
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-[#1a1b2e] border border-white/20 px-2 py-1 rounded text-[9px] font-black transition-opacity whitespace-nowrap z-10 shadow-lg tracking-widest">
                ${(d.val * 120).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      );
    } 
    
    if (chartType === 'Donut') {
      const totalVal = currentChartData.reduce((sum, d) => sum + d.val, 0);
      let currentOffset = 0;
      return (
        <div className="w-full h-full flex items-center justify-center p-2">
          <svg viewBox="0 0 50 50" className="h-full w-full max-w-[16rem] transform -rotate-90 drop-shadow-2xl overflow-visible">
            <circle cx="25" cy="25" r="15.9155" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            
            {currentChartData.map((d, i) => {
              const dashVal = (d.val / totalVal) * 100;
              const dashStr = `${dashVal} ${100 - dashVal}`;
              const offsetStr = -currentOffset;
              currentOffset += dashVal;
              return (
                <circle 
                  key={i} cx="25" cy="25" r="15.9155" fill="none" 
                  stroke={d.color} strokeWidth="8" 
                  strokeDasharray={dashStr} strokeDashoffset={offsetStr}
                  className="transition-all duration-1000 cursor-pointer hover:stroke-[10px]"
                />
              );
            })}
          </svg>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-end">
        <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
          <defs>
            <linearGradient id="dynamicGradient" x1="0" y1="0" x2="1" y2="0">
              {currentChartData.map((d, i) => (
                <stop key={i} offset={`${(i / (currentChartData.length - 1)) * 100}%`} stopColor={d.color} stopOpacity="0.5"/>
              ))}
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              {currentChartData.map((d, i) => (
                <stop key={i} offset={`${(i / (currentChartData.length - 1)) * 100}%`} stopColor={d.color} stopOpacity="1"/>
              ))}
            </linearGradient>
            <linearGradient id="fadeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="1"/>
              <stop offset="100%" stopColor="white" stopOpacity="0"/>
            </linearGradient>
            <mask id="fadeMask">
              <rect x="0" y="0" width="100" height="40" fill="url(#fadeGradient)" />
            </mask>
          </defs>

          <path 
            d={generateAreaPath(currentChartData, false)} 
            fill="url(#dynamicGradient)" 
            mask="url(#fadeMask)"
            className="transition-all duration-700 ease-in-out" 
          />
          <path 
            d={generateAreaPath(currentChartData, true)} 
            fill="none" 
            stroke="url(#lineGradient)" 
            strokeWidth="0.8" 
            className="transition-all duration-700 ease-in-out drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"
          />
          {currentChartData.map((d, i) => (
            <circle 
              key={i} 
              cx={i * (100 / (currentChartData.length - 1))} 
              cy={40 - (d.val * 0.35)} 
              r="1.5" 
              fill="#1a1b2e" 
              stroke={d.color} 
              strokeWidth="0.5" 
              className="transition-all duration-700 hover:r-[2.5]" 
            />
          ))}
        </svg>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 overflow-y-auto custom-scroll max-w-7xl mx-auto p-6 pb-20 space-y-6"
    >
      
      {/* ── Top Metrics ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "Today's Sale", value: "$12,426", icon: DollarSign, trend: "+36%", isUp: true, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: "Total Sales", value: "$2,38,485", icon: Target, trend: "-14%", isUp: false, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: "Total Orders", value: "84,382", icon: ShoppingCart, trend: "+36%", isUp: true, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((metric, i) => (
          <div key={i} className="glass-pod p-6 flex flex-col justify-between relative h-40">
            <div className="flex justify-between items-start mb-3">
              <div className={`w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center`}>
                <metric.icon size={18} className="text-blue-400" />
              </div>
              <div className="relative">
                <button onClick={() => toggleMenu(`metric${i}`)} className="text-white/40 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10">
                  <MoreVertical size={16} />
                </button>
                <ActionMenu isOpen={openMenuId === `metric${i}`} onClose={() => setOpenMenuId(null)} />
              </div>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{metric.label}</p>
               <div className="flex items-end justify-between">
                 <p className="text-2xl font-black">{metric.value}</p>
                 <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest opacity-60 pb-1">
                   {metric.isUp ? <ArrowUp size={12} className={metric.color} /> : <ArrowDown size={12} className={metric.color} />}
                   <span className={metric.color}>{metric.trend}</span>
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── FIXED SALES REPORT CONTAINER USING STRICT GRID ── */}
        <div className="glass-pod col-span-2 relative h-[26rem] grid grid-rows-[auto_minmax(0,1fr)_auto] gap-2 p-6 md:p-8">
          
          {/* Header Row */}
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center mb-4">
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-blue-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50">Sales Report</h3>
              <div className="hidden sm:flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1 ml-2">
                {[
                  { id: 'Area', icon: Activity },
                  { id: 'Bar', icon: BarChart2 },
                  { id: 'Donut', icon: PieChart }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setChartType(type.id)}
                    title={`${type.id} Chart`}
                    className={`p-1.5 rounded-lg transition-all ${
                      chartType === type.id ? 'bg-white/20 text-blue-300 shadow-sm' : 'text-white/40 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <type.icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {timeFilters.map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setActiveTimeFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeTimeFilter === filter 
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' 
                    : 'text-white/40 border border-transparent hover:text-white hover:bg-white/10'
                  }`}
                >
                  {filter}
                </button>
              ))}
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className={`ml-2 flex items-center justify-center gap-2 py-1.5 px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 ${
                  isExporting 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white border border-transparent'
                }`}
              >
                {isExporting ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
                <span className="hidden md:inline">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
              </button>
            </div>
          </div>

          {/* Chart Wrapper */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0">
               {renderNativeChart()}
            </div>
          </div>
          
          {/* Labels Row */}
          <div className="flex justify-between text-[9px] font-black opacity-40 mt-4 px-2 uppercase tracking-widest">
            {currentChartData.map(m => <span key={m.label}>{m.label}</span>)}
          </div>
        </div>


        {/* ── Traffic Sources ── */}
        <div className="glass-pod p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-blue-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50">Traffic Sources</h3>
            </div>
            <button className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest opacity-60 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 hover:opacity-100 transition-all">
               7 DAYS <ChevronDown size={12} />
            </button>
          </div>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {[
              { label: 'Direct', val: '1,43,382', pct: '75%', color: 'bg-blue-400' },
              { label: 'Referral', val: '87,974', pct: '50%', color: 'bg-indigo-400' },
              { label: 'Social Media', val: '45,211', pct: '25%', color: 'bg-purple-400' },
              { label: 'Twitter', val: '21,893', pct: '12%', color: 'bg-sky-400' },
              { label: 'Facebook', val: '21,893', pct: '12%', color: 'bg-blue-600' }
            ].map((t,i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                  <span>{t.label}</span>
                  <span>{t.val}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${t.color} rounded-full`} style={{ width: t.pct }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* ── Total Bets ── */}
         <div className="glass-pod p-6 flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-blue-400" />
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50">Total Bets</h3>
              </div>
              <div className="relative">
                <button onClick={() => toggleMenu('bets')} className="text-white/40 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10">
                  <MoreVertical size={16} />
                </button>
                <ActionMenu isOpen={openMenuId === 'bets'} onClose={() => setOpenMenuId(null)} />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-6">
               <div className="relative w-48 h-48 flex items-center justify-center mb-8 drop-shadow-2xl">
                 <svg viewBox="0 0 50 50" className="w-full h-full transform -rotate-90 overflow-visible">
                    <circle cx="25" cy="25" r="15.9155" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="25" cy="25" r="15.9155" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray="70 30" />
                    <circle cx="25" cy="25" r="15.9155" fill="none" stroke="#facc15" strokeWidth="8" strokeDasharray="20 80" strokeDashoffset="-70" />
                    <circle cx="25" cy="25" r="15.9155" fill="none" stroke="#f97316" strokeWidth="8" strokeDasharray="10 90" strokeDashoffset="-90" />
                 </svg>
                 
                 <div className="absolute top-2 right-2 bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-lg font-black text-[9px] border border-yellow-400/20">20%</div>
                 <div className="absolute bottom-6 right-6 bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-lg font-black text-[9px] border border-orange-500/20">10%</div>
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                   <div className="text-white font-black text-3xl">70%</div>
                   <div className="text-[9px] font-black opacity-50 uppercase tracking-widest mt-1">Mobile</div>
                 </div>
               </div>
               <div className="w-full space-y-4 px-4">
                 {[
                   { label: 'Mobile', val: '$50,280', color: 'bg-blue-500' },
                   { label: 'Laptop', val: '$30,160', color: 'bg-yellow-400' },
                   { label: 'Watch', val: '$15,520', color: 'bg-orange-500' }
                 ].map(item => (
                   <div key={item.label} className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                     <span className="flex items-center gap-3"><div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm`} /> {item.label}</span>
                     <span>{item.val}</span>
                   </div>
                 ))}
               </div>
            </div>
         </div>

         {/* ── Recent Customers ── */}
         <div className="glass-pod p-6 md:p-8 col-span-2 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50">Recent Customers</h3>
              <button className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 hover:underline transition-all">
                 View All &rarr;
              </button>
            </div>
            <div className="overflow-x-auto w-full flex-1">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-[9px] font-black opacity-50 uppercase tracking-widest border-b border-white/10">
                    <th className="pb-4 px-4">Product</th>
                    <th className="pb-4 px-4">Orders ID</th>
                    <th className="pb-4 px-4">Customer Name</th>
                    <th className="pb-4 px-4">Date</th>
                    <th className="pb-4 px-4">Price</th>
                    <th className="pb-4 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-bold">
                  {[
                    { id: '#202395', name: 'Ripon Ahmed', date: '1 Jan 24', price: '$20,584', status: 'Complete', statColor: 'text-green-400 bg-green-500/10 border border-green-500/20' },
                    { id: '#202396', name: 'Leslie Alexander', date: '2 Jan 24', price: '$11,234', status: 'Pending', statColor: 'text-orange-400 bg-orange-500/10 border border-orange-500/20' },
                    { id: '#202397', name: 'Ralph Edwards', date: '3 Jan 24', price: '$11,159', status: 'Complete', statColor: 'text-green-400 bg-green-500/10 border border-green-500/20' },
                    { id: '#202398', name: 'Ronaid Richards', date: '4 Jan 24', price: '$10,483', status: 'Complete', statColor: 'text-green-400 bg-green-500/10 border border-green-500/20' },
                    { id: '#202399', name: 'Devon Lane', date: '6 Jan 24', price: '$9,084', status: 'Pending', statColor: 'text-orange-400 bg-orange-500/10 border border-orange-500/20' }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                      <td className="py-4 px-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl shrink-0">
                           {glassIcons[i % glassIcons.length]}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[11px] opacity-60 font-mono uppercase">{row.id}</td>
                      <td className="py-4 px-4">{row.name}</td>
                      <td className="py-4 px-4 flex items-center gap-2 opacity-60 mt-3 text-[11px] uppercase tracking-wider"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> {row.date}</td>
                      <td className="py-4 px-4 font-black">{row.price}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-black tracking-widest inline-flex ${row.statColor}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-6 text-[9px] font-black uppercase tracking-widest opacity-60">
               <div>Show <span className="bg-white/10 px-2 py-1 rounded-md border border-white/20 ml-1">5</span> of {totalPages}</div>
               <div className="flex items-center gap-1">
                 <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'}`}>&lt;</button>
                 {[1, 2, 3].map(num => (
                    <button key={num} onClick={() => handlePageChange(num)} className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${currentPage === num ? 'bg-blue-600 text-white shadow-lg font-black' : 'hover:bg-white/10'}`}>{num}</button>
                 ))}
                 <span className="px-1">...</span>
                 <button onClick={() => handlePageChange(totalPages)} className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${currentPage === totalPages ? 'bg-blue-600 text-white shadow-lg font-black' : 'hover:bg-white/10'}`}>{totalPages}</button>
                 <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'}`}>&gt;</button>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}