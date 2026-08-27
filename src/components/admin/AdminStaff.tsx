import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Staff } from '../../types';
import { Plus, Edit2, Trash2, Phone, Mail, MapPin, Star, UserCheck, Shield } from 'lucide-react';

export const AdminStaff: React.FC = () => {
  const { staff, addStaff, updateStaff, deleteStaff, bookings } = useData();

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [serviceArea, setServiceArea] = useState('Pune West & PCMC');
  const [skillsText, setSkillsText] = useState('Floor Polishing, Sofa Extraction, Sanitization');
  const [status, setStatus] = useState<'active' | 'busy' | 'inactive' | 'on_leave'>('active');
  const [photo, setPhoto] = useState('');

  const handleOpenStaffModal = (stf?: Staff) => {
    if (stf) {
      setEditingStaffId(stf.id);
      setName(stf.name);
      setMobile(stf.mobile);
      setEmail(stf.email);
      setServiceArea(stf.serviceArea);
      setSkillsText(stf.skills.join(', '));
      setStatus(stf.status);
      setPhoto(stf.photo);
    } else {
      setEditingStaffId(null);
      setName('');
      setMobile('+91 98');
      setEmail('');
      setServiceArea('Pune Central & West');
      setSkillsText('Deep Cleaning, Kitchen Degrease, Diversey Safe Chemicals');
      setStatus('active');
      setPhoto('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80');
    }
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skillsText.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingStaffId) {
      await updateStaff(editingStaffId, {
        name,
        mobile,
        email,
        serviceArea,
        skills: skillsArray,
        status,
        photo
      });
    } else {
      await addStaff({
        name,
        mobile,
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@cleaningflash.in`,
        serviceArea,
        skills: skillsArray,
        status,
        photo: photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        rating: 4.9,
        completedJobs: 0
      });
    }
    setIsStaffModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Cleaning Crew & Staff Roster</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage full-time certified cleaning professionals, service territories, live availability, and ratings.
          </p>
        </div>

        <button
          onClick={() => handleOpenStaffModal()}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Specialist</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((stf) => {
          const activeJobsCount = bookings.filter(
            (b) => b.assignedStaffId === stf.id && ['assigned', 'on_the_way', 'in_progress'].includes(b.bookingStatus)
          ).length;

          return (
            <div
              key={stf.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4 transition"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={stf.photo}
                      alt={stf.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {stf.staffId}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">{stf.name}</h3>
                      <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{stf.rating} / 5.0</span>
                        <span className="text-[10px] text-slate-400">({stf.completedJobs} completed)</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      stf.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : stf.status === 'busy'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {stf.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{stf.mobile}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{stf.serviceArea}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Skills & Badges</span>
                  <div className="flex flex-wrap gap-1">
                    {stf.skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  {activeJobsCount > 0 ? `⚡ ${activeJobsCount} Active Job${activeJobsCount > 1 ? 's' : ''}` : 'Ready for assignment'}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenStaffModal(stf)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="Edit Profile"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove staff member "${stf.name}"?`)) deleteStaff(stf.id);
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete Staff"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingStaffId ? 'Edit Cleaning Specialist' : 'Register New Specialist'}
            </h3>

            <form onSubmit={handleSaveStaff} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kulkarni"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile *</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Staff['status'])}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="active">Active (Available)</option>
                    <option value="busy">Busy on Job</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Territory</label>
                <input
                  type="text"
                  placeholder="e.g. Baner, Aundh, Wakad, Hinjewadi"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                >
                  Save Specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
