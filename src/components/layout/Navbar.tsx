import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Sparkles,
  Menu,
  X,
  User,
  Calendar,
  MapPin,
  LogOut,
  Shield,
  ChevronDown,
  Phone,
  Tag,
  HelpCircle,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  currentPage?: string;
  onNavigate: (tab: string, serviceSlug?: string) => void;
  onOpenBookingModal: (serviceId?: string) => void;
  onOpenAuthModal?: (mode?: 'signin' | 'signup' | 'admin') => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  currentPage,
  onNavigate,
  onOpenBookingModal,
  onOpenAuthModal,
  onOpenAdmin
}) => {
  const current = activeTab || currentPage || 'home';
  const { user, isAdmin, logout } = useAuth();
  const { services, settings, offers } = useData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const activeOffersCount = offers.filter((o) => o.isActive).length;

  const handleAdminClick = () => {
    if (onOpenAdmin) {
      onOpenAdmin();
    } else {
      onNavigate('admin');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-medium text-slate-300">
              ⚡ Instant 2-Hour Cleaning Slot Booking Available • Certified Eco-Friendly
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-slate-400">
            <a
              href={`tel:${settings.business.phone}`}
              className="hover:text-white transition flex items-center space-x-1"
            >
              <Phone className="w-3 h-3 text-blue-400" />
              <span>{settings.business.phone}</span>
            </a>
            <span className="text-slate-600">|</span>
            <button
              onClick={handleAdminClick}
              className="hover:text-blue-400 transition flex items-center space-x-1 text-slate-300 font-semibold cursor-pointer"
            >
              <Shield className="w-3 h-3 text-blue-400" />
              <span>Admin Center</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            id="brand-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md text-white group-hover:scale-105 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">
              Cleaning<span className="text-blue-600">Flash</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              id="nav-home-btn"
              onClick={() => onNavigate('home')}
              className={`transition cursor-pointer ${
                current === 'home'
                  ? 'text-blue-600 font-bold'
                  : 'hover:text-blue-600'
              }`}
            >
              Home
            </button>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                id="nav-services-dropdown-btn"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                className={`transition flex items-center gap-1 cursor-pointer ${
                  current.startsWith('service')
                    ? 'text-blue-600 font-bold'
                    : 'hover:text-blue-600'
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {servicesDropdownOpen && (
                <div
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Our Services</p>
                  </div>
                  <div className="py-1 space-y-0.5">
                    {services.filter((s) => s.isActive).map((srv) => (
                      <button
                        key={srv.id}
                        onClick={() => {
                          onNavigate('service_detail', srv.id);
                          setServicesDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-blue-50 hover:text-blue-700 transition flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <p className="font-semibold text-slate-800 group-hover:text-blue-700">{srv.name}</p>
                          <p className="text-[10px] text-slate-400">Starts ₹{srv.startingPrice}</p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-600 transition" />
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onNavigate('home');
                        setServicesDropdownOpen(false);
                        const el = document.getElementById('services-catalog');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full text-center py-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      View All Services & Packages →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              id="nav-offers-btn"
              onClick={() => onNavigate('offers')}
              className={`transition flex items-center gap-1.5 cursor-pointer ${
                current === 'offers'
                  ? 'text-blue-600 font-bold'
                  : 'hover:text-blue-600'
              }`}
            >
              <span>Offers</span>
              {activeOffersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  {activeOffersCount}
                </span>
              )}
            </button>

            <button
              id="nav-about-btn"
              onClick={() => onNavigate('about')}
              className={`transition cursor-pointer ${
                current === 'about'
                  ? 'text-blue-600 font-bold'
                  : 'hover:text-blue-600'
              }`}
            >
              About
            </button>

            <button
              id="nav-contact-btn"
              onClick={() => onNavigate('contact')}
              className={`transition cursor-pointer ${
                current === 'contact'
                  ? 'text-blue-600 font-bold'
                  : 'hover:text-blue-600'
              }`}
            >
              Contact
            </button>

            <button
              id="nav-faq-btn"
              onClick={() => onNavigate('faq')}
              className={`transition cursor-pointer ${
                current === 'faq'
                  ? 'text-blue-600 font-bold'
                  : 'hover:text-blue-600'
              }`}
            >
              FAQ
            </button>
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition border border-slate-200 cursor-pointer"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="hidden sm:block text-left pr-1">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{user.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => {
                          onNavigate('portal', 'bookings');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 text-slate-700 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>My Bookings</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('portal', 'addresses');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 text-slate-700 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Saved Addresses</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('portal', 'profile');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 text-slate-700 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-blue-600" />
                        <span>Profile & Settings</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            handleAdminClick();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center space-x-2 cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span>Admin Center</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="login-header-btn"
                onClick={() => onOpenAuthModal ? onOpenAuthModal('signin') : null}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition cursor-pointer"
              >
                Login
              </button>
            )}

            {/* Main CTA: Book a Service */}
            <button
              id="header-book-service-btn"
              onClick={() => onOpenBookingModal()}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 transition cursor-pointer"
            >
              Book a Service
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150 shadow-xl">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
              const el = document.getElementById('services-catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            All Services
          </button>
          <button
            onClick={() => {
              onNavigate('offers');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between"
          >
            <span>Offers & Coupons</span>
            {activeOffersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                {activeOffersCount} Active
              </span>
            )}
          </button>
          <button
            onClick={() => {
              onNavigate('about');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            About Cleaning Flash
          </button>
          <button
            onClick={() => {
              onNavigate('contact');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Contact & Support
          </button>
          <button
            onClick={() => {
              onNavigate('faq');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            FAQs
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            <button
              onClick={() => {
                handleAdminClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Admin Management Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
