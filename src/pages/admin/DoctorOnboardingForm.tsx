import React, { useState } from 'react';
import LocationPicker from '../../components/LocationPicker';
import { UserPlus, Upload, ShieldCheck, MapPin, Phone, Briefcase, GraduationCap, Hospital } from 'lucide-react';
import axios from 'axios';

export default function DoctorOnboardingForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    licenseNumber: '',
    degree: '',
    hospitalAffiliation: '',
    clinicName: '',
    address: ''
  });
  
  const [files, setFiles] = useState<{
    licenseDoc: File | null;
    degreeCert: File | null;
  }>({
    licenseDoc: null,
    degreeCert: null
  });

  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert("Please select a clinic location on the map.");
      return;
    }
    if (!files.licenseDoc || !files.degreeCert) {
      alert("Please upload both license and degree documents.");
      return;
    }

    setLoading(true);
    const submitData = new FormData();
    submitData.append('full_name', formData.fullName);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('specialization', formData.specialization);
    submitData.append('experience', formData.experience);
    submitData.append('license_number', formData.licenseNumber);
    submitData.append('clinic_name', formData.clinicName);
    submitData.append('address', formData.address);
    submitData.append('latitude', location.lat.toString());
    submitData.append('longitude', location.lng.toString());
    submitData.append('license_doc', files.licenseDoc);
    submitData.append('degree_cert', files.degreeCert);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:8000/admin/verify-doctor', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Doctor verified and profile created successfully!");
      console.log(response.data);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-brand-lime/20 rounded-xl flex items-center justify-center border border-brand-lime/30">
          <UserPlus className="text-brand-black" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Doctor Verification & Onboarding</h1>
          <p className="text-gray-500">Submit medical credentials and location details for approval</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-brand-lime" />
              Professional Identity
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                <input type="text" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full outline-none focus:border-brand-black" onChange={e => setFormData({...formData, fullName: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                <input type="email" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full outline-none focus:border-brand-black" onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" className="bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 w-full outline-none focus:border-brand-black" onChange={e => setFormData({...formData, phone: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Specialization</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="e.g. Dermatologist" className="bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 w-full outline-none focus:border-brand-black" onChange={e => setFormData({...formData, specialization: e.target.value})} required />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <GraduationCap size={20} className="text-brand-lime" />
              Credentials & Affiliation
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Degree (e.g. MBBS, MD)" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full outline-none focus:border-brand-black" onChange={e => setFormData({...formData, degree: e.target.value})} required />
              <input type="number" placeholder="Years of Experience" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full outline-none focus:border-brand-black" onChange={e => setFormData({...formData, experience: e.target.value})} required />
              <div className="col-span-2 relative">
                <Hospital size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Hospital Affiliation" className="bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 w-full outline-none focus:border-brand-black" onChange={e => setFormData({...formData, hospitalAffiliation: e.target.value})} required />
              </div>
              <input type="text" placeholder="License Number" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full outline-none focus:border-brand-black" onChange={e => setFormData({...formData, licenseNumber: e.target.value})} required />
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Upload size={20} className="text-brand-lime" />
              Document Uploads
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-brand-lime transition-colors">
                <label className="cursor-pointer block">
                  <Upload className="mx-auto mb-2 text-gray-400" />
                  <span className="text-sm font-bold block">License Document</span>
                  <span className="text-[10px] text-gray-400">{files.licenseDoc?.name || "Upload PDF/Image"}</span>
                  <input type="file" className="hidden" onChange={e => setFiles({...files, licenseDoc: e.target.files?.[0] || null})} />
                </label>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-brand-lime transition-colors">
                <label className="cursor-pointer block">
                  <Upload className="mx-auto mb-2 text-gray-400" />
                  <span className="text-sm font-bold block">Degree Certificate</span>
                  <span className="text-[10px] text-gray-400">{files.degreeCert?.name || "Upload PDF/Image"}</span>
                  <input type="file" className="hidden" onChange={e => setFiles({...files, degreeCert: e.target.files?.[0] || null})} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card flex flex-col h-full">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-brand-lime" />
              Clinic Information
            </h3>
            <input type="text" placeholder="Clinic Name" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full outline-none focus:border-brand-black mb-4" onChange={e => setFormData({...formData, clinicName: e.target.value})} required />
            <textarea placeholder="Physical Address" rows={3} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full outline-none focus:border-brand-black mb-6" onChange={e => setFormData({...formData, address: e.target.value})} required />
            
            <div className="flex-1 min-h-[300px] rounded-2xl overflow-hidden border border-gray-100">
               <LocationPicker onLocationSelect={(pos) => setLocation({ lat: pos.lat, lng: pos.lng })} />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full py-5 mt-8 text-lg justify-center shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              {loading ? "Processing..." : "Submit & Verify"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
