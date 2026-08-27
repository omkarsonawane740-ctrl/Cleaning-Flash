import React, { useState } from 'react';
import { Service, ServicePackage, Review } from '../../types';
import {
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Tag,
  ThumbsUp,
  UserCheck
} from 'lucide-react';

interface ServiceDetailPageProps {
  service: Service;
  reviews: Review[];
  onOpenBookingModal: (serviceId?: string, packageId?: string) => void;
  onNavigate: (tab: string, serviceSlug?: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  service,
  reviews,
  onOpenBookingModal,
  onNavigate
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    service.packages?.[0]?.id || ''
  );
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const currentPackage =
    service.packages?.find((p) => p.id === selectedPackageId) || service.packages?.[0];

  const serviceReviews = reviews.filter((r) => r.serviceId === service.id && r.isApproved);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs text-slate-500">
          <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => onNavigate('services')} className="hover:text-blue-600 transition cursor-pointer">
            Services
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800">{service.name}</span>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="bg-white border-b border-slate-200 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  {service.categoryName}
                </span>
                <div className="flex items-center space-x-1 text-xs font-bold text-slate-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{service.rating}</span>
                  <span className="text-slate-400 font-normal">({service.totalReviews} verified reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {service.name}
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                {service.fullDescription || service.shortDescription}
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-700">
                <div className="flex items-center space-x-1.5 font-medium">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Duration: {service.duration}</span>
                </div>
                <div className="flex items-center space-x-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Satisfaction or Free Re-clean</span>
                </div>
                <div className="flex items-center space-x-1.5 font-medium">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Background Verified Crew</span>
                </div>
              </div>
            </div>

            {/* Service Banner Image */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100 aspect-16/10">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details & Package Selector Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 8 Cols: Packages, What's Included, Inclusions/Exclusions, FAQs, Reviews */}
          <div className="lg:col-span-8 space-y-10">
            {/* 1. Package Tiers Selection */}
            {service.packages && service.packages.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Choose Size / Variant</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">Select Service Package</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize your cleaning scope based on apartment size or depth of clean.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between relative ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {pkg.isPopular && (
                          <span className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Most Popular
                          </span>
                        )}

                        <div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={isSelected}
                              onChange={() => setSelectedPackageId(pkg.id)}
                              className="text-blue-600"
                            />
                            <h3 className="font-bold text-sm text-slate-900">{pkg.name}</h3>
                          </div>

                          {pkg.duration && (
                            <p className="text-[11px] text-slate-500 mt-1 pl-6">⏱️ Approx {pkg.duration}</p>
                          )}

                          {pkg.description && (
                            <p className="text-xs text-slate-600 mt-2 pl-6 leading-relaxed">
                              {pkg.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 pl-6 flex items-baseline justify-between">
                          <div>
                            <span className="text-xl font-black text-slate-900">₹{pkg.price.toLocaleString()}</span>
                            {pkg.originalPrice && (
                              <span className="text-xs text-slate-400 line-through ml-2">₹{pkg.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                          <span className={`text-xs font-bold ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                            {isSelected ? '✓ Selected' : 'Choose'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. What's Included vs Excluded */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Scope of Work</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">What's Included & What's Excluded</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete transparency on chemicals, equipment, and cleaning boundaries.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Inclusions */}
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>What is Included</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700">
                    {service.included?.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    )) || (
                      <>
                        <li className="flex items-start space-x-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>Complete floor scrubbing with single disc machine</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>Tile descaling & sanitization with Taski R2/R9</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>Cobweb removal and high-dusting</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>What is NOT Included</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700">
                    {service.excluded?.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-rose-500 font-bold">✗</span>
                        <span>{item}</span>
                      </li>
                    )) || (
                      <>
                        <li className="flex items-start space-x-2">
                          <span className="text-rose-500 font-bold">✗</span>
                          <span>Internal appliance cleaning (refrigerator/oven inside) unless added as addon</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-rose-500 font-bold">✗</span>
                          <span>Exterior window ledge climbing without security harness</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Service FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Need Help?</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">Frequently Asked Questions</h2>
                </div>

                <div className="divide-y divide-slate-100">
                  {service.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="py-3.5">
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-blue-600 transition cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {isOpen && (
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-2 border-l-2 border-blue-600">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Customer Verified Reviews */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Real Feedback</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">Customer Reviews ({serviceReviews.length})</h2>
                </div>
                <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-extrabold text-xs text-slate-900">{service.rating} / 5</span>
                </div>
              </div>

              {serviceReviews.length > 0 ? (
                <div className="space-y-4">
                  {serviceReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                            {rev.customerName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{rev.customerName}</p>
                            <p className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 italic leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No reviews yet for this service category. Be the first to book and review!</p>
              )}
            </div>
          </div>

          {/* Right 4 Cols: Sticky Quick Booking Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Booking Summary</span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">{service.name}</h3>
                <p className="text-xs text-blue-600 font-semibold mt-0.5">
                  Package: {currentPackage?.name || 'Standard'}
                </p>
              </div>

              {/* Price card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                <span className="text-xs text-slate-600">Starting at</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{(currentPackage?.price || service.startingPrice).toLocaleString()}
                </span>
              </div>

              {/* Benefits list */}
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instant slot confirmation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pay online or cash after service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Free re-cleaning guarantee</span>
                </div>
              </div>

              <button
                id="sticky-book-now-btn"
                onClick={() => onOpenBookingModal(service.id, selectedPackageId)}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Book This Service Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center space-x-2.5 text-[11px] text-blue-800">
                <Tag className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Use coupon <strong>FLASH200</strong> at checkout for ₹200 off!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
