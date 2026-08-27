import React from 'react';
import { WebsiteSettings, Service } from '../../types';
import { Sparkles, Phone, Mail, MapPin, Clock, ShieldCheck, ArrowUp } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface FooterProps {
  settings?: WebsiteSettings;
  services?: Service[];
  currentPage?: string;
  onNavigate: (tab: string, serviceSlug?: string) => void;
  onOpenBookingModal: (serviceId?: string) => void;
  onOpenAuthModal?: (mode?: 'signin' | 'signup' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings: propSettings,
  services: propServices,
  onNavigate,
  onOpenBookingModal
}) => {
  const { settings: contextSettings, services: contextServices } = useData();
  const settings = propSettings || contextSettings;
  const services = propServices || contextServices;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Main Dark Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
            {/* Col 1 & 2: Brand & About */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">
                  Cleaning<span className="text-blue-500">Flash</span>
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                {settings.footer.aboutText}
              </p>

              <div className="space-y-2 text-xs text-slate-400 pt-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{settings.business.address}, {settings.business.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                  <a href={`tel:${settings.business.phone}`} className="hover:text-white transition">
                    {settings.business.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                  <a href={`mailto:${settings.business.email}`} className="hover:text-white transition">
                    {settings.business.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{settings.business.workingHours}</span>
                </div>
              </div>
            </div>

            {/* Col 3: Cleaning Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Our Services</h4>
              <ul className="space-y-2 text-xs">
                {services.slice(0, 5).map((srv) => (
                  <li key={srv.id}>
                    <button
                      onClick={() => onNavigate('service_detail', srv.id)}
                      className="hover:text-white hover:underline transition cursor-pointer text-left"
                    >
                      {srv.name}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => {
                      onNavigate('home');
                      const el = document.getElementById('services-catalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    View All Services →
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onNavigate('about')} className="hover:text-white transition cursor-pointer">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('offers')} className="hover:text-white transition cursor-pointer">
                    Coupons & Offers
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact')} className="hover:text-white transition cursor-pointer">
                    Contact Support
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('faq')} className="hover:text-white transition cursor-pointer">
                    Frequently Asked Questions
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('portal')} className="hover:text-white transition cursor-pointer">
                    Customer Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 5: Trust & Guarantee */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quality Promise</h4>
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Satisfaction</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  If you are not delighted with any area cleaned, we will re-clean it within 24 hours at no extra charge.
                </p>
              </div>

              <button
                onClick={() => onOpenBookingModal()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition cursor-pointer"
              >
                Book Service Now
              </button>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>{settings.footer.copyrightText}</p>

            <div className="flex items-center gap-4">
              <span>Hospital-grade hygiene & ISO compliance standards</span>
              <button
                onClick={scrollToTop}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Live Status Sub-Footer */}
      <div className="border-t border-slate-200 bg-white px-4 sm:px-10 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-medium gap-2">
        <div className="flex items-center gap-6">
          <span>&copy; {new Date().getFullYear()} Cleaning Flash Inc.</span>
          <button onClick={() => onNavigate('about')} className="hover:text-blue-600 transition cursor-pointer">Privacy Policy</button>
          <button onClick={() => onNavigate('about')} className="hover:text-blue-600 transition cursor-pointer">Terms of Service</button>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Booking Slots Available</span>
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span>Contact: {settings.business.phone}</span>
        </div>
      </div>
    </div>
  );
};

