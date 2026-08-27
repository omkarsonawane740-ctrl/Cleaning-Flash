import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Booking, BookingStatus, UserAddress, Review } from '../../types';
import { InvoiceModal } from '../common/InvoiceModal';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  RotateCcw,
  XCircle,
  Star,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Phone,
  ShieldCheck,
  User,
  AlertCircle,
  Tag,
  Sparkles
} from 'lucide-react';

interface CustomerPortalProps {
  initialTab?: 'bookings' | 'addresses' | 'profile';
  onOpenBookingModal: () => void;
  onNavigateHome: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  initialTab = 'bookings',
  onOpenBookingModal,
  onNavigateHome
}) => {
  const { user, updateProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { bookings, settings, rescheduleBooking, cancelBooking, submitReview } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'addresses' | 'profile'>(initialTab);
  const [bookingFilter, setBookingFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  // Modals inside portal
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);
  const [rescheduleBookingTarget, setRescheduleBookingTarget] = useState<Booking | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>('');
  const [newRescheduleSlot, setNewRescheduleSlot] = useState<string>('10 AM - 12 PM');

  const [cancelBookingTarget, setCancelBookingTarget] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>('');

  const [reviewBookingTarget, setReviewBookingTarget] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  // Address add/edit modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrType, setAddrType] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [addrFlat, setAddrFlat] = useState('');
  const [addrBuilding, setAddrBuilding] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrArea, setAddrArea] = useState('Baner');
  const [addrCity, setAddrCity] = useState('Pune');
  const [addrPincode, setAddrPincode] = useState('411045');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Filter customer bookings
  const customerBookings = bookings.filter((b) => {
    if (!user) return true;
    return (
      b.customerId === user.uid ||
      b.customerEmail.toLowerCase() === user.email.toLowerCase() ||
      b.customerMobile === user.phone
    );
  });

  const filteredBookings = customerBookings.filter((b) => {
    if (bookingFilter === 'upcoming') {
      return ['pending', 'confirmed', 'assigned', 'on_the_way', 'in_progress', 'rescheduled'].includes(b.bookingStatus);
    }
    if (bookingFilter === 'completed') return b.bookingStatus === 'completed';
    if (bookingFilter === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name: profileName, phone: profilePhone });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  const handleOpenAddressModal = (addr?: UserAddress) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setAddrType(addr.type);
      setAddrFlat(addr.flatNo);
      setAddrBuilding(addr.building);
      setAddrLine(addr.address);
      setAddrArea(addr.area);
      setAddrCity(addr.city);
      setAddrPincode(addr.pincode);
      setAddrLandmark(addr.landmark || '');
      setAddrIsDefault(addr.isDefault);
    } else {
      setEditingAddressId(null);
      setAddrType('Home');
      setAddrFlat('');
      setAddrBuilding('');
      setAddrLine('');
      setAddrArea('Baner');
      setAddrCity('Pune');
      setAddrPincode('411045');
      setAddrLandmark('');
      setAddrIsDefault(false);
    }
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      await updateAddress({
        id: editingAddressId,
        type: addrType,
        flatNo: addrFlat,
        building: addrBuilding,
        address: addrLine,
        area: addrArea,
        city: addrCity,
        pincode: addrPincode,
        landmark: addrLandmark,
        isDefault: addrIsDefault
      });
    } else {
      await addAddress({
        type: addrType,
        flatNo: addrFlat,
        building: addrBuilding,
        address: addrLine,
        area: addrArea,
        city: addrCity,
        pincode: addrPincode,
        landmark: addrLandmark,
        isDefault: addrIsDefault
      });
    }
    setIsAddressModalOpen(false);
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleBookingTarget || !newRescheduleDate || !newRescheduleSlot) return;
    await rescheduleBooking(rescheduleBookingTarget.id, newRescheduleDate, newRescheduleSlot);
    setRescheduleBookingTarget(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelBookingTarget) return;
    await cancelBooking(cancelBookingTarget.id, cancellationReason);
    setCancelBookingTarget(null);
  };

  const handleConfirmReview = async () => {
    if (!reviewBookingTarget || !user) return;
    await submitReview({
      bookingId: reviewBookingTarget.bookingId,
      customerId: user.uid,
      customerName: user.name,
      serviceId: reviewBookingTarget.serviceId,
      serviceName: reviewBookingTarget.serviceName,
      rating: reviewRating,
      comment: reviewComment
    });
    setReviewBookingTarget(null);
    setReviewComment('');
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Completed</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 animate-pulse">Cleaning In Progress</span>;
      case 'on_the_way':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">Crew On The Way</span>;
      case 'assigned':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">Cleaner Assigned</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">Confirmed</span>;
      case 'rescheduled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Rescheduled</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">Pending Assignment</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
            />
            <div>
              <h1 className="text-2xl font-black text-slate-900">{user?.name || 'Customer Account'}</h1>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email} • {user?.phone || 'No phone'}</p>
            </div>
          </div>

          <button
            onClick={() => onOpenBookingModal()}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Book New Cleaning</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-6 flex space-x-2 border-b border-slate-200">
          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'bookings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Bookings ({customerBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('addresses')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'addresses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({user?.addresses?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* SUBTAB 1: BOOKINGS */}
        {activeSubTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => setBookingFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    bookingFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  All ({customerBookings.length})
                </button>
                <button
                  onClick={() => setBookingFilter('upcoming')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    bookingFilter === 'upcoming'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Upcoming / Active
                </button>
                <button
                  onClick={() => setBookingFilter('completed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    bookingFilter === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setBookingFilter('cancelled')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    bookingFilter === 'cancelled'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Cancelled
                </button>
              </div>
            </div>

            {/* Bookings List Cards */}
            {filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map((bkg) => (
                  <div
                    key={bkg.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5 transition hover:border-blue-200"
                  >
                    {/* Top Row: Service info & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-start space-x-3.5">
                        <img
                          src={bkg.serviceImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=150&q=80'}
                          alt={bkg.serviceName}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {bkg.bookingId}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              Booked on {new Date(bkg.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-bold text-base text-slate-900 mt-1">{bkg.serviceName}</h3>
                          <p className="text-xs text-blue-600 font-semibold">{bkg.packageName}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-1">
                        {getStatusBadge(bkg.bookingStatus)}
                        <span className="text-lg font-black text-slate-900 mt-1">₹{bkg.totalAmount.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Payment: {bkg.paymentStatus} ({bkg.paymentMethod})
                        </span>
                      </div>
                    </div>

                    {/* Middle Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                      <div className="flex items-start space-x-2">
                        <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900">Service Slot</p>
                          <p className="mt-0.5">{bkg.date}</p>
                          <p className="text-slate-500 font-medium">{bkg.timeSlot}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900">Service Address</p>
                          <p className="mt-0.5">{bkg.address.flatNo}, {bkg.address.building}</p>
                          <p className="text-slate-500">{bkg.address.area}, {bkg.address.city}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <User className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900">Assigned Crew</p>
                          {bkg.assignedStaffName ? (
                            <>
                              <p className="font-semibold text-slate-800 mt-0.5">{bkg.assignedStaffName}</p>
                              <p className="text-slate-500">{bkg.assignedStaffPhone || 'Assigned Lead'}</p>
                            </>
                          ) : (
                            <p className="text-slate-400 italic mt-0.5">Crew assigning soon...</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Add-ons note if any */}
                    {bkg.addons && bkg.addons.length > 0 && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                        <span className="font-bold text-slate-800">Add-ons Included: </span>
                        {bkg.addons.map((a) => `${a.name} (x${a.quantity})`).join(', ')}
                      </div>
                    )}

                    {/* Bottom Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedInvoiceBooking(bkg)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Tax Invoice</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* If eligible for Reschedule / Cancel */}
                        {['pending', 'confirmed', 'assigned', 'rescheduled'].includes(bkg.bookingStatus) && (
                          <>
                            <button
                              onClick={() => {
                                setRescheduleBookingTarget(bkg);
                                setNewRescheduleDate(bkg.date);
                                setNewRescheduleSlot(bkg.timeSlot);
                              }}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reschedule</span>
                            </button>

                            <button
                              onClick={() => {
                                setCancelBookingTarget(bkg);
                                setCancellationReason('');
                              }}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-600 transition cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          </>
                        )}

                        {/* If completed, allow review */}
                        {bkg.bookingStatus === 'completed' && !bkg.reviewSubmitted && (
                          <button
                            onClick={() => {
                              setReviewBookingTarget(bkg);
                              setReviewRating(5);
                              setReviewComment('');
                            }}
                            className="inline-flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>Rate & Review</span>
                          </button>
                        )}

                        {bkg.bookingStatus === 'completed' && bkg.reviewSubmitted && (
                          <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Review Submitted</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Bookings Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You do not have any bookings in this filter category yet. Book a deep clean today!
                </p>
                <button
                  onClick={() => onOpenBookingModal()}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
                >
                  Book a Service
                </button>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: SAVED ADDRESSES */}
        {activeSubTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Saved Addresses</h2>
                <p className="text-xs text-slate-500">Manage frequently used cleaning locations for rapid 1-click checkout.</p>
              </div>
              <button
                onClick={() => handleOpenAddressModal()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.addresses?.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs">
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Default Address
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 mt-2">{addr.flatNo}, {addr.building}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{addr.address}, {addr.area}</p>
                    <p className="text-xs text-slate-500">{addr.city} - {addr.pincode}</p>
                    {addr.landmark && (
                      <p className="text-[11px] text-slate-400 italic mt-1">Landmark: {addr.landmark}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {!addr.isDefault ? (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-blue-600 font-semibold hover:underline cursor-pointer"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Primary Location</span>
                    )}

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenAddressModal(addr)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                        title="Edit Address"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: PROFILE SETTINGS */}
        {activeSubTab === 'profile' && (
          <div className="max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">Keep your contact info up to date for booking confirmations & WhatsApp updates.</p>
            </div>

            {profileSavedMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (WhatsApp updates)</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Email is tied to your account login and cannot be altered directly.</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          settings={settings}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}

      {/* Reschedule Modal */}
      {rescheduleBookingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reschedule Booking {rescheduleBookingTarget.bookingId}</h3>
            <p className="text-xs text-slate-500">Pick a new date and convenient time slot for our cleaners to visit.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Time Slot</label>
                <select
                  value={newRescheduleSlot}
                  onChange={(e) => setNewRescheduleSlot(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                >
                  {settings.booking.timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleBookingTarget(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelBookingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Cancel Booking {cancelBookingTarget.bookingId}?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to cancel this booking? Free cancellation is allowed without any penalty.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for cancellation (optional)</label>
              <textarea
                rows={3}
                placeholder="e.g. Schedule clash, out of town, booked by mistake..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelBookingTarget(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating & Review Modal */}
      {reviewBookingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Rate Your Cleaning Service</h3>
              <p className="text-xs text-slate-500">{reviewBookingTarget.serviceName} ({reviewBookingTarget.bookingId})</p>
            </div>

            {/* Stars Selector */}
            <div className="flex justify-center space-x-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 transition cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Review & Feedback</label>
              <textarea
                rows={3}
                placeholder="Tell us about the cleaner's punctuality, chemical smell, shine quality..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewBookingTarget(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Add / Edit Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div className="flex space-x-2">
                {(['Home', 'Office', 'Other'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAddrType(t)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      addrType === t ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Flat / Unit No. *"
                  value={addrFlat}
                  onChange={(e) => setAddrFlat(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="Building Name *"
                  value={addrBuilding}
                  onChange={(e) => setAddrBuilding(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Street / Locality *"
                value={addrLine}
                onChange={(e) => setAddrLine(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                required
              />

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Area *"
                  value={addrArea}
                  onChange={(e) => setAddrArea(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="City *"
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="Pincode *"
                  value={addrPincode}
                  onChange={(e) => setAddrPincode(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Landmark (Optional)"
                value={addrLandmark}
                onChange={(e) => setAddrLandmark(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs"
              />

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="addr-default-check"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="addr-default-check" className="text-xs text-slate-700 font-medium">
                  Make this my default address
                </label>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
