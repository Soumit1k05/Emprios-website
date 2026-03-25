import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Box, BarChart2, Users, 
  DollarSign, FileText, Percent, MessageCircle, Mail, 
  Plus, Settings, HelpCircle, Moon, Search, ShoppingCart
} from 'lucide-react';

export default function Sidebar() {
  const mainMenu = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { title: 'Bundles', icon: Box, path: '/bundles' },
    { title: 'Orders', icon: ShoppingBag, path: '/orders' },
    { title: 'Products', icon: ShoppingCart, path: '/products' },
    { title: 'Analytics', icon: BarChart2, path: '/analytics' },
    { title: 'Customers', icon: Users, path: '/customers' },
    { title: 'Finances', icon: DollarSign, path: '/finances' },
    { title: 'Invoices', icon: FileText, path: '/invoices' },
    { title: 'Discounts', icon: Percent, path: '/discounts' },
  ];

  const appsMenu = [
    { title: 'Chats', icon: MessageCircle, path: '/chats' },
    { title: 'Email', icon: Mail, path: '/email' },
  ];

  return (
    <aside className="w-64 h-full flex flex-col pt-6 pb-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-6 text-primary">
        <ShoppingCart size={28} />
        <span className="font-bold text-xl text-slate-800">E-commerce</span>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
           <span className="text-[10px] bg-white border px-1 rounded">⌘1</span>
           <Search size={14} />
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto custom-scroll -mr-2 pr-2 space-y-1">
        {mainMenu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}
            `}
          >
            <item.icon size={18} />
            {item.title}
          </NavLink>
        ))}

        <div className="mt-8 mb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Apps</div>
        {appsMenu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <item.icon size={18} />
            {item.title}
          </NavLink>
        ))}
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors w-full text-left">
          <Plus size={18} /> Add Apps
        </button>
      </nav>

      {/* Bottom Nav */}
      <div className="mt-6 space-y-1 pt-6 border-t border-slate-200">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors w-full text-left">
          <Settings size={18} /> Settings
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors w-full text-left">
          <HelpCircle size={18} /> Help Center
        </button>
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500">
          <div className="flex items-center gap-3">
            <Moon size={18} /> Dark Mode
          </div>
          <div className="w-8 h-4 bg-slate-200 rounded-full relative">
             <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="mt-4 flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-9 h-9 rounded-full object-cover" />
          <div className="text-left">
            <div className="text-[13px] font-bold text-slate-800">Ryan Reybrown</div>
            <div className="text-[11px] text-slate-400">yourmail@gmail.com</div>
          </div>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
      </div>
    </aside>
  );
}
