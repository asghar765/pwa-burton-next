"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, where, writeBatch, runTransaction, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';
import { useAuth } from '../../context/authContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Menu } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { user, userRole } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });
  const [newCollector, setNewCollector] = useState({ name: '', email: '', phoneNumber: '' });
  const [newNote, setNewNote] = useState({ memberId: '', note: '' });
  const [notes, setNotes] = useState([]);
  const [bulkUploadJson, setBulkUploadJson] = useState('');
  const [bulkUploadResult, setBulkUploadResult] = useState('');
  const fileInputRef = useRef(null);
  const router = useRouter();

  const [editingMember, setEditingMember] = useState(null);
  const [payments, setPayments] = useState([]);
  const [accountBalance, setAccountBalance] = useState(0);
  const [expandedMembers, setExpandedMembers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [bulkRegistrations, setBulkRegistrations] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', date: '' });
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const membersQuery = query(collection(db, 'members'), where('verified', '==', true));
      const registrationsQuery = query(collection(db, 'registrations'));
      const notesQuery = query(collection(db, 'notes'));
      const collectorsQuery = query(collection(db, 'collectors'));
      const paymentsQuery = query(collection(db, 'payments'));

      const [membersSnapshot, registrationsSnapshot, notesSnapshot, collectorsSnapshot, paymentsSnapshot] = await Promise.all([
        getDocs(membersQuery),
        getDocs(registrationsQuery),
        getDocs(notesQuery),
        getDocs(collectorsQuery),
        getDocs(paymentsQuery)
      ]);

      const fetchedMembers = membersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(fetchedMembers);

      const fetchedRegistrations = registrationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const normalRegistrations = fetchedRegistrations.filter(reg => reg.registrationType !== 'bulk');
      const bulkRegs = fetchedRegistrations.filter(reg => reg.registrationType === 'bulk');

      setRegistrations(normalRegistrations);
      setBulkRegistrations(bulkRegs);

      const fetchedNotes = notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(fetchedNotes);

      const fetchedCollectors = collectorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCollectors(fetchedCollectors);

      const fetchedPayments = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPayments(fetchedPayments);

      // Calculate total balance from all payments
      const totalBalance = fetchedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

      // Update account balance in Firestore
      await runTransaction(db, async (transaction) => {
        const accountBalanceRef = doc(db, 'accountBalance', 'current');
        const accountBalanceDoc = await transaction.get(accountBalanceRef);

        if (!accountBalanceDoc.exists()) {
          transaction.set(accountBalanceRef, { balance: totalBalance });
        } else {
          transaction.update(accountBalanceRef, { balance: totalBalance });
        }
      });

      setAccountBalance(totalBalance);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || userRole !== 'admin') {
      setLoading(false);
      return;
    }

    fetchData();
  }, [user, userRole, fetchData]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const generateMemberNumber = useCallback(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }, []);

  const handleSignOut = useCallback(() => {
    auth.signOut().then(() => {
      router.push('/login');
    }).catch((error) => {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
    });
  }, [router]);

  const handleAddMember = useCallback(async () => {
    try {
      const memberNumber = generateMemberNumber();
      const memberWithNumber = { ...newMember, memberNumber, verified: true };
      await addDoc(collection(db, 'members'), memberWithNumber);
      setMembers(prevMembers => [...prevMembers, { id: Date.now().toString(), ...memberWithNumber }]);
      setNewMember({ name: '', email: '', role: '' });
    } catch (error) {
      console.error('Error adding member:', error);
      setError('Failed to add member');
    }
  }, [newMember, generateMemberNumber]);

  const handleUpdateMember = useCallback(async (id, updatedMember) => {
    try {
      await updateDoc(doc(db, 'members', id), updatedMember);
      setMembers(prevMembers => prevMembers.map(member => member.id === id ? { ...member, ...updatedMember } : member));
      setEditingMember(null);
    } catch (error) {
      console.error('Error updating member:', error);
      setError('Failed to update member');
    }
  }, []);

  const handleDeleteMember = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'members', id));
      setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
    } catch (error) {
      console.error('Error deleting member:', error);
      setError('Failed to delete member');
    }
  }, []);

  const handleUnapprove = useCallback(async (member) => {
    try {
      await addDoc(collection(db, 'registrations'), {
        fullName: member.name,
        email: member.email,
      });

      await deleteDoc(doc(db, 'members', member.id));

      setMembers(prevMembers => prevMembers.filter(m => m.id !== member.id));
      setRegistrations(prevRegistrations => [...prevRegistrations, { id: Date.now().toString(), fullName: member.name, email: member.email }]);
    } catch (error) {
      console.error('Error unapproving member:', error);
      setError('Failed to unapprove member');
    }
  }, []);

  const handleAddCollector = useCallback(async () => {
    try {
      await addDoc(collection(db, 'collectors'), newCollector);
      setCollectors(prevCollectors => [...prevCollectors, { id: Date.now().toString(), ...newCollector }]);
      setNewCollector({ name: '', email: '', phoneNumber: '' });
    } catch (error) {
      console.error('Error adding collector:', error);
      setError('Failed to add collector');
    }
  }, [newCollector]);

  const handleUpdateCollector = useCallback(async (id, updatedCollector) => {
    try {
      await updateDoc(doc(db, 'collectors', id), updatedCollector);
      setCollectors(prevCollectors => prevCollectors.map(collector => collector.id === id ? { ...collector, ...updatedCollector } : collector));
    } catch (error) {
      console.error('Error updating collector:', error);
      setError('Failed to update collector');
    }
  }, []);

  const handleDeleteCollector = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'collectors', id));
      setCollectors(prevCollectors => prevCollectors.filter(collector => collector.id !== id));
    } catch (error) {
      console.error('Error deleting collector:', error);
      setError('Failed to delete collector');
    }
  }, []);

  const handleApproveRegistration = useCallback(async (registration) => {
    try {
      console.log('Approving registration:', registration);

      const memberNumber = generateMemberNumber();
      const newMember = {
        name: registration.fullName || registration.name,
        email: registration.email,
        role: 'member',
        memberNumber,
        verified: true,
        registrationDate: registration.registrationDate
      };

      const newMemberDocRef = await addDoc(collection(db, 'members'), newMember);
      console.log('New member added:', newMemberDocRef.id);

      if (!newMemberDocRef.id) {
        throw new Error('Failed to add new member');
      }

      await deleteDoc(doc(db, 'registrations', registration.id));
      console.log('Registration deleted:', registration.id);

      setRegistrations(prevRegistrations => prevRegistrations.filter(r => r.id !== registration.id));
      setMembers(prevMembers => [...prevMembers, { id: newMemberDocRef.id, ...newMember }]);

      console.log('Registration approved successfully');
    } catch (error) {
      console.error('Error approving registration:', error);
      setError('Failed to approve registration: ' + error.message);
    }
  }, [generateMemberNumber]);

  const handleAddNote = useCallback(async (memberId, note) => {
    try {
      const newNote = { memberId, note, createdAt: new Date() };
      await addDoc(collection(db, 'notes'), newNote);
      setNotes(prevNotes => [...prevNotes, { id: Date.now().toString(), ...newNote }]);
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Failed to add note');
    }
  }, []);

  const handleDeleteNote = useCallback(async (noteId) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note');
    }
  }, []);

  const handleBulkUpload = useCallback(async (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (!Array.isArray(data)) {
        throw new Error('Input must be an array of objects');
      }

      const batch = writeBatch(db);
      const registrationsRef = collection(db, 'registrations');

      data.forEach((user) => {
        const newRegistrationRef = doc(registrationsRef);
        batch.set(newRegistrationRef, { 
          ...user, 
          registrationType: 'bulk', 
          registrationDate: new Date() 
        });
      });

      await batch.commit();

      setBulkUploadResult(`Successfully uploaded ${data.length} registrations`);
      setBulkUploadJson('');
      fetchData();
    } catch (error) {
      console.error('Error bulk uploading registrations:', error);
      setBulkUploadResult('Error: ' + error.message);
    }
  }, [fetchData]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        handleBulkUpload(content);
      };
      reader.readAsText(file);
    }
  }, [handleBulkUpload]);

  const handleAddPayment = useCallback(async (memberId, amount, date) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      const newPayment = {
        memberId,
        amount: parseFloat(amount),
        date,
        createdAt: new Date(),
        addedBy: {
          id: user.uid,
          name: user.displayName || user.email
        }
      };
      const docRef = await addDoc(collection(db, 'payments'), newPayment);
      setPayments(prevPayments => [...prevPayments, { id: docRef.id, ...newPayment }]);

      // Update account balance
      const newBalance = accountBalance + parseFloat(amount);
      await updateDoc(doc(db, 'accountBalance', 'current'), { balance: newBalance });
      setAccountBalance(newBalance);
    } catch (error) {
      console.error('Error adding payment:', error);
      setError('Failed to add payment');
    }
  }, [user, accountBalance]);

  const toggleMemberExpansion = (memberId) => {
    setExpandedMembers(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  useEffect(() => {
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = members.filter(member => 
      member.name.toLowerCase().includes(lowercasedSearch) ||
      member.memberNumber.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredMembers(filtered);
  }, [searchTerm, members]);

  const handleApproveAllBulkRegistrations = useCallback(async () => {
    try {
      const batch = writeBatch(db);
      const membersRef = collection(db, 'members');
      const registrationsRef = collection(db, 'registrations');

      bulkRegistrations.forEach((registration) => {
        const newMemberRef = doc(membersRef);
        batch.set(newMemberRef, {
          name: registration.fullName || registration.name,
          email: registration.email,
          memberNumber: generateMemberNumber(),
          verified: true,
          registrationDate: registration.registrationDate
        });

        batch.delete(doc(registrationsRef, registration.id));
      });

      await batch.commit();

      setBulkUploadResult(`Successfully approved ${bulkRegistrations.length} bulk registrations`);
      fetchData();
    } catch (error) {
      console.error('Error approving bulk registrations:', error);
      setError('Failed to approve bulk registrations: ' + error.message);
    }
  }, [bulkRegistrations, fetchData, generateMemberNumber]);

  const fetchFinanceData = useCallback(async () => {
    try {
      // Fetch account balance
      const balanceQuery = query(collection(db, 'accountBalance'));
      const balanceSnapshot = await getDocs(balanceQuery);
      const balanceData = balanceSnapshot.docs[0]?.data();
      setAccountBalance(balanceData?.balance || 0);

      // Fetch recent transactions
      const recentTransactionsQuery = query(
        collection(db, 'payments'),
        orderBy('date', 'desc'),
        limit(5)
      );
      const recentTransactionsSnapshot = await getDocs(recentTransactionsQuery);
      const recentTransactionsData = recentTransactionsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date instanceof Date ? data.date : new Date(data.date.seconds * 1000)
        };
      });
      console.log('Recent transactions:', recentTransactionsData);
      setRecentTransactions(recentTransactionsData);

      // Fetch all transactions
      const allTransactionsQuery = query(
        collection(db, 'payments'),
        orderBy('date', 'desc')
      );
      const allTransactionsSnapshot = await getDocs(allTransactionsQuery);
      const allTransactionsData = allTransactionsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date instanceof Date ? data.date : new Date(data.date.seconds * 1000)
        };
      });
      console.log('All transactions:', allTransactionsData);
      setAllTransactions(allTransactionsData);

      // Fetch expenses
      const expensesQuery = query(
        collection(db, 'expenses'),
        orderBy('date', 'desc')
      );
      const expensesSnapshot = await getDocs(expensesQuery);
      const expensesData = expensesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date instanceof Date ? doc.data().date : new Date(doc.data().date.seconds * 1000)
      }));
      setExpenses(expensesData);

    } catch (error) {
      console.error('Error fetching finance data:', error);
      setError('Failed to fetch finance data');
    }
  }, []);

  useEffect(() => {
    if (activeSection === 'finance') {
      fetchFinanceData();
    }
  }, [activeSection, fetchFinanceData]);

  const handleUpdateBalance = useCallback(async () => {
    try {
      const totalBalance = allTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      await updateDoc(doc(db, 'accountBalance', 'current'), { balance: totalBalance });
      setAccountBalance(totalBalance);
      setError('Balance updated successfully');
    } catch (error) {
      console.error('Error updating balance:', error);
      setError('Failed to update balance');
    }
  }, [allTransactions]);

  const generateReport = useCallback((reportType) => {
    try {
      const currentDate = new Date();
      let startDate;
      if (reportType === 'monthly') {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      } else if (reportType === 'annual') {
        startDate = new Date(currentDate.getFullYear(), 0, 1);
      }

      console.log('Generating report from', startDate, 'to', currentDate);

      const reportTransactions = allTransactions.filter(transaction => 
        transaction.date >= startDate && transaction.date <= currentDate
      );

      console.log('Filtered transactions:', reportTransactions);

      const totalAmount = reportTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

      const report = {
        type: reportType,
        startDate: startDate.toLocaleDateString(),
        endDate: currentDate.toLocaleDateString(),
        totalAmount,
        transactions: reportTransactions.map(t => ({
          ...t,
          date: t.date.toLocaleDateString()
        }))
      };

      console.log('Generated report:', report);

      setReportData(report);
      setShowReportModal(true);
    } catch (error) {
      console.error(`Error generating ${reportType} report:`, error);
      setError(`Failed to generate ${reportType} report: ${error.message}`);
    }
  }, [allTransactions]);

  const generatePDF = useCallback(() => {
    if (!reportData) return;

    const doc = new jsPDF();
    doc.text(`${reportData.type.charAt(0).toUpperCase() + reportData.type.slice(1)} Report`, 14, 15);
    doc.text(`From: ${reportData.startDate} To: ${reportData.endDate}`, 14, 25);
    doc.text(`Total Amount: £${reportData.totalAmount.toFixed(2)}`, 14, 35);

    doc.autoTable({
      head: [['Date', 'Amount', 'Member']],
      body: reportData.transactions.map(t => [t.date, `£${t.amount.toFixed(2)}`, t.memberName || 'N/A']),
      startY: 40
    });

    doc.save(`${reportData.type}_report_${reportData.endDate}.pdf`);
  }, [reportData]);

  const closeReportModal = () => {
    setShowReportModal(false);
    setReportData(null);
  };

  const handleAddExpense = useCallback(async () => {
    try {
      const expenseData = {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        date: new Date(newExpense.date),
        createdAt: new Date(),
        addedBy: {
          id: user.uid,
          name: user.displayName || user.email
        }
      };
      await addDoc(collection(db, 'expenses'), expenseData);
      setExpenses(prevExpenses => [expenseData, ...prevExpenses]);
      setNewExpense({ description: '', amount: '', date: '' });
      setShowExpenseModal(false);
      
      // Update account balance
      const newBalance = accountBalance - parseFloat(newExpense.amount);
      await updateDoc(doc(db, 'accountBalance', 'current'), { balance: newBalance });
      setAccountBalance(newBalance);
    } catch (error) {
      console.error('Error adding expense:', error);
      setError('Failed to add expense');
    }
  }, [newExpense, user, accountBalance]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user || userRole !== 'admin') {
    return <div className="p-8">You do not have permission to access this page.</div>;
  }

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white min-h-screen">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          <nav className="space-y-2">
            <button onClick={() => setActiveSection('dashboard')} className="block w-full text-left p-2 hover:bg-gray-700 rounded">Dashboard</button>
            <button onClick={() => setActiveSection('members')} className="block w-full text-left p-2 hover:bg-gray-700 rounded">Members</button>
            <button onClick={() => setActiveSection('collectors')} className="block w-full text-left p-2 hover:bg-gray-700 rounded">Collectors</button>
            <button onClick={() => setActiveSection('registrations')} className="block w-full text-left p-2 hover:bg-gray-700 rounded">Registrations</button>
            <button onClick={() => setActiveSection('database')} className="block w-full text-left p-2 hover:bg-gray-700 rounded">Database Tools</button>
            <button onClick={() => setActiveSection('finance')} className="block w-full text-left p-2 hover:bg-gray-700 rounded">Finance</button>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Sign Out</button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {activeSection === 'dashboard' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.displayName || user.email}</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Your Profile</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.uid}</p>
              <p><strong>Role:</strong> {userRole}</p>
              {user.emailVerified && <p><strong>Email Verified:</strong> Yes</p>}
              {user.phoneNumber && <p><strong>Phone Number:</strong> {user.phoneNumber}</p>}
              {user.photoURL && (
                <div className="mt-4">
                  <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-full" />
                </div>
              )}
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="font-semibold">Total Members</h4>
                  <p className="text-2xl">{members.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="font-semibold">Pending Registrations</h4>
                  <p className="text-2xl">{registrations.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="font-semibold">Total Collectors</h4>
                  <p className="text-2xl">{collectors.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="font-semibold">Account Balance</h4>
                  <p className="text-2xl">£{accountBalance.toFixed(2)}</p>
                </div>
              </div>
            </div>
            {registrations.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Latest Registrations</h3>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p className="mb-2">You have <strong>{registrations.length}</strong> pending registration{registrations.length !== 1 ? 's' : ''} that need{registrations.length === 1 ? 's' : ''} approval.</p>
                  <button onClick={() => setActiveSection('registrations')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">View Registrations</button>
                </div>
              </div>
            )}
          </div>
        )}
        {activeSection === 'members' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Members</h2>
            <div className="mb-4 flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or member number"
                className="p-2 border border-gray-300 rounded mr-2 flex-grow"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="Name"
                className="p-2 border border-gray-300 rounded mr-2"
              />
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="Email"
                className="p-2 border border-gray-300 rounded mr-2"
              />
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="p-2 border border-gray-300 rounded mr-2"
              >
                <option value="">Select Role</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={handleAddMember} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Member</button>
            </div>
            <h3 className="text-lg font-semibold mt-6 mb-2">Members</h3>
            <ul className="space-y-4">
              {filteredMembers.map(member => (
                <li key={member.id} className="bg-white rounded shadow">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleMemberExpansion(member.id)}
                  >
                    <div>
                      <h4 className="font-bold">{member.name}</h4>
                      <p>Member No: {member.memberNumber}</p>
                    </div>
                    {expandedMembers[member.id] ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </div>
                  {expandedMembers[member.id] && (
                    <div className="p-4 border-t border-gray-200">
                      {editingMember === member.id ? (
                        <div>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => setMembers(prevMembers => prevMembers.map(m => m.id === member.id ? { ...m, name: e.target.value } : m))}
                            className="p-2 border border-gray-300 rounded mb-2 w-full"
                          />
                          <input
                            type="email"
                            value={member.email}
                            onChange={(e) => setMembers(prevMembers => prevMembers.map(m => m.id === member.id ? { ...m, email: e.target.value } : m))}
                            className="p-2 border border-gray-300 rounded mb-2 w-full"
                          />
                          <select
                            value={member.role}
                            onChange={(e) => setMembers(prevMembers => prevMembers.map(m => m.id === member.id ? { ...m, role: e.target.value } : m))}
                            className="p-2 border border-gray-300 rounded mb-2 w-full"
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button onClick={() => handleUpdateMember(member.id, member)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2">Save</button>
                          <button onClick={() => setEditingMember(null)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                        </div>
                      ) : (
                        <div>
                          <p>Email: {member.email}</p>
                          <p>Role: {member.role}</p>
                          <div className="mt-2">
                            <button onClick={() => setEditingMember(member.id)} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2">Edit</button>
                            <button onClick={() => handleDeleteMember(member.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 mr-2">Delete</button>
                            <button onClick={() => handleUnapprove(member)} className="px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">Unapprove</button>
                          </div>
                        </div>
                      )}
                      <div className="mt-4">
                        <h5 className="font-semibold">Notes</h5>
                        <ul className="space-y-2">
                          {notes.filter(note => note.memberId === member.id).map(note => (
                            <li key={note.id} className="flex justify-between items-center">
                              <span>{note.note}</span>
                              <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:text-red-700">Delete</button>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 flex">
                          <input
                            type="text"
                            placeholder="Add a note"
                            className="p-2 border border-gray-300 rounded flex-grow mr-2"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddNote(member.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button onClick={(e) => {
                            const input = e.target.previousSibling;
                            handleAddNote(member.id, input.value);
                            input.value = '';
                          }} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Note</button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h5 className="font-semibold">Payment History</h5>
                        <ul className="space-y-2">
                          {payments
                            .filter(payment => payment.memberId === member.id)
                            .map(payment => (
                              <li key={payment.id} className="flex justify-between items-center">
                                <span>
                                  {payment.date && new Date(payment.date).toLocaleDateString()} - £{payment.amount}
                                  <br />
                                  <small className="text-gray-500">
                                    Added by {payment.addedBy ? payment.addedBy.name : 'Unknown'} on {payment.createdAt ? new Date(payment.createdAt instanceof Date ? payment.createdAt : payment.createdAt.toDate()).toLocaleString() : 'Unknown date'}
                                  </small>
                                </span>
                              </li>
                            ))}
                        </ul>
                        <div className="mt-2 flex">
                          <input
                            type="number"
                            placeholder="Amount"
                            className="p-2 border border-gray-300 rounded mr-2"
                            id={`payment-amount-${member.id}`}
                          />
                          <input
                            type="date"
                            className="p-2 border border-gray-300 rounded mr-2"
                            id={`payment-date-${member.id}`}
                          />
                          <button onClick={() => {
                            const amountInput = document.getElementById(`payment-amount-${member.id}`);
                            const dateInput = document.getElementById(`payment-date-${member.id}`);
                            handleAddPayment(member.id, amountInput.value, dateInput.value);
                            amountInput.value = '';
                            dateInput.value = '';
                          }} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add Payment</button>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeSection === 'collectors' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Collectors</h2>
            <div className="mb-4">
              <input
                type="text"
                value={newCollector.name}
                onChange={(e) => setNewCollector({ ...newCollector, name: e.target.value })}
                placeholder="Name"
                className="p-2 border border-gray-300 rounded mr-2"
              />
              <input
                type="email"
                value={newCollector.email}
                onChange={(e) => setNewCollector({ ...newCollector, email: e.target.value })}
                placeholder="Email"
                className="p-2 border border-gray-300 rounded mr-2"
              />
              <input
                type="tel"
                value={newCollector.phoneNumber}
                onChange={(e) => setNewCollector({ ...newCollector, phoneNumber: e.target.value })}
                placeholder="Phone Number"
                className="p-2 border border-gray-300 rounded mr-2"
              />
              <button onClick={handleAddCollector} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Collector</button>
            </div>
            <ul className="space-y-2">
              {collectors.map(collector => (
                <li key={collector.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                  <span>{collector.name} - {collector.email} - {collector.phoneNumber}</span>
                  <div>
                    <button onClick={() => handleUpdateCollector(collector.id, { ...collector, name: collector.name + ' (updated)' })} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2">Edit</button>
                    <button onClick={() => handleDeleteCollector(collector.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeSection === 'registrations' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Registrations</h2>
            
            {/* Normal Registrations */}
            <h3 className="text-lg font-semibold mt-6 mb-2">Individual Registrations</h3>
            <ul className="space-y-4">
              {registrations.map(registration => (
                <li key={registration.id} className="bg-white rounded shadow">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleMemberExpansion(registration.id)}
                  >
                    <div>
                      <h3 className="font-bold">{registration.fullName}</h3>
                      <p>Email: {registration.email}</p>
                    </div>
                    {expandedMembers[registration.id] ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </div>
                  {expandedMembers[registration.id] && (
                    <div className="p-4 border-t border-gray-200">
                      <p>Gender: {registration.gender}</p>
                      <p>Date of Birth: {registration.dateOfBirth}</p>
                      <p>Address: {registration.address}</p>
                      <p>Postcode: {registration.postCode}</p>
                      <p>Mobile: {registration.mobileNo}</p>
                      <p>Marital Status: {registration.maritalStatus}</p>
                      {registration.dependants && registrations.dependants.length > 0 && (
                        <div>
                          <h4 className="font-semibold mt-2">Dependants:</h4>
                          <ul>
                            {registration.dependants.map((dependant, index) => (
                              <li key={index}>
                                {dependant.name.value} - {dependant.dateOfBirth.value} ({dependant.gender.value})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <button 
                        onClick={() => handleApproveRegistration(registration)} 
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Bulk Registrations */}
            <h3 className="text-lg font-semibold mt-6 mb-2">Bulk Registrations</h3>
            {bulkRegistrations.length > 0 && (
              <button 
                onClick={handleApproveAllBulkRegistrations}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4"
              >
                Approve All Bulk Registrations
              </button>
            )}
            <ul className="space-y-4">
              {bulkRegistrations.map(registration => (
                <li key={registration.id} className="bg-white rounded shadow">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleMemberExpansion(registration.id)}
                  >
                    <div>
                      <h3 className="font-bold">{registration.fullName || registrations.name}</h3>
                      <p>Email: {registration.email}</p>
                    </div>
                    {expandedMembers[registration.id] ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </div>
                  {expandedMembers[registration.id] && (
                    <div className="p-4 border-t border-gray-200">
                      {/* Display all available registration details */}
                      {Object.entries(registration).map(([key, value]) => (
                        key !== 'id' && (
                          <p key={key}>{key}: {typeof value === 'object' ? JSON.stringify(value) : value.toString()}</p>
                        )
                      ))}
                      <button 
                        onClick={() => handleApproveRegistration(registration)} 
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeSection === 'database' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Database Tools</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Bulk User Upload</h3>
              <textarea
                value={bulkUploadJson}
                onChange={(e) => setBulkUploadJson(e.target.value)}
                placeholder="Paste JSON data here..."
                className="w-full h-40 p-2 border border-gray-300 rounded mb-2"
              />
              <div className="flex items-center">
                <button onClick={() => handleBulkUpload(bulkUploadJson)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">Upload Users from Text</button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Upload JSON File
                </button>
              </div>
              {bulkUploadResult && <p className="mt-2">{bulkUploadResult}</p>}
            </div>
          </div>
        )}
        {activeSection === 'finance' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Finance</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Account Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Current Balance</h4>
                  <p className="text-2xl mb-4">£{accountBalance.toFixed(2)}</p>
                  <button 
                    onClick={handleUpdateBalance} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Update Balance
                  </button>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recent Transactions</h4>
                  <ul className="space-y-2">
                    {(showAllTransactions ? allTransactions : recentTransactions).map(payment => (
                      <li key={payment.id} className="flex justify-between">
                        <span>{new Date(payment.date).toLocaleDateString()}</span>
                        <span>£{payment.amount.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => setShowAllTransactions(!showAllTransactions)} 
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {showAllTransactions ? 'Show Recent Transactions' : 'View All Transactions'}
                  </button>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="font-semibold mb-2">Financial Reports</h4>
                <button 
                  onClick={() => generateReport('monthly')} 
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mr-2"
                >
                  Generate Monthly Report
                </button>
                <button 
                  onClick={() => generateReport('annual')} 
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                  Generate Annual Report
                </button>
              </div>
              <div className="mt-8">
                <h4 className="font-semibold mb-2">Expense Tracking</h4>
                <button 
                  onClick={() => setShowExpenseModal(true)} 
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Expense
                </button>
                <div className="mt-4">
                  <h5 className="font-semibold mb-2">Recent Expenses</h5>
                  <ul className="space-y-2">
                    {expenses.slice(0, 5).map(expense => (
                      <li key={expense.id} className="flex justify-between items-center">
                        <span>{expense.description}</span>
                        <span className="flex items-center">
                          <MinusIcon className="h-4 w-4 text-red-500 mr-1" />
                          £{expense.amount.toFixed(2)} - {new Date(expense.date).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        {showReportModal && reportData && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {reportData.type.charAt(0).toUpperCase() + reportData.type.slice(1)} Report
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    From: {reportData.startDate} To: {reportData.endDate}
                  </p>
                  <p className="text-sm text-gray-500">
                    Total Amount: £{reportData.totalAmount.toFixed(2)}
                  </p>
                  {reportData.transactions.length > 0 ? (
                    <div className="mt-4 max-h-60 overflow-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Member</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.transactions.map((transaction, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                              <td className="border px-4 py-2">{transaction.date}</td>
                              <td className="border px-4 py-2">£{transaction.amount.toFixed(2)}</td>
                              <td className="border px-4 py-2">{transaction.memberName || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="mt-4 text-gray-600">No transactions found for this period.</p>
                  )}
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    onClick={generatePDF}
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
                  >
                    Save as PDF
                  </button>
                  <CSVLink
                    data={reportData.transactions}
                    filename={`${reportData.type}_report_${reportData.endDate}.csv`}
                    className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 mr-2"
                  >
                    Save as CSV
                  </CSVLink>
                  <button
                    onClick={closeReportModal}
                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showExpenseModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Expense</h3>
              <input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                className="w-full p-2 mb-4 border rounded"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddExpense}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                >
                  Add Expense
                </button>
                <button
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
