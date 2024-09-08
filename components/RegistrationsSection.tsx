import React, { useState } from 'react';
import { Registration, Member } from '../types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface RegistrationsSectionProps {
  registrations: Registration[];
  revokedMembers: Member[];
  onApproveRegistration: (registration: Registration) => Promise<void>;
  onReinstateRevokedMember: (member: Member) => Promise<void>;
}

const RegistrationsSection: React.FC<RegistrationsSectionProps> = ({ 
  registrations, 
  revokedMembers, 
  onApproveRegistration, 
  onReinstateRevokedMember 
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleApprove = async (registration: Registration) => {
    setProcessing(prev => ({ ...prev, [registration.id]: true }));
    try {
      const memberNumber = generateMemberNumber();
      await onApproveRegistration({ ...registration, memberNumber });
    } catch (error) {
      console.error('Error approving registration:', error);
    } finally {
      setProcessing(prev => ({ ...prev, [registration.id]: false }));
    }
  };

  const generateMemberNumber = () => {
    const prefix = 'MEM';
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}${randomDigits}`;
  };

  const handleReinstate = async (member: Member) => {
    setProcessing(prev => ({ ...prev, [member.id]: true }));
    try {
      await onReinstateRevokedMember(member);
    } catch (error) {
      console.error('Error reinstating member:', error);
    } finally {
      setProcessing(prev => ({ ...prev, [member.id]: false }));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Registrations and Revoked Members</h2>
      <ul className="space-y-4">
        {registrations.map(registration => (
          <li key={registration.id} className="bg-white rounded shadow">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleItemExpansion(registration.id)}
            >
              <div>
                <h4 className="font-bold">{registration.fullName || 'N/A'}</h4>
                <p>Email: {registration.email || 'N/A'}</p>
              </div>
              {expandedItems[registration.id] ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
            {expandedItems[registration.id] && (
              <div className="p-4 border-t border-gray-200">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(registration);
                  }} 
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
                  disabled={processing[registration.id]}
                >
                  {processing[registration.id] ? 'Approving...' : 'Approve and Move to Members'}
                </button>
              </div>
            )}
          </li>
        ))}
        {revokedMembers && revokedMembers.length > 0 ? (
          revokedMembers.map(member => (
            <li key={member.id} className="bg-white rounded shadow">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleItemExpansion(member.id)}
            >
              <div>
                <h4 className="font-bold">{member.name || 'N/A'}</h4>
                <p>Email: {member.email || 'N/A'}</p>
                <p className="text-red-500">Revoked Member</p>
              </div>
              {expandedItems[member.id] ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
            {expandedItems[member.id] && (
              <div className="p-4 border-t border-gray-200">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReinstate(member);
                  }} 
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={processing[member.id]}
                >
                  {processing[member.id] ? 'Reinstating...' : 'Reinstate as Member'}
                </button>
              </div>
            )}
            </li>
          ))
        ) : (
          <li className="bg-white rounded shadow p-4">
            <p>No revoked members to display.</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default RegistrationsSection;
