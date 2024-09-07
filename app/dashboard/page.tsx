"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, where, orderBy, limit, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';
import { useAuth } from '../../context/authContext';
import { useRouter } from 'next/navigation';
import { Member, MemberWithPayments, Registration, Collector, Note, Payment, Expense } from '../../types';
import DashboardSection from '../../components/DashboardSection';
import MembersSection from '../../components/MembersSection';
import CollectorsSection from '../../components/CollectorsSection';
import RegistrationsSection from '../../components/RegistrationsSection';
import DatabaseSection from '../../components/DatabaseSection';
import FinanceSection from '../../components/FinanceSection';
import ErrorBoundary from '../../components/ErrorBoundary';

interface FirebaseUser {
  id: string;
  createdAt: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: string;
}

const AdminDashboard: React.FC = () => {
  const { user, userRole } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [members, setMembers] = useState<MemberWithPayments[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [accountBalance, setAccountBalance] = useState(0);
  const [firebaseUsers, setFirebaseUsers] = useState<FirebaseUser[]>([]);
  
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMembers, setExpandedMembers] = useState<Record<string, boolean>>({});
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

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

      const [membersSnapshot, registrationsSnapshot, notesSnapshot, collectorsSnapshot, paymentsSnapshot, expensesSnapshot, usersSnapshot] = await Promise.all([
        getDocs(membersQuery),
        getDocs(registrationsQuery),
        getDocs(notesQuery),
        getDocs(collectorsQuery),
        getDocs(paymentsQuery),
        getDocs(expensesQuery),
        getDocs(usersQuery)
      ]);

      setMembers(membersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          role: data.role || '',
          memberNumber: data.memberNumber || '',
          verified: data.verified || false,
          payments: [],
          notes: data.notes || []
        } as MemberWithPayments;
      }));
      setRegistrations(registrationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration)));
      setNotes(notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note)));
      setCollectors(collectorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Collector)));
      const paymentsWithMemberNumbers = await Promise.all(paymentsSnapshot.docs.map(async doc => {
        const payment = { id: doc.id, ...doc.data() } as Payment;
        const memberDoc = await getDocs(query(collection(db, 'members'), where('id', '==', payment.memberId)));
        const memberData = memberDoc.docs[0]?.data();
        return { ...payment, memberNumber: memberData?.memberNumber || payment.memberId };
      }));
      setPayments(paymentsWithMemberNumbers);
      setExpenses(expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense)));
      setFirebaseUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseUser)));

      let totalPayments = 0;
      let totalExpenses = 0;

      try {
        totalPayments = paymentsSnapshot.docs.reduce((sum, doc) => {
          const paymentData = doc.data();
          const amount = paymentData.amount;
          let parsedAmount = 0;
          if (typeof amount === 'number') {
            parsedAmount = amount;
          } else if (typeof amount === 'string') {
            try {
              parsedAmount = JSON.parse(amount).amount || parseFloat(amount) || 0;
            } catch {
              parsedAmount = parseFloat(amount) || 0;
            }
          }
          return sum + parsedAmount;
        }, 0);
      } catch (error) {
        console.error('Error calculating total payments:', error);
      }

      try {
        totalExpenses = expensesSnapshot.docs.reduce((sum, doc) => {
          const expenseData = doc.data();
          const amount = expenseData.amount;
          let parsedAmount = 0;
          if (typeof amount === 'number') {
            parsedAmount = amount;
          } else if (typeof amount === 'string') {
            try {
              parsedAmount = JSON.parse(amount).amount || parseFloat(amount) || 0;
            } catch {
              parsedAmount = parseFloat(amount) || 0;
            }
          }
          return sum + parsedAmount;
        }, 0);
      } catch (error) {
        console.error('Error calculating total expenses:', error);
      }

      console.log('Total Payments:', totalPayments);
      console.log('Total Expenses:', totalExpenses);

      const accountBalance = totalPayments - totalExpenses;
      console.log('Account Balance:', accountBalance);

      setAccountBalance(accountBalance);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Failed to fetch data. Please try again.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && userRole === 'admin') {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, userRole, fetchData]);

  const handleAddExpense = async (amount: number, description: string) => {
    try {
      const expenseData = {
        amount,
        description,
        date: new Date().toISOString(),
      };
      await addDoc(collection(db, 'expenses'), expenseData);
      fetchData();
    } catch (error) {
      console.error('Error adding expense:', error);
      setErrorMessage('Failed to add expense. Please try again.');
    }
  };

  const handleAddMember = async (member: Omit<Member, 'id'>) => {
    try {
      await addDoc(collection(db, 'members'), member);
      fetchData();
    } catch (error) {
      console.error('Error adding member:', error);
      setErrorMessage('Failed to add member. Please try again.');
    }
  };

  const handleUpdateMember = async (id: string, member: Partial<Member>) => {
    try {
      await updateDoc(doc(db, 'members', id), member);
      fetchData();
    } catch (error) {
      console.error('Error updating member:', error);
      setErrorMessage('Failed to update member. Please try again.');
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'members', id));
      fetchData();
    } catch (error) {
      console.error('Error deleting member:', error);
      setErrorMessage('Failed to delete member. Please try again.');
    }
  };

  const handleRevokeMember = async (id: string) => {
    try {
      const memberRef = doc(db, 'members', id);
      const memberDoc = await getDoc(memberRef);
      if (memberDoc.exists()) {
        const memberData = memberDoc.data();
        // Move member data to registrations collection
        await addDoc(collection(db, 'registrations'), {
          ...memberData,
          status: 'revoked',
          revokedAt: new Date().toISOString()
        });
        // Delete member from members collection
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

  const handleAddPayment = async (memberId: string, payment: Omit<Payment, 'id'>) => {
    try {
      await addDoc(collection(db, 'payments'), { ...payment, memberId });
      fetchData();
    } catch (error) {
      console.error('Error adding payment:', error);
      setErrorMessage('Failed to add payment. Please try again.');
    }
  };

  const handleAddNote = async (memberId: string, note: string) => {
    try {
      await addDoc(collection(db, 'notes'), { memberId, content: note, date: new Date().toISOString() });
      fetchData();
    } catch (error) {
      console.error('Error adding note:', error);
      setErrorMessage('Failed to add note. Please try again.');
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

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user || userRole !== 'admin') {
    return <div className="p-8">You do not have permission to access this page.</div>;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardSection
            members={members}
            registrations={registrations}
            collectors={collectors}
            accountBalance={accountBalance}
          />
        );
      case 'members':
        return (
          <MembersSection
            members={members}
            firebaseUsers={firebaseUsers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            expandedMembers={expandedMembers}
            setExpandedMembers={setExpandedMembers}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onRevokeMember={handleRevokeMember}
            currentUserRole={userRole || ''}
            onAddPayment={handleAddPayment}
            onAddNote={handleAddNote}
          />
        );
      case 'collectors':
        return <CollectorsSection collectors={collectors} />;
      case 'registrations':
        return <RegistrationsSection 
          registrations={registrations}
          onApproveRegistration={handleApproveRegistration}
        />;
      case 'database':
        return <DatabaseSection />;
      case 'finance':
        return (
          <FinanceSection
            accountBalance={accountBalance}
            payments={payments.map(payment => ({
              ...payment,
              amount: typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount) || 0,
              date: typeof payment.date === 'string' 
                ? (isNaN(Date.parse(payment.date)) ? new Date().toISOString() : new Date(payment.date).toISOString())
                : new Date().toISOString(),
              // Ensure all properties are primitive values
              ...Object.entries(payment).reduce((acc, [key, value]) => {
                acc[key] = typeof value === 'object' && value !== null ? JSON.stringify(value) : value;
                return acc;
              }, {} as Record<string, any>)
            }))}
            expenses={expenses.map(expense => ({
              ...expense,
              amount: typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount) || 0,
              date: typeof expense.date === 'string' 
                ? (isNaN(Date.parse(expense.date)) ? new Date().toISOString() : new Date(expense.date).toISOString())
                : new Date().toISOString(),
              // Ensure all properties are primitive values
              ...Object.entries(expense).reduce((acc, [key, value]) => {
                acc[key] = typeof value === 'object' && value !== null ? JSON.stringify(value) : value;
                return acc;
              }, {} as Record<string, any>)
            }))}
            onAddExpense={handleAddExpense}
            currencySymbol="£"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white min-h-screen">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          <nav className="space-y-2">
            {['dashboard', 'members', 'collectors', 'registrations', 'database', 'finance'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`block w-full text-left p-2 hover:bg-gray-700 rounded capitalize ${
                  activeSection === section ? 'bg-gray-700' : ''
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center">
            {lastRefreshed && (
              <p className="text-sm text-gray-500 mr-4">
                Last refreshed: {lastRefreshed.toLocaleTimeString()}
              </p>
            )}
            <button onClick={() => auth.signOut()} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Sign Out
            </button>
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-500 mb-4">{errorMessage}</p>
        )}

        <ErrorBoundary>
          {renderActiveSection()}
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default AdminDashboard;
