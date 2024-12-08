"use client";

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';
import { useAuth } from '../../context/authContext';
import { Payment, Note, Member, MemberWithPayments, Registration, Collector, Expense, FirebaseUser } from '../../types';
import { format } from 'date-fns';

interface DashboardContextType {
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  members: MemberWithPayments[];
  registrations: Registration[];
  notes: Note[];
  collectors: Collector[];
  payments: Payment[];
  expenses: Expense[];
  firebaseUsers: FirebaseUser[];
  loading: boolean;
  errorMessage: string;
  lastRefreshed: Date | null;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  expandedMembers: Record<string, boolean>;
  setExpandedMembers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  accountBalanceState: number;
  fetchData: () => Promise<void>;
  handleAddExpense: (amount: number, description: string) => Promise<void>;
  handleUpdateMember: (memberNumber: string, member: Partial<Member>) => Promise<void>;
  handleDeleteMember: (memberNumber: string) => Promise<void>;
  handleRevokeMember: (memberNumber: string) => Promise<void>;
  handleAddPayment: (memberNumber: string, payment: Omit<Payment, 'id'>) => Promise<void>;
  handleAddNote: (memberNumber: string, note: string) => Promise<void>;
  handleUpdateUserRole: (userId: string, newRole: string) => Promise<void>;
  handleApproveRegistration: (registration: Registration) => Promise<void>;
  handleReinstateRevokedMember: (member: Member) => Promise<void>;
  user: import('firebase/auth').User | null;
  userRole: string | null;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { user, userRole } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [members, setMembers] = useState<MemberWithPayments[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [firebaseUsers, setFirebaseUsers] = useState<FirebaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMembers, setExpandedMembers] = useState<Record<string, boolean>>({});
  const [accountBalanceState, setAccountBalanceState] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const membersQuery = query(collection(db, 'members'), where('verified', '==', true));
      const registrationsQuery = query(collection(db, 'registrations'));
      const notesQuery = query(collection(db, 'notes'));
      const collectorsQuery = query(collection(db, 'collectors'));
      const paymentsQuery = query(collection(db, 'payments'));
      const expensesQuery = query(collection(db, 'expenses'));
      const usersQuery = query(collection(db, 'users'));

      setLastRefreshed(new Date());

      const [
        membersSnapshot,
        registrationsSnapshot,
        notesSnapshot,
        collectorsSnapshot,
        paymentsSnapshot,
        expensesSnapshot,
        usersSnapshot
      ] = await Promise.all([
        getDocs(membersQuery),
        getDocs(registrationsQuery),
        getDocs(notesQuery),
        getDocs(collectorsQuery),
        getDocs(paymentsQuery),
        getDocs(expensesQuery),
        getDocs(usersQuery)
      ]);

