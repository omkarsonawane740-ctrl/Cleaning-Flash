import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/customer/HeroSection';
import { ServiceCard } from './components/customer/ServiceCard';
import { ServiceDetailPage } from './components/customer/ServiceDetailPage';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { OffersPage } from './components/customer/OffersPage';
import { AboutPage } from './components/customer/AboutPage';
import { ContactPage } from './components/customer/ContactPage';
import { FAQSection } from './components/customer/FAQSection';
import { BookingModal } from './components/customer/BookingModal';
import { AuthModal } from './components/customer/AuthModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { Service } from './types';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  Star,
  CheckCircle2,
  Phone,
  Search,
  ArrowRight,
  Zap,
  Clock
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { user, isAdmin, role } = useAuth();
  const { services, categories, reviews, settings } = useData();

  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Modals State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [initialBookingServiceId, setInitialBookingServiceId] = useState<string | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'admin'>('signin');

  // Home Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedServiceId]);

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setCurrentPage('service_detail');
  };

  const handleOpenBooking = (serviceId?: string) => {
    setInitialBookingServiceId(serviceId);
    setIsBookingModalOpen(true);
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' | 'admin' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // If viewing admin panel
  if (currentPage === 'admin') {
    return <AdminLayout onReturnToCustomerSite={() => setCurrentPage('home')} />;
  }

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  const filteredServices = services.filter((srv) => {
    const matchesCat = selectedCategory === 'all' || srv.categoryId === selectedCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const approvedReviews = reviews.filter((r) => r.isApproved);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onOpenBookingModal={() => handleOpenBooking()}
        onOpenAuthModal={(mode) => handleOpenAuth(mode)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {/* PAGE 1: HOME */}
        {currentPage === 'home' && (
          <div className="space-y-16 pb-20">
            {/* Hero Section */}
            <HeroSection
              settings={settings}
              onOpenBookingModal={(serviceId) => handleOpenBooking(serviceId)}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                const el = document.getElementById('services-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Services Catalog & Category Filter Section */}
            <section id="services-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Transparent Fixed Pricing</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Professional Cleaning Services
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Select your space type. Every appointment includes certified staff, mechanized equipment, and hospital-grade non-toxic chemicals.
                </p>

                {/* Live Search Bar */}
                <div className="pt-2 relative max-w-md mx-auto">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5" />
                  <input
                    type="text"
                    placeholder="Search services (e.g. 2 BHK, Sofa, Kitchen, Carpet)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs bg-white shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  All Services
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onSelect={(s) => handleSelectService(s.id)}
                    onBookNow={(s) => handleOpenBooking(s.id)}
                  />
                ))}
              </div>
            </section>

            {/* Why Choose Cleaning Flash Section */}
            <section className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">The Cleaning Flash Standard</span>
                  <h2 className="text-3xl font-black text-slate-900">Why Over 15,000+ Homes Trust Us</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">100% Background-Verified</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Every crew specialist is a permanent employee with police clearance and rigorous 80-hour training.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Diversey Safe Chemistry</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Hospital-standard, eco-friendly detergents safe for toddlers, elderly family members, and pets.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Punctual Slot Guarantee</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Guaranteed on-time arrival with real-time status updates and live dispatch tracking.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Free Re-Clean Promise</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Not 100% happy with any corner? We re-scrub that spot within 24 hours at zero extra charge.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Customer Reviews Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Real Verified Feedback</span>
                  <h2 className="text-3xl font-black text-slate-900 mt-1">What Our Customers Say</h2>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-black text-slate-900 text-sm">4.9 / 5.0</span>
                  </div>
                  <span className="text-xs text-slate-400">• Based on 1,450+ reviews</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">"{rev.comment}"</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{rev.customerName}</h4>
                        <p className="text-[11px] text-blue-600 font-semibold">{rev.serviceName}</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Verified Booking
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom Booking CTA Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2 text-center md:text-left max-w-xl">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900 inline-block">
                    ⚡ 60-Second Instant Booking
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black">Ready for a Spotless, Pristine Space?</h3>
                  <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                    Book certified cleaning professionals today. Instant slots available with flexible payment options.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleOpenBooking()}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-black text-xs shadow-md transition cursor-pointer"
                  >
                    Book a Service Now
                  </button>
                  <a
                    href={`tel:${settings.business.phone}`}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-xs border border-blue-400/40 transition text-center flex items-center justify-center space-x-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Support</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PAGE 2: SERVICE DETAIL */}
        {currentPage === 'service_detail' && (
          <ServiceDetailPage
            service={selectedService}
            onOpenBookingModal={(serviceId) => handleOpenBooking(serviceId)}
            onBack={() => setCurrentPage('home')}
          />
        )}

        {/* PAGE 3: CUSTOMER PORTAL */}
        {currentPage === 'portal' && (
          <CustomerPortal
            onOpenBookingModal={() => handleOpenBooking()}
            onOpenAuthModal={() => handleOpenAuth('signin')}
          />
        )}

        {/* PAGE 4: OFFERS & COUPONS */}
        {currentPage === 'offers' && (
          <OffersPage onOpenBookingModal={(serviceId) => handleOpenBooking(serviceId)} />
        )}

        {/* PAGE 5: ABOUT */}
        {currentPage === 'about' && (
          <AboutPage settings={settings} onOpenBookingModal={() => handleOpenBooking()} />
        )}

        {/* PAGE 6: CONTACT */}
        {currentPage === 'contact' && (
          <ContactPage settings={settings} />
        )}

        {/* PAGE 7: FAQ */}
        {currentPage === 'faq' && (
          <FAQSection onOpenBookingModal={() => handleOpenBooking()} />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onOpenBookingModal={() => handleOpenBooking()}
        onOpenAuthModal={(mode) => handleOpenAuth(mode)}
      />

      {/* 4-Step Global Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          initialServiceId={initialBookingServiceId}
          onClose={() => setIsBookingModalOpen(false)}
          onViewBookings={() => {
            setIsBookingModalOpen(false);
            setCurrentPage('portal');
          }}
        />
      )}

      {/* Global Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccessAdmin={() => {
            setIsAuthModalOpen(false);
            setCurrentPage('admin');
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainAppContent />
      </DataProvider>
    </AuthProvider>
  );
}
