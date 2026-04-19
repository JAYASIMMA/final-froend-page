import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, Shield, User as UserIcon, Activity } from 'lucide-react';
import type { UserRole } from '../types';

const Login: React.FC = () => {
  const [role, setRole] = useState<UserRole>('PATIENT');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'DOCTOR') navigate('/doctor/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
    else navigate('/patient/dashboard');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-[#F0F4F8] overflow-hidden">
      {/* Background Blobs (BETTRLABS Design) */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-[#C5C6FC] rounded-full mix-blend-multiply filter opacity-50 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-[#FDA7D8] rounded-full mix-blend-multiply filter opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#DAF185] rounded-full mix-blend-multiply filter opacity-50 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-12 w-full max-w-md shadow-2xl border border-white animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-black rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:rotate-6 transition-transform">
            <Scan className="text-[#DAF185]" size={36} />
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tighter">SkinTermo AI</h1>
          <p className="text-gray-500 text-sm font-medium">Advanced Skin Disease Prediction System</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="grid grid-cols-3 gap-3 mb-10">
            {(['PATIENT', 'DOCTOR', 'ADMIN'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                    role === r 
                    ? 'bg-black border-black text-white shadow-xl scale-105' 
                    : 'bg-white/50 border-gray-100 text-gray-400 hover:border-gray-300'
                }`}
              >
                {r === 'PATIENT' ? <UserIcon size={20} /> : r === 'DOCTOR' ? <Activity size={20} /> : <Shield size={20} />}
                <span className="text-[10px] font-bold uppercase tracking-widest">{r}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="name@skintermo.ai" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full py-5 text-lg mt-12 rounded-full shadow-2xl hover:scale-105 transition-transform">
            Authorize Access
          </button>
        </form>

        <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                Secure Enterprise Portal<br/>
                Verified by SkinTermo AI Protocols
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
