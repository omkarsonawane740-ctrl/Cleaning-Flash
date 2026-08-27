import React from 'react';
import { WebsiteSettings } from '../../types';
import { Sparkles, ShieldCheck, HeartHandshake, Award, Users, CheckCircle2, Zap } from 'lucide-react';

interface AboutPageProps {
  settings: WebsiteSettings;
  onOpenBookingModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onOpenBookingModal }) => {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Crafting Spotless Sanctuaries Since 2019</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            About Cleaning Flash
          </h1>

          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We are Pune's leading professional cleaning partner, bringing industrial-grade hygiene, certified crews, and non-toxic eco-safe cleaning to modern homes and workspaces.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* Story & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Our Mission</span>
            <h2 className="text-2xl font-black text-slate-900">Setting the Highest Standard for Home & Facility Hygiene</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cleaning Flash was founded with a singular ambition: eliminate the uncertainty, unpunctuality, and inconsistent quality of traditional maid services. We introduced hospital-grade chemical standards (Diversey/Taski), mechanized scrubbing machinery, and rigorously trained, background-verified specialists.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Whether preparing a home for a new family moving in, restoring post-renovation luster, or maintaining a high-traffic corporate office, our team treats every square inch with scientific precision.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 aspect-16/10">
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
              alt="Cleaning Flash Team at work"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Why Choose Us</span>
            <h2 className="text-2xl font-black text-slate-900">The Cleaning Flash Distinction</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">100% In-House Staff</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No third-party gig workers. All cleaners are full-time employees vetted with police verification and identity checks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Eco-Safe Chemicals</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Biodegradable, pet-friendly, baby-safe detergents that eliminate stubborn limescale and grime without toxic fumes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Industrial Equipment</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Single disc rotary floor polishers, HEPA extraction vacuums, and high-pressure steam sanitizers for deep extraction.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Re-Clean Guarantee</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                If you are unsatisfied with any cleaned area, notify us within 24 hours and we will re-clean it completely free.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="rounded-3xl p-8 sm:p-12 bg-blue-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black">Experience the Cleaning Flash Sparkle Today</h3>
            <p className="text-xs text-blue-100 max-w-lg">
              Book a residential or commercial deep clean in less than 60 seconds with live slot availability.
            </p>
          </div>
          <button
            onClick={() => onOpenBookingModal()}
            className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-blue-600 font-extrabold text-xs shadow-md transition cursor-pointer"
          >
            Book a Service Now
          </button>
        </div>
      </div>
    </div>
  );
};
