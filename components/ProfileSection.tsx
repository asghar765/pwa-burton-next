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
  console.log('ProfileSection props:', { user, member, userRole, accountBalance, expenses, payments, notes });

  if (!user || !member) {
    console.log('User or member is null, returning null');
    return null;
  }

  console.log('Rendering ProfileSection with member:', member);

  const renderField = (label: string, value: any) => (
    <p><strong>{label}:</strong> {value || 'N/A'}</p>
  );

  return (
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
        {renderField('Account Balance', `£${accountBalance.toFixed(2)}`)}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payments</h3>
        {payments.length > 0 ? (
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
        {expenses.length > 0 ? (
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
