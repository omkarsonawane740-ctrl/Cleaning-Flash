import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Booking, BookingStatus } from '../../types';
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Tag
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onSelectBooking: (booking: Booking) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab, onSelectBooking }) => {
  const { bookings, services, staff, coupons, auditLogs } = useData();
  const { user, role } = useAuth();

  const totalBookings = bookings.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter((b) => b.date === todayStr);

  const pendingAssignments = bookings.filter(
    (b) => b.bookingStatus === 'pending' || (b.bookingStatus === 'confirmed' && !b.assignedStaffId)
  );

  const activeInProg = bookings.filter(
    (b) => b.bookingStatus === 'in_progress' || b.bookingStatus === 'on_the_way' || b.bookingStatus === 'assigned'
  );

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid' || b.bookingStatus === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const availableStaff = staff.filter((s) => s.isAvailable);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">Completed</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 animate-pulse">In Progress</span>;
      case 'assigned':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-800">Assigned</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">Cancelled</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">Needs Assignment</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 capitalize">
              Role: {role.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400">• Cleaning Flash Control Center</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Operations Overview</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateTab('bookings')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            Manage All Bookings ({totalBookings})
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">From completed & paid cleanings</p>
          </div>
        </div>

        {/* Card 2: Today's Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Today</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{todayBookings.length}</p>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">{activeInProg.length} currently active on field</p>
          </div>
        </div>

        {/* Card 3: Pending Cleaner Assignments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unassigned Jobs</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-amber-600">{pendingAssignments.length}</p>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">Require crew dispatch</p>
          </div>
        </div>

        {/* Card 4: Active Cleaners */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Crew On Duty</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{availableStaff.length} / {staff.length}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Verified cleaning staff</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Unassigned / Live Jobs & Quick Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Recent Bookings needing action */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Customer Bookings</h2>
              <p className="text-xs text-slate-500">Live incoming jobs from website</p>
            </div>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>View Table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
            {bookings.slice(0, 6).map((bkg) => (
              <div
                key={bkg.id}
                onClick={() => onSelectBooking(bkg)}
                className="p-4 hover:bg-blue-50/40 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {bkg.bookingId.replace('CF-', '')}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-xs text-slate-900">{bkg.customerName}</h4>
                      <span className="text-[10px] text-slate-400">{bkg.customerMobile}</span>
                    </div>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">
                      {bkg.serviceName} ({bkg.packageName})
                    </p>
                    <p className="text-[11px] text-slate-500">
                      📅 {bkg.date} • {bkg.timeSlot} • {bkg.address.area}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                  {getStatusBadge(bkg.bookingStatus)}
                  <span className="text-xs font-black text-slate-900 mt-1">₹{bkg.totalAmount.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400">
                    {bkg.assignedStaffName ? `Cleaner: ${bkg.assignedStaffName}` : 'No cleaner assigned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Quick Actions & Audit Trail */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Management Shortcuts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Quick Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab('services')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold border border-slate-200/80 transition text-left cursor-pointer"
              >
                🛠️ Services & Prices
              </button>
              <button
                onClick={() => onNavigateTab('staff')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold border border-slate-200/80 transition text-left cursor-pointer"
              >
                👥 Staff Roster
              </button>
              <button
                onClick={() => onNavigateTab('coupons')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold border border-slate-200/80 transition text-left cursor-pointer"
              >
                🏷️ Coupons & Deals
              </button>
              <button
                onClick={() => onNavigateTab('reports')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold border border-slate-200/80 transition text-left cursor-pointer"
              >
                📊 Financial Reports
              </button>
            </div>
          </div>

          {/* Recent Audit Logs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Audit Trail</h3>
              <button
                onClick={() => onNavigateTab('audit')}
                className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                All Logs
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 divide-y divide-slate-100">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="pt-2 first:pt-0 space-y-0.5">
                  <p className="font-semibold text-slate-800 text-[11px] leading-tight">{log.action}</p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.module}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
