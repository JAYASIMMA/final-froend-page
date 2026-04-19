import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Folder, 
  Users, 
  MessageSquare, 
  UserCircle, 
  Scan, 
  Grid, 
  Settings,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import type { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const doctorLinks = [
    { icon: Home, label: 'Campus', path: '/doctor/dashboard' },
    { icon: Folder, label: 'Sequence Reports', path: '/doctor/reports' },
    { icon: Users, label: 'Access Requests', path: '/doctor/requests' },
    { icon: MessageSquare, label: 'Chat Assistant', path: '/doctor/chatbot' },
    { icon: UserCircle, label: 'My Profile', path: '/doctor/profile' },
  ];

  const patientLinks = [
    { icon: Home, label: 'Campus', path: '/patient/dashboard' },
    { icon: Scan, label: 'Sequencing Lab', path: '/patient/scanning' },
    { icon: Grid, label: 'Doctor Marketplace', path: '/patient/doctors' },
    { icon: MessageSquare, label: 'AI Assistant', path: '/patient/chatbot' },
    { icon: UserCircle, label: 'My Profile', path: '/patient/profile' },
  ];

  const adminLinks = [
    { icon: ShieldCheck, label: 'Admin Terminal', path: '/admin/dashboard' },
    { icon: Users, label: 'Node Management', path: '/admin/users' },
    { icon: Settings, label: 'System Protocols', path: '/admin/settings' },
  ];

  const links = role === 'DOCTOR' ? doctorLinks : role === 'PATIENT' ? patientLinks : adminLinks;

  return (
    <aside className="sidebar">
      <div className="p-8">
        <h2 className="text-xl font-bold flex items-center gap-3 uppercase tracking-tighter">
          <div className="w-8 h-8 bg-brand-black rounded-lg flex items-center justify-center text-white text-[10px] font-bold">ST</div>
          SKINTERMO AI
        </h2>
      </div>

      <nav className="mt-4 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-6 py-3.5 transition-all duration-300 rounded-2xl
              ${isActive 
                ? 'bg-gray-100 border-l-4 border-black text-black font-bold shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-black'}
            `}
          >
            <link.icon size={18} />
            <span className="text-sm">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-10 left-0 w-full px-8">
        <div className="p-4 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">R&D Tier</p>
            <p className="text-xs font-bold text-brand-blue">Enterprise Member</p>
        </div>
        <button className="flex items-center gap-3 py-2 text-status-error hover:scale-105 transition-all w-full">
          <LogOut size={18} />
          <span className="text-sm font-bold">Terminal Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
