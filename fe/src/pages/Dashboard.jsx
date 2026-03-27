import React, { useState } from 'react';
import { MoreVertical, ArrowUp, ArrowDown, ChevronDown, Download, RefreshCw, Settings, BarChart2, TrendingUp, Activity, Layers } from 'lucide-react';

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

// --- MOCK DATA FOR DIFFERENT TIMEFRAMES ---
const chartData = {
  '12 MONTHS': [
    { name: 'Feb', sales: 4000, target: 2400 }, { name: 'Mar', sales: 3000, target: 1398 },
    { name: 'Apr', sales: 2000, target: 9800 }, { name: 'May', sales: 2780, target: 3908 },
    { name: 'Jun', sales: 1890, target: 4800 }, { name: 'Jul', sales: 2390, target: 3800 },
    { name: 'Aug', sales: 3490, target: 4300 }, { name: 'Sep', sales: 4200, target: 3100 },
    { name: 'Oct', sales: 5100, target: 4100 }, { name: 'Nov', sales: 6000, target: 5300 },
    { name: 'Dec', sales: 7100, target: 6100 }, { name: 'Jan', sales: 8500, target: 7500 }
  ],
  '6 MONTHS': [
    { name: 'Aug', sales: 3490, target: 4300 }, { name: 'Sep', sales: 4200, target: 3100 },
    { name: 'Oct', sales: 5100, target: 4100 }, { name: 'Nov', sales: 6000, target: 5300 },
    { name: 'Dec', sales: 7100, target: 6100 }, { name: 'Jan', sales: 8500, target: 7500 }
  ],
  '30 DAYS': [
    { name: 'Wk 1', sales: 1200, target: 1000 }, { name: 'Wk 2', sales: 1800, target: 1500 },
    { name: 'Wk 3', sales: 2400, target: 2000 }, { name: 'Wk 4', sales: 2100, target: 2500 }
  ],
  '7 DAYS': [
    { name: 'Mon', sales: 150, target: 200 }, { name: 'Tue', sales: 230, target: 210 },
    { name: 'Wed', sales: 340, target: 250 }, { name: 'Thu', sales: 290, target: 300 },
    { name: 'Fri', sales: 450, target: 350 }, { name: 'Sat', sales: 600, target: 500 },
    { name: 'Sun', sales: 550, target: 480 }
  ]
};

// --- PURE REACT & SVG CHART COMPONENT (No Libraries Required) ---
const CustomSVGChart = ({ data, type }) => {
  const width = 800;
  const height = 200;
  
  // Find max value to scale the chart dynamically
  const maxVal = Math.max(...data.map(d => Math.max(d.sales, d.target))) || 1;
  const adjustedMax = maxVal * 1.1; // Add 10% padding to the top

  // Utility to scale X and Y coordinates
  const getX = (index) => (index / (data.length - 1 || 1)) * width;
  const getBarX = (index) => (index / data.length) * width;
  const getY = (val) => height - (val / adjustedMax) * height;

  // Path generators
  const makeLinePath = (key) => data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[key])}`).join(' ');
  const makeAreaPath = (key) => `${makeLinePath(key)} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex-1 w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line key={i} x1="0" y1={height * ratio} x2={width} y2={height * ratio} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          ))}

          {/* Render based on selected type */}
          {(type === 'Area' || type === 'Line') && (
            <>
              {type === 'Area' && <path d={makeAreaPath('target')} fill="url(#colorTarget)" />}
              <path d={makeLinePath('target')} fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray={type === 'Line' ? "5 5" : "0"} />
              
              {type === 'Area' && <path d={makeAreaPath('sales')} fill="url(#colorSales)" />}
              <path d={makeLinePath('sales')} fill="none" stroke="#60a5fa" strokeWidth="3" />

              {/* Data points for Line/Area */}
              {data.map((d, i) => (
                <g key={i}>
                  <circle cx={getX(i)} cy={getY(d.target)} r="4" fill="#1a1b2e" stroke="#fbbf24" strokeWidth="2">
                    <title>Target: ${d.target}</title>
                  </circle>
                  <circle cx={getX(i)} cy={getY(d.sales)} r="4" fill="#1a1b2e" stroke="#60a5fa" strokeWidth="2" className="hover:r-[6px] transition-all cursor-pointer">
                    <title>{d.name} Sales: ${d.sales}</title>
                  </circle>
                </g>
              ))}
            </>
          )}

          {type === 'Bar' && (
            data.map((d, i) => {
              const barWidth = (width / data.length) * 0.3;
              const spacing = barWidth * 0.1;
              const xCenter = getBarX(i) + (width / data.length) / 2;
              
              return (
                <g key={i}>
                  <rect x={xCenter - barWidth - spacing} y={getY(d.sales)} width={barWidth} height={height - getY(d.sales)} fill="#60a5fa" rx="2" className="hover:opacity-80 transition-opacity cursor-pointer"><title>Sales: ${d.sales}</title></rect>
                  <rect x={xCenter + spacing} y={getY(d.target)} width={barWidth} height={height - getY(d.target)} fill="#fbbf24" rx="2" className="hover:opacity-80 transition-opacity cursor-pointer"><title>Target: ${d.target}</title></rect>
                </g>
              );
            })
          )}

          {type === 'Mixed' && (
            <>
              {/* Background Bars for Target */}
              {data.map((d, i) => {
                const barWidth = (width / data.length) * 0.4;
                const xCenter = getBarX(i) + (width / data.length) / 2;
                return (
                  <rect key={i} x={xCenter - barWidth/2} y={getY(d.target)} width={barWidth} height={height - getY(d.target)} fill="rgba(251, 191, 36, 0.3)" rx="4" className="hover:fill-[rgba(251,191,36,0.5)] transition-colors cursor-pointer">
                    <title>Target: ${d.target}</title>
                  </rect>
                );
              })}
              {/* Foreground Line for Sales */}
              <path d={makeLinePath('sales')} fill="none" stroke="#60a5fa" strokeWidth="3" />
              {data.map((d, i) => (
                <circle key={i} cx={getX(i)} cy={getY(d.sales)} r="4" fill="#1a1b2e" stroke="#60a5fa" strokeWidth="2" className="hover:r-[6px] transition-all cursor-pointer">
                  <title>{d.name} Sales: ${d.sales}</title>
                </circle>
              ))}
            </>
          )}
        </svg>
      </div>
      
      {/* X-Axis Labels */}
      <div className="flex justify-between text-[11px] font-bold opacity-40 mt-4 uppercase tracking-widest w-full px-2">
        {data.map((d, i) => (
          <span key={i} className="text-center w-8 -ml-4">{d.name}</span>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const glassIcons = ['📱', '💻', '🎧', '⌚', '🎮'];
  
  const [activeTimeFilter, setActiveTimeFilter] = useState('12 MONTHS');
  const [chartType, setChartType] = useState('Area'); // 'Area', 'Line', 'Bar', 'Mixed'
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

  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6 pb-20 space-y-6">
      
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
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

        {/* Metric 2 */}
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

        {/* Metric 3 */}
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
        
        {/* Sales Report Chart */}
        <Widget className="col-span-2 relative h-[26rem] flex flex-col">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-black uppercase">Sales Report</h3>
              {/* Chart Type Selectors */}
              <div className="hidden sm:flex bg-white/5 border border-white/10 rounded-lg p-1 gap-1">
                {[
                  { id: 'Area', icon: Activity },
                  { id: 'Line', icon: TrendingUp },
                  { id: 'Bar', icon: BarChart2 },
                  { id: 'Mixed', icon: Layers }
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

          {/* Custom SVG Render Container */}
          <div className="flex-1 w-full min-h-0 mt-2">
            <CustomSVGChart data={chartData[activeTimeFilter]} type={chartType} />
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
         {/* Total Bets (Pie Chart Placeholder) */}
         <Widget className="flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black uppercase">Total Bets</h3>
              <div className="relative">
                <button onClick={() => toggleMenu('bets')} className="text-white/40 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                <ActionMenu isOpen={openMenuId === 'bets'} onClose={() => setOpenMenuId(null)} />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-6">
               <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                 <div className="w-full h-full rounded-full bg-blue-500 absolute clip-half opacity-80"></div>
                 <div className="w-32 h-32 rounded-full bg-yellow-400 absolute top-0 right-0 shadow-lg flex items-center justify-center text-black font-black text-sm">20%</div>
                 <div className="w-24 h-24 rounded-full bg-orange-500 absolute bottom-4 right-4 shadow-lg flex items-center justify-center text-white font-black text-sm border-4 border-[#1a1b2e]">10%</div>
                 <div className="absolute left-8 text-white font-black text-3xl drop-shadow-md">70%</div>
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
              <button 
                onClick={() => alert('Navigate to full Customers page')}
                className="flex items-center gap-1 text-sm font-bold text-blue-400 hover:text-blue-300 hover:underline transition-all"
              >
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
                 <button 
                   onClick={() => handlePageChange(currentPage - 1)}
                   disabled={currentPage === 1}
                   className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'}`}
                 >
                   &lt;
                 </button>
                 
                 {[1, 2, 3].map(num => (
                    <button 
                      key={num}
                      onClick={() => handlePageChange(num)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                        currentPage === num 
                        ? 'bg-blue-500 text-white shadow-lg font-black border border-blue-400/50' 
                        : 'hover:bg-white/10'
                      }`}
                    >
                      {num}
                    </button>
                 ))}
                 
                 <span className="px-1">...</span>
                 
                 <button 
                   onClick={() => handlePageChange(totalPages)}
                   className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                     currentPage === totalPages 
                     ? 'bg-blue-500 text-white shadow-lg font-black border border-blue-400/50' 
                     : 'hover:bg-white/10'
                   }`}
                 >
                   {totalPages}
                 </button>
                 
                 <button 
                   onClick={() => handlePageChange(currentPage + 1)}
                   disabled={currentPage === totalPages}
                   className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'}`}
                 >
                   &gt;
                 </button>
               </div>
            </div>
         </Widget>
      </div>
    </div>
  );
}