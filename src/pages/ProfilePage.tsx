import React from 'react';
import { User, Shield, Bell, Key, LogOut, ExternalLink, ChevronRight } from 'lucide-react';

const ProfilePage: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-8 mb-12">
        <div className="relative">
            <div className="w-24 h-24 rounded-[2rem] bg-brand-black text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-xl">
                JD
            </div>
            <div className="absolute -bottom-1 -right-1 bg-brand-lime p-2 rounded-xl border-4 border-white shadow-lg">
                <Shield size={16} className="text-black" />
            </div>
        </div>
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Jayasimma D</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Enterprise Lab Member • ID: #RX-29384</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
            <div className="glass-card p-4 space-y-1">
                {[
                    { icon: User, label: 'Account Details', active: true },
                    { icon: Shield, label: 'Security & Auth', active: false },
                    { icon: Bell, label: 'Notifications', active: false },
                    { icon: Key, label: 'API Keys', active: false },
                ].map((item, i) => (
                    <button 
                        key={i} 
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-black text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={18} />
                            <span className="text-sm font-bold">{item.label}</span>
                        </div>
                        {item.active && <ChevronRight size={14} />}
                    </button>
                ))}
            </div>
            
            <button className="w-full flex items-center gap-3 px-8 py-4 rounded-xl text-status-error font-bold hover:bg-red-50 transition-all">
                <LogOut size={18} /> Sign Out
            </button>
        </div>

        <div className="md:col-span-2 space-y-8">
            <div className="glass-card">
                <h3 className="text-xl font-bold mb-8 tracking-tighter">Personal Parameters</h3>
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input type="text" defaultValue="Jayasimma D" className="w-full" disabled />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input type="email" defaultValue="javasimma@skintermo.ai" className="w-full" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Lab Group</label>
                        <input type="text" defaultValue="Clinical Validation A" className="w-full" disabled />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Security Tier</label>
                        <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-brand-blue flex items-center gap-2">
                            <Shield size={14} /> Level 4 Enterprise
                        </div>
                    </div>
                </div>
                <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end">
                    <button className="btn btn-primary px-10">Update Protocol</button>
                </div>
            </div>

            <div className="glass-card bg-gray-50/50 border-dashed">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Connected Nodes</h3>
                    <ExternalLink size={14} className="text-gray-300" />
                </div>
                <p className="text-xs text-gray-500">Your account is currently linked to 3 laboratory validation nodes. Higher data processing speeds are enabled for your current tier.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
