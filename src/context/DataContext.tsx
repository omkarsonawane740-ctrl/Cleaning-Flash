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
import {
  db,
  seedFirestoreDatabaseIfEmpty,
  handleFirestoreError,
  OperationType
} from '../services/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  getDoc
} from 'firebase/firestore';
import {
  startCleaningTabTitle,
  stopCleaningTabTitle,
  withCleaningTabTitle
} from '../utils/tabTitleAnimation';

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
  isFirestoreConnected: boolean;
  startCleaningTabTitle: () => void;
  stopCleaningTabTitle: (force?: boolean) => void;

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

  // Reset / Reseed
  resetToDemoData: () => Promise<void>;
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
      }
    ])
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    getStorage('audit', [
      {
        id: 'aud-1',
        adminId: 'adm-cf-01',
        adminName: 'Super Admin',
        action: 'System initialized and connected to Firebase Firestore',
        module: 'Settings',
        recordId: 'global_settings',
        timestamp: new Date().toISOString()
      }
    ])
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);

  // Sync to localStorage as fast-fallback
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

  // Real-time Firestore synchronization
  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }

    let isSubscribed = true;

    // Mark initial loading ready immediately with cached/seed data
    setIsLoading(false);
    setIsFirestoreConnected(true);

    // Run seed check safely in the background without blocking application startup
    seedFirestoreDatabaseIfEmpty()
      .then(() => {
        if (!isSubscribed) return;
        setIsFirestoreConnected(true);
      })
      .catch((err) => {
        console.info('Background seed verification note:', err?.message || err);
      });

    // 1. Services Listener
    const unsubServices = onSnapshot(
      collection(db, 'services'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Service[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as Service);
          });
          setServices(list);
        }
      },
      (error) => {
        console.warn('Firestore services listener note:', error);
      }
    );

    // 2. Categories Listener
    const unsubCategories = onSnapshot(
      collection(db, 'serviceCategories'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ServiceCategory[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as ServiceCategory);
          });
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          setCategories(list);
        }
      },
      (error) => {
        console.warn('Firestore categories listener note:', error);
      }
    );

    // 3. Addons Listener
    const unsubAddons = onSnapshot(
      collection(db, 'addons'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ServiceAddon[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as ServiceAddon);
          });
          setAddons(list);
        }
      },
      (error) => {
        console.warn('Firestore addons listener note:', error);
      }
    );

    // 4. Bookings Listener
    const unsubBookings = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Booking[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as Booking);
          });
          // Sort newest first
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setBookings(list);
        }
      },
      (error) => {
        console.warn('Firestore bookings listener note:', error);
      }
    );

    // 5. Staff Listener
    const unsubStaff = onSnapshot(
      collection(db, 'staff'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Staff[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as Staff);
          });
          setStaff(list);
        }
      },
      (error) => {
        console.warn('Firestore staff listener note:', error);
      }
    );

    // 6. Coupons Listener
    const unsubCoupons = onSnapshot(
      collection(db, 'coupons'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Coupon[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as Coupon);
          });
          setCoupons(list);
        }
      },
      (error) => {
        console.warn('Firestore coupons listener note:', error);
      }
    );

    // 7. Offers Listener
    const unsubOffers = onSnapshot(
      collection(db, 'offers'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Offer[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as Offer);
          });
          setOffers(list);
        }
      },
      (error) => {
        console.warn('Firestore offers listener note:', error);
      }
    );

    // 8. Reviews Listener
    const unsubReviews = onSnapshot(
      collection(db, 'reviews'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Review[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as Review);
          });
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setReviews(list);
        }
      },
      (error) => {
        console.warn('Firestore reviews listener note:', error);
      }
    );

    // 9. FAQs Listener
    const unsubFaqs = onSnapshot(
      collection(db, 'faqs'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: FAQ[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as FAQ);
          });
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          setFaqs(list);
        }
      },
      (error) => {
        console.warn('Firestore faqs listener note:', error);
      }
    );

    // 10. Global Settings Listener
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'global_settings'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as WebsiteSettings);
        }
      },
      (error) => {
        console.warn('Firestore settings listener note:', error);
      }
    );

    // 11. Audit Logs Listener
    const unsubAudit = onSnapshot(
      collection(db, 'auditLogs'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: AuditLog[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as AuditLog);
          });
          list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setAuditLogs(list);
        }
      },
      (error) => {
        console.warn('Firestore auditLogs listener note:', error);
      }
    );

    // 12. Contact Messages Listener
    const unsubContact = onSnapshot(
      collection(db, 'contactMessages'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ContactMessage[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as ContactMessage);
          });
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setContactMessages(list);
        }
      },
      (error) => {
        console.warn('Firestore contactMessages listener note:', error);
      }
    );

    // 13. Notifications Listener
    const unsubNotifs = onSnapshot(
      collection(db, 'notifications'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: AppNotification[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as AppNotification);
          });
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setNotifications(list);
        }
      },
      (error) => {
        console.warn('Firestore notifications listener note:', error);
      }
    );

    return () => {
      isSubscribed = false;
      unsubServices();
      unsubCategories();
      unsubAddons();
      unsubBookings();
      unsubStaff();
      unsubCoupons();
      unsubOffers();
      unsubReviews();
      unsubFaqs();
      unsubSettings();
      unsubAudit();
      unsubContact();
      unsubNotifs();
    };
  }, []);

  const logAudit = async (action: string, module: AuditLog['module'], recordId: string, details?: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      adminId: 'adm-current',
      adminName: 'Super Admin',
      action,
      module,
      recordId,
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    if (db) {
      try {
        await setDoc(doc(db, 'auditLogs', newLog.id), newLog);
      } catch (err) {
        console.warn('Firestore log audit note:', err);
      }
    }
  };

  const addNotification = async (title: string, message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (db) {
      try {
        await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
      } catch (err) {
        console.warn('Firestore notification note:', err);
      }
    }
  };

  // SERVICES CRUD
  const addService = async (serviceData: Omit<Service, 'id' | 'createdAt'>): Promise<Service> => {
    const id = `srv-${Date.now()}`;
    const newService: Service = {
      ...serviceData,
      id,
      createdAt: new Date().toISOString()
    };
    setServices((prev) => [newService, ...prev]);

    if (db) {
      try {
        await setDoc(doc(db, 'services', id), newService);
        if (newService.packages) {
          for (const pkg of newService.packages) {
            await setDoc(doc(db, 'packages', pkg.id), pkg);
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `services/${id}`);
      }
    }

    logAudit(`Added new service: "${newService.name}"`, 'Services', id);
    return newService;
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return { ...s, ...updates };
        }
        return s;
      })
    );

    if (db) {
      try {
        await updateDoc(doc(db, 'services', id), updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `services/${id}`);
      }
    }

    logAudit(`Updated service details for ID: ${id}`, 'Services', id);
  };

  const deleteService = async (id: string) => {
    const s = services.find((x) => x.id === id);
    setServices((prev) => prev.filter((x) => x.id !== id));

    if (db) {
      try {
        await deleteDoc(doc(db, 'services', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
      }
    }

    logAudit(`Deleted service: "${s?.name || id}"`, 'Services', id);
  };

  const toggleServiceStatus = async (id: string) => {
    const target = services.find((s) => s.id === id);
    if (!target) return;
    const newStatus = !target.isActive;

    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: newStatus } : s))
    );

    if (db) {
      try {
        await updateDoc(doc(db, 'services', id), { isActive: newStatus });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `services/${id}`);
      }
    }
  };

  // CATEGORIES CRUD
  const addCategory = async (categoryData: Omit<ServiceCategory, 'id'>) => {
    const id = `cat-${Date.now()}`;
    const newCat: ServiceCategory = { ...categoryData, id };
    setCategories((prev) => [...prev, newCat]);

    if (db) {
      try {
        await setDoc(doc(db, 'serviceCategories', id), newCat);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `serviceCategories/${id}`);
      }
    }
    logAudit(`Added category: "${newCat.name}"`, 'Services', id);
  };

  const updateCategory = async (id: string, updates: Partial<ServiceCategory>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    if (db) {
      try {
        await updateDoc(doc(db, 'serviceCategories', id), updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `serviceCategories/${id}`);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (db) {
      try {
        await deleteDoc(doc(db, 'serviceCategories', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `serviceCategories/${id}`);
      }
    }
  };

  // PACKAGES CRUD (Syncs to Service and Package docs)
  const addPackageToService = async (serviceId: string, pkg: Omit<ServicePackage, 'id' | 'serviceId'>) => {
    const id = `pkg-${Date.now()}`;
    const newPkg: ServicePackage = { ...pkg, id, serviceId };

    const targetService = services.find((s) => s.id === serviceId);
    if (!targetService) return;

    const existingPackages = targetService.packages || [];
    const updatedPackages = [...existingPackages, newPkg];
    const lowestPrice = Math.min(...updatedPackages.map((p) => p.price));

    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          return {
            ...s,
            packages: updatedPackages,
            startingPrice: lowestPrice
          };
        }
        return s;
      })
    );

    if (db) {
      try {
        await setDoc(doc(db, 'packages', id), newPkg);
        await updateDoc(doc(db, 'services', serviceId), {
          packages: updatedPackages,
          startingPrice: lowestPrice
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `services/${serviceId}`);
      }
    }

    logAudit(`Added package "${newPkg.name}" (₹${newPkg.price}) to service ${serviceId}`, 'Services', serviceId);
  };

  const updateServicePackage = async (serviceId: string, packageId: string, updates: Partial<ServicePackage>) => {
    const targetService = services.find((s) => s.id === serviceId);
    if (!targetService || !targetService.packages) return;

    const updatedPackages = targetService.packages.map((p) => (p.id === packageId ? { ...p, ...updates } : p));
    const lowestPrice = Math.min(...updatedPackages.map((p) => p.price));

    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          return {
            ...s,
            packages: updatedPackages,
            startingPrice: lowestPrice
          };
        }
        return s;
      })
    );

    if (db) {
      try {
        await updateDoc(doc(db, 'packages', packageId), updates);
        await updateDoc(doc(db, 'services', serviceId), {
          packages: updatedPackages,
          startingPrice: lowestPrice
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `services/${serviceId}`);
      }
    }

    logAudit(`Updated package price/details for "${packageId}" in service ${serviceId}`, 'Services', serviceId);
  };

  const deleteServicePackage = async (serviceId: string, packageId: string) => {
    const targetService = services.find((s) => s.id === serviceId);
    if (!targetService || !targetService.packages) return;

    const updatedPackages = targetService.packages.filter((p) => p.id !== packageId);
    const lowestPrice = updatedPackages.length > 0 ? Math.min(...updatedPackages.map((p) => p.price)) : targetService.startingPrice;

    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          return {
            ...s,
            packages: updatedPackages,
            startingPrice: lowestPrice
          };
        }
        return s;
      })
    );

    if (db) {
      try {
        await deleteDoc(doc(db, 'packages', packageId));
        await updateDoc(doc(db, 'services', serviceId), {
          packages: updatedPackages,
          startingPrice: lowestPrice
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `packages/${packageId}`);
      }
    }
  };

  // ADDONS CRUD
  const addAddon = async (addonData: Omit<ServiceAddon, 'id'>) => {
    const id = `addon-${Date.now()}`;
    const newAddon: ServiceAddon = { ...addonData, id };
    setAddons((prev) => [...prev, newAddon]);

    if (db) {
      try {
        await setDoc(doc(db, 'addons', id), newAddon);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `addons/${id}`);
      }
    }
    logAudit(`Created add-on: "${newAddon.name}"`, 'Services', id);
  };

  const updateAddon = async (id: string, updates: Partial<ServiceAddon>) => {
    setAddons((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    if (db) {
      try {
        await updateDoc(doc(db, 'addons', id), updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `addons/${id}`);
      }
    }
  };

  const deleteAddon = async (id: string) => {
    setAddons((prev) => prev.filter((a) => a.id !== id));
    if (db) {
      try {
        await deleteDoc(doc(db, 'addons', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `addons/${id}`);
      }
    }
  };

  // BOOKINGS (Real-Time Firestore Sync with Price Protection)
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

    if (db) {
      try {
        await setDoc(doc(db, 'bookings', id), newBooking);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `bookings/${id}`);
      }
    }

    // If coupon was used, increment usedCount in Firestore
    if (bookingData.couponCode) {
      const cpn = coupons.find((c) => c.code.toUpperCase() === bookingData.couponCode?.toUpperCase());
      if (cpn) {
        const newCount = cpn.usedCount + 1;
        setCoupons((prev) =>
          prev.map((c) => (c.id === cpn.id ? { ...c, usedCount: newCount } : c))
        );
        if (db) {
          try {
            await updateDoc(doc(db, 'coupons', cpn.id), { usedCount: newCount });
          } catch (err) {
            console.warn('Coupon count increment note:', err);
          }
        }
      }
    }

    addNotification(
      'New Booking Confirmed!',
      `${newBooking.customerName} booked ${newBooking.serviceName} (${bookingId}) for ₹${newBooking.totalAmount.toLocaleString()}`,
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
    const target = bookings.find((b) => b.bookingId === bookingId || b.id === bookingId);
    const docId = target?.id || bookingId;

    const updates: Partial<Booking> = {
      bookingStatus: status,
      updatedAt: new Date().toISOString()
    };
    if (notes !== undefined) updates.adminNotes = notes;
    if (staffId !== undefined) updates.assignedStaffId = staffId;
    if (staffName !== undefined) updates.assignedStaffName = staffName;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId || b.id === bookingId) {
          return { ...b, ...updates };
        }
        return b;
      })
    );

    if (db) {
      try {
        await updateDoc(doc(db, 'bookings', docId), updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${docId}`);
      }
    }

    logAudit(`Changed booking ${bookingId} status to "${status.replace('_', ' ').toUpperCase()}"`, 'Bookings', bookingId);
  };

  const assignStaffToBooking = async (bookingId: string, staffId: string) => {
    const staffMember = staff.find((s) => s.id === staffId || s.staffId === staffId);
    if (!staffMember) return;

    const target = bookings.find((b) => b.bookingId === bookingId || b.id === bookingId);
    const docId = target?.id || bookingId;

    const updates: Partial<Booking> = {
      assignedStaffId: staffMember.id,
      assignedStaffName: staffMember.name,
      assignedStaffPhone: staffMember.mobile,
      assignmentTime: new Date().toISOString(),
      bookingStatus: target?.bookingStatus === 'pending' ? 'assigned' : (target?.bookingStatus || 'assigned'),
      updatedAt: new Date().toISOString()
    };

    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId || b.id === bookingId) {
          return { ...b, ...updates };
        }
        return b;
      })
    );

    if (db) {
      try {
        await updateDoc(doc(db, 'bookings', docId), updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${docId}`);
      }
    }

    addNotification(
      'Staff Assigned',
      `${staffMember.name} has been assigned to job ${bookingId}`,
      'staff'
    );
    logAudit(`Assigned cleaner "${staffMember.name}" to booking ${bookingId}`, 'Bookings', bookingId);
  };

  const rescheduleBooking = async (bookingId: string, date: string, timeSlot: string) => {
    const target = bookings.find((b) => b.bookingId === bookingId || b.id === bookingId);
    const docId = target?.id || bookingId;

    const updates: Partial<Booking> = {
      rescheduledFrom: target ? { date: target.date, timeSlot: target.timeSlot } : undefined,
      date,
      timeSlot,
      bookingStatus: 'rescheduled',
      updatedAt: new Date().toISOString()
    };

    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId || b.id === bookingId) {
          return { ...b, ...updates };
        }
        return b;
      })
    );

    if (db) {
      try {
        await updateDoc(doc(db, 'bookings', docId), updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${docId}`);
      }
    }

    logAudit(`Rescheduled booking ${bookingId} to ${date} (${timeSlot})`, 'Bookings', bookingId);
    addNotification('Booking Rescheduled', `Booking ${bookingId} rescheduled to ${date}, ${timeSlot}`, 'booking');
  };

  const cancelBooking = async (bookingId: string, reason?: string) => {
    const target = bookings.find((b) => b.bookingId === bookingId || b.id === bookingId);
    const docId = target?.id || bookingId;

    const updates: Partial<Booking> = {
      bookingStatus: 'cancelled',
      cancellationReason: reason || 'Customer requested cancellation',
      updatedAt: new Date().toISOString()
    };

    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId || b.id === bookingId) {
          return { ...b, ...updates };
        }
        return b;
      })
    );

    if (db) {
      try {
        await updateDoc(doc(db, 'bookings', docId), updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${docId}`);
      }
    }

    logAudit(`Cancelled booking ${bookingId}: ${reason || 'N/A'}`, 'Bookings', bookingId);
  };

  const updatePaymentStatus = async (bookingId: string, status: PaymentStatus, method?: PaymentMethod) => {
    const target = bookings.find((b) => b.bookingId === bookingId || b.id === bookingId);
    const docId = target?.id || bookingId;

    const updates: Partial<Booking> = {
      paymentStatus: status,
      paymentMethod: method || target?.paymentMethod || 'online',
      updatedAt: new Date().toISOString()
    };

    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId || b.id === bookingId) {
          return { ...b, ...updates };
        }
        return b;
      })
    );

    if (db) {
      try {
        await updateDoc(doc(db, 'bookings', docId), updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${docId}`);
      }
    }

    logAudit(`Updated payment status for ${bookingId} to "${status.toUpperCase()}"`, 'Payments', bookingId);
  };

  const addBookingInternalNotes = async (bookingId: string, notes: string) => {
    const target = bookings.find((b) => b.bookingId === bookingId || b.id === bookingId);
    const docId = target?.id || bookingId;

    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId || b.id === bookingId ? { ...b, adminNotes: notes } : b))
    );

    if (db) {
      try {
        await updateDoc(doc(db, 'bookings', docId), { adminNotes: notes });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${docId}`);
      }
    }
  };

  // STAFF CRUD
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

    if (db) {
      try {
        await setDoc(doc(db, 'staff', id), newStaff);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `staff/${id}`);
      }
    }
    logAudit(`Registered new cleaning staff: "${newStaff.name}" (${staffId})`, 'Staff', id);
  };

  const updateStaff = async (id: string, updates: Partial<Staff>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    if (db) {
      try {
        await updateDoc(doc(db, 'staff', id), updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `staff/${id}`);
      }
    }
    logAudit(`Updated staff profile for ID ${id}`, 'Staff', id);
  };

  const deleteStaff = async (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    if (db) {
      try {
        await deleteDoc(doc(db, 'staff', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `staff/${id}`);
      }
    }
  };

  // COUPONS CRUD
  const addCoupon = async (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const id = `cpn-${Date.now()}`;
    const newCoupon: Coupon = {
      ...couponData,
      id,
      code: couponData.code.toUpperCase().trim(),
      usedCount: 0
    };
    setCoupons((prev) => [...prev, newCoupon]);

    if (db) {
      try {
        await setDoc(doc(db, 'coupons', id), newCoupon);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `coupons/${id}`);
      }
    }
    logAudit(`Created coupon code: "${newCoupon.code}"`, 'Coupons', id);
  };

  const updateCoupon = async (id: string, updates: Partial<Coupon>) => {
    const normalizedUpdates = {
      ...updates,
      ...(updates.code ? { code: updates.code.toUpperCase().trim() } : {})
    };

    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...normalizedUpdates } : c))
    );

    if (db) {
      try {
        await updateDoc(doc(db, 'coupons', id), normalizedUpdates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `coupons/${id}`);
      }
    }
  };

  const deleteCoupon = async (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    if (db) {
      try {
        await deleteDoc(doc(db, 'coupons', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `coupons/${id}`);
      }
    }
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

  // OFFERS CRUD
  const addOffer = async (offerData: Omit<Offer, 'id'>) => {
    const id = `off-${Date.now()}`;
    const newOffer: Offer = { ...offerData, id };
    setOffers((prev) => [...prev, newOffer]);

    if (db) {
      try {
        await setDoc(doc(db, 'offers', id), newOffer);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `offers/${id}`);
      }
    }
  };

  const updateOffer = async (id: string, updates: Partial<Offer>) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    if (db) {
      try {
        await updateDoc(doc(db, 'offers', id), updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `offers/${id}`);
      }
    }
  };

  const deleteOffer = async (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    if (db) {
      try {
        await deleteDoc(doc(db, 'offers', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `offers/${id}`);
      }
    }
  };

  // REVIEWS CRUD
  const submitReview = async (reviewData: Omit<Review, 'id' | 'isApproved' | 'createdAt'>) => {
    const id = `rev-${Date.now()}`;
    const newRev: Review = {
      ...reviewData,
      id,
      isApproved: true,
      createdAt: new Date().toISOString()
    };
    setReviews((prev) => [newRev, ...prev]);

    // Mark booking review submitted
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === reviewData.bookingId || b.id === reviewData.bookingId ? { ...b, reviewSubmitted: true } : b))
    );

    if (db) {
      try {
        await setDoc(doc(db, 'reviews', id), newRev);
        const bkg = bookings.find((b) => b.bookingId === reviewData.bookingId || b.id === reviewData.bookingId);
        if (bkg) {
          await updateDoc(doc(db, 'bookings', bkg.id), { reviewSubmitted: true });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `reviews/${id}`);
      }
    }

    addNotification(
      'New Customer Review',
      `${reviewData.customerName} gave a ${reviewData.rating}-star review for ${reviewData.serviceName}`,
      'system'
    );
  };

  const toggleReviewApproval = async (id: string, isApproved: boolean) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved } : r)));
    if (db) {
      try {
        await updateDoc(doc(db, 'reviews', id), { isApproved });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `reviews/${id}`);
      }
    }
  };

  const deleteReview = async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    if (db) {
      try {
        await deleteDoc(doc(db, 'reviews', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `reviews/${id}`);
      }
    }
  };

  // FAQS CRUD
  const addFAQ = async (faqData: Omit<FAQ, 'id'>) => {
    const id = `faq-${Date.now()}`;
    const newFaq: FAQ = { ...faqData, id };
    setFaqs((prev) => [...prev, newFaq]);

    if (db) {
      try {
        await setDoc(doc(db, 'faqs', id), newFaq);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `faqs/${id}`);
      }
    }
  };

  const updateFAQ = async (id: string, updates: Partial<FAQ>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    if (db) {
      try {
        await updateDoc(doc(db, 'faqs', id), updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `faqs/${id}`);
      }
    }
  };

  const deleteFAQ = async (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    if (db) {
      try {
        await deleteDoc(doc(db, 'faqs', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `faqs/${id}`);
      }
    }
  };

  // CONTACT MESSAGES CRUD
  const submitContactMessage = async (msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) => {
    const id = `msg-${Date.now()}`;
    const newMsg: ContactMessage = {
      ...msg,
      id,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setContactMessages((prev) => [newMsg, ...prev]);

    if (db) {
      try {
        await setDoc(doc(db, 'contactMessages', id), newMsg);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `contactMessages/${id}`);
      }
    }

    addNotification('New Contact Inquiry', `${msg.name} sent an inquiry: "${msg.message.substring(0, 45)}..."`, 'system');
  };

  const updateContactMessageStatus = async (id: string, status: 'new' | 'in_review' | 'resolved') => {
    setContactMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    if (db) {
      try {
        await updateDoc(doc(db, 'contactMessages', id), { status });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `contactMessages/${id}`);
      }
    }
  };

  // NOTIFICATIONS
  const markNotificationRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (db) {
      try {
        await updateDoc(doc(db, 'notifications', id), { read: true });
      } catch (err) {
        console.warn('Mark notif read error:', err);
      }
    }
  };

  const clearAllNotifications = async () => {
    setNotifications([]);
  };

  // SETTINGS
  const updateSettings = async (newSettings: Partial<WebsiteSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);

    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'global_settings'), merged);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'settings/global_settings');
      }
    }

    logAudit('Updated business/website settings', 'Settings', 'global_settings');
  };

  const resetToDemoData = async () => {
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

    if (db) {
      try {
        // Re-seed firestore
        for (const srv of INITIAL_SERVICES) {
          await setDoc(doc(db, 'services', srv.id), srv);
        }
        for (const cat of INITIAL_CATEGORIES) {
          await setDoc(doc(db, 'serviceCategories', cat.id), cat);
        }
        for (const bkg of INITIAL_BOOKINGS) {
          await setDoc(doc(db, 'bookings', bkg.id), bkg);
        }
        await setDoc(doc(db, 'settings', 'global_settings'), INITIAL_SETTINGS);
      } catch (err) {
        console.warn('Reset Firestore error:', err);
      }
    }
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
        isFirestoreConnected,
        startCleaningTabTitle,
        stopCleaningTabTitle,
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

