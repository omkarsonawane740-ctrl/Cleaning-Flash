import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Coupon, Offer } from '../../types';
import { Plus, Edit2, Trash2, Tag, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const {
    coupons,
    offers,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    addOffer,
    updateOffer,
    deleteOffer
  } = useData();

  const [activeTab, setActiveTab] = useState<'coupons' | 'offers'>('coupons');

  // Coupon Modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'flat' | 'percentage'>('flat');
  const [discountValue, setDiscountValue] = useState(200);
  const [minimumOrder, setMinimumOrder] = useState(1499);
  const [maximumDiscount, setMaximumDiscount] = useState(500);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  // Offer Modal
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [offerHeading, setOfferHeading] = useState('');
  const [offerDesc, setOfferDesc] = useState('');
  const [offerDiscountBadge, setOfferDiscountBadge] = useState('');
  const [offerCouponCode, setOfferCouponCode] = useState('');
  const [offerBannerImage, setOfferBannerImage] = useState('');

  const handleOpenCouponModal = (c?: Coupon) => {
    if (c) {
      setEditingCouponId(c.id);
      setCode(c.code);
      setDescription(c.description);
      setDiscountType(c.discountType);
      setDiscountValue(c.discountValue);
      setMinimumOrder(c.minimumOrder);
      setMaximumDiscount(c.maximumDiscount || 500);
      setExpiryDate(c.expiryDate);
    } else {
      setEditingCouponId(null);
      setCode('');
      setDescription('');
      setDiscountType('flat');
      setDiscountValue(250);
      setMinimumOrder(1499);
      setMaximumDiscount(500);
      setExpiryDate('2026-12-31');
    }
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCouponId) {
      await updateCoupon(editingCouponId, {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue: Number(discountValue),
        minimumOrder: Number(minimumOrder),
        maximumDiscount: Number(maximumDiscount),
        expiryDate
      });
    } else {
      await addCoupon({
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue: Number(discountValue),
        minimumOrder: Number(minimumOrder),
        maximumDiscount: Number(maximumDiscount),
        startDate: new Date().toISOString().split('T')[0],
        expiryDate,
        usageLimit: 500,
        isActive: true
      });
    }
    setIsCouponModalOpen(false);
  };

  // Offer Handlers
  const handleOpenOfferModal = (o?: Offer) => {
    if (o) {
      setEditingOfferId(o.id);
      setOfferHeading(o.heading);
      setOfferDesc(o.description);
      setOfferDiscountBadge(o.discountBadge);
      setOfferCouponCode(o.couponCode || '');
      setOfferBannerImage(o.bannerImage);
    } else {
      setEditingOfferId(null);
      setOfferHeading('');
      setOfferDesc('');
      setOfferDiscountBadge('Flat 20% OFF');
      setOfferCouponCode('FLASH20');
      setOfferBannerImage('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80');
    }
    setIsOfferModalOpen(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOfferId) {
      await updateOffer(editingOfferId, {
        heading: offerHeading,
        description: offerDesc,
        discountBadge: offerDiscountBadge,
        couponCode: offerCouponCode.toUpperCase(),
        bannerImage: offerBannerImage
      });
    } else {
      await addOffer({
        heading: offerHeading,
        description: offerDesc,
        discountBadge: offerDiscountBadge,
        couponCode: offerCouponCode.toUpperCase(),
        bannerImage: offerBannerImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
        ctaText: 'Claim Offer',
        ctaLink: '#',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2026-12-31',
        isActive: true
      });
    }
    setIsOfferModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Coupons & Promotional Deals</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure discount codes, flat vs percentage discounts, minimum thresholds, and customer banners.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'coupons' ? (
            <button
              onClick={() => handleOpenCouponModal()}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon Code</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenOfferModal()}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Seasonal Banner</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'coupons'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Checkout Promo Codes ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'offers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Promotional Banners ({offers.length})
        </button>
      </div>

      {/* TAB 1: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                    {c.code}
                  </span>
                  <button
                    onClick={() => updateCoupon(c.id, { isActive: !c.isActive })}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                      c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <h4 className="font-bold text-xs text-slate-900 mt-3">{c.description}</h4>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <p>
                    <strong>Discount:</strong>{' '}
                    {c.discountType === 'flat' ? `₹${c.discountValue} Flat` : `${c.discountValue}%`}
                  </p>
                  <p><strong>Min Order:</strong> ₹{c.minimumOrder}</p>
                  {c.discountType === 'percentage' && c.maximumDiscount && (
                    <p><strong>Max Cap:</strong> ₹{c.maximumDiscount}</p>
                  )}
                  <p className="text-[11px] text-slate-400">Valid Till: {c.expiryDate}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Used {c.usedCount} times</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenCouponModal(c)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete coupon "${c.code}"?`)) deleteCoupon(c.id);
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: OFFERS */}
      {activeTab === 'offers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {o.discountBadge}
                  </span>
                  <button
                    onClick={() => updateOffer(o.id, { isActive: !o.isActive })}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                      o.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {o.isActive ? 'Live on Site' : 'Hidden'}
                  </button>
                </div>

                <h3 className="font-black text-base text-slate-900">{o.heading}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{o.description}</p>
                {o.couponCode && (
                  <p className="text-xs font-semibold text-blue-600">Attached Code: {o.couponCode}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleOpenOfferModal(o)}
                  className="px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete banner "${o.heading}"?`)) deleteOffer(o.id);
                  }}
                  className="px-3 py-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingCouponId ? 'Edit Promo Coupon' : 'Create Promo Code'}
            </h3>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  placeholder="e.g. FLASH300"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs uppercase font-mono font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'flat' | 'percentage')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="flat">Flat Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={minimumOrder}
                    onChange={(e) => setMinimumOrder(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Cap (if %)</label>
                  <input
                    type="number"
                    value={maximumDiscount}
                    onChange={(e) => setMaximumDiscount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Save ₹200 on all deep cleaning bookings above ₹1499"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingOfferId ? 'Edit Promotional Banner' : 'Create Promotional Banner'}
            </h3>

            <form onSubmit={handleSaveOffer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Headline *</label>
                <input
                  type="text"
                  placeholder="e.g. Monsoon Deep Scrub Offer"
                  value={offerHeading}
                  onChange={(e) => setOfferHeading(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Discount Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 25% OFF on 2 BHK & 3 BHK"
                  value={offerDiscountBadge}
                  onChange={(e) => setOfferDiscountBadge(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Coupon Code to Link</label>
                <input
                  type="text"
                  placeholder="e.g. MONSOON25"
                  value={offerCouponCode}
                  onChange={(e) => setOfferCouponCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Details Description</label>
                <textarea
                  rows={2}
                  value={offerDesc}
                  onChange={(e) => setOfferDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
