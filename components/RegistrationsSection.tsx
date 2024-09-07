import React, { useState } from 'react';
import { Registration } from '../types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface RegistrationsSectionProps {
  registrations: Registration[];
  onApproveRegistration: (registration: Registration) => Promise<void>;
}

const RegistrationsSection: React.FC<RegistrationsSectionProps> = ({ registrations, onApproveRegistration }) => {
  const [expandedRegistrations, setExpandedRegistrations] = useState<Record<string, boolean>>({});
  const [approving, setApproving] = useState<Record<string, boolean>>({});

  const toggleRegistrationExpansion = (registrationId: string) => {
    setExpandedRegistrations(prev => ({
      ...prev,
      [registrationId]: !prev[registrationId]
    }));
  };

  const handleApprove = async (registration: Registration) => {
    setApproving(prev => ({ ...prev, [registration.id]: true }));
    try {
      await onApproveRegistration(registration);
    } catch (error) {
      console.error('Error approving registration:', error);
    } finally {
      setApproving(prev => ({ ...prev, [registration.id]: false }));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Registrations</h2>
      <ul className="space-y-4">
        {registrations.map(registration => (
          <li key={registration.id} className="bg-white rounded shadow">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleRegistrationExpansion(registration.id)}
            >
              <div>
                <h4 className="font-bold">{registration.fullName || 'N/A'}</h4>
                <p>Email: {registration.email || 'N/A'}</p>
              </div>
              {expandedRegistrations[registration.id] ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
            {expandedRegistrations[registration.id] && (
              <div className="p-4 border-t border-gray-200">
                {/* Remove or comment out fields that are not in the Registration type */}
                {/* <p>Gender: {registration.gender || 'N/A'}</p> */}
                {/* <p>Date of Birth: {registration.dateOfBirth || 'N/A'}</p> */}
                {/* <p>Address: {typeof registration.address === 'object' ? JSON.stringify(registration.address) : (registration.address || 'N/A')}</p> */}
                {/* <p>Postcode: {registration.postCode || 'N/A'}</p> */}
                {/* <p>Mobile: {registration.mobileNo || 'N/A'}</p> */}
                {/* <p>Marital Status: {registration.maritalStatus || 'N/A'}</p> */}
                {/* {registration.dependants && registration.dependants.length > 0 && (
                  <div>
                    <h5 className="font-semibold mt-2">Dependants:</h5>
                    <ul>
                      {registration.dependants.map((dependant, index) => (
                        <li key={index}>
                          {typeof dependant === 'object' 
                            ? `${dependant.name || 'N/A'} - ${dependant.dateOfBirth || 'N/A'}`
                            : String(dependant)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )} */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(registration);
                  }} 
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
                  disabled={approving[registration.id]}
                >
                  {approving[registration.id] ? 'Approving...' : 'Approve and Move to Members'}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegistrationsSection;