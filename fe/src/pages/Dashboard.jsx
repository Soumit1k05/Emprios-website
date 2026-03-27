import React from 'react';
import { MoreVertical, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';

const Widget = ({ children, className = '' }) => (
  <div className={`bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-6 ${className}`}>
    {children}
  </div>
);

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Metric 1 */}
        <Widget className="flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-bold text-slate-700">Today's Sale</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
          </div>
          <div>
             <div className="text-3xl font-black text-slate-800">$12,426</div>
             <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-slate-500">
                <ArrowUp size={14} className="text-green-500" />
                <span className="text-green-500">+36%</span>
                vs last month
             </div>
          </div>
        </Widget>

        {/* Metric 2 */}
        <Widget className="flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
            <h3 className="text-sm font-bold text-slate-700">Total Sales</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
          </div>
          <div>
             <div className="text-3xl font-black text-slate-800">$2,38,485</div>
             <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-slate-500">
                <ArrowDown size={14} className="text-red-500" />
                <span className="text-red-500">-14%</span>
                vs last month
             </div>
          </div>
        </Widget>

        {/* Metric 3 */}
        <Widget className="flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
            <h3 className="text-sm font-bold text-slate-700">Total Orders</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
          </div>
          <div>
             <div className="text-3xl font-black text-slate-800">84,382</div>
             <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-slate-500">
                <ArrowUp size={14} className="text-green-500" />
                <span className="text-green-500">+36%</span>
                vs last month
             </div>
          </div>
        </Widget>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Report Chart */}
        <Widget className="col-span-2 relative h-80 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800">Sales Report</h3>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
              <button className="text-primary bg-primary/10 px-3 py-1 rounded-full">12 MONTHS</button>
              <button className="hover:text-slate-800">6 MONTHS</button>
              <button className="hover:text-slate-800">30 DAYS</button>
              <button className="hover:text-slate-800">7 DAYS</button>
              <button className="flex items-center gap-1 border border-slate-200 px-3 py-1 rounded-full bg-white text-slate-700 ml-4"><span className="font-bold">EXPORT PDF</span></button>
            </div>
          </div>
          <div className="flex-1 w-full flex items-end relative overflow-hidden">
             {/* Mocking a line chart */}
             <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
               <path d="M0,35 Q10,30 20,38 T40,25 T60,10 T80,15 T100,5" fill="none" stroke="#2563eb" strokeWidth="1" />
               <path d="M0,35 Q10,30 20,38 T40,25 T60,10 T80,15 T100,5" fill="url(#gradient-blue)" />
               <path d="M0,30 Q15,35 30,20 T50,25 T70,5 T90,20 T100,10" fill="none" stroke="#eab308" strokeWidth="1" />
               
               <defs>
                 <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2"/>
                   <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
                 </linearGradient>
               </defs>
             </svg>
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-4 px-2">
            {['Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan'].map(m => <span key={m}>{m}</span>)}
          </div>
        </Widget>

        {/* Traffic Sources */}
        <Widget className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800">Traffic Sources</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800">
               LAST 7 DAYS <ChevronDown size={14} />
            </button>
          </div>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {[
              { label: 'Direct', val: '1,43,382', pct: '75%', color: 'bg-primary' },
              { label: 'Referral', val: '87,974', pct: '50%', color: 'bg-primary' },
              { label: 'Social Media', val: '45,211', pct: '25%', color: 'bg-primary' },
              { label: 'Twitter', val: '21,893', pct: '12%', color: 'bg-primary' },
              { label: 'Facebook', val: '21,893', pct: '12%', color: 'bg-primary' }
            ].map((t,i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Total Bets (Pie Chart Placeholder) */}
         <Widget className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-slate-800">Total Bets</h3>
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-6">
               <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                  {/* Mock CSS Pie Chart */}
                  <div className="w-full h-full rounded-full bg-blue-500 absolute clip-half"></div>
                  <div className="w-32 h-32 rounded-full bg-yellow-400 absolute top-0 right-0 shadow-lg flex items-center justify-center text-white font-bold text-sm">20%</div>
                  <div className="w-24 h-24 rounded-full bg-orange-500 absolute bottom-4 right-4 shadow-lg flex items-center justify-center text-white font-bold text-sm">10%</div>
                  <div className="absolute left-8 text-white font-black text-2xl">70%</div>
               </div>
               <div className="w-full space-y-4">
                 {[
                   { label: 'Mobile', val: '$50,280', color: 'bg-blue-500' },
                   { label: 'Leptop', val: '$30,160', color: 'bg-yellow-400' },
                   { label: 'watch', val: '$15,520', color: 'bg-orange-500' }
                 ].map(item => (
                   <div key={item.label} className="flex justify-between text-xs font-bold text-slate-600">
                     <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${item.color}`} /> {item.label}</span>
                     <span>{item.val}</span>
                   </div>
                 ))}
               </div>
            </div>
         </Widget>

         {/* Recent Customers */}
         <Widget className="col-span-2 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-slate-800">Recent Customers</h3>
              <button className="flex items-center gap-1 text-sm font-bold text-primary hover:text-blue-700">
                 View All &rarr;
              </button>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-slate-500 border-b border-slate-100">
                    <th className="pb-3 px-2">Product</th>
                    <th className="pb-3 px-2">Orders ID</th>
                    <th className="pb-3 px-2">Customer Name</th>
                    <th className="pb-3 px-2">Date</th>
                    <th className="pb-3 px-2">Price</th>
                    <th className="pb-3 px-2">Statues</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-semibold text-slate-700">
                  {[
                    { id: '#202395', name: 'Ripon Ahmed', date: '1 Jan 24', price: '$20,584', status: 'Complete', statColor: 'text-green-600 bg-green-100' },
                    { id: '#202396', name: 'Leslie Alexander', date: '2 Jan 24', price: '$11,234', status: 'Pending', statColor: 'text-orange-600 bg-orange-100' },
                    { id: '#202397', name: 'Ralph Edwards', date: '3 Jan 24', price: '$11,159', status: 'Complete', statColor: 'text-green-600 bg-green-100' },
                    { id: '#202398', name: 'Ronaid Richards', date: '4 Jan 24', price: '$10,483', status: 'Complete', statColor: 'text-green-600 bg-green-100' },
                    { id: '#202399', name: 'Devon Lane', date: '6 Jan 24', price: '$9,084', status: 'Pending', statColor: 'text-orange-600 bg-orange-100' }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                      <td className="py-3 px-2">
                        <div className="w-8 h-8 rounded bg-slate-200 overflow-hidden shadow-sm">
                           <img src={`https://images.unsplash.com/photo-${1600000000000 + i}?w=100&h=100&fit=crop`} alt="product" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-2 text-slate-500">{row.id}</td>
                      <td className="py-3 px-2">{row.name}</td>
                      <td className="py-3 px-2 flex items-center gap-1 text-slate-500"><div className="w-3 h-3 border rounded-sm"></div> {row.date}</td>
                      <td className="py-3 px-2">{row.price}</td>
                      <td className="py-3 px-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${row.statColor}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-6 text-xs font-bold text-slate-500">
               <div>Show <span className="bg-slate-100 px-2 py-1 rounded border">5</span> from 12</div>
               <div className="flex items-center gap-2">
                 <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded">&lt;</button>
                 <button className="w-6 h-6 flex items-center justify-center bg-primary text-white rounded shadow-sm hover:opacity-90">2</button>
                 <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded">3</button>
                 <span>...</span>
                 <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded">12</button>
                 <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded">&gt;</button>
               </div>
            </div>
         </Widget>
      </div>
    </div>
  );
}
