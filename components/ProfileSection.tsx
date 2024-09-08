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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Basic Information</h3>
        <p><strong>Full Name:</strong> {member.fullName || 'N/A'}</p>
        <p><strong>Email:</strong> {member.email || 'N/A'}</p>
        <p><strong>Role:</strong> {userRole || 'N/A'}</p>
        <p><strong>Member Number:</strong> {member.memberNumber || 'N/A'}</p>
        <p><strong>Verified:</strong> {member.verified ? 'Yes' : 'No'}</p>
        <p><strong>Address:</strong> {member.address || 'N/A'}</p>
        <p><strong>Post Code:</strong> {member.postCode || 'N/A'}</p>
        <p><strong>Town:</strong> {member.town || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> {member.dateOfBirth || 'N/A'}</p>
        <p><strong>Place of Birth:</strong> {member.placeOfBirth || 'N/A'}</p>
        <p><strong>Gender:</strong> {member.gender || 'N/A'}</p>
        <p><strong>Marital Status:</strong> {member.maritalStatus || 'N/A'}</p>
        <p><strong>Mobile No:</strong> {member.mobileNo || 'N/A'}</p>
        <p><strong>Collector:</strong> {member.collector || 'N/A'}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Next of Kin Information</h3>
        <p><strong>Name:</strong> {member.nextOfKinName || 'N/A'}</p>
        <p><strong>Address:</strong> {member.nextOfKinAddress || 'N/A'}</p>
        <p><strong>Phone:</strong> {member.nextOfKinPhone || 'N/A'}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Dependants</h3>
        {member.dependants && member.dependants.length > 0 ? (
          <ul className="list-disc pl-5">
            {member.dependants.map((dependant, index) => (
              <li key={index}>{dependant}</li>
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
                <p><strong>Name:</strong> {spouse.name?.value || 'N/A'}</p>
                <p><strong>Date of Birth:</strong> {spouse.dateOfBirth?.value || 'N/A'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No spouse information recorded.</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Membership Information</h3>
        <p>{member.membershipInfo || 'No additional membership information available.'}</p>
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
