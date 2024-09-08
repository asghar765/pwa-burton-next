import React from 'react';
import { User } from 'firebase/auth';
import { Member, Payment, Expense, Note } from '../types';

interface ProfileSectionProps {
  user: User | null;
  member: Member | null;
  userRole: string | null;
  accountBalance: number;
  expenses: Expense[];
  payments: Payment[];
  notes: Note[];
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  user, 
  member, 
  userRole, 
  accountBalance, 
  expenses, 
  payments, 
  notes 
}) => {
  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Basic Information</h3>
        <p><strong>Name:</strong> {user.displayName || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email || 'N/A'}</p>
        <p><strong>Role:</strong> {userRole || 'N/A'}</p>
        {member && (
          <>
            <p><strong>Member Number:</strong> {member.memberNumber || 'N/A'}</p>
            <p><strong>Verified:</strong> {member.verified ? 'Yes' : 'No'}</p>
            <p><strong>Address:</strong> {member.address || 'N/A'}</p>
            <p><strong>Collector:</strong> {member.collector || 'N/A'}</p>
          </>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Financial Information</h3>
        <p><strong>Account Balance:</strong> £{accountBalance.toFixed(2)}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Expenses</h3>
        {expenses.length > 0 ? (
          <ul className="list-disc pl-5">
            {expenses.map((expense, index) => (
              <li key={index}>
                {expense.description}: £{expense.amount.toFixed(2)} ({new Date(expense.date).toLocaleDateString()})
              </li>
            ))}
          </ul>
        ) : (
          <p>No expenses recorded.</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payments</h3>
        {payments.length > 0 ? (
          <ul className="list-disc pl-5">
            {payments.map((payment, index) => (
              <li key={index}>
                £{payment.amount.toFixed(2)} ({new Date(payment.date).toLocaleDateString()})
              </li>
            ))}
          </ul>
        ) : (
          <p>No payments recorded.</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Notes</h3>
        {notes.length > 0 ? (
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
  );
};

export default ProfileSection;
