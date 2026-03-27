import React, { useState } from 'react';
import { MoreVertical, ArrowUp, ArrowDown, ChevronDown, Download, RefreshCw, Settings, BarChart2, Activity, PieChart } from 'lucide-react';

const Widget = ({ children, className = '' }) => (
  <div className={`bg-white/5 backdrop-blur-md rounded-3xl shadow-xl border border-white/10 p-8 text-white ${className}`}>
    {children}
  </div>
);

const ActionMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-8 right-0 z-10 w-36 bg-[#1a1b2e]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden">
      <button onClick={onClose} className="w-full text-left px-4 py-2 text-xs font-bold opacity-80 hover:bg-white/10 hover:opacity-100 flex items-center gap-2 transition-colors">
        <RefreshCw size={12} /> Refresh
      </button>
      <button onClick={onClose} className="w-full text-left px-4 py-2 text-xs font-bold opacity-80 hover:bg-white/10 hover:opacity-100 flex items-center gap-2 transition-colors">
        <Settings size={12} /> Settings
      </button>
    </div>
  );
};

// --- DYNAMIC DATA MAPPING ---
// Colors and values update based on the selected timeline
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

  // Get current data based on active filter
  const currentChartData = chartDataMapping[activeTimeFilter];

  // Helper function to build dynamic Area Chart SVG paths
  const generateAreaPath = (data, isLineOnly = false) => {
    const w = 100;
    const h = 40;
    const step = w / (data.length - 1);
    
    // Start drawing path
    let path = isLineOnly 
      ? `M0,${h - (data[0].val * 0.35)}` 
      : `M0,${h} L0,${h - (data[0].val * 0.35)}`;

    for (let i = 1; i < data.length; i++) {
      const x = i * step;
      const y = h - (data[i].val * 0.35); // 0.35 keeps it slightly below the top edge
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
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-[#1a1b2e] border border-white/20 px-2 py-1 rounded text-xs font-bold transition-opacity whitespace-nowrap z-10 shadow-lg">
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
          {/* Expanded viewBox (42x42) prevents stroke clipping */}
          <svg viewBox="0 0 42 42" className="w-48 h-48 sm:w-64 sm:h-64 transform -rotate-90 drop-shadow-2xl overflow-visible">
            {/* Background Track */}
            <circle cx="21" cy="21" r="15.9155" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            
            {/* Data Slices */}
            {currentChartData.map((d, i) => {
              const dashVal = (d.val / totalVal) * 100;
              const dashStr = `${dashVal} ${100 - dashVal}`;
              const offsetStr = -currentOffset;
              currentOffset += dashVal;
              return (
                <circle 
                  key={i} cx="21" cy="21" r="15.9155" fill="none" 
                  stroke={d.color} strokeWidth="6" 
                  strokeDasharray={dashStr} strokeDashoffset={offsetStr}
                  className="transition-all duration-1000 cursor-pointer hover:stroke-[8px]"
                />
              );
            })}
          </svg>
        </div>
      );
    }

    // Area Chart (SVG)
    return (
      <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
        <defs>
          <linearGradient id="dynamicGradient" x1="0" y1="0" x2="1" y2="0">
            {currentChartData.map((d, i) => (
              <stop key={i} offset={`${(i / (currentChartData.length - 1)) * 100}%`} stopColor={d.color} stopOpacity="0.5"/>
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

        {/* Fill Area */}
        <path 
          d={generateAreaPath(currentChartData, false)} 
          fill="url(#dynamicGradient)" 
          mask="url(#fadeMask)"
          className="transition-all duration-700 ease-in-out" 
        />
        
        {/* Top Edge Line */}
        <path 
          d={generateAreaPath(currentChartData, true)} 
          fill="none" 
          stroke={currentChartData[currentChartData.length - 1].color} 
          strokeWidth="0.8" 
          className="transition-all duration-700 ease-in-out drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"
        />
        
        {/* Data Dots on the line */}
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
    );
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6 pb-20 space-y-6">
      
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Widget className="flex flex-col justify-between h-44 relative">
          <div className="flex justify-between items-start">
            <h3 className="text-xs opacity-60 uppercase tracking-widest">Today's Sale</h3>
            <div className="relative">
              <button onClick={() => toggleMenu('metric1')} className="text-white/40 hover:text-white transition-colors"><MoreVertical size={16} /></button>
              <ActionMenu isOpen={openMenuId === 'metric1'} onClose={() => setOpenMenuId(null)} />
            </div>
          </div>
          <div>
             <div className="text-4xl font-black mt-2">$12,426</div>
             <div className="flex items-center gap-1 mt-3 text-xs opacity-60">
                <ArrowUp size={14} className="text-green-400" />
                <span className="text-green-400 font-bold">+36%</span>
                vs last month
             </div>
          </div>
        </Widget>

        <Widget className="flex flex-col justify-between h-44 relative">
           <div className="flex justify-between items-start">
            <h3 className="text-xs opacity-60 uppercase tracking-widest">Total Sales</h3>
            <div className="relative">
              <button onClick={() => toggleMenu('metric2')} className="text-white/40 hover:text-white transition-colors"><MoreVertical size={16} /></button>
              <ActionMenu isOpen={openMenuId === 'metric2'} onClose={() => setOpenMenuId(null)} />
            </div>
          </div>
          <div>
             <div className="text-4xl font-black mt-2">$2,38,485</div>
             <div className="flex items-center gap-1 mt-3 text-xs opacity-60">
                <ArrowDown size={14} className="text-red-400" />
                <span className="text-red-400 font-bold">-14%</span>
                vs last month
             </div>
          </div>
        </Widget>

        <Widget className="flex flex-col justify-between h-44 relative">
           <div className="flex justify-between items-start">
            <h3 className="text-xs opacity-60 uppercase tracking-widest">Total Orders</h3>
            <div className="relative">
              <button onClick={() => toggleMenu('metric3')} className="text-white/40 hover:text-white transition-colors"><MoreVertical size={16} /></button>
              <ActionMenu isOpen={openMenuId === 'metric3'} onClose={() => setOpenMenuId(null)} />
            </div>
          </div>
          <div>
             <div className="text-4xl font-black mt-2">84,382</div>
             <div className="flex items-center gap-1 mt-3 text-xs opacity-60">
                <ArrowUp size={14} className="text-green-400" />
                <span className="text-green-400 font-bold">+36%</span>
                vs last month
             </div>
          </div>
        </Widget>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Report Chart Container */}
        <Widget className="col-span-2 relative h-[26rem] flex flex-col">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-black uppercase">Sales Report</h3>
              <div className="hidden sm:flex bg-white/5 border border-white/10 rounded-lg p-1 gap-1">
                {[
                  { id: 'Area', icon: Activity },
                  { id: 'Bar', icon: BarChart2 },
                  { id: 'Donut', icon: PieChart }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setChartType(type.id)}
                    title={`${type.id} Chart`}
                    className={`p-1.5 rounded-md transition-all ${
                      chartType === type.id ? 'bg-white/20 text-blue-300 shadow-sm' : 'text-white/40 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <type.icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              {timeFilters.map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setActiveTimeFilter(filter)}
                  className={`px-3 py-2 rounded-full border transition-all duration-300 ${
                    activeTimeFilter === filter 
                    ? 'text-blue-300 bg-blue-500/20 border-blue-500/30' 
                    : 'text-white/60 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  {filter}
                </button>
              ))}
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className={`flex items-center gap-2 border px-4 py-2 rounded-full ml-2 transition-all duration-300 ${
                  isExporting 
                  ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                  : 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                }`}
              >
                {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                <span className="hidden md:inline">{isExporting ? 'EXPORTING...' : 'EXPORT PDF'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 w-full flex items-end relative overflow-hidden mt-2">
            {renderNativeChart()}
          </div>
          
          <div className="flex justify-between text-[11px] font-bold opacity-40 mt-4 px-2 uppercase tracking-widest">
            {currentChartData.map(m => <span key={m.label}>{m.label}</span>)}
          </div>
        </Widget>

        {/* Traffic Sources */}
        <Widget className="flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black uppercase">Traffic Sources</h3>
            <button className="flex items-center gap-1 text-xs font-bold opacity-60 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 hover:opacity-100 transition-all">
               LAST 7 DAYS <ChevronDown size={14} />
            </button>
          </div>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {[
              { label: 'Direct', val: '1,43,382', pct: '75%', color: 'bg-blue-400' },
              { label: 'Referral', val: '87,974', pct: '50%', color: 'bg-blue-500' },
              { label: 'Social Media', val: '45,211', pct: '25%', color: 'bg-purple-500' },
              { label: 'Twitter', val: '21,893', pct: '12%', color: 'bg-sky-400' },
              { label: 'Facebook', val: '21,893', pct: '12%', color: 'bg-indigo-500' }
            ].map((t,i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold opacity-80">
                  <span>{t.label}</span>
                  <span>{t.val}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${t.color} rounded-full`} style={{ width: t.pct }}></div>
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Total Bets (Donut Chart fixed with proper viewBox) */}
         <Widget className="flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black uppercase">Total Bets</h3>
              <div className="relative">
                <button onClick={() => toggleMenu('bets')} className="text-white/40 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                <ActionMenu isOpen={openMenuId === 'bets'} onClose={() => setOpenMenuId(null)} />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-6">
               <div className="relative w-48 h-48 flex items-center justify-center mb-8 drop-shadow-2xl">
                 <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90 overflow-visible">
                    <circle cx="21" cy="21" r="15.9155" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle cx="21" cy="21" r="15.9155" fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray="70 30" />
                    <circle cx="21" cy="21" r="15.9155" fill="none" stroke="#facc15" strokeWidth="6" strokeDasharray="20 80" strokeDashoffset="-70" />
                    <circle cx="21" cy="21" r="15.9155" fill="none" stroke="#f97316" strokeWidth="6" strokeDasharray="10 90" strokeDashoffset="-90" />
                 </svg>
                 
                 <div className="absolute top-2 right-2 bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-md backdrop-blur-sm font-black text-xs border border-yellow-400/30">20%</div>
                 <div className="absolute bottom-6 right-6 bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-md backdrop-blur-sm font-black text-xs border border-orange-500/30">10%</div>
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                   <div className="text-white font-black text-3xl">70%</div>
                   <div className="text-[10px] font-bold opacity-60 uppercase">Mobile</div>
                 </div>
               </div>
               <div className="w-full space-y-4">
                 {[
                   { label: 'Mobile', val: '$50,280', color: 'bg-blue-500' },
                   { label: 'Laptop', val: '$30,160', color: 'bg-yellow-400' },
                   { label: 'Watch', val: '$15,520', color: 'bg-orange-500' }
                 ].map(item => (
                   <div key={item.label} className="flex justify-between text-sm font-bold opacity-80">
                     <span className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`} /> {item.label}</span>
                     <span>{item.val}</span>
                   </div>
                 ))}
               </div>
            </div>
         </Widget>

         {/* Recent Customers */}
         <Widget className="col-span-2 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black uppercase">Recent Customers</h3>
              <button className="flex items-center gap-1 text-sm font-bold text-blue-400 hover:text-blue-300 hover:underline transition-all">
                 View All &rarr;
              </button>
            </div>
            <div className="overflow-x-auto w-full flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold opacity-50 uppercase tracking-widest border-b border-white/10">
                    <th className="pb-4 px-4 font-bold">Product</th>
                    <th className="pb-4 px-4 font-bold">Orders ID</th>
                    <th className="pb-4 px-4 font-bold">Customer Name</th>
                    <th className="pb-4 px-4 font-bold">Date</th>
                    <th className="pb-4 px-4 font-bold">Price</th>
                    <th className="pb-4 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-semibold">
                  {[
                    { id: '#202395', name: 'Ripon Ahmed', date: '1 Jan 24', price: '$20,584', status: 'Complete', statColor: 'text-green-400 bg-green-500/20 border border-green-500/30' },
                    { id: '#202396', name: 'Leslie Alexander', date: '2 Jan 24', price: '$11,234', status: 'Pending', statColor: 'text-orange-400 bg-orange-500/20 border border-orange-500/30' },
                    { id: '#202397', name: 'Ralph Edwards', date: '3 Jan 24', price: '$11,159', status: 'Complete', statColor: 'text-green-400 bg-green-500/20 border border-green-500/30' },
                    { id: '#202398', name: 'Ronaid Richards', date: '4 Jan 24', price: '$10,483', status: 'Complete', statColor: 'text-green-400 bg-green-500/20 border border-green-500/30' },
                    { id: '#202399', name: 'Devon Lane', date: '6 Jan 24', price: '$9,084', status: 'Pending', statColor: 'text-orange-400 bg-orange-500/20 border border-orange-500/30' }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                      <td className="py-4 px-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center text-xl shadow-[0_4px_10px_rgba(0,0,0,0.1)] backdrop-blur-md">
                           {glassIcons[i % glassIcons.length]}
                        </div>
                      </td>
                      <td className="py-4 px-4 opacity-60 font-mono">{row.id}</td>
                      <td className="py-4 px-4">{row.name}</td>
                      <td className="py-4 px-4 flex items-center gap-2 opacity-60 mt-3"><div className="w-2 h-2 rounded-full bg-white/40"></div> {row.date}</td>
                      <td className="py-4 px-4 font-black">{row.price}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider ${row.statColor}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-6 text-xs font-bold opacity-60">
               <div>Show <span className="bg-white/10 px-2 py-1 rounded-md border border-white/20">5</span> from {totalPages}</div>
               <div className="flex items-center gap-1">
                 <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'}`}>&lt;</button>
                 {[1, 2, 3].map(num => (
                    <button key={num} onClick={() => handlePageChange(num)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${currentPage === num ? 'bg-blue-500 text-white shadow-lg font-black border border-blue-400/50' : 'hover:bg-white/10'}`}>{num}</button>
                 ))}
                 <span className="px-1">...</span>
                 <button onClick={() => handlePageChange(totalPages)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${currentPage === totalPages ? 'bg-blue-500 text-white shadow-lg font-black border border-blue-400/50' : 'hover:bg-white/10'}`}>{totalPages}</button>
                 <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'}`}>&gt;</button>
               </div>
            </div>
         </Widget>
      </div>
    </div>
  );
}