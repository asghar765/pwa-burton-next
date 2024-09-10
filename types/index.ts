export interface Member {
  id: string;
  fullName: string;
  email: string;
  memberNumber: string;
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
    name: string;
    dateOfBirth: string;
    gender: string;
    category: string;
  }>;
  spouses: Array<{
    name: { value: string };
    dateOfBirth: { value: string };
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
  onAddPayment: (memberId: string, payment: Omit<Payment, 'id'>) => Promise<void>;
  onAddNote: (memberId: string, note: string) => Promise<void>;
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
  id: string;
  name: string;
  email: string;
  members?: Member[];
}

export interface Note {
  id: string;
  memberId: string;
  content: string;
  date: string; // ISO date string
}

export interface Payment {
  id: string;
  amount: number;
  date: string; // ISO date string
  memberNumber: string;
  memberId: string;
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
}
