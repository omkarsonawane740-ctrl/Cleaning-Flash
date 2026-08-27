export type AdminRole = 'super_admin' | 'manager' | 'booking_executive' | 'accounts' | 'customer';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

export type PaymentMethod = 'online' | 'cash';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface UserAddress {
  id: string;
  type: 'Home' | 'Office' | 'Villa' | 'Other';
  flatNo: string;
  building: string;
  address: string;
  area: string;
  city: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  name: string;
  phone?: string;
  role: AdminRole;
  avatar?: string;
  addresses?: UserAddress[];
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  isActive: boolean;
  order: number;
}

export interface ServicePackage {
  id: string;
  serviceId: string;
  name: string; // e.g. "1 BHK", "2 BHK", "3 BHK", "Villa/Bungalow"
  price: number;
  originalPrice?: number;
  duration: string; // e.g. "3 - 4 Hours"
  description?: string;
  includedServices: string[];
  isActive: boolean;
  isPopular?: boolean;
}

export interface ServiceAddon {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  isActive: boolean;
  category?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  shortDescription: string;
  image: string;
  startingPrice: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  includedItems: string[];
  excludedItems: string[];
  packages?: ServicePackage[];
  addons?: ServiceAddon[];
  faqs?: { question: string; answer: string }[];
  isActive: boolean;
  isPopular?: boolean;
  createdAt: string;
}

export interface SelectedAddon {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Booking {
  id: string;
  bookingId: string; // CF-XXXXXX
  customerId: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  serviceImage?: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  addons: SelectedAddon[];
  address: UserAddress;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10 AM - 12 PM"
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaffPhone?: string;
  assignmentTime?: string;
  customerNotes?: string;
  adminNotes?: string;
  cancellationReason?: string;
  rescheduledFrom?: { date: string; timeSlot: string };
  reviewSubmitted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  staffId: string; // CF-STF-01
  name: string;
  mobile: string;
  email: string;
  photo: string;
  serviceArea: string;
  skills: string[];
  rating: number;
  completedJobs: number;
  status: 'active' | 'busy' | 'inactive' | 'on_leave';
  joinedDate: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number; // e.g. 20 for 20% or 300 for ₹300
  minimumOrder: number;
  maximumDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  description: string;
}

export interface Offer {
  id: string;
  bannerImage: string;
  heading: string;
  description: string;
  discountBadge: string;
  couponCode: string;
  ctaText: string;
  ctaLink: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  serviceId: string;
  serviceName: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Booking' | 'Services' | 'Payment' | 'Safety';
  order: number;
  isActive: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceInterest?: string;
  message: string;
  status: 'new' | 'in_review' | 'resolved';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'system' | 'staff';
  recipientId?: string; // empty means broadcast to all admins
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  module: 'Bookings' | 'Services' | 'Staff' | 'Customers' | 'Payments' | 'Settings' | 'Coupons';
  recordId: string;
  timestamp: string;
  details?: string;
}

export interface PaymentRecord {
  id: string;
  paymentId: string;
  bookingId: string;
  customerName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  gatewayResponse?: string;
  createdAt: string;
}

export interface WebsiteSettings {
  business: {
    companyName: string;
    tagline: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    city: string;
    workingHours: string;
    emergencyAvailable: boolean;
  };
  booking: {
    advanceBookingHours: number;
    allowCancellationHours: number;
    allowRescheduleHours: number;
    timeSlots: string[];
    taxRatePercent: number;
    autoAssignStaff: boolean;
  };
  payment: {
    onlinePaymentEnabled: boolean;
    cashPaymentEnabled: boolean;
    razorpayKeyId?: string;
  };
  hero: {
    heading: string;
    subheading: string;
    heroImage: string;
    primaryCtaText: string;
    secondaryCtaText: string;
    badgeText: string;
  };
  about: {
    title: string;
    story: string;
    mission: string;
    qualityPromise: string;
    teamCount: string;
    servedCount: string;
    ratingScore: string;
  };
  social: {
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
  };
  footer: {
    aboutText: string;
    copyrightText: string;
  };
}
