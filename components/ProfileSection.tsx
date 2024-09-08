import React from 'react';
import { User } from 'firebase/auth';
import { Member } from '../types';

interface ProfileSectionProps {
  user: User | null;
  member: Member | null;
  userRole: string | null;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, member, userRole }) => {
  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {user.displayName || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email || 'N/A'}</p>
        <p><strong>Role:</strong> {userRole || 'N/A'}</p>
        {member && (
          <>
            <p><strong>Member Number:</strong> {member.memberNumber || 'N/A'}</p>
            <p><strong>Verified:</strong> {member.verified ? 'Yes' : 'No'}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
