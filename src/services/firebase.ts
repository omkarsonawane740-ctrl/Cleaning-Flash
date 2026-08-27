import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  Firestore,
  writeBatch
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
  signInAnonymously
} from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseConfigData from '../../firebase-applet-config.json';
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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let appInstance: FirebaseApp;
let dbInstance: Firestore;
let authInstance: Auth;
let storageInstance: FirebaseStorage;
let isFirebaseInitialized = false;

// Resolve Firebase configuration for project: cleaning-flash
const projectId =
  import.meta.env.VITE_FIREBASE_PROJECT_ID ||
  firebaseConfigData.projectId ||
  'cleaning-flash';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigData.apiKey || 'AIzaSyDYUgoMsTS0GNsmI6gVvUTMm5VnvNQvL4Q',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigData.authDomain || `${projectId}.firebaseapp.com`,
  projectId: projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigData.storageBucket || `${projectId}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigData.messagingSenderId || '438258239671',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigData.appId || `1:438258239671:web:cleaning-flash`
};

try {
  appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  const dbId = import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfigData.firestoreDatabaseId;
  if (dbId && dbId.trim() !== '') {
    dbInstance = getFirestore(appInstance, dbId.trim());
  } else {
    dbInstance = getFirestore(appInstance);
  }
  
  authInstance = getAuth(appInstance);
  storageInstance = getStorage(appInstance);
  isFirebaseInitialized = true;
  console.log(`Firebase initialized successfully with project:\n${firebaseConfig.projectId}`);
} catch (e) {
  console.warn('Firebase initialization note:', e);
  const fallbackConfig = {
    apiKey: 'AIzaSyDYUgoMsTS0GNsmI6gVvUTMm5VnvNQvL4Q',
    authDomain: 'cleaning-flash.firebaseapp.com',
    projectId: 'cleaning-flash',
    storageBucket: 'cleaning-flash.firebasestorage.app',
    messagingSenderId: '438258239671',
    appId: '1:438258239671:web:cleaning-flash'
  };
  appInstance = getApps().length === 0 ? initializeApp(fallbackConfig) : getApp();
  const dbId = firebaseConfigData.firestoreDatabaseId;
  if (dbId && dbId.trim() !== '') {
    dbInstance = getFirestore(appInstance, dbId.trim());
  } else {
    dbInstance = getFirestore(appInstance);
  }
  authInstance = getAuth(appInstance);
  storageInstance = getStorage(appInstance);
  console.log(`Firebase initialized successfully with project:\n${fallbackConfig.projectId}`);
}

export const app = appInstance;
export const db = dbInstance;
export const auth = authInstance;
export const storage = storageInstance;
export const googleProvider = new GoogleAuthProvider();

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = authInstance?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// State trackers to prevent duplicate checks and warnings
let seedCheckInProgress = false;
let seedCheckCompleted = false;
let seedCheckPromise: Promise<boolean> | null = null;

// Seed the database with complete initial data if Firestore is empty
export async function seedFirestoreDatabaseIfEmpty(): Promise<boolean> {
  if (!db) return false;
  if (seedCheckCompleted) return true;
  if (seedCheckInProgress && seedCheckPromise) {
    return seedCheckPromise;
  }

  seedCheckInProgress = true;

  seedCheckPromise = (async () => {
    try {
      // 1. Efficient check using limit(1) to avoid large payload reads
      const servicesQuery = query(collection(db, 'services'), limit(1));
      
      // Safe fetch with a generous 10-second timeout that resolves gracefully
      const fetchWithTimeout = new Promise<boolean>((resolve) => {
        const timeoutId = setTimeout(() => {
          // Resolve false gracefully rather than throwing an unhandled rejection
          resolve(false);
        }, 10000);

        getDocs(servicesQuery)
          .then((servicesSnap) => {
            clearTimeout(timeoutId);
            if (!servicesSnap.empty) {
              seedCheckCompleted = true;
              resolve(false); // Already has data, no seeding needed
            } else {
              resolve(true); // Empty, proceed with seeding
            }
          })
          .catch((err) => {
            clearTimeout(timeoutId);
            console.info('Firestore background connectivity status: Operating with client cache', err?.message || err);
            resolve(false);
          });
      });

      const needsSeed = await fetchWithTimeout;

      if (!needsSeed) {
        seedCheckCompleted = true;
        seedCheckInProgress = false;
        return false;
      }

      // Check if another check ran while awaiting
      if (seedCheckCompleted) {
        seedCheckInProgress = false;
        return false;
      }

      console.log('Seeding initial Firestore catalog data...');
      const batch = writeBatch(db);

      // 1. Categories
      for (const cat of INITIAL_CATEGORIES) {
        batch.set(doc(db, 'serviceCategories', cat.id), cat, { merge: true });
      }

      // 2. Services
      for (const srv of INITIAL_SERVICES) {
        batch.set(doc(db, 'services', srv.id), srv, { merge: true });
        if (srv.packages) {
          for (const pkg of srv.packages) {
            batch.set(doc(db, 'packages', pkg.id), pkg, { merge: true });
          }
        }
      }

      // 3. Addons
      for (const addon of INITIAL_ADDONS) {
        batch.set(doc(db, 'addons', addon.id), addon, { merge: true });
      }

      // 4. Staff
      for (const staffMember of INITIAL_STAFF) {
        batch.set(doc(db, 'staff', staffMember.id), staffMember, { merge: true });
      }

      // 5. Coupons
      for (const cpn of INITIAL_COUPONS) {
        batch.set(doc(db, 'coupons', cpn.id), cpn, { merge: true });
      }

      // 6. Offers
      for (const off of INITIAL_OFFERS) {
        batch.set(doc(db, 'offers', off.id), off, { merge: true });
      }

      // 7. Reviews
      for (const rev of INITIAL_REVIEWS) {
        batch.set(doc(db, 'reviews', rev.id), rev, { merge: true });
      }

      // 8. FAQs
      for (const faq of INITIAL_FAQS) {
        batch.set(doc(db, 'faqs', faq.id), faq, { merge: true });
      }

      // 9. Initial Bookings
      for (const bkg of INITIAL_BOOKINGS) {
        batch.set(doc(db, 'bookings', bkg.id), bkg, { merge: true });
      }

      // 10. Global Settings
      batch.set(doc(db, 'settings', 'global_settings'), INITIAL_SETTINGS, { merge: true });

      await batch.commit();
      console.log('Firestore catalog data seeded successfully.');
      seedCheckCompleted = true;
      seedCheckInProgress = false;
      return true;
    } catch (err) {
      console.info('Firestore seed synchronization note: will retry in background', err);
      seedCheckInProgress = false;
      return false;
    }
  })();

  return seedCheckPromise;
}

export { isFirebaseInitialized };
