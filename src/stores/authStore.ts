import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isSuperAdmin?: boolean;
  phone?: string;
  createdAt?: string;
  isActive?: boolean;
  activeView?: string;
  permissions?: {
    canBid?: boolean;
    canListProperties?: boolean;
    emailNotifications?: boolean;
    smsAlerts?: boolean;
  };
  roleRequest?: {
    requestedRole?: string;
    status?: string;
    requestedAt?: string;
  };
  agentDetails?: {
    companyName?: string;
    licenseNumber?: string;
    companyAddress?: string;
    commissionRate?: number;
    specialization?: string;
  };
  bankDetails?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    sortCode?: string;
    iban?: string;
    bankAddress?: string;
  };
  notificationSettings?: {
    bidPlaced?: boolean;
    outbid?: boolean;
    auctionWon?: boolean;
    auctionLost?: boolean;
    auctionStarted?: boolean;
    propertyApproved?: boolean;
    propertyRejected?: boolean;
    propertySold?: boolean;
    newBidOnProperty?: boolean;
    newEnquiry?: boolean;
    messageReceived?: boolean;
  };
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  activeView: string | null; // NOT persisted - derived fresh each session
  login: (token: string, user: User) => void;
  logout: () => void;
  setActiveView: (view: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      token: localStorage.getItem('token'),
      user: JSON.parse(localStorage.getItem('user') || 'null'),
      isAuthenticated: !!(localStorage.getItem('token') && localStorage.getItem('user')),
      activeView: null, // Always starts null - derived on mount

      login: (token, userData) => {
        // Strip activeView from stored user - managed separately in memory
        const { activeView: _view, ...userWithoutView } = userData as any;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userWithoutView));

        // Derive correct view from permissions/role
        const role = userData.role;
        const canBid = userData.permissions?.canBid === true;
        const canList = userData.permissions?.canListProperties === true;
        const correctView =
          (role === 'seller' || role === 'agent') && !canBid ? 'seller' :
          canBid && !canList ? 'buyer' :
          (role === 'seller' || role === 'agent') ? 'seller' :
          'buyer';

        set({
          token,
          user: userWithoutView as User,
          isAuthenticated: true,
          activeView: correctView,
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null, isAuthenticated: false, activeView: null });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("app:logout"));
        }
      },

      setActiveView: (view: string) => {
        set({ activeView: view });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // activeView intentionally excluded - not persisted
      }),
    }
  )
);
