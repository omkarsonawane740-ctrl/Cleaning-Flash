import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Booking, BookingStatus, PaymentStatus, PaymentMethod } from '../../types';
import { InvoiceModal } from '../common/InvoiceModal';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  CheckCircle2,
  X,
  Edit2,
  RotateCcw,
  Sparkles,
  Download,
  Phone
} from 'lucide-react';

interface AdminBookingsProps {
  initialSelectedBooking?: Booking | null;
}

export const AdminBookings: React.FC<AdminBookingsProps> = ({ initialSelectedBooking }) => {
  const {
    bookings,
    staff,
    settings,
    updateBookingStatus,
    assignStaffToBooking,
    updatePaymentStatus,
    rescheduleBooking,
    cancelBooking,
    addBookingInternalNotes
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(initialSelectedBooking || null);
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);

  // Status & Assignment form states inside modal
  const [assignedStaffId, setAssignedStaffId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('pending');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [rescheduleDate, setNewRescheduleDate] = useState<string>('');
  const [rescheduleSlot, setNewRescheduleSlot] = useState<string>('10 AM - 12 PM');
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);

  const handleOpenBookingDetails = (bkg: Booking) => {
    setSelectedBooking(bkg);
    setAssignedStaffId(bkg.assignedStaffId || '');
    setSelectedStatus(bkg.bookingStatus);
    setInternalNotes(bkg.adminNotes || '');
    setNewRescheduleDate(bkg.date);
    setNewRescheduleSlot(bkg.timeSlot);
    setIsRescheduling(false);
  };

  const handleSaveStaffAssignment = async () => {
    if (!selectedBooking || !assignedStaffId) return;
    await assignStaffToBooking(selectedBooking.id, assignedStaffId);
    const updated = bookings.find((b) => b.id === selectedBooking.id);
    if (updated) setSelectedBooking(updated);
  };

  const handleSaveStatus = async () => {
    if (!selectedBooking) return;
    await updateBookingStatus(selectedBooking.id, selectedStatus, internalNotes);
    const updated = bookings.find((b) => b.id === selectedBooking.id);
    if (updated) setSelectedBooking(updated);
  };

  const handleSavePaymentStatus = async (status: PaymentStatus) => {
    if (!selectedBooking) return;
    await updatePaymentStatus(selectedBooking.id, status);
    const updated = bookings.find((b) => b.id === selectedBooking.id);
    if (updated) setSelectedBooking(updated);
  };

  const handleConfirmReschedule = async () => {
    if (!selectedBooking || !rescheduleDate || !rescheduleSlot) return;
    await rescheduleBooking(selectedBooking.id, rescheduleDate, rescheduleSlot);
    setIsRescheduling(false);
    const updated = bookings.find((b) => b.id === selectedBooking.id);
    if (updated) setSelectedBooking(updated);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      b.bookingId.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.customerMobile.includes(q) ||
      b.serviceName.toLowerCase().includes(q) ||
      b.address.area.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">Completed</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 animate-pulse">In Progress</span>;
      case 'on_the_way':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">On The Way</span>;
      case 'assigned':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800">Assigned</span>;
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">Confirmed</span>;
      case 'rescheduled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">Rescheduled</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800">Pending</span>;
    }
  };

  const exportCSV = () => {
    const headers = ['Booking ID', 'Customer', 'Mobile', 'Service', 'Package', 'Date', 'Time Slot', 'Area', 'Total', 'Payment Status', 'Booking Status', 'Cleaner'];
    const rows = filteredBookings.map((b) => [
      b.bookingId,
      `"${b.customerName}"`,
      b.customerMobile,
      `"${b.serviceName}"`,
      `"${b.packageName}"`,
      b.date,
      b.timeSlot,
      `"${b.address.area}"`,
      b.totalAmount,
      b.paymentStatus,
      b.bookingStatus,
      `"${b.assignedStaffName || 'Unassigned'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CleaningFlash_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Bookings Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor, assign staff, reschedule, and manage statuses for all customer orders in real time.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs transition cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by ID (CF-XXXX), customer, phone, area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Status filters pills */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'assigned', label: 'Assigned' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Service & Package</th>
                <th className="py-3 px-4">Slot & Location</th>
                <th className="py-3 px-4">Cleaner Assigned</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((bkg) => (
                  <tr
                    key={bkg.id}
                    className="hover:bg-blue-50/40 transition cursor-pointer"
                    onClick={() => handleOpenBookingDetails(bkg)}
                  >
                    <td className="py-3.5 px-4 font-bold text-blue-600">
                      {bkg.bookingId}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{bkg.customerName}</p>
                      <p className="text-[11px] text-slate-500">{bkg.customerMobile}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{bkg.serviceName}</p>
                      <p className="text-[11px] text-blue-600">{bkg.packageName}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{bkg.date}</p>
                      <p className="text-[11px] text-slate-500">{bkg.timeSlot} • {bkg.address.area}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      {bkg.assignedStaffName ? (
                        <div className="flex items-center space-x-1 text-slate-800 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{bkg.assignedStaffName}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <p className="font-bold text-slate-900">₹{bkg.totalAmount.toLocaleString()}</p>
                      <span className={`text-[10px] uppercase font-semibold ${bkg.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {bkg.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(bkg.bookingStatus)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBookingDetails(bkg);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No bookings found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Management Drawer / Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-base font-bold bg-blue-600 px-3 py-1 rounded-xl">
                  {selectedBooking.bookingId}
                </span>
                <div>
                  <h3 className="text-base font-bold">{selectedBooking.serviceName}</h3>
                  <p className="text-xs text-slate-400">Created {new Date(selectedBooking.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setInvoiceBooking(selectedBooking)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400 mb-1">
                    Customer Information
                  </h4>
                  <p className="font-bold text-slate-900 text-sm">{selectedBooking.customerName}</p>
                  <p className="text-slate-600 mt-0.5">{selectedBooking.customerMobile}</p>
                  <p className="text-slate-600">{selectedBooking.customerEmail}</p>
                  {selectedBooking.customerNotes && (
                    <p className="text-amber-800 bg-amber-50 p-2 rounded-lg mt-2 border border-amber-200">
                      <strong>Customer Note:</strong> {selectedBooking.customerNotes}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400 mb-1">
                    Service Location
                  </h4>
                  <p className="font-semibold text-slate-800">
                    {selectedBooking.address.flatNo}, {selectedBooking.address.building}
                  </p>
                  <p className="text-slate-600">{selectedBooking.address.address}, {selectedBooking.address.area}</p>
                  <p className="text-slate-600">{selectedBooking.address.city} - {selectedBooking.address.pincode}</p>
                  {selectedBooking.address.landmark && (
                    <p className="text-slate-400 italic">Landmark: {selectedBooking.address.landmark}</p>
                  )}
                </div>
              </div>

              {/* Action 1: Assign Cleaning Staff */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Assign Cleaning Crew Leader</span>
                  </h4>
                  {selectedBooking.assignedStaffName && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Current: {selectedBooking.assignedStaffName}</span>
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <select
                    value={assignedStaffId}
                    onChange={(e) => setAssignedStaffId(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Staff Member --</option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.staffId}) • {s.specialization.join(', ')} • Rating {s.rating}★
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleSaveStaffAssignment}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Assign Staff
                  </button>
                </div>
              </div>

              {/* Action 2: Update Status & Internal Notes */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-bold text-sm text-slate-900">Update Booking Status & Operational Notes</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Booking Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as BookingStatus)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="assigned">Assigned</option>
                      <option value="on_the_way">On The Way</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Status</label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleSavePaymentStatus('paid')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          selectedBooking.paymentStatus === 'paid'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Paid
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSavePaymentStatus('pending')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          selectedBooking.paymentStatus === 'pending'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Pending
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Internal Admin Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Add internal notes for crew, chemical requirements, payment reminders..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveStatus}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Save Status & Notes
                  </button>
                </div>
              </div>

              {/* Action 3: Reschedule Slot */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Reschedule Service Slot</h4>
                    <p className="text-xs text-slate-500">Current: {selectedBooking.date} ({selectedBooking.timeSlot})</p>
                  </div>
                  <button
                    onClick={() => setIsRescheduling(!isRescheduling)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    {isRescheduling ? 'Cancel' : 'Change Slot'}
                  </button>
                </div>

                {isRescheduling && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setNewRescheduleDate(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <select
                        value={rescheduleSlot}
                        onChange={(e) => setNewRescheduleSlot(e.target.value)}
                        className="flex-1 p-2 rounded-xl border border-slate-200 text-xs"
                      >
                        {settings.booking.timeSlots.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button
                        onClick={handleConfirmReschedule}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice */}
      {invoiceBooking && (
        <InvoiceModal
          booking={invoiceBooking}
          settings={settings}
          onClose={() => setInvoiceBooking(null)}
        />
      )}
    </div>
  );
};
