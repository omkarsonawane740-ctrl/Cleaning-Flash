import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AdminRole, UserAddress } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  role: AdminRole;
  isLoading: boolean;
  loginCustomer: (email: string, name: string, phone?: string) => Promise<void>;
  loginAdmin: (email: string, role?: AdminRole) => Promise<boolean>;
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

  const isAdmin = user ? ['super_admin', 'manager', 'booking_executive', 'accounts'].includes(user.role) : false;
  const role: AdminRole = user ? user.role : 'customer';

  const loginCustomer = async (email: string, name: string, phone?: string) => {
    setIsLoading(true);
    // Simulate auth network
    await new Promise((r) => setTimeout(r, 400));
    const customerUser: UserProfile = {
      id: `usr-${Date.now()}`,
      uid: `cust-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      phone: phone || '',
      role: 'customer',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
      addresses: user?.addresses || DEMO_CUSTOMER.addresses,
      createdAt: new Date().toISOString()
    };
    setUser(customerUser);
    setIsLoading(false);
  };

  const loginAdmin = async (email: string, targetRole: AdminRole = 'super_admin') => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    
    // Accept admin login
    const adminUser: UserProfile = {
      id: `admin-${Date.now()}`,
      uid: `adm-cf-01`,
      email,
      name: email.includes('omkar') ? 'Omkar (Super Admin)' : 'Cleaning Flash Administrator',
      phone: '+91 80000 25326',
      role: targetRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString()
    };
    setUser(adminUser);
    setIsLoading(false);
    return true;
  };

  const switchAdminRoleForTesting = (newRole: AdminRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
    } else {
      setUser({
        ...DEMO_CUSTOMER,
        role: newRole,
        name: `Admin (${newRole.replace('_', ' ').toUpperCase()})`
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data, updatedAt: new Date().toISOString() });
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
      setUser({ ...user, addresses: updatedAddresses });
    }
    return address;
  };

  const updateAddress = async (updatedAddr: UserAddress) => {
    if (!user || !user.addresses) return;
    const updated = user.addresses.map((a) => (a.id === updatedAddr.id ? updatedAddr : a));
    setUser({ ...user, addresses: updated });
  };

  const deleteAddress = async (addressId: string) => {
    if (!user || !user.addresses) return;
    const updated = user.addresses.filter((a) => a.id !== addressId);
    setUser({ ...user, addresses: updated });
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!user || !user.addresses) return;
    const updated = user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId
    }));
    setUser({ ...user, addresses: updated });
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
