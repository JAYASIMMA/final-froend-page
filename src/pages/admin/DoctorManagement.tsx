import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { Download, Share2, ShieldCheck, User, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface Doctor {
  id: number;
  specialization: string;
  experience: number;
  clinic_name: string;
  address: string;
  status: string;
  user: {
    name: string;
    email: string;
    profile_image?: string;
  };
}

const DoctorPasscodeCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = () => {
    if (cardRef.current === null) return;
    toPng(cardRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `Doctor_Passcode_${doctor.user.name}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to generate card', err);
      });
  };

  const shareCard = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current);
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'passcode.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Doctor Verified Passcode',
          text: `Verified Doctor: ${doctor.user.name}`,
        });
      } else {
        alert("Sharing not supported on this browser. Downloading instead.");
        downloadCard();
      }
    } catch (err) {
      console.error('Error sharing', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* The Actual Passcode Card */}
      <div 
        ref={cardRef}
        className="w-[350px] h-[550px] bg-brand-black text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl border-4 border-brand-lime/20"
      >
        {/* Background Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-lime/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-lime/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-lime rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-brand-black w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-widest text-brand-lime uppercase">Verified Provider</span>
            </div>
            <div className="text-[10px] font-mono opacity-40">SKINSCAN-ID-{doctor.id.toString().padStart(4, '0')}</div>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-3xl border-4 border-brand-lime/30 overflow-hidden mb-4 bg-gray-800">
              {doctor.user.profile_image ? (
                <img 
                  src={`http://127.0.0.1:8000/${doctor.user.profile_image}`} 
                  alt={doctor.user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={48} className="text-gray-600" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-center leading-tight mb-1">{doctor.user.name}</h2>
            <p className="text-brand-lime text-sm font-medium tracking-wide">{doctor.specialization}</p>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-center gap-3 text-xs opacity-70">
              <MapPin size={14} className="text-brand-lime" />
              <span>{doctor.clinic_name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs opacity-70">
              <Phone size={14} className="text-brand-lime" />
              <span>+1 (800) VERIFIED</span>
            </div>
            <div className="flex items-center gap-3 text-xs opacity-70">
              <Mail size={14} className="text-brand-lime" />
              <span>{doctor.user.email}</span>
            </div>
          </div>

          {/* QR Code Footer */}
          <div className="bg-white p-4 rounded-3xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-black text-[10px] font-bold uppercase tracking-tighter">Scan to Verify</span>
              <span className="text-gray-400 text-[8px] font-mono">ID: {doctor.user.email}</span>
            </div>
            <QRCodeSVG 
              value={`https://skinscan.ai/verify/${doctor.id}`} 
              size={50}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 w-full">
        <button 
          onClick={downloadCard}
          className="flex-1 btn btn-primary py-4 flex items-center justify-center gap-2"
        >
          <Download size={18} /> Download Card
        </button>
        <button 
          onClick={shareCard}
          className="btn btn-secondary py-4 px-6 flex items-center justify-center"
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [activeTab, setActiveTab] = useState<'verified' | 'requests'>('verified');
  const [approvalResult, setApprovalResult] = useState<{ email: string; pass: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      if (activeTab === 'verified') {
        const response = await axios.get('http://127.0.0.1:8000/doctors', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(response.data);
      } else {
        const response = await axios.get('http://127.0.0.1:8000/doctor-verification/requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(response.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    if (!window.confirm("Authorize this medical professional for network access?")) return;
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`http://127.0.0.1:8000/doctor-verification/approve/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApprovalResult({ email: response.data.email, pass: response.data.temporary_password });
      fetchData();
    } catch (err) {
      alert("Failed to approve doctor");
    }
  };

  return (
    <div className="p-8 animate-fade-in space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-brand-black">Medical Provider Control</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Manage expert nodes and authorize new clinical practitioners.</p>
        </div>
        
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          <button 
            onClick={() => setActiveTab('verified')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'verified' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-black'}`}
          >
            Verified Providers
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-black'}`}
          >
            Pending Requests ({requests.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {activeTab === 'verified' ? (
          <>
            <div className="xl:col-span-2 space-y-4">
              {loading ? (
                <div className="glass-card animate-pulse h-32 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-gray-400">Synchronizing Expert Nodes...</div>
              ) : doctors.length === 0 ? (
                <div className="glass-card py-20 text-center text-gray-400 border-dashed">No verified doctors in current registry</div>
              ) : (
                doctors.map((doc) => (
                  <motion.div 
                    key={doc.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`glass-card cursor-pointer transition-all border-2 ${selectedDoctor?.id === doc.id ? 'border-brand-lime bg-brand-lime/5 shadow-xl' : 'border-transparent hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-brand-black/5 rounded-2xl overflow-hidden flex items-center justify-center">
                        {doc.user.profile_image ? (
                          <img src={`http://127.0.0.1:8000/${doc.user.profile_image}`} className="w-full h-full object-cover" />
                        ) : (
                          <User size={32} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-brand-black tracking-tight">{doc.user.name}</h3>
                        <p className="text-xs font-bold text-brand-lime uppercase tracking-widest mt-1">{doc.specialization} • {doc.experience}y Exp.</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-2 bg-brand-lime/10 text-brand-lime text-[10px] font-black uppercase px-4 py-1.5 rounded-xl border border-brand-lime/20 mb-3">
                          <ShieldCheck size={12} /> {doc.status}
                        </span>
                        <p className="text-[10px] text-gray-400 flex items-center gap-2 justify-end font-bold uppercase tracking-widest">
                          <ExternalLink size={12} /> Provider Node
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            <div className="flex flex-col items-center">
              {selectedDoctor ? (
                <DoctorPasscodeCard doctor={selectedDoctor} />
              ) : (
                <div className="w-full aspect-[3/5] border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center text-gray-300">
                  <User size={64} className="mb-6 opacity-20" />
                  <p className="text-xs font-black uppercase tracking-widest">Node Preview Standby</p>
                  <p className="text-[10px] mt-2 leading-relaxed">Select a verified expert from the registry to generate their digital clinical credentials.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="xl:col-span-3 space-y-6">
            {loading ? (
              <div className="glass-card animate-pulse h-64 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-gray-400">Fetching Unverified Credentials...</div>
            ) : requests.length === 0 ? (
              <div className="glass-card py-32 text-center border-dashed border-gray-200 flex flex-col items-center gap-4">
                <Users className="text-gray-200" size={64} />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Clinical Request Queue Empty</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requests.map((req) => (
                  <motion.div 
                    key={req.id}
                    className="glass-card p-10 bg-white border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-start justify-between">
                        <div className="w-16 h-16 bg-brand-black text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl">
                          {req.full_name.charAt(0)}
                        </div>
                        <span className="px-4 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-orange-100">Pending Review</span>
                      </div>
                      
                      <div>
                        <h4 className="text-3xl font-black text-brand-black tracking-tighter">{req.full_name}</h4>
                        <p className="text-xs font-bold text-brand-lime uppercase tracking-widest mt-2">{req.specialization}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</p>
                          <p className="text-sm font-bold">{req.experience_years} Years</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">License</p>
                          <p className="text-sm font-bold font-mono">{req.license_number}</p>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Clinical Node</p>
                          <p className="text-sm font-bold truncate">{req.clinic_name}</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-50 flex items-center gap-4">
                        <button 
                          onClick={() => handleApprove(req.id)}
                          className="flex-1 py-5 bg-brand-black text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-brand-lime hover:text-black transition-all shadow-xl"
                        >
                          Authorize Expert Node
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Approval Success Modal */}
      <AnimatePresence>
        {approvalResult && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white w-full max-w-md rounded-[3rem] p-12 text-center space-y-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-brand-lime"></div>
              <div className="w-20 h-20 bg-brand-lime/20 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="text-brand-lime" size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tighter text-brand-black">Authorization Issued</h3>
                <p className="text-sm font-medium text-gray-500">Security protocols have been established for the provider node.</p>
              </div>

              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 text-left space-y-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Access Email</p>
                  <p className="text-sm font-bold font-mono text-brand-black">{approvalResult.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Temporary Protocol Key</p>
                  <p className="text-xl font-black font-mono text-brand-blue tracking-wider">{approvalResult.pass}</p>
                </div>
              </div>

              <button 
                onClick={() => setApprovalResult(null)}
                className="w-full py-5 bg-brand-black text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-brand-lime hover:text-black transition-all"
              >
                Close Secure Terminal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