      const fetchedMembers = membersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        memberNumber: doc.data().memberNumber || '',
        payments: []
      } as MemberWithPayments));

      setMembers(fetchedMembers);
      setRegistrations(registrationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration)));
      setNotes(notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note)));
      setCollectors(collectorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Collector)));

      const paymentsWithMemberNumbers = await Promise.all(
        paymentsSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          if ('amount' in data && 'date' in data && 'memberNumber' in data) {
            return {
              id: doc.id,
              ...data
            } as Payment;
          }
          return null;
        })
      );

      setPayments(paymentsWithMemberNumbers.filter((payment): payment is Payment => payment !== null));
      setExpenses(expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense)));
      setFirebaseUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseUser)));

      const totalPayments = paymentsWithMemberNumbers.reduce((sum, payment) => {
        if (payment) {
          const amount = typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount) || 0;
          return sum + amount;
        }
        return sum;
      }, 0);

      const totalExpenses = expensesSnapshot.docs.reduce((sum, doc) => {
        const expenseData = doc.data();
        const amount = typeof expenseData.amount === 'number' ? expenseData.amount : parseFloat(expenseData.amount) || 0;
        return sum + amount;
      }, 0);

      const accountBalance = totalPayments - totalExpenses;
      setAccountBalanceState(accountBalance);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Failed to fetch data. Please try again.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user && userRole === 'admin') {
        fetchData();
      } else {
        setLoading(false);
      }
    }
  }, [user, userRole, fetchData]);

  const handleAddExpense = async (amount: number, description: string) => {
    try {
      const expenseData = {
        amount,
        description,
        date: new Date().toISOString()
      };
      await addDoc(collection(db, 'expenses'), expenseData);
      fetchData();
    } catch (error) {
      console.error('Error adding expense:', error);
      setErrorMessage('Failed to add expense. Please try again.');
    }
  };

  const handleUpdateMember = async (memberNumber: string, member: Partial<Member>) => {
    try {
      await updateDoc(doc(db, 'members', memberNumber), member);
      fetchData();
    } catch (error) {
      console.error('Error updating member:', error);
      setErrorMessage('Failed to update member. Please try again.');
    }
  };

  const handleDeleteMember = async (memberNumber: string) => {
    try {
      await deleteDoc(doc(db, 'members', memberNumber));
      fetchData();
    } catch (error) {
      console.error('Error deleting member:', error);
      setErrorMessage('Failed to delete member. Please try again.');
    }
  };

  const handleRevokeMember = async (memberNumber: string) => {
    try {
      const memberRef = doc(db, 'members', memberNumber);
      const memberDoc = await getDoc(memberRef);
      if (memberDoc.exists()) {
        const memberData = memberDoc.data();
        await addDoc(collection(db, 'registrations'), {
          ...memberData,
          status: 'revoked',
          revokedAt: new Date().toISOString()
        });
        await deleteDoc(memberRef);
        fetchData();
      } else {
        throw new Error('Member not found');
      }
    } catch (error) {
      console.error('Error revoking member:', error);
      setErrorMessage('Failed to revoke member. Please try again.');
    }
  };

  const handleAddPayment = async (memberNumber: string, payment: Omit<Payment, 'id'>) => {
    try {
      await addDoc(collection(db, 'payments'), { ...payment, memberNumber });
      fetchData();
    } catch (error) {
      console.error('Error adding payment:', error);
      setErrorMessage('Failed to add payment. Please try again.');
    }
  };

  const handleAddNote = async (memberNumber: string, note: string) => {
    try {
      await addDoc(collection(db, 'notes'), { memberNumber, content: note, date: new Date().toISOString() });
      fetchData();
    } catch (error) {
      console.error('Error adding note:', error);
      setErrorMessage('Failed to add note. Please try again.');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      fetchData();
    } catch (error) {
      console.error('Error updating user role:', error);
      setErrorMessage('Failed to update user role. Please try again.');
    }
  };

  const handleApproveRegistration = async (registration: Registration) => {
    try {
      const registrationRef = doc(db, 'registrations', registration.id);
      await updateDoc(registrationRef, { status: 'approved' });
      fetchData();
    } catch (error) {
      console.error('Error approving registration:', error);
      setErrorMessage('Failed to approve registration. Please try again.');
    }
  };

  const handleReinstateRevokedMember = async (member: Member) => {
    try {
      const memberRef = doc(db, 'members', member.id);
      await updateDoc(memberRef, { verified: true });
      fetchData();
    } catch (error) {
      console.error('Error reinstating member:', error);
      setErrorMessage('Failed to reinstate member. Please try again.');
    }
  };

  const contextValue: DashboardContextType = {
    activeSection,
    setActiveSection,
    members,
    registrations,
    notes,
    collectors,
    payments,
    expenses,
    firebaseUsers,
    loading,
    errorMessage,
    lastRefreshed,
    searchTerm,
    setSearchTerm,
    expandedMembers,
    setExpandedMembers,
    accountBalanceState,
    fetchData,
    handleAddExpense,
    handleUpdateMember,
    handleDeleteMember,
    handleRevokeMember,
    handleAddPayment,
    handleAddNote,
    handleUpdateUserRole,
    handleApproveRegistration,
    handleReinstateRevokedMember,
    user,
    userRole
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
