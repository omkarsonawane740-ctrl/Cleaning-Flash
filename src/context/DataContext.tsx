import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Service,
  ServiceCategory,
  ServicePackage,
  ServiceAddon,
  Booking,
  Staff,
  Coupon,
  Offer,
  Review,
  FAQ,
  AppNotification,
  AuditLog,
  ContactMessage,
  WebsiteSettings,
  BookingStatus,
  PaymentStatus,
  PaymentMethod
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_SERVICES,
  INITIAL_ADDONS,
  INITIAL_STAFF,
  INITIAL_COUPONS,
  INITIAL_OFFERS,
  INITIAL_REVIEWS,
  INITIAL_FAQS,
  INITIAL_BOOKINGS,
  INITIAL_SETTINGS
} from '../data/seedData';

interface DataContextType {
  services: Service[];
  categories: ServiceCategory[];
  addons: ServiceAddon[];
  bookings: Booking[];
  staff: Staff[];
  coupons: Coupon[];
  offers: Offer[];
  reviews: Review[];
  faqs: FAQ[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  contactMessages: ContactMessage[];
  settings: WebsiteSettings;
  isLoading: boolean;

  // Service CRUD
  addService: (service: Omit<Service, 'id' | 'createdAt'>) => Promise<Service>;
  updateService: (id: string, updates: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceStatus: (id: string) => Promise<void>;

  // Category CRUD
  addCategory: (category: Omit<ServiceCategory, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<ServiceCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Package Management (inside service)
  addPackageToService: (serviceId: string, pkg: Omit<ServicePackage, 'id' | 'serviceId'>) => Promise<void>;
  updateServicePackage: (serviceId: string, packageId: string, updates: Partial<ServicePackage>) => Promise<void>;
  deleteServicePackage: (serviceId: string, packageId: string) => Promise<void>;

  // Addon CRUD
  addAddon: (addon: Omit<ServiceAddon, 'id'>) => Promise<void>;
  updateAddon: (id: string, updates: Partial<ServiceAddon>) => Promise<void>;
  deleteAddon: (id: string) => Promise<void>;

  // Bookings
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingId' | 'createdAt' | 'updatedAt'>) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: BookingStatus, notes?: string, staffId?: string, staffName?: string) => Promise<void>;
  assignStaffToBooking: (bookingId: string, staffId: string) => Promise<void>;
  rescheduleBooking: (bookingId: string, date: string, timeSlot: string) => Promise<void>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<void>;
  updatePaymentStatus: (bookingId: string, status: PaymentStatus, method?: PaymentMethod) => Promise<void>;
  addBookingInternalNotes: (bookingId: string, notes: string) => Promise<void>;

  // Staff CRUD
  addStaff: (staffMember: Omit<Staff, 'id' | 'staffId' | 'joinedDate'>) => Promise<void>;
  updateStaff: (id: string, updates: Partial<Staff>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;

  // Coupons
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => Promise<void>;
  updateCoupon: (id: string, updates: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  validateCoupon: (code: string, orderAmount: number) => { valid: boolean; discount: number; message: string; coupon?: Coupon };

  // Offers
  addOffer: (offer: Omit<Offer, 'id'>) => Promise<void>;
  updateOffer: (id: string, updates: Partial<Offer>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;

  // Reviews
  submitReview: (review: Omit<Review, 'id' | 'isApproved' | 'createdAt'>) => Promise<void>;
  toggleReviewApproval: (id: string, isApproved: boolean) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  // FAQs
  addFAQ: (faq: Omit<FAQ, 'id'>) => Promise<void>;
  updateFAQ: (id: string, updates: Partial<FAQ>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;

  // Contact
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateContactMessageStatus: (id: string, status: 'new' | 'in_review' | 'resolved') => Promise<void>;

  // Notifications
  markNotificationRead: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;

  // Settings
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<void>;

  // Reset to demo data
  resetToDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_PREFIX = 'cf_v2_';

function getStorage<T>(key: string, defaultVal: T): T {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Storage parse error for', key, e);
  }
  return defaultVal;
}

function setStorage<T>(key: string, val: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage write error for', key, e);
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(() => getStorage('services', INITIAL_SERVICES));
  const [categories, setCategories] = useState<ServiceCategory[]>(() => getStorage('categories', INITIAL_CATEGORIES));
  const [addons, setAddons] = useState<ServiceAddon[]>(() => getStorage('addons', INITIAL_ADDONS));
  const [bookings, setBookings] = useState<Booking[]>(() => getStorage('bookings', INITIAL_BOOKINGS));
  const [staff, setStaff] = useState<Staff[]>(() => getStorage('staff', INITIAL_STAFF));
  const [coupons, setCoupons] = useState<Coupon[]>(() => getStorage('coupons', INITIAL_COUPONS));
  const [offers, setOffers] = useState<Offer[]>(() => getStorage('offers', INITIAL_OFFERS));
  const [reviews, setReviews] = useState<Review[]>(() => getStorage('reviews', INITIAL_REVIEWS));
  const [faqs, setFaqs] = useState<FAQ[]>(() => getStorage('faqs', INITIAL_FAQS));
  const [settings, setSettings] = useState<WebsiteSettings>(() => getStorage('settings', INITIAL_SETTINGS));
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => getStorage('contact', []));
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getStorage('notifications', [
      {
        id: 'notif-1',
        title: 'New Booking Received',
        message: 'Omkar Sonawane booked 2 BHK Full House Deep Cleaning (CF-90214).',
        type: 'booking',
        read: false,
        createdAt: '2026-08-27T04:30:00.000Z'
      },
      {
        id: 'notif-2',
        title: 'Commercial Cleaning Request',
        message: 'TechVision Labs scheduled Office Deep Clean for Aug 30.',
        type: 'booking',
        read: false,
        createdAt: '2026-08-27T04:20:00.000Z'
      }
    ])
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    getStorage('audit', [
      {
        id: 'aud-1',
        adminId: 'adm-cf-01',
        adminName: 'Super Admin',
        action: 'Assigned Rajesh Kumar to booking CF-90214',
        module: 'Bookings',
        recordId: 'CF-90214',
        timestamp: '2026-08-27T08:30:00.000Z'
      },
      {
        id: 'aud-2',
        adminId: 'adm-cf-01',
        adminName: 'Super Admin',
        action: 'Updated 1 BHK Deep Clean package price to ₹1,999',
        module: 'Services',
        recordId: 'srv-full-house',
        timestamp: '2026-08-26T14:10:00.000Z'
      }
    ])
  );

  const [isLoading, setIsLoading] = useState(false);

  // Sync to persistence
  useEffect(() => { setStorage('services', services); }, [services]);
  useEffect(() => { setStorage('categories', categories); }, [categories]);
  useEffect(() => { setStorage('addons', addons); }, [addons]);
  useEffect(() => { setStorage('bookings', bookings); }, [bookings]);
  useEffect(() => { setStorage('staff', staff); }, [staff]);
  useEffect(() => { setStorage('coupons', coupons); }, [coupons]);
  useEffect(() => { setStorage('offers', offers); }, [offers]);
  useEffect(() => { setStorage('reviews', reviews); }, [reviews]);
  useEffect(() => { setStorage('faqs', faqs); }, [faqs]);
  useEffect(() => { setStorage('settings', settings); }, [settings]);
  useEffect(() => { setStorage('contact', contactMessages); }, [contactMessages]);
  useEffect(() => { setStorage('notifications', notifications); }, [notifications]);
  useEffect(() => { setStorage('audit', auditLogs); }, [auditLogs]);

  const logAudit = (action: string, module: AuditLog['module'], recordId: string, details?: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      adminId: 'adm-current',
      adminName: 'Admin',
      action,
      module,
      recordId,
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = (title: string, message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // SERVICES
  const addService = async (serviceData: Omit<Service, 'id' | 'createdAt'>): Promise<Service> => {
    const id = `srv-${Date.now()}`;
    const newService: Service = {
      ...serviceData,
      id,
      createdAt: new Date().toISOString()
    };
    setServices((prev) => [newService, ...prev]);
    logAudit(`Added new service: "${newService.name}"`, 'Services', id);
    return newService;
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updates };
          return updated;
        }
        return s;
      })
    );
    logAudit(`Updated service details for ID: ${id}`, 'Services', id);
  };

  const deleteService = async (id: string) => {
    const s = services.find((x) => x.id === id);
    setServices((prev) => prev.filter((x) => x.id !== id));
    logAudit(`Deleted service: "${s?.name || id}"`, 'Services', id);
  };

  const toggleServiceStatus = async (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // CATEGORIES
  const addCategory = async (categoryData: Omit<ServiceCategory, 'id'>) => {
    const id = `cat-${Date.now()}`;
    const newCat: ServiceCategory = { ...categoryData, id };
    setCategories((prev) => [...prev, newCat]);
    logAudit(`Added category: "${newCat.name}"`, 'Services', id);
  };

  const updateCategory = async (id: string, updates: Partial<ServiceCategory>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // PACKAGES
  const addPackageToService = async (serviceId: string, pkg: Omit<ServicePackage, 'id' | 'serviceId'>) => {
    const id = `pkg-${Date.now()}`;
    const newPkg: ServicePackage = { ...pkg, id, serviceId };
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          const existingPackages = s.packages || [];
          const updatedPackages = [...existingPackages, newPkg];
          const lowestPrice = Math.min(...updatedPackages.map((p) => p.price));
          return {
            ...s,
            packages: updatedPackages,
            startingPrice: lowestPrice
          };
        }
        return s;
      })
    );
    logAudit(`Added package "${newPkg.name}" to service ${serviceId}`, 'Services', serviceId);
  };

