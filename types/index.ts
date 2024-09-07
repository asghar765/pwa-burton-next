export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  memberNumber: string;
  verified: boolean;
  payments?: Payment[];
  notes?: Note[];
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
  memberNumber?: string;
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
  createdAt: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: string;
}
