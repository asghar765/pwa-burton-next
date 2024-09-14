import React, { ErrorInfo, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { Member, Payment, Expense, Note } from '../types';

class ErrorBoundary extends React.Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ProfileSection error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error in ProfileSection:</strong>
          <span className="block sm:inline"> {this.state.error?.message || 'Unknown error'}</span>
          <p className="mt-2">Please try refreshing the page. If the problem persists, contact support.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ProfileSectionProps {
  user: User | null;
  member: Member | null;
  userRole: string | null;
  accountBalance: number | null;
  expenses: Expense[] | null;
  payments: Payment[] | null;
  notes: Note[] | null;
  isLoading?: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  user, 
  member, 
  userRole, 
  accountBalance, 
  expenses, 
  payments, 
  notes,
  isLoading = false
}) => {
  if (isLoading) {
    return <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">Loading profile information...</div>;
  }
  console.log('ProfileSection props:', { 
    user: user ? 'User object present' : 'User is null', 
    member: member ? 'Member object present' : 'Member is null', 
    userRole, 
    accountBalance, 
    expenses: expenses?.length || 0, 
    payments: payments?.length || 0, 
    notes: notes?.length || 0 
  });

  if (!user) {
    console.log('User is null, returning login message');
    return <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">Please log in to view your profile.</div>;
  }

  if (!member) {
    console.log('Member is null, returning not found message');
    return <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">Member information not found. Please contact support.</div>;
  }

  console.log('Rendering ProfileSection with member:', member);

  if (!member.fullName || !member.email) {
    console.log('Essential member information missing');
    return <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">Incomplete member information. Please update your profile.</div>;
  }

  const renderField = (label: string, value: any) => (
    <p><strong>{label}:</strong> {value || 'N/A'}</p>
  );

  return (
    <ErrorBoundary>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        
        <div className="space-y-2">
        <h3 className="text-xl font-semibold">Basic Information</h3>
        {renderField('Full Name', member.fullName)}
        {renderField('Email', member.email)}
        {renderField('Role', userRole)}
        {renderField('Member Number', member.memberNumber)}
        {renderField('Verified', member.verified ? 'Yes' : 'No')}
        {renderField('Address', member.address)}
        {renderField('Post Code', member.postCode)}
        {renderField('Town', member.town)}
        {renderField('Date of Birth', member.dateOfBirth)}
        {renderField('Place of Birth', member.placeOfBirth)}
        {renderField('Gender', member.gender)}
        {renderField('Marital Status', member.maritalStatus)}
        {renderField('Mobile No', member.mobileNo)}
        {renderField('Collector', member.collector)}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Next of Kin Information</h3>
        {renderField('Name', member.nextOfKinName)}
        {renderField('Address', member.nextOfKinAddress)}
        {renderField('Phone', member.nextOfKinPhone)}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Dependants</h3>
        {member.dependants && member.dependants.length > 0 ? (
          <ul className="list-disc pl-5">
            {member.dependants.map((dependant, index) => (
              <li key={index}>
                {dependant.name} (DoB: {dependant.dateOfBirth}, Gender: {dependant.gender}, Category: {dependant.category})
              </li>
            ))}
          </ul>
        ) : (
          <p>No dependants recorded.</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Spouse Information</h3>
        {member.spouses && member.spouses.length > 0 ? (
          <ul className="list-disc pl-5">
            {member.spouses.map((spouse, index) => (
              <li key={index}>
                {renderField('Name', spouse.name?.value)}
                {renderField('Date of Birth', spouse.dateOfBirth?.value)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No spouse information recorded.</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Membership Information</h3>
        {renderField('Membership Info', member.membershipInfo)}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Account Information</h3>
        {renderField('Account Balance', accountBalance !== null ? `£${accountBalance.toFixed(2)}` : 'Not available')}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payments</h3>
        {payments && payments.length > 0 ? (
          <ul className="list-disc pl-5">
            {payments.map((payment, index) => (
              <li key={index}>
                {`£${payment.amount.toFixed(2)} on ${new Date(payment.date).toLocaleDateString()}`}
              </li>
            ))}
          </ul>
        ) : (
          <p>No payments recorded.</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Expenses</h3>
        {expenses && expenses.length > 0 ? (
          <ul className="list-disc pl-5">
            {expenses.map((expense, index) => (
              <li key={index}>
                {`£${expense.amount.toFixed(2)} for ${expense.description} on ${new Date(expense.date).toLocaleDateString()}`}
              </li>
            ))}
          </ul>
        ) : (
          <p>No expenses recorded.</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Notes</h3>
        {notes && notes.length > 0 ? (
          <ul className="list-disc pl-5">
            {notes.map((note, index) => (
              <li key={index}>
                {note.content} ({new Date(note.date).toLocaleDateString()})
              </li>
            ))}
          </ul>
        ) : (
          <p>No notes recorded.</p>
        )}
      </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProfileSection;
