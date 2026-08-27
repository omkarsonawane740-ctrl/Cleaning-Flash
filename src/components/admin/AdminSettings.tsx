import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { WebsiteSettings } from '../../types';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Save,
  CreditCard
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetToSeedData } = useData();

  const [businessName, setBusinessName] = useState(settings.business.name);
  const [tagline, setTagline] = useState(settings.business.tagline);
  const [phone, setPhone] = useState(settings.business.phone);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.business.whatsappNumber);
  const [email, setEmail] = useState(settings.business.email);
  const [address, setAddress] = useState(settings.business.address);
  const [city, setCity] = useState(settings.business.city);
  const [workingHours, setWorkingHours] = useState(settings.business.workingHours);

  // Booking settings
  const [taxRate, setTaxRate] = useState(settings.booking.taxRate);
  const [minAdvanceNoticeHours, setMinAdvanceNoticeHours] = useState(settings.booking.minAdvanceNoticeHours);
  const [timeSlotsStr, setTimeSlotsStr] = useState(settings.booking.timeSlots.join(', '));
  const [allowCashOnDelivery, setAllowCashOnDelivery] = useState(settings.payment.allowCashOnDelivery);
  const [allowOnlinePayment, setAllowOnlinePayment] = useState(settings.payment.allowOnlinePayment);
  const [allowUpi, setAllowUpi] = useState(settings.payment.allowUpi);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSlots = timeSlotsStr.split(',').map((s) => s.trim()).filter(Boolean);

    await updateSettings({
      business: {
        name: businessName,
        tagline,
        phone,
        whatsappNumber,
        email,
        address,
        city,
        workingHours
      },
      booking: {
        taxRate: Number(taxRate),
        minAdvanceNoticeHours: Number(minAdvanceNoticeHours),
        timeSlots: parsedSlots,
        cancellationRefundHours: settings.booking.cancellationRefundHours
      },
      payment: {
        allowCashOnDelivery,
        allowOnlinePayment,
        allowUpi,
        currency: 'INR',
        currencySymbol: '₹'
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetData = () => {
    if (confirm('Reset entire application data (services, bookings, staff, reviews) to initial default seed state? This will restore clean demo data.')) {
      resetToSeedData();
      alert('Application reset to default seed data successfully.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Website & Platform Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure contact coordinates, business brand rules, GST tax rates, booking time slots, and payment gateways.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Platform settings updated successfully! Changes reflect on customer portal and checkout instantly.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Business Identity & Contact */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Business Identity & Contact Coordinates</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Care Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Office / Hub Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Operating City / Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Booking Engine & Pricing Rules */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Booking Rules & Tax Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GST Tax Rate (% on total)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Calculated automatically on checkout and invoices.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Advance Notice (Hours)</label>
              <input
                type="number"
                value={minAdvanceNoticeHours}
                onChange={(e) => setMinAdvanceNoticeHours(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Available Daily Time Slots (comma-separated)
            </label>
            <input
              type="text"
              value={timeSlotsStr}
              onChange={(e) => setTimeSlotsStr(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Section 3: Payment Gateway Methods */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>Payment Options Available to Customers</span>
          </h3>

          <div className="space-y-3 pt-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowCashOnDelivery}
                onChange={(e) => setAllowCashOnDelivery(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-slate-700">Allow "Cash / Card After Service Completion"</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowOnlinePayment}
                onChange={(e) => setAllowOnlinePayment(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-slate-700">Allow Online Card / Netbanking Gateway</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowUpi}
                onChange={(e) => setAllowUpi(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-slate-700">Allow Instant UPI QR Code / Apps</span>
            </label>
          </div>
        </div>

        {/* Submit & Reset Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo State to Initial Seed</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
