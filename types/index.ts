export interface Member {
  id: string;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
  memberNumber?: string;
  verified?: boolean;
  payments?: Payment[];
  notes?: Note[];
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  membershipInfo?: string;
  mobileNo?: string;
  nextOfKinName?: string;
  nextOfKinAddress?: string;
  nextOfKinPhone?: string;
  placeOfBirth?: string;
  postCode?: string;
  town?: string;
}

export interface NewMember extends Omit<Member, 'id' | 'memberNumber'> {
  memberNumber?: string;
}

export interface MemberWithPayments extends Omit<Member, 'payments'> {
  payments: Payment[];
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  // ... other registration fields
}

export interface Collector {
  id: string;
  name: string;
  email: string;
  // ... other collector fields
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
  memberId: string;
  memberNumber: string;
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
