import React, { useState } from 'react';
import { WebsiteSettings, ServiceCategory } from '../../types';
import { Sparkles, ArrowRight, Home, Building2, Sparkle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface HeroSectionProps {
  settings: WebsiteSettings;
  categories?: ServiceCategory[];
  onOpenBookingModal: (serviceId?: string) => void;
  onNavigate?: (tab: string, serviceSlug?: string) => void;
  onSelectCategory: (categoryId: string) => void;
  selectedCategory?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onOpenBookingModal,
  onSelectCategory,
}) => {
  const { services } = useData();

  // Instant Quote Card State
  const [selectedType, setSelectedType] = useState<'residential' | 'commercial'>('residential');
  const [selectedPackagePrice, setSelectedPackagePrice] = useState<number>(3499);
  const [selectedServiceName, setSelectedServiceName] = useState<string>('3 BHK Deep Clean');
  const [targetServiceId, setTargetServiceId] = useState<string>('srv-1');
  const [bookingDate, setBookingDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [bookingTime, setBookingTime] = useState<string>('10:00 AM');

  const residentialPackages = [
    { id: 'srv-1', name: '1 BHK Deep Clean', price: 1999 },
    { id: 'srv-1', name: '2 BHK Deep Clean', price: 2499 },
    { id: 'srv-1', name: '3 BHK Deep Clean', price: 3499 },
    { id: 'srv-4', name: 'Sofa & Fabric Spa', price: 899 },
    { id: 'srv-1', name: 'Villa / Custom Clean', price: 5499 }
  ];

  const commercialPackages = [
    { id: 'srv-5', name: 'Office Standard Clean (Up to 1000 sq ft)', price: 3999 },
    { id: 'srv-5', name: 'Commercial Full Deep Clean (2500 sq ft)', price: 6999 },
    { id: 'srv-5', name: 'Retail / Clinic Sanitization', price: 4499 }
  ];

  const currentPackages = selectedType === 'residential' ? residentialPackages : commercialPackages;

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkgName = e.target.value;
    const found = currentPackages.find((p) => p.name === pkgName);
    if (found) {
      setSelectedPackagePrice(found.price);
      setSelectedServiceName(found.name);
      setTargetServiceId(found.id);
    }
  };

  const handleTypeToggle = (type: 'residential' | 'commercial') => {
    setSelectedType(type);
    if (type === 'residential') {
      setSelectedPackagePrice(3499);
      setSelectedServiceName('3 BHK Deep Clean');
      setTargetServiceId('srv-1');
    } else {
      setSelectedPackagePrice(3999);
      setSelectedServiceName('Office Standard Clean (Up to 1000 sq ft)');
      setTargetServiceId('srv-5');
    }
  };

  const handleQuickBook = () => {
    // Find matching real service if available
    const matchedService = services.find((s) => s.id === targetServiceId) || services[0];
    onOpenBookingModal(matchedService?.id);
  };

  return (
    <section className="bg-slate-50 pt-8 pb-16 lg:pt-12 lg:pb-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Heading, Badges, CTAs, Feature Grid */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div>
              {/* Trust Tag */}
              <span className="px-3.5 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider inline-block">
                Professional. Fast. Reliable.
              </span>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 mt-6 tracking-tight">
                Professional Cleaning<br />
                <span className="text-blue-600">at Your Doorstep</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 mt-6 max-w-xl leading-relaxed">
                Reliable home and commercial cleaning services delivered by trained professionals with certified eco-friendly products and hospital-grade equipment.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <button
                  id="hero-explore-services-btn"
                  onClick={() => {
                    const el = document.getElementById('services-catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-200 flex items-center gap-2 hover:bg-blue-700 transition cursor-pointer"
                >
                  <span>Explore Services</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>

                <button
                  id="hero-watch-demo-btn"
                  onClick={() => onOpenBookingModal()}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  Instant Estimate
                </button>
              </div>
            </div>

            {/* 3-Card Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-50 rounded-xl mb-4 flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 mb-1 text-sm">Home Deep Clean</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Full sanitization and deep interior scrubbing.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-50 rounded-xl mb-4 flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 mb-1 text-sm">Office Space</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Professional commercial hygiene solutions.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-50 rounded-xl mb-4 flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 mb-1 text-sm">Expert Care</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Furniture, upholstery and delicate fabrics.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Booking Estimation Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="w-full bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col h-full justify-between overflow-hidden">
              {/* Card Header */}
              <div className="p-6 sm:p-8 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800">Book Your Service</h2>
                <p className="text-sm text-slate-500 mt-1">Instant quote based on your needs</p>
              </div>

              {/* Card Form Body */}
              <div className="p-6 sm:p-8 flex-grow flex flex-col gap-6">
                {/* Category Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Select Category
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleTypeToggle('residential')}
                      className={`p-4 rounded-xl text-left transition cursor-pointer ${
                        selectedType === 'residential'
                          ? 'border-2 border-blue-600 bg-blue-50'
                          : 'border border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <p className={`text-sm font-bold ${selectedType === 'residential' ? 'text-blue-700' : 'text-slate-700'}`}>
                        Residential
                      </p>
                      <p className={`text-[10px] ${selectedType === 'residential' ? 'text-blue-500' : 'text-slate-400'}`}>
                        Home & Apartments
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTypeToggle('commercial')}
                      className={`p-4 rounded-xl text-left transition cursor-pointer ${
                        selectedType === 'commercial'
                          ? 'border-2 border-blue-600 bg-blue-50'
                          : 'border border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <p className={`text-sm font-bold ${selectedType === 'commercial' ? 'text-blue-700' : 'text-slate-700'}`}>
                        Commercial
                      </p>
                      <p className={`text-[10px] ${selectedType === 'commercial' ? 'text-blue-500' : 'text-slate-400'}`}>
                        Office & Shops
                      </p>
                    </button>
                  </div>
                </div>

                {/* Package Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Select Package
                  </label>
                  <select
                    value={selectedServiceName}
                    onChange={handlePackageChange}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
                  >
                    {currentPackages.map((pkg) => (
                      <option key={pkg.name} value={pkg.name}>
                        {pkg.name} — ₹{pkg.price.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time Slot */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Date & Preferred Time
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="flex-grow p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
                    />
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-36 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dark Summary Footer Band */}
              <div className="p-6 sm:p-8 bg-slate-900 rounded-b-3xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Total Estimate</p>
                    <p className="text-white text-3xl font-bold">₹{selectedPackagePrice.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    <p className="text-green-400 text-[10px] font-bold uppercase">Save 15% Today</p>
                  </div>
                </div>
                <button
                  id="hero-confirm-booking-btn"
                  onClick={handleQuickBook}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Confirm Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

