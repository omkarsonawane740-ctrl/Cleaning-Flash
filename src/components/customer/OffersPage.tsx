import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Tag, Sparkles, Copy, Check, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface OffersPageProps {
  onOpenBookingModal: (serviceId?: string) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onOpenBookingModal }) => {
  const { offers, coupons } = useData();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const activeOffers = offers.filter((o) => o.isActive);
  const activeCoupons = coupons.filter((c) => c.isActive);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>Exclusive Cleaning Deals & Discounts</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Flash Deals & Coupon Offers
          </h1>

          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Save extra on deep home cleaning, kitchen degreasing, bathroom scrubbing, and sofa sanitization with our active promotional codes.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Active Featured Banners */}
        {activeOffers.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Featured Seasonal Specials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative space-y-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900 inline-block">
                      Limited Time Special
                    </span>
                    <h3 className="text-2xl font-black">{offer.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-md">{offer.description}</p>
                    <p className="text-xs font-semibold text-emerald-400">{offer.discountText}</p>
                  </div>

                  <div className="relative pt-6 mt-6 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3">
                    {offer.couponCode && (
                      <div className="flex items-center space-x-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-600">
                        <span className="text-xs text-slate-400 font-medium">Code:</span>
                        <span className="font-mono font-black text-amber-300 text-sm tracking-wider">
                          {offer.couponCode}
                        </span>
                        <button
                          onClick={() => handleCopyCode(offer.couponCode!)}
                          className="text-slate-300 hover:text-white transition p-1 cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedCode === offer.couponCode ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => onOpenBookingModal()}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Claim Deal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Active Coupon Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Available Promo Codes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-300 p-6 shadow-sm flex flex-col justify-between space-y-4 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100 tracking-wider">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer flex items-center space-x-1 text-xs"
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-3">{coupon.description}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {coupon.discountType === 'flat'
                      ? `Flat ₹${coupon.discountValue} OFF on orders above ₹${coupon.minimumOrder}`
                      : `${coupon.discountValue}% OFF up to ₹${coupon.maximumDiscount || 'No Limit'} on min. order ₹${coupon.minimumOrder}`}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Expires: {coupon.validTill}</span>
                  <button
                    onClick={() => onOpenBookingModal()}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Apply on Booking →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms note */}
        <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">Coupon Usage Terms & Conditions:</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500 text-[11px]">
            <li>Only one coupon code may be applied per cleaning appointment.</li>
            <li>Coupons apply automatically to the pre-tax booking subtotal during checkout step 4.</li>
            <li>In case of booking cancellation, coupon eligibility resets for your next booking.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
