import React from 'react';
import { Booking, WebsiteSettings } from '../../types';
import { X, Printer, Download, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  booking: Booking | null;
  settings: WebsiteSettings;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, settings, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="invoice-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div id="invoice-modal-container" className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tax Invoice</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {booking.bookingId}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="print-invoice-btn"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Invoice</span>
            </button>
            <button
              id="close-invoice-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-8 space-y-6 text-slate-800" id="printable-invoice">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                    {settings.business.companyName}
                  </h1>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{settings.business.tagline}</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500 space-y-0.5">
                <p>{settings.business.address}</p>
                <p>{settings.business.city}</p>
                <p>Phone: {settings.business.phone} | Email: {settings.business.email}</p>
                <p>GSTIN: 27AABCC1234F1Z8</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                {booking.paymentStatus === 'paid' ? 'PAID IN FULL' : 'PAYMENT PENDING'}
              </span>
              <p className="text-sm font-bold text-slate-900 mt-2">Invoice #: INV-{booking.bookingId.replace('CF-', '')}</p>
              <p className="text-xs text-slate-500">Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-slate-500">Service Slot: {booking.date} ({booking.timeSlot})</p>
            </div>
          </div>

          {/* Billed To / Service Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100 text-xs">
            <div>
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider mb-1.5 text-[11px] text-slate-400">
                Billed To (Customer)
              </h3>
              <p className="font-bold text-sm text-slate-900">{booking.customerName}</p>
              <p className="text-slate-600 mt-0.5">{booking.customerMobile}</p>
              <p className="text-slate-600">{booking.customerEmail}</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider mb-1.5 text-[11px] text-slate-400">
                Service Address
              </h3>
              <p className="font-medium text-slate-800">{booking.address.flatNo}, {booking.address.building}</p>
              <p className="text-slate-600">{booking.address.address}, {booking.address.area}</p>
              <p className="text-slate-600">{booking.address.city} - {booking.address.pincode}</p>
              {booking.address.landmark && (
                <p className="text-slate-500 italic mt-0.5">Landmark: {booking.address.landmark}</p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center">Type</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3">
                    <p className="font-bold text-slate-900 text-sm">{booking.serviceName}</p>
                    <p className="text-slate-500 text-xs mt-0.5">Package: {booking.packageName}</p>
                  </td>
                  <td className="py-3 text-center text-slate-600">Base Package</td>
                  <td className="py-3 text-right font-medium text-slate-900">
                    ₹{booking.packagePrice.toLocaleString()}
                  </td>
                </tr>

                {booking.addons && booking.addons.length > 0 && booking.addons.map((addon) => (
                  <tr key={addon.id}>
                    <td className="py-2.5">
                      <p className="font-medium text-slate-800">{addon.name}</p>
                      <p className="text-slate-400 text-[11px]">Add-on Service (Qty: {addon.quantity})</p>
                    </td>
                    <td className="py-2.5 text-center text-slate-500">Add-on</td>
                    <td className="py-2.5 text-right font-medium text-slate-800">
                      ₹{(addon.price * addon.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Price Breakdown */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-medium text-slate-800">₹{booking.subtotal.toLocaleString()}</span>
              </div>
              {booking.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount ({booking.couponCode}):</span>
                  <span className="font-medium">- ₹{booking.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST & Service Tax ({settings.booking.taxRatePercent}%):</span>
                <span className="font-medium text-slate-800">₹{booking.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{booking.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Payment Mode:</span>
                <span className="uppercase font-semibold text-slate-700">
                  {booking.paymentMethod === 'online' ? 'Online UPI / Card' : 'Cash on Service'}
                </span>
              </div>
            </div>
          </div>

          {/* Guarantee & Terms */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-3 text-[11px] text-slate-600">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">100% Cleaning Flash Satisfaction Guarantee</p>
              <p className="mt-0.5">
                If you find any missed spots or are unsatisfied with any cleaned area, notify us within 24 hours for a complimentary re-cleaning.
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 text-[11px] text-slate-400 border-t border-slate-100">
            <p>Thank you for choosing {settings.business.companyName}! This is a computer-generated invoice and requires no physical signature.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
