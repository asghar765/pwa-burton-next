export interface Member {
  [x: string]: any;
  id: string;
  fullName: string;
  email: string;
  verified: boolean;
  address: string;
  postCode: string;
  town: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  maritalStatus: string;
  mobileNo: string;
  collector: string;
  nextOfKinName: string;
  nextOfKinAddress: string;
  nextOfKinPhone: string;
  dependants: Array<{
    // redacted
  }>;
  spouses: Array<{
    // redacted
  }>;
  membershipInfo: string;
  name?: string;
  role?: string;
  payments?: Payment[];
  notes?: Note[];
  membershipType?: string;
  membershipStatus?: string;
  membershipStartDate?: string;
  membershipEndDate?: string;
  lastPaymentDate?: string;
  totalPayments?: number;
}

export interface NewMember extends Omit<Member, 'id'> {
  // No changes needed here since 'id' is already omitted
}

export interface NewMember extends Omit<Member, 'id' | 'memberNumber'> {
  memberNumber?: string;
}

export interface MemberWithPayments extends Omit<Member, 'payments'> {
  payments: Payment[];
}

export interface MembersSectionProps {
  members: MemberWithPayments[];
  firebaseUsers: FirebaseUser[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  expandedMembers: Record<string, boolean>;
  setExpandedMembers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onUpdateMember: (id: string, member: Partial<Member>) => Promise<void>;
  onDeleteMember: (id: string) => Promise<void>;
  onRevokeMember: (id: string) => Promise<void>;
  currentUserRole: string;
  onAddPayment: (memberNumber: string, payment: Omit<Payment, 'id'>) => Promise<void>;
  onAddNote: (memberNumber: string, note: string) => Promise<void>;
  onUpdateUserRole: (userId: string, newRole: string) => Promise<void>;
}

export interface DatabaseSectionProps {
  collections: { name: string; count: number }[];
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  // ... other registration fields
}

export interface Collector {
  order: number;
  id: string;
  name: string;
  email: string;
  members?: Member[];
}

export interface Note {
  id: string;
  memberNumber: string;
  content: string;
  date: string; // ISO date string
}

export interface Payment {
  id: string;
  amount: number;
  date: string; // ISO date string
  memberNumber: string;
}

export interface User {
  uid?: string;
  id?: string;
  email?: string;
  displayName?: string;
  emailVerified?: boolean;
  isAnonymous?: boolean;
  metadata?: any;
  providerData?: any[];
  getIdTokenResult?: (forceRefresh?: boolean) => Promise<any>;
  getIdToken?: (forceRefresh?: boolean) => Promise<string>;
  refreshToken?: string;
  tenantId?: string | null;
  delete?: () => Promise<void>;
  // Add any other properties that your User type should have
}

export interface Expense {
  id: string;
  amount: number; // Changed from string to number
  description: string;
  date: string; // ISO date string
  userId: string;
}

export interface FirebaseUser {
  id: string;
  uid?: string;
  createdAt: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: string;
  providerData?: {
    providerId: string;
    uid: string;
    displayName: string;
    email: string;
    phoneNumber: string | null;
    photoURL: string;
  }[];
}

export interface LoggedUser extends Omit<User, 'reload' | 'toJSON'> {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  photoURL: string;
  role: string;
  // Add Google sign-in specific fields
  googleId?: string;
  accessToken?: string;
  idToken?: string;
  // Add other properties as needed
  reload?: () => Promise<void>;
  toJSON?: () => object;
}

export interface Collector {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  address?: string;
  members?: Member[];
}

export interface Settings {
  appName: string;
  contactEmail: string;
  contactPhone: string;
  companyLogo?: File;
}
