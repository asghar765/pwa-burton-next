"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../config/firebaseConfig';
import { useDashboard } from './dashboard-context';
import ErrorBoundary from '../../components/ErrorBoundary';

import DashboardSection from '../../components/DashboardSection';
import { MembersSection } from '../../components/MembersSection';
import CollectorsSection from '../../components/CollectorsSection';
import RegistrationsSection from '../../components/RegistrationsSection';
import DatabaseSection from '../../components/DatabaseSection';
import FinanceSection from '../../components/FinanceSection';
import ProfileSection from '../../components/ProfileSection';
import { Member, MemberWithPayments } from '../../types';

export const DashboardLayout: React.FC = () => {
  const router = useRouter();
  const {
    activeSection,
    setActiveSection,
    members,
    registrations,
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
    userRole,
    notes
  } = useDashboard();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (userRole !== 'admin' && userRole !== 'member') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">You do not have permission to access this page.</p>
          <p className="mb-4">Your current role: {userRole || 'Unknown'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardSection
            members={members as Member[]}
            registrations={registrations}
            collectors={collectors}
            accountBalance={accountBalanceState}
            registrationChartData={[]} 
            currentUser={null} 
            userRole={userRole || ''}
          />
        );
      case 'members':
        return userRole === 'admin' ? (
          <MembersSection
            members={members.map(member => {
              const memberWithPayments: MemberWithPayments = {
                id: member.id || '',
                fullName: member.fullName || member.name || '',
                email: member.email || '',
                verified: member.verified || false,
                address: member.address || '',
                postCode: member.postCode || '',
                town: member.town || '',
                dateOfBirth: member.dateOfBirth || '',
                placeOfBirth: member.placeOfBirth || '',
                gender: member.gender || '',
                maritalStatus: member.maritalStatus || '',
                mobileNo: member.mobileNo || '',
                collector: member.collector || '',
                nextOfKinName: member.nextOfKinName || '',
                nextOfKinAddress: member.nextOfKinAddress || '',
                nextOfKinPhone: member.nextOfKinPhone || '',
                dependants: member.dependants || [],
                spouses: member.spouses || [],
                membershipInfo: member.membershipInfo || '',
                name: member.name || '',
                role: member.role || '',
                payments: member.payments || [],
                notes: member.notes || [],
                membershipType: member.membershipType || '',
                membershipStatus: member.membershipStatus || '',
                membershipStartDate: member.membershipStartDate || '',
                membershipEndDate: member.membershipEndDate || '',
                lastPaymentDate: member.lastPaymentDate || '',
                totalPayments: member.totalPayments || 0,
                memberNumber: member.memberNumber || ''
              };
              return memberWithPayments;
            }) as MemberWithPayments[]}
            firebaseUsers={firebaseUsers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            expandedMembers={expandedMembers}
            setExpandedMembers={setExpandedMembers}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onRevokeMember={handleRevokeMember}
            currentUserRole={userRole || ''}
            onAddPayment={handleAddPayment}
            onAddNote={handleAddNote}
            onUpdateUserRole={handleUpdateUserRole}
          />
        ) : null;
      case 'collectors':
        return userRole === 'admin' ? <CollectorsSection members={members as Member[]} /> : null;
      case 'registrations':
        return userRole === 'admin' ? (
          <RegistrationsSection
            registrations={registrations}
            revokedMembers={members.filter(member => !member.verified) as Member[]}
            onApproveRegistration={handleApproveRegistration}
            onReinstateRevokedMember={handleReinstateRevokedMember}
          />
        ) : null;
      case 'database':
        return userRole === 'admin' ? (
          <DatabaseSection
            collections={[
              { name: 'members', count: members.length },
              { name: 'registrations', count: registrations.length },
              { name: 'collectors', count: collectors.length },
              { name: 'notes', count: notes.length },
              { name: 'payments', count: payments.length },
              { name: 'expenses', count: expenses.length },
              { name: 'users', count: firebaseUsers.length }
            ]}
          />
        ) : null;
      case 'finance':
        return (
          <FinanceSection
            accountBalance={userRole === 'admin' ? accountBalanceState : undefined}
            payments={payments}
            expenses={userRole === 'admin' ? expenses : []}
            onAddExpense={userRole === 'admin' ? handleAddExpense : undefined}
            currencySymbol="£"
            userRole={userRole || ''}
          />
        );
      case 'profile':
        return (
          <ProfileSection
            user={user}
            member={null}
            userRole={userRole || ''}
            accountBalance={accountBalanceState}
            expenses={[]}
            payments={[]}
            notes={[]}
            isLoading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white min-h-screen">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">{userRole === 'admin' ? 'Admin Dashboard' : 'Member Dashboard'}</h2>
          <nav className="space-y-2">
            {['dashboard', 'members', 'collectors', 'registrations', 'database', 'finance', 'profile'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`block w-full text-left p-2 hover:bg-gray-700 rounded capitalize ${
                  activeSection === section ? 'bg-gray-700' : ''
                }`}
                disabled={userRole !== 'admin' && !['dashboard', 'finance', 'profile'].includes(section)}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{userRole === 'admin' ? 'Admin Dashboard' : 'Member Dashboard'}</h1>
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

export default DashboardLayout;