  const updateServicePackage = async (serviceId: string, packageId: string, updates: Partial<ServicePackage>) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId && s.packages) {
          const updatedPackages = s.packages.map((p) => (p.id === packageId ? { ...p, ...updates } : p));
          const lowestPrice = Math.min(...updatedPackages.map((p) => p.price));
          return {
            ...s,
            packages: updatedPackages,
            startingPrice: lowestPrice
          };
        }
        return s;
      })
    );
    logAudit(`Updated package ${packageId} price/details in service ${serviceId}`, 'Services', serviceId);
  };

  const deleteServicePackage = async (serviceId: string, packageId: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId && s.packages) {
          const updatedPackages = s.packages.filter((p) => p.id !== packageId);
          const lowestPrice = updatedPackages.length > 0 ? Math.min(...updatedPackages.map((p) => p.price)) : s.startingPrice;
          return {
            ...s,
            packages: updatedPackages,
            startingPrice: lowestPrice
          };
        }
        return s;
      })
    );
  };

  // ADDONS
  const addAddon = async (addonData: Omit<ServiceAddon, 'id'>) => {
    const id = `addon-${Date.now()}`;
    const newAddon: ServiceAddon = { ...addonData, id };
    setAddons((prev) => [...prev, newAddon]);
    logAudit(`Created add-on: "${newAddon.name}"`, 'Services', id);
  };

  const updateAddon = async (id: string, updates: Partial<ServiceAddon>) => {
    setAddons((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAddon = async (id: string) => {
    setAddons((prev) => prev.filter((a) => a.id !== id));
  };

  // BOOKINGS
  const createBooking = async (bookingData: Omit<Booking, 'id' | 'bookingId' | 'createdAt' | 'updatedAt'>): Promise<Booking> => {
    const id = `bkg-${Date.now()}`;
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `CF-${randomNum}`;
    const now = new Date().toISOString();

    const newBooking: Booking = {
      ...bookingData,
      id,
      bookingId,
      createdAt: now,
      updatedAt: now
    };

    setBookings((prev) => [newBooking, ...prev]);

    // If coupon was used, increment usedCount
    if (bookingData.couponCode) {
      setCoupons((prev) =>
        prev.map((c) => (c.code.toUpperCase() === bookingData.couponCode?.toUpperCase() ? { ...c, usedCount: c.usedCount + 1 } : c))
      );
    }

    addNotification(
      'New Booking Confirmed!',
      `${newBooking.customerName} booked ${newBooking.serviceName} (${bookingId}) for ₹${newBooking.totalAmount}`,
      'booking'
    );

    logAudit(`New booking created: ${bookingId} for ${newBooking.customerName}`, 'Bookings', bookingId);
    return newBooking;
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: BookingStatus,
    notes?: string,
    staffId?: string,
    staffName?: string
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId || b.id === bookingId) {
          const updated: Booking = {
            ...b,
            bookingStatus: status,
            adminNotes: notes !== undefined ? notes : b.adminNotes,
            assignedStaffId: staffId !== undefined ? staffId : b.assignedStaffId,
            assignedStaffName: staffName !== undefined ? staffName : b.assignedStaffName,
            updatedAt: new Date().toISOString()
          };
          return updated;
        }
        return b;
      })
    );
    logAudit(`Changed booking ${bookingId} status to "${status.replace('_', ' ').toUpperCase()}"`, 'Bookings', bookingId);
  };

  const assignStaffToBooking = async (bookingId: string, staffId: string) => {
    const staffMember = staff.find((s) => s.id === staffId || s.staffId === staffId);
    if (!staffMember) return;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId || b.id === bookingId) {
          return {
            ...b,
            assignedStaffId: staffMember.id,
            assignedStaffName: staffMember.name,
            assignedStaffPhone: staffMember.mobile,
            assignmentTime: new Date().toISOString(),
            bookingStatus: b.bookingStatus === 'pending' ? 'assigned' : b.bookingStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return b;
      })
    );

    addNotification(
      'Staff Assigned',
      `${staffMember.name} has been assigned to job ${bookingId}`,
      'staff'
    );
    logAudit(`Assigned cleaner "${staffMember.name}" to booking ${bookingId}`, 'Bookings', bookingId);
  };

  const rescheduleBooking = async (bookingId: string, date: string, timeSlot: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId || b.id === bookingId) {
          return {
            ...b,
            rescheduledFrom: { date: b.date, timeSlot: b.timeSlot },
            date,
            timeSlot,
            bookingStatus: 'rescheduled',
            updatedAt: new Date().toISOString()
          };
        }
        return b;
      })
    );
    logAudit(`Rescheduled booking ${bookingId} to ${date} (${timeSlot})`, 'Bookings', bookingId);
    addNotification('Booking Rescheduled', `Booking ${bookingId} rescheduled to ${date}, ${timeSlot}`, 'booking');
  };

  const cancelBooking = async (bookingId: string, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId || b.id === bookingId) {
          return {
            ...b,
            bookingStatus: 'cancelled',
            cancellationReason: reason || 'Customer requested cancellation',
            updatedAt: new Date().toISOString()
          };
        }
        return b;
      })
    );
    logAudit(`Cancelled booking ${bookingId}: ${reason || 'N/A'}`, 'Bookings', bookingId);
  };

  const updatePaymentStatus = async (bookingId: string, status: PaymentStatus, method?: PaymentMethod) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId || b.id === bookingId) {
          return {
            ...b,
            paymentStatus: status,
            paymentMethod: method || b.paymentMethod,
            updatedAt: new Date().toISOString()
          };
        }
        return b;
      })
    );
    logAudit(`Updated payment status for ${bookingId} to "${status.toUpperCase()}"`, 'Payments', bookingId);
  };

  const addBookingInternalNotes = async (bookingId: string, notes: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId || b.id === bookingId ? { ...b, adminNotes: notes } : b))
    );
  };

  // STAFF
  const addStaff = async (staffMember: Omit<Staff, 'id' | 'staffId' | 'joinedDate'>) => {
    const id = `stf-${Date.now()}`;
    const staffId = `CF-STF-${Math.floor(100 + Math.random() * 900)}`;
    const newStaff: Staff = {
      ...staffMember,
      id,
      staffId,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setStaff((prev) => [...prev, newStaff]);
    logAudit(`Registered new cleaning staff: "${newStaff.name}" (${staffId})`, 'Staff', id);
  };

  const updateStaff = async (id: string, updates: Partial<Staff>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    logAudit(`Updated staff profile for ID ${id}`, 'Staff', id);
  };

  const deleteStaff = async (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  // COUPONS
  const addCoupon = async (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const id = `cpn-${Date.now()}`;
    const newCoupon: Coupon = {
      ...couponData,
      id,
      code: couponData.code.toUpperCase().trim(),
      usedCount: 0
    };
    setCoupons((prev) => [...prev, newCoupon]);
    logAudit(`Created coupon code: "${newCoupon.code}"`, 'Coupons', id);
  };

  const updateCoupon = async (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, code: (updates.code || c.code).toUpperCase().trim() } : c))
    );
  };

  const deleteCoupon = async (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const validateCoupon = (code: string, orderAmount: number) => {
    const normalized = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === normalized && c.isActive);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or inactive coupon code.' };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'This coupon usage limit has been reached.' };
    }

    if (orderAmount < coupon.minimumOrder) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of ₹${coupon.minimumOrder.toLocaleString()} required for this coupon.`
      };
    }

    let calculatedDiscount = 0;
    if (coupon.discountType === 'flat') {
      calculatedDiscount = coupon.discountValue;
    } else {
      calculatedDiscount = Math.round((orderAmount * coupon.discountValue) / 100);
      if (coupon.maximumDiscount && calculatedDiscount > coupon.maximumDiscount) {
        calculatedDiscount = coupon.maximumDiscount;
      }
    }

    return {
      valid: true,
      discount: calculatedDiscount,
      message: `Coupon applied! Saved ₹${calculatedDiscount.toLocaleString()}`,
      coupon
    };
  };

  // OFFERS
  const addOffer = async (offerData: Omit<Offer, 'id'>) => {
    const id = `off-${Date.now()}`;
    const newOffer: Offer = { ...offerData, id };
    setOffers((prev) => [...prev, newOffer]);
  };

  const updateOffer = async (id: string, updates: Partial<Offer>) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const deleteOffer = async (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  // REVIEWS
  const submitReview = async (reviewData: Omit<Review, 'id' | 'isApproved' | 'createdAt'>) => {
    const id = `rev-${Date.now()}`;
    const newRev: Review = {
      ...reviewData,
      id,
      isApproved: true, // auto-approve in demo or configurable
      createdAt: new Date().toISOString()
    };
    setReviews((prev) => [newRev, ...prev]);

    // Mark booking review submitted
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === reviewData.bookingId || b.id === reviewData.bookingId ? { ...b, reviewSubmitted: true } : b))
    );

    addNotification(
      'New Customer Review',
      `${reviewData.customerName} gave a ${reviewData.rating}-star review for ${reviewData.serviceName}`,
      'system'
    );
  };

  const toggleReviewApproval = async (id: string, isApproved: boolean) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved } : r)));
  };

  const deleteReview = async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // FAQS
  const addFAQ = async (faqData: Omit<FAQ, 'id'>) => {
    const id = `faq-${Date.now()}`;
    const newFaq: FAQ = { ...faqData, id };
    setFaqs((prev) => [...prev, newFaq]);
  };

  const updateFAQ = async (id: string, updates: Partial<FAQ>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFAQ = async (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // CONTACT MESSAGES
  const submitContactMessage = async (msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) => {
    const id = `msg-${Date.now()}`;
    const newMsg: ContactMessage = {
      ...msg,
      id,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    addNotification('New Contact Inquiry', `${msg.name} sent an inquiry: "${msg.message.substring(0, 45)}..."`, 'system');
  };

  const updateContactMessageStatus = async (id: string, status: 'new' | 'in_review' | 'resolved') => {
    setContactMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  // NOTIFICATIONS
  const markNotificationRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = async () => {
    setNotifications([]);
  };

  // SETTINGS
  const updateSettings = async (newSettings: Partial<WebsiteSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      return merged;
    });
    logAudit('Updated business/website settings', 'Settings', 'global_settings');
  };

  const resetToDemoData = () => {
    setServices(INITIAL_SERVICES);
    setCategories(INITIAL_CATEGORIES);
    setAddons(INITIAL_ADDONS);
    setStaff(INITIAL_STAFF);
    setCoupons(INITIAL_COUPONS);
    setOffers(INITIAL_OFFERS);
    setReviews(INITIAL_REVIEWS);
    setFaqs(INITIAL_FAQS);
    setBookings(INITIAL_BOOKINGS);
    setSettings(INITIAL_SETTINGS);
    localStorage.clear();
  };

  return (
    <DataContext.Provider
      value={{
        services,
        categories,
        addons,
        bookings,
        staff,
        coupons,
        offers,
        reviews,
        faqs,
        notifications,
        auditLogs,
        contactMessages,
        settings,
        isLoading,
        addService,
        updateService,
        deleteService,
        toggleServiceStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        addPackageToService,
        updateServicePackage,
        deleteServicePackage,
        addAddon,
        updateAddon,
        deleteAddon,
        createBooking,
        updateBookingStatus,
        assignStaffToBooking,
        rescheduleBooking,
        cancelBooking,
        updatePaymentStatus,
        addBookingInternalNotes,
        addStaff,
        updateStaff,
        deleteStaff,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        validateCoupon,
        addOffer,
        updateOffer,
        deleteOffer,
        submitReview,
        toggleReviewApproval,
        deleteReview,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        submitContactMessage,
        updateContactMessageStatus,
        markNotificationRead,
        clearAllNotifications,
        updateSettings,
        resetToDemoData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
