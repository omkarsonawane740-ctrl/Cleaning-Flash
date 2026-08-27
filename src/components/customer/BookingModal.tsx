import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Service, ServicePackage, SelectedAddon, UserAddress, Booking } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Tag,
  CheckCircle2,
  CreditCard,
  Banknote,
  ShieldCheck,
  Plus,
  Trash2,
  Receipt,
  FileText,
  AlertCircle
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  initialServiceId?: string;
  initialPackageId?: string;
  onClose: () => void;
  onViewBookingDetails?: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  initialServiceId,
  initialPackageId,
  onClose,
  onViewBookingDetails
}) => {
  const { services, addons, coupons, settings, validateCoupon, createBooking } = useData();
  const { user, addAddress } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || (services[0]?.id || ''));
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackageId || '');
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);

  // Step 2: Date & Slot
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState<string>(tomorrowStr);
  const [selectedSlot, setSelectedSlot] = useState<string>(settings.booking.timeSlots[0] || '10 AM - 12 PM');

  // Step 3: Customer & Address Details
  const [customerName, setCustomerName] = useState<string>(user?.name || '');
  const [customerMobile, setCustomerMobile] = useState<string>(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState<string>(user?.email || '');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const [selectedAddressId, setSelectedAddressId] = useState<string>(user?.addresses?.[0]?.id || 'custom');
  const [flatNo, setFlatNo] = useState<string>(user?.addresses?.[0]?.flatNo || '');
  const [building, setBuilding] = useState<string>(user?.addresses?.[0]?.building || '');
  const [addressLine, setAddressLine] = useState<string>(user?.addresses?.[0]?.address || '');
  const [area, setArea] = useState<string>(user?.addresses?.[0]?.area || 'Baner');
  const [city, setCity] = useState<string>(user?.addresses?.[0]?.city || 'Pune');
  const [pincode, setPincode] = useState<string>(user?.addresses?.[0]?.pincode || '411045');
  const [landmark, setLandmark] = useState<string>(user?.addresses?.[0]?.landmark || '');
  const [saveToAccount, setSaveToAccount] = useState<boolean>(true);

  // Step 4: Coupon & Discounts
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Step 5: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Step 6: Confirmed Booking state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Sync selected service & package defaults
  useEffect(() => {
    if (initialServiceId) setSelectedServiceId(initialServiceId);
  }, [initialServiceId]);

  const activeService = services.find((s) => s.id === selectedServiceId) || services[0];
  const servicePackages = activeService?.packages || [];

  useEffect(() => {
    if (initialPackageId && servicePackages.some((p) => p.id === initialPackageId)) {
      setSelectedPackageId(initialPackageId);
    } else if (servicePackages.length > 0 && !servicePackages.some((p) => p.id === selectedPackageId)) {
      setSelectedPackageId(servicePackages[0].id);
    }
  }, [activeService, initialPackageId]);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!customerMobile && user.phone) setCustomerMobile(user.phone);
      if (user.addresses && user.addresses.length > 0 && selectedAddressId === 'custom') {
        const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setSelectedAddressId(defaultAddr.id);
        setFlatNo(defaultAddr.flatNo);
        setBuilding(defaultAddr.building);
        setAddressLine(defaultAddr.address);
        setArea(defaultAddr.area);
        setCity(defaultAddr.city);
        setPincode(defaultAddr.pincode);
        setLandmark(defaultAddr.landmark || '');
      }
    }
  }, [user]);

  if (!isOpen) return null;

  const currentPackage = servicePackages.find((p) => p.id === selectedPackageId) || servicePackages[0];
  const basePrice = currentPackage ? currentPackage.price : (activeService?.startingPrice || 0);

  const addonsTotal = selectedAddons.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const subtotal = basePrice + addonsTotal;
  const taxRate = settings.booking.taxRatePercent || 5;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxableAmount * taxRate) / 100);
  const finalTotal = taxableAmount + taxAmount;

  // Addon selection handlers
  const handleToggleAddon = (addon: any) => {
    const existing = selectedAddons.find((a) => a.id === addon.id);
    if (existing) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, { id: addon.id, name: addon.name, price: addon.price, quantity: 1 }]);
    }
  };

  const handleUpdateAddonQty = (addonId: string, delta: number) => {
    setSelectedAddons(
      selectedAddons
        .map((a) => {
          if (a.id === addonId) {
            const nextQty = a.quantity + delta;
            return nextQty > 0 ? { ...a, quantity: nextQty } : null;
          }
          return a;
        })
        .filter(Boolean) as SelectedAddon[]
    );
  };

  // Coupon application
  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) return;

    const result = validateCoupon(code, subtotal);
    if (result.valid) {
      setAppliedCouponCode(code);
      setDiscountAmount(result.discount);
      setCouponMessage({ text: result.message, isError: false });
    } else {
      setAppliedCouponCode('');
      setDiscountAmount(0);
      setCouponMessage({ text: result.message, isError: true });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponCode('');
    setDiscountAmount(0);
    setCouponCodeInput('');
    setCouponMessage(null);
  };

  // Address picker change
  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId === 'custom') {
      setFlatNo('');
      setBuilding('');
      setAddressLine('');
      setLandmark('');
    } else {
      const found = user?.addresses?.find((a) => a.id === addrId);
      if (found) {
        setFlatNo(found.flatNo);
        setBuilding(found.building);
        setAddressLine(found.address);
        setArea(found.area);
        setCity(found.city);
        setPincode(found.pincode);
        setLandmark(found.landmark || '');
      }
    }
  };

  // Final confirmation
  const handleConfirmAndPay = async () => {
    if (!customerName || !customerMobile || !addressLine || !area || !pincode) {
      alert('Please fill in all mandatory customer and address details.');
      setCurrentStep(3);
      return;
    }

    setIsProcessingPayment(true);

    // Save address if requested
    let currentAddressObj: UserAddress = {
      id: selectedAddressId === 'custom' ? `addr-${Date.now()}` : selectedAddressId,
      type: 'Home',
      flatNo,
      building,
      address: addressLine,
      area,
      city,
      pincode,
      landmark,
      isDefault: false
    };

    if (user && saveToAccount && selectedAddressId === 'custom') {
      try {
        await addAddress(currentAddressObj);
      } catch (e) {
        console.error('Failed to save address:', e);
      }
    }

    // Payment simulation delay
    await new Promise((r) => setTimeout(r, 800));

    const newBooking = await createBooking({
      customerId: user?.uid || `guest-${Date.now()}`,
      customerName,
      customerMobile,
      customerEmail: customerEmail || 'guest@cleaningflash.com',
      serviceId: activeService.id,
      serviceName: activeService.name,
      serviceImage: activeService.image,
      packageId: currentPackage.id,
      packageName: currentPackage.name,
      packagePrice: currentPackage.price,
      addons: selectedAddons,
      address: currentAddressObj,
      date: bookingDate,
      timeSlot: selectedSlot,
      subtotal,
      discount: discountAmount,
      couponCode: appliedCouponCode || undefined,
      tax: taxAmount,
      totalAmount: finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      bookingStatus: 'pending',
      customerNotes: specialInstructions
    });

    setIsProcessingPayment(false);
    setConfirmedBooking(newBooking);
    setCurrentStep(6);

    // Launch confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div id="booking-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div id="booking-modal-container" className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Book a Cleaning Service</h2>
              <p className="text-[11px] text-slate-400">Step {currentStep} of 6: {
                currentStep === 1 ? 'Select Package & Add-ons' :
                currentStep === 2 ? 'Date & Time Slot' :
                currentStep === 3 ? 'Service Address' :
                currentStep === 4 ? 'Order Summary & Coupon' :
                currentStep === 5 ? 'Payment Method' :
                'Booking Confirmed'
              }</p>
            </div>
          </div>
          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        {currentStep < 6 && (
          <div className="w-full bg-slate-100 h-1.5 flex">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex-1 transition-all duration-300 ${
                  currentStep >= step ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: SERVICE & PACKAGE & ADDONS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Service Selector if multiple */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Cleaning Service
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {services.filter((s) => s.isActive).map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => {
                        setSelectedServiceId(srv.id);
                        if (srv.packages && srv.packages.length > 0) {
                          setSelectedPackageId(srv.packages[0].id);
                        }
                      }}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        selectedServiceId === srv.id
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="font-semibold text-xs text-slate-900 leading-snug line-clamp-1">{srv.name}</span>
                      <span className="text-[11px] text-blue-600 font-bold mt-1.5">Starts ₹{srv.startingPrice}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Package Tier Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Choose Package Tier for {activeService?.name}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicePackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between relative ${
                        selectedPackageId === pkg.id
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {pkg.isPopular && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Popular Choice
                        </span>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={selectedPackageId === pkg.id}
                            onChange={() => setSelectedPackageId(pkg.id)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <h4 className="font-bold text-sm text-slate-900">{pkg.name}</h4>
                        </div>
                        {pkg.duration && (
                          <p className="text-[11px] text-slate-500 mt-1 pl-6">⏱️ Duration: {pkg.duration}</p>
                        )}
                        {pkg.description && (
                          <p className="text-xs text-slate-600 mt-2 pl-6">{pkg.description}</p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 pl-6 flex items-baseline justify-between">
                        <div>
                          <span className="text-lg font-bold text-slate-900">₹{pkg.price.toLocaleString()}</span>
                          {pkg.originalPrice && (
                            <span className="text-xs text-slate-400 line-through ml-2">₹{pkg.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                        <span className="text-xs text-blue-600 font-semibold">Select</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Recommended Add-on Services (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {addons.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.id === addon.id);
                    const selectedItem = selectedAddons.find((a) => a.id === addon.id);

                    return (
                      <div
                        key={addon.id}
                        className={`p-3 rounded-xl border transition flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex-1 pr-2">
                          <h5 className="font-semibold text-xs text-slate-900">{addon.name}</h5>
                          <p className="text-[11px] text-blue-600 font-bold mt-0.5">+ ₹{addon.price.toLocaleString()}</p>
                          {addon.description && (
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{addon.description}</p>
                          )}
                        </div>

                        {isSelected ? (
                          <div className="flex items-center space-x-1.5 bg-white border border-blue-200 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => handleUpdateAddonQty(addon.id, -1)}
                              className="w-6 h-6 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100 cursor-pointer text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-slate-900 px-1">{selectedItem?.quantity || 1}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateAddonQty(addon.id, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100 cursor-pointer text-xs"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleAddon(addon)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition cursor-pointer"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME SLOT */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Cleaning Date
                </label>
                <div className="relative max-w-sm">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="booking-date-input"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Choose Preferred Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {settings.booking.timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3.5 rounded-xl border text-center transition font-semibold text-xs flex items-center justify-center space-x-2 cursor-pointer ${
                        selectedSlot === slot
                          ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start space-x-3 text-xs text-blue-800">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Punctuality Assurance</p>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Our team arrives within 15 minutes of the selected time slot with all industrial cleaning tools.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CUSTOMER & ADDRESS DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Saved Address Chips if logged in */}
              {user?.addresses && user.addresses.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Use Saved Address
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr.id)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          selectedAddressId === addr.id
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{addr.type}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Default</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 mt-1">{addr.flatNo}, {addr.building}</p>
                        <p className="text-[11px] text-slate-500">{addr.area}, {addr.city} - {addr.pincode}</p>
                      </div>
                    ))}

                    <div
                      onClick={() => handleSelectSavedAddress('custom')}
                      className={`p-3 rounded-xl border border-dashed text-center flex items-center justify-center cursor-pointer transition ${
                        selectedAddressId === 'custom'
                          ? 'border-blue-600 bg-blue-50/60 text-blue-700'
                          : 'border-slate-300 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      <span className="text-xs font-semibold">+ Enter Different Address</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    id="booking-cust-name"
                    type="text"
                    placeholder="e.g. Omkar Sonawane"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    id="booking-cust-mobile"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email (for Invoice)</label>
                  <input
                    id="booking-cust-email"
                    type="email"
                    placeholder="omkar@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Detailed Address */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Flat / House / Unit No. *</label>
                    <input
                      id="booking-flat-input"
                      type="text"
                      placeholder="e.g. Flat 402"
                      value={flatNo}
                      onChange={(e) => setFlatNo(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Building / Society Name *</label>
                    <input
                      id="booking-building-input"
                      type="text"
                      placeholder="e.g. Sunrise Heights, Tower B"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address / Locality *</label>
                  <input
                    id="booking-address-input"
                    type="text"
                    placeholder="e.g. Near Central Green Park, Main Road"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Area *</label>
                    <input
                      id="booking-area-input"
                      type="text"
                      placeholder="e.g. Baner"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                    <input
                      id="booking-city-input"
                      type="text"
                      placeholder="e.g. Pune"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode *</label>
                    <input
                      id="booking-pincode-input"
                      type="text"
                      placeholder="e.g. 411045"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Landmark (Optional)</label>
                  <input
                    id="booking-landmark-input"
                    type="text"
                    placeholder="e.g. Opposite State Bank of India"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Special Instructions for Cleaners</label>
                  <textarea
                    id="booking-notes-input"
                    rows={2}
                    placeholder="e.g. Please pay special attention to kitchen chimney and balcony glass panes..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER SUMMARY & COUPON */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{activeService?.name}</h3>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">Package: {currentPackage?.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      📅 {bookingDate} | ⏱️ {selectedSlot}
                    </p>
                  </div>
                  <span className="font-bold text-base text-slate-900">₹{basePrice.toLocaleString()}</span>
                </div>

                {/* Addons List */}
                {selectedAddons.length > 0 && (
                  <div className="space-y-2 pb-4 border-b border-slate-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Add-ons</p>
                    {selectedAddons.map((add) => (
                      <div key={add.id} className="flex justify-between text-xs text-slate-700">
                        <span>{add.name} (x{add.quantity})</span>
                        <span className="font-medium">₹{(add.price * add.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Address Summary */}
                <div className="text-xs text-slate-600 pb-4 border-b border-slate-200 flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">{customerName}</span> ({customerMobile})
                    <p className="mt-0.5">{flatNo}, {building}, {addressLine}, {area}, {city} - {pincode}</p>
                  </div>
                </div>

                {/* Coupon Box */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Apply Coupon Code
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="booking-coupon-input"
                        type="text"
                        placeholder="e.g. FLASH200, FIRST15, MEGA500"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-bold tracking-wider uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    {appliedCouponCode ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition cursor-pointer"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold transition cursor-pointer shadow-xs"
                      >
                        Apply
                      </button>
                    )}
                  </div>

                  {couponMessage && (
                    <p className={`text-xs font-medium mt-1.5 ${couponMessage.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {couponMessage.text}
                    </p>
                  )}

                  {/* Active Coupons quick pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {coupons.filter((c) => c.isActive).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCouponCodeInput(c.code);
                          handleApplyCoupon(c.code);
                        }}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition cursor-pointer"
                      >
                        🏷️ {c.code} ({c.discountType === 'flat' ? `₹${c.discountValue} OFF` : `${c.discountValue}% OFF`})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Final Bill Breakdown */}
                <div className="space-y-2 pt-4 border-t border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({appliedCouponCode}):</span>
                      <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>GST & Safety Insurance ({taxRate}%):</span>
                    <span className="font-semibold text-slate-800">₹{taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Final Amount:</span>
                    <span className="text-blue-600">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PAYMENT */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="text-center pb-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Payable Amount</span>
                <h3 className="text-3xl font-extrabold text-blue-600 mt-1">₹{finalTotal.toLocaleString()}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Includes all taxes & 100% satisfaction guarantee</p>
              </div>

              <div className="space-y-3">
                {/* Online Payment */}
                <div
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'online'
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Online Payment (UPI, Cards, NetBanking)</h4>
                      <p className="text-xs text-slate-500">Fast & contactless via secure 256-bit encrypted gateway</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="text-blue-600"
                  />
                </div>

                {/* Cash on Service */}
                {settings.payment.cashPaymentEnabled && (
                  <div
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'cash'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">Cash / UPI on Service Completion</h4>
                        <p className="text-xs text-slate-500">Pay directly to our team leader after checking the clean</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="text-blue-600"
                    />
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3 text-xs text-slate-600">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p>
                  No hidden charges. Free cancellation or rescheduling allowed up to 4 hours before slot.
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMATION */}
          {currentStep === 6 && confirmedBooking && (
            <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 tracking-wider">
                  Booking Confirmed
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Booking ID: {confirmedBooking.bookingId}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Thank you, <span className="font-semibold text-slate-700">{confirmedBooking.customerName}</span>! Your cleaning slot has been successfully reserved.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left max-w-lg mx-auto space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.serviceName} ({confirmedBooking.packageName})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Appointment Date:</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.date} ({confirmedBooking.timeSlot})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Address:</span>
                  <span className="font-medium text-slate-800 text-right max-w-xs truncate">
                    {confirmedBooking.address.flatNo}, {confirmedBooking.address.building}, {confirmedBooking.address.area}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-blue-600">₹{confirmedBooking.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className={`font-semibold uppercase ${confirmedBooking.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {confirmedBooking.paymentStatus} ({confirmedBooking.paymentMethod})
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  id="view-confirmed-booking-btn"
                  type="button"
                  onClick={() => {
                    if (onViewBookingDetails) onViewBookingDetails(confirmedBooking);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  View Booking in My Account
                </button>
                <button
                  id="back-to-home-btn"
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Navigation */}
        {currentStep < 6 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
            {currentStep > 1 ? (
              <button
                id="booking-prev-step-btn"
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Estimated Total</span>
                <p className="text-sm font-bold text-slate-900 leading-none">₹{finalTotal.toLocaleString()}</p>
              </div>

              {currentStep < 5 ? (
                <button
                  id="booking-next-step-btn"
                  type="button"
                  onClick={() => {
                    if (currentStep === 1 && !selectedPackageId) {
                      alert('Please select a package');
                      return;
                    }
                    if (currentStep === 2 && (!bookingDate || !selectedSlot)) {
                      alert('Please select both date and time slot');
                      return;
                    }
                    if (currentStep === 3 && (!customerName || !customerMobile || !addressLine || !pincode)) {
                      alert('Please fill all required contact and address fields');
                      return;
                    }
                    setCurrentStep(currentStep + 1);
                  }}
                  className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="booking-pay-btn"
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleConfirmAndPay}
                  className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  <span>{isProcessingPayment ? 'Securing Booking...' : paymentMethod === 'online' ? `Pay ₹${finalTotal.toLocaleString()}` : 'Confirm Booking'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
