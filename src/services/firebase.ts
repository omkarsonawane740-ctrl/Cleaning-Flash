import { initializeApp, getApps, getApp } from 'firebase/app';
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
  Timestamp
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';

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

let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let isFirebaseInitialized = false;

// Attempt loading configuration if present
try {
  // Standard AI Studio config path or fallback
  const config = {
    apiKey: "AIzaSyFakeKeyPlaceholderForBuildSafety12345",
    authDomain: "cleaning-flash.firebaseapp.com",
    projectId: "cleaning-flash",
    storageBucket: "cleaning-flash.appspot.com",
    messagingSenderId: "138532473968",
    appId: "1:138532473968:web:abcdef123456"
  };

  const app = getApps().length === 0 ? initializeApp(config) : getApp();
  dbInstance = getFirestore(app);
  authInstance = getAuth(app);
  isFirebaseInitialized = true;
} catch (e) {
  console.warn("Firebase initialized in fallback mode:", e);
}

export const db = dbInstance as Firestore;
export const auth = authInstance as Auth;

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
      providerInfo: currentUser?.providerData?.map(provider => ({
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

export { isFirebaseInitialized };
