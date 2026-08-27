# Security Specification for Cleaning Flash

## 1. Data Invariants & Security Pillars
1. **User Security**: User documents under `/users/{userId}` can only be read and modified by the owning user (`request.auth.uid == userId`) or administrators. Users cannot self-escalate their `role` field.
2. **Catalog Integrity**: Collections `/services`, `/packages`, `/addons`, `/offers`, `/faqs`, and `/settings` are publicly readable by customers but strictly modifiable only by authenticated administrators.
3. **Booking Isolation**: Bookings in `/bookings/{bookingId}` can only be created by the authenticated customer who matches `customerId == request.auth.uid` or an admin. Customers can only read and query their own bookings (`resource.data.customerId == request.auth.uid`). Only admins can assign staff, modify internal notes, and alter payment records.
4. **Review Moderation**: Reviews in `/reviews/{reviewId}` are publicly readable only when `isApproved == true`, or by the author or an admin. Review creation requires authentication and `incoming().customerId == request.auth.uid`.
5. **Contact Messages & Notifications**: Customers can submit contact inquiries (`/contactMessages`), readable only by admins. In-app notifications are strictly partitioned by `recipientId == request.auth.uid` or admin.

## 2. The Dirty Dozen Payloads (Negative Tests)
1. Unauthenticated write to `/services/srv_1` -> Denied
2. Customer updating another customer's booking status to 'completed' -> Denied
3. Customer writing a booking with `customerId: "different_uid"` -> Denied
4. Customer self-assigning `role: "super_admin"` in `/users/{userId}` -> Denied
5. Unauthenticated read of PII in `/users/{userId}` -> Denied
6. Customer updating pricing in `/packages/pkg_1` -> Denied
7. Customer modifying `adminNotes` or `assignedStaffId` directly -> Denied
8. Unauthenticated creation of `/coupons` -> Denied
9. Customer querying all bookings across the platform without `where("customerId", "==", uid)` -> Denied
10. Malicious payload injecting oversized strings (>10KB) into service descriptions -> Denied
11. Reading unapproved reviews from other users -> Denied
12. Direct deletion of `/auditLogs` -> Denied
