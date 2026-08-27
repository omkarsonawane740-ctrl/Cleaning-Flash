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

let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let isFirebaseInitialized = false;

try {
  const firebaseConfig = {
    apiKey: firebaseConfigData.apiKey,
    authDomain: firebaseConfigData.authDomain,
    projectId: firebaseConfigData.projectId,
    storageBucket: firebaseConfigData.storageBucket,
    messagingSenderId: firebaseConfigData.messagingSenderId,
    appId: firebaseConfigData.appId
  };

  appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  if (firebaseConfigData.firestoreDatabaseId) {
    dbInstance = getFirestore(appInstance, firebaseConfigData.firestoreDatabaseId);
  } else {
    dbInstance = getFirestore(appInstance);
  }
  
  authInstance = getAuth(appInstance);
  isFirebaseInitialized = true;
  console.log('Firebase initialized successfully with project:', firebaseConfigData.projectId);
} catch (e) {
  console.warn('Firebase initialization fallback:', e);
  const fallbackConfig = {
    apiKey: 'AIzaSyDYUgoMsTS0GNsmI6gVvUTMm5VnvNQvL4Q',
    authDomain: 'gen-lang-client-0442123702.firebaseapp.com',
    projectId: 'gen-lang-client-0442123702'
  };
  appInstance = getApps().length === 0 ? initializeApp(fallbackConfig) : getApp();
  dbInstance = getFirestore(appInstance);
  authInstance = getAuth(appInstance);
}

export const app = appInstance as FirebaseApp;
export const db = dbInstance as Firestore;
export const auth = authInstance as Auth;
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

// Seed the database with complete initial data if Firestore is empty
export async function seedFirestoreDatabaseIfEmpty(): Promise<boolean> {
  if (!db) return false;
  try {
    const servicesSnap = await getDocs(collection(db, 'services'));
    if (!servicesSnap.empty) {
      console.log('Firestore already contains data (', servicesSnap.size, 'services). Skipping seed.');
      return false;
    }

    console.log('Seeding initial data into Firestore...');
    const batch = writeBatch(db);

    // 1. Categories
    for (const cat of INITIAL_CATEGORIES) {
      batch.set(doc(db, 'serviceCategories', cat.id), cat);
    }

    // 2. Services
    for (const srv of INITIAL_SERVICES) {
      batch.set(doc(db, 'services', srv.id), srv);
      // Also add individual package documents in packages collection
      if (srv.packages) {
        for (const pkg of srv.packages) {
          batch.set(doc(db, 'packages', pkg.id), pkg);
        }
      }
    }

    // 3. Addons
    for (const addon of INITIAL_ADDONS) {
      batch.set(doc(db, 'addons', addon.id), addon);
    }

    // 4. Staff
    for (const staffMember of INITIAL_STAFF) {
      batch.set(doc(db, 'staff', staffMember.id), staffMember);
    }

    // 5. Coupons
    for (const cpn of INITIAL_COUPONS) {
      batch.set(doc(db, 'coupons', cpn.id), cpn);
    }

    // 6. Offers
    for (const off of INITIAL_OFFERS) {
      batch.set(doc(db, 'offers', off.id), off);
    }

    // 7. Reviews
    for (const rev of INITIAL_REVIEWS) {
      batch.set(doc(db, 'reviews', rev.id), rev);
    }

    // 8. FAQs
    for (const faq of INITIAL_FAQS) {
      batch.set(doc(db, 'faqs', faq.id), faq);
    }

    // 9. Initial Bookings
    for (const bkg of INITIAL_BOOKINGS) {
      batch.set(doc(db, 'bookings', bkg.id), bkg);
    }

    // 10. Global Settings
    batch.set(doc(db, 'settings', 'global_settings'), INITIAL_SETTINGS);

    await batch.commit();
    console.log('Firestore seed completed successfully!');
    return true;
  } catch (err) {
    console.error('Error while seeding Firestore:', err);
    return false;
  }
}

export { isFirebaseInitialized };

