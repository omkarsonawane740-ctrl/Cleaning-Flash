import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AdminRole, UserAddress } from '../types';
import { auth, db, googleProvider } from '../services/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  role: AdminRole;
  isLoading: boolean;
  loginCustomer: (email: string, name: string, phone?: string) => Promise<void>;
  loginAdmin: (email: string, role?: AdminRole) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  addAddress: (address: Omit<UserAddress, 'id'>) => Promise<UserAddress>;
  updateAddress: (address: UserAddress) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  switchAdminRoleForTesting: (role: AdminRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CUSTOMER: UserProfile = {
  id: 'usr-demo-customer',
  uid: 'cust-demo-1',
  email: 'omkarsonawane740@gmail.com',
  name: 'Omkar Sonawane',
  phone: '+91 98765 43210',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  addresses: [
    {
      id: 'addr-1',
      type: 'Home',
      flatNo: 'Flat 402',
      building: 'Sunrise Heights, Tower B',
      address: 'Near Central Green Park, Baner',
      area: 'Baner',
      city: 'Pune',
      pincode: '411045',
      landmark: 'Opposite State Bank',
      isDefault: true
    },
    {
      id: 'addr-2',
      type: 'Office',
      flatNo: 'Suite 302',
      building: 'EON IT Park, Cluster D',
      address: 'Kharadi Bypass',
      area: 'Kharadi',
      city: 'Pune',
      pincode: '411014',
      landmark: 'Near World Trade Center',
      isDefault: false
    }
  ],
  createdAt: '2026-01-01T00:00:00.000Z'
};

const STORAGE_KEY_USER = 'cf_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEMO_CUSTOMER;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  // Sync with Firebase Auth state
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          if (db) {
            const userDocSnap = await getDoc(doc(db, 'users', fbUser.uid));
            if (userDocSnap.exists()) {
              setUser(userDocSnap.data() as UserProfile);
              return;
            }
          }
        } catch (e) {
          console.warn('Firebase user doc fetch note:', e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = user ? ['super_admin', 'manager', 'booking_executive', 'accounts'].includes(user.role) : false;
  const role: AdminRole = user ? user.role : 'customer';

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      if (auth) {
        const res = await signInWithPopup(auth, googleProvider);
        const fbUser = res.user;
        const profile: UserProfile = {
          id: fbUser.uid,
          uid: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || 'Customer',
          phone: fbUser.phoneNumber || '',
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fbUser.displayName || 'User')}`,
          role: fbUser.email === 'omkarsonawane740@gmail.com' ? 'super_admin' : 'customer',
          addresses: DEMO_CUSTOMER.addresses,
          createdAt: new Date().toISOString()
        };
        setUser(profile);
        if (db) {
          await setDoc(doc(db, 'users', fbUser.uid), profile, { merge: true });
        }
      }
    } catch (err) {
      console.warn('Google sign-in fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loginCustomer = async (email: string, name: string, phone?: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const uid = `usr-${Date.now()}`;
    const customerUser: UserProfile = {
      id: uid,
      uid,
      email,
      name: name || email.split('@')[0],
      phone: phone || '',
      role: 'customer',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
      addresses: user?.addresses || DEMO_CUSTOMER.addresses,
      createdAt: new Date().toISOString()
    };
    setUser(customerUser);

    if (db) {
      try {
        await setDoc(doc(db, 'users', customerUser.id), customerUser);
      } catch (err) {
        console.warn('Save user doc note:', err);
      }
    }

    setIsLoading(false);
  };

  const loginAdmin = async (email: string, targetRole: AdminRole = 'super_admin') => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    
    const adminUser: UserProfile = {
      id: `adm-cf-01`,
      uid: `adm-cf-01`,
      email,
      name: email.includes('omkar') ? 'Omkar Sonawane (Super Admin)' : 'Cleaning Flash Administrator',
      phone: '+91 80000 25326',
      role: targetRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString()
    };
    setUser(adminUser);

    if (db) {
      try {
        await setDoc(doc(db, 'admins', adminUser.id), adminUser);
        await setDoc(doc(db, 'users', adminUser.id), adminUser);
      } catch (err) {
        console.warn('Save admin doc note:', err);
      }
    }

    setIsLoading(false);
    return true;
  };

  const switchAdminRoleForTesting = (newRole: AdminRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      if (db && user.id) {
        setDoc(doc(db, 'users', user.id), updated, { merge: true }).catch(() => {});
      }
    } else {
      setUser({
        ...DEMO_CUSTOMER,
        role: newRole,
        name: `Admin (${newRole.replace('_', ' ').toUpperCase()})`
      });
    }
  };

  const logout = () => {
    if (auth) {
      signOut(auth).catch(() => {});
    }
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
    setUser(updated);
    if (db && user.id) {
      try {
        await setDoc(doc(db, 'users', user.id), updated, { merge: true });
      } catch (e) {
        console.warn('Update user profile doc note:', e);
      }
    }
  };

  const addAddress = async (newAddr: Omit<UserAddress, 'id'>): Promise<UserAddress> => {
    const address: UserAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };

    if (user) {
      const existingAddresses = user.addresses || [];
      const updatedAddresses = address.isDefault
        ? existingAddresses.map((a) => ({ ...a, isDefault: false })).concat(address)
        : [...existingAddresses, address];
      const updatedUser = { ...user, addresses: updatedAddresses };
      setUser(updatedUser);

      if (db && user.id) {
        try {
          await updateDoc(doc(db, 'users', user.id), { addresses: updatedAddresses });
        } catch (e) {
          console.warn('Update address doc note:', e);
        }
      }
    }
    return address;
  };

  const updateAddress = async (updatedAddr: UserAddress) => {
    if (!user || !user.addresses) return;
    const updated = user.addresses.map((a) => (a.id === updatedAddr.id ? updatedAddr : a));
    const updatedUser = { ...user, addresses: updated };
    setUser(updatedUser);

    if (db && user.id) {
      try {
        await updateDoc(doc(db, 'users', user.id), { addresses: updated });
      } catch (e) {
        console.warn('Update address doc note:', e);
      }
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!user || !user.addresses) return;
    const updated = user.addresses.filter((a) => a.id !== addressId);
    const updatedUser = { ...user, addresses: updated };
    setUser(updatedUser);

    if (db && user.id) {
      try {
        await updateDoc(doc(db, 'users', user.id), { addresses: updated });
      } catch (e) {
        console.warn('Delete address doc note:', e);
      }
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!user || !user.addresses) return;
    const updated = user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId
    }));
    const updatedUser = { ...user, addresses: updated };
    setUser(updatedUser);

    if (db && user.id) {
      try {
        await updateDoc(doc(db, 'users', user.id), { addresses: updated });
      } catch (e) {
        console.warn('Set default address doc note:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        role,
        isLoading,
        loginCustomer,
        loginAdmin,
        loginWithGoogle,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        switchAdminRoleForTesting
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

