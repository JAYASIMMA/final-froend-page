import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="header" style={{ width: 'calc(100% - var(--sidebar-width))', left: 'var(--sidebar-width)' }}>
      <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl w-96">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search items, users, reports..." 
          className="bg-transparent border-none p-0 focus:shadow-none text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-black hover:bg-gray-100 p-2 rounded-full transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right">
            <p className="text-sm font-bold">Jayasimma D</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Admin Role</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold border border-white shadow-sm">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
