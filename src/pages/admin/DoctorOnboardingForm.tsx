import React, { useState } from 'react';
import LocationPicker from '../../components/LocationPicker';
import { UserPlus, Upload, ShieldCheck, MapPin } from 'lucide-react';

export default function DoctorOnboardingForm() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', 
    licenceNumber: '', specialization: ''
  });
  
  const [files, setFiles] = useState<{
    profilePicture: File | null;
    licenceDocument: File | null;
    aadhaarDocument: File | null;
  }>({
    profilePicture: null,
    licenceDocument: null,
    aadhaarDocument: null
  });

  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('licenceNumber', formData.licenceNumber);
    submitData.append('specialization', formData.specialization);
    
    if (location) {
      submitData.append('latitude', location.lat.toString());
      submitData.append('longitude', location.lng.toString());
    }
    
    if (files.profilePicture) submitData.append('profilePicture', files.profilePicture);
    if (files.licenceDocument) submitData.append('licenceDocument', files.licenceDocument);
    if (files.aadhaarDocument) submitData.append('aadhaarDocument', files.aadhaarDocument);

    console.log("Submitting Doctor Data...", Object.fromEntries(submitData));
    alert("Doctor registration initiated. Following BETTRLABS workflow.");
  };

  return (
    <div className="animate-fade-in p-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
          <UserPlus className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Register New Doctor</h1>
          <p className="text-text-secondary">Follow the SkinTermo AI implementation guide for verification</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-card">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary" />
              Basic Information
            </h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white w-full outline-none focus:border-primary/50"
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white w-full outline-none focus:border-primary/50"
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required
              />
              <input 
                type="password" 
                placeholder="Temporary Password" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white w-full outline-none focus:border-primary/50"
                onChange={e => setFormData({...formData, password: e.target.value})} 
                required
              />
              <input 
                type="text" 
                placeholder="Specialization (e.g., Dermatologist)" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white w-full outline-none focus:border-primary/50"
                onChange={e => setFormData({...formData, specialization: e.target.value})} 
                required
              />
              <input 
                type="text" 
                placeholder="Medical Licence Number" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white w-full outline-none focus:border-primary/50"
                onChange={e => setFormData({...formData, licenceNumber: e.target.value})} 
                required
              />
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Upload size={20} className="text-secondary" />
              Required Documents
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase mb-2 block">Profile Picture</label>
                <input type="file" accept="image/*" className="text-sm text-text-secondary w-full" onChange={e => setFiles({...files, profilePicture: e.target.files?.[0] || null})} />
              </div>
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase mb-2 block">Medical Licence (PDF)</label>
                <input type="file" accept="application/pdf" className="text-sm text-text-secondary w-full" onChange={e => setFiles({...files, licenceDocument: e.target.files?.[0] || null})} />
              </div>
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase mb-2 block">Aadhaar Verification (PDF)</label>
                <input type="file" accept="application/pdf" className="text-sm text-text-secondary w-full" onChange={e => setFiles({...files, aadhaarDocument: e.target.files?.[0] || null})} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card h-full">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-accent" />
              Clinic Location
            </h3>
            <p className="text-sm text-text-secondary mb-4">Mark the exact location of the clinic on the map below.</p>
            <LocationPicker onLocationSelect={(pos) => setLocation({ lat: pos.lat, lng: pos.lng })} />
            {location && (
              <div className="mt-4 p-3 bg-primary/10 rounded-xl border border-primary/20 text-xs font-mono">
                Lat: {location.lat.toFixed(6)} | Lng: {location.lng.toFixed(6)}
              </div>
            )}
            
            <button type="submit" className="btn btn-primary w-full py-4 mt-8 text-lg justify-center">
              Complete Onboarding
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
