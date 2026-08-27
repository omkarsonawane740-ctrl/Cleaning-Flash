import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { AdminRole } from '../../types';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Users,
  Tag,
  Star,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Settings,
  Bell,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';

import { AdminDashboard } from './AdminDashboard';
import { AdminBookings } from './AdminBookings';
import { AdminServices } from './AdminServices';
import { AdminStaff } from './AdminStaff';
import { AdminCoupons } from './AdminCoupons';
import { AdminReviews } from './AdminReviews';
import { AdminInquiries } from './AdminInquiries';
import { AdminReports } from './AdminReports';
import { AdminAuditLogs } from './AdminAuditLogs';
import { AdminSettings } from './AdminSettings';
import { Booking } from '../../types';

interface AdminLayoutProps {
  onReturnToCustomerSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onReturnToCustomerSite }) => {
  const { user, role, switchAdminRoleForTesting, logout } = useAuth();
  const { bookings, contactMessages, reviews, notifications, markNotificationRead } = useData();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const pendingBookingsCount = bookings.filter(
    (b) => b.bookingStatus === 'pending' || (b.bookingStatus === 'confirmed' && !b.assignedStaffId)
  ).length;

  const newInquiriesCount = contactMessages.filter((m) => m.status === 'new').length;
  const pendingReviewsCount = reviews.filter((r) => !r.isApproved).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings Management', icon: Calendar, badge: pendingBookingsCount },
    { id: 'services', label: 'Services & Pricing', icon: Layers },
    { id: 'staff', label: 'Cleaning Staff Roster', icon: Users },
    { id: 'coupons', label: 'Coupons & Deals', icon: Tag },
    { id: 'reviews', label: 'Customer Reviews', icon: Star, badge: pendingReviewsCount },
    { id: 'inquiries', label: 'Inquiries & Callbacks', icon: MessageSquare, badge: newInquiriesCount },
    { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
    { id: 'audit', label: 'Audit Trail Logs', icon: ShieldCheck },
    { id: 'settings', label: 'Platform Settings', icon: Settings }
  ];

  const handleSelectBookingFromDashboard = (bkg: Booking) => {
    setSelectedBookingForDetails(bkg);
    setActiveTab('bookings');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight">Cleaning Flash</span>
              <span className="block text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                Admin Center
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1 text-slate-400 hover:text-white md:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-blue-700' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile & Back to Customer Site */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <button
            onClick={onReturnToCustomerSite}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>View Customer Site</span>
          </button>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center font-bold text-xs">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate max-w-[100px]">
                <p className="font-bold text-xs text-white truncate">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-slate-400 capitalize">{role.replace('_', ' ')}</p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 md:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">Admin Control</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{activeTab.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Right Header Controls: Role Switcher & Notifications */}
          <div className="flex items-center space-x-3">
            {/* Live Role Switcher (Simulate Super Admin, Operations Manager, Booking Executive, Accounts) */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] text-slate-500 font-medium">Test Role:</span>
              <select
                value={role}
                onChange={(e) => switchAdminRoleForTesting(e.target.value as AdminRole)}
                className="bg-transparent font-bold text-xs text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="super_admin">Super Admin</option>
                <option value="manager">Operations Manager</option>
                <option value="booking_executive">Booking Executive</option>
                <option value="accounts">Accountant</option>
              </select>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-900">System Notifications</span>
                    <span className="text-[10px] text-blue-600 font-semibold">{unreadNotificationsCount} Unread</span>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 text-xs divide-y divide-slate-100">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`pt-2 first:pt-0 cursor-pointer space-y-0.5 ${!n.read ? 'font-semibold text-slate-900' : 'text-slate-500'}`}
                        >
                          <p className="text-[11px] leading-tight">{n.title}</p>
                          <p className="text-[10px] text-slate-400">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-slate-400 py-4 text-xs">No notifications.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onReturnToCustomerSite}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition cursor-pointer flex items-center space-x-1"
            >
              <span>Customer Site</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectBooking={handleSelectBookingFromDashboard}
            />
          )}

          {activeTab === 'bookings' && (
            <AdminBookings initialSelectedBooking={selectedBookingForDetails} />
          )}

          {activeTab === 'services' && <AdminServices />}

          {activeTab === 'staff' && <AdminStaff />}

          {activeTab === 'coupons' && <AdminCoupons />}

          {activeTab === 'reviews' && <AdminReviews />}

          {activeTab === 'inquiries' && <AdminInquiries />}

          {activeTab === 'reports' && <AdminReports />}

          {activeTab === 'audit' && <AdminAuditLogs />}

          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};
