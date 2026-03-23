import React from 'react';
import { Search, Bell, Grid, Plus } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-between items-center py-6 px-8 bg-transparent">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hi, Jubed</h1>
        <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
          Welcome back to Ecomic <span className="text-lg">👋</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Actions */}
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 shadow-sm border border-slate-100 transition-colors">
            <Search size={18} />
          </button>
          <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center relative text-slate-500 hover:text-primary hover:bg-slate-50 shadow-sm border border-slate-100 transition-colors">
            <Bell size={18} />
            <span className="w-2 h-2 bg-red-500 rounded-full absolute top-2.5 right-2.5 border-2 border-white"></span>
          </button>
        </div>

        {/* Buttons */}
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-semibold text-slate-700 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
          <Grid size={16} />
          Customize
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary rounded-xl text-sm font-semibold text-white shadow-md shadow-primary/30 hover:bg-blue-600 transition-colors">
          <Plus size={16} />
          Add New
        </button>
      </div>
    </header>
  );
}
