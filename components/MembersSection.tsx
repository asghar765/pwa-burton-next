import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Member, Payment, Note, FirebaseUser, NewMember, Collector } from '../types';
import { Dialog } from '@headlessui/react';
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { updateMemberNumberOnCollectorChange, generateRawMemberNumber } from '../utils/memberUtils';
import { useInView } from 'react-intersection-observer';

interface MemberWithPayments extends Member {
  memberNumber: any;
  payments: Payment[];
}

interface LoggedUser {
  id: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  displayName: string;
  email: string;
  photoURL: string;
  role: string;
}

export interface MembersSectionProps {
  members: MemberWithPayments[];
  firebaseUsers: FirebaseUser[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  expandedMembers: Record<string, boolean>;
  setExpandedMembers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onUpdateMember: (id: string, member: Partial<MemberWithPayments>) => void;
  onDeleteMember: (id: string) => void;
  onRevokeMember: (id: string) => void;
  currentUserRole: string;
  onAddPayment: (memberNumber: string, payment: Omit<Payment, 'id'>) => void;
  onAddNote: (memberNumber: string, note: string) => void;
  onUpdateUserRole: (userId: string, newRole: string) => void;
}

interface CollectorChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (collectorId: string) => void;
  collectors: Collector[];
}

const CollectorChangeModal: React.FC<CollectorChangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  collectors
}) => {
  const [selectedCollector, setSelectedCollector] = useState('');

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">Change Collector</Dialog.Title>
          <select
            value={selectedCollector}
            onChange={(e) => setSelectedCollector(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">Select a collector</option>
            {collectors.map((collector) => (
              <option key={collector.id} value={collector.id}>
                {collector.name}
              </option>
            ))}
          </select>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                if (selectedCollector) {
                  onConfirm(selectedCollector);
                  onClose();
                }
              }}
              disabled={!selectedCollector}
            >
              Change Collector
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const MembersSection: React.FC<MembersSectionProps> = ({
  members,
  searchTerm,
  setSearchTerm,
  expandedMembers,
  setExpandedMembers,
  onUpdateMember,
  onDeleteMember,
  onRevokeMember,
  currentUserRole,
  onAddPayment,
  onAddNote,
  onUpdateUserRole
}) => {
  const [firebaseUsers] = useState<FirebaseUser[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [newPaymentAmounts, setNewPaymentAmounts] = useState<Record<string, string>>({});
  const [newNote, setNewNote] = useState('');
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [collectorChangeModal, setCollectorChangeModal] = useState<{
    isOpen: boolean;
    memberNumber: string | null;
  }>({ isOpen: false, memberNumber: null });
  const [collectors, setCollectors] = useState<Collector[]>([]);

  // Fetch collectors
  useEffect(() => {
    const fetchCollectors = async () => {
      const collectorsRef = collection(db, 'collectors');
      const snapshot = await getDocs(collectorsRef);
      const collectorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || '',
        email: doc.data().email || '',
        contactNumber: doc.data().contactNumber,
        address: doc.data().address,
        members: doc.data().members || [],
        order: doc.data().order || 0 // Handle order dynamically
      } as Collector));
      setCollectors(collectorsData);
    };
    fetchCollectors();
  }, []);

  const toggleMemberExpansion = useCallback((memberNumber: string) => {
    setExpandedMembers(prev => ({ ...prev, [memberNumber]: !prev[memberNumber] }));
  }, [setExpandedMembers]);

  const handleDeleteMember = useCallback((memberNumber: string) => {
    setMemberToDelete(memberNumber);
  }, []);

  // Handle collector change
  const handleCollectorChange = async (memberNumber: string, newCollectorId: string) => {
    try {
      const collector = collectors.find(c => c.id === newCollectorId);
      if (!collector) {
        throw new Error('Collector not found');
      }

      // Keep the existing member number during collector change
      await updateMemberNumberOnCollectorChange(db, memberNumber, newCollectorId, {
        initials: collector.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        order: collector.order ?? 0
      });

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error changing collector:', error);
      alert('Failed to change collector. Please try again.');
    }
  };

  const formatMemberNumber = (member: MemberWithPayments) => {
    const collector = collectors.find(c => c.id === member.collectorId);
    if (!collector || !member.memberNumber) return 'Not assigned';
    
    return generateRawMemberNumber(
      collector.name, 
      collector.order || 0, 
      parseInt(member.memberNumber, 10)
    );
  };

  const filteredMembers = useMemo(() => {
    return members
      .filter(member => {
        const search = searchTerm.toLowerCase();
        return (
          (member.fullName && member.fullName.toLowerCase().includes(search)) ||
          (member.memberNumber && member.memberNumber.toLowerCase().includes(search)) ||
          (member.name && member.name.toLowerCase().includes(search))
        );
      });
  }, [members, searchTerm]);

  const confirmDeleteMember = useCallback(() => {
    if (memberToDelete) {
      onDeleteMember(memberToDelete);
      setMemberToDelete(null);
    }
  }, [memberToDelete, onDeleteMember]);

  const handleAddPayment = useCallback((memberNumber: string) => {
    const amount = parseFloat(newPaymentAmounts[memberNumber] || '0');
    if (!isNaN(amount) && amount > 0) {
      const newPayment = {
        amount: amount,
        date: new Date().toISOString(),
        memberNumber: memberNumber
      };
      onAddPayment(memberNumber, newPayment);
      setNewPaymentAmounts(prev => ({ ...prev, [memberNumber]: '' }));
    } else {
      alert('Please enter a valid payment amount.');
    }
  }, [newPaymentAmounts, onAddPayment]);

  return (
    <div className="container mx-auto px-4 max-w-full">
<h2 className="text-2xl font-bold mb-4">Members</h2>
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
      <div className="overflow-x-auto">
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray">
          <table className="w-full bg-white">
            <thead className="sticky top-0 bg-gray-200 z-10">
              <tr className="text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Member No</th>
                <th className="py-3 px-6 text-left">Address</th>
                <th className="py-3 px-6 text-left">Contact</th>
                <th className="py-3 px-6 text-left">Collector</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredMembers.map(member => (
                <React.Fragment key={member.memberNumber}>
                  <tr className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-medium">{member.fullName || member.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span>{formatMemberNumber(member)}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span>{`${member.address || ''}, ${member.town || ''}, ${member.postCode || ''}`}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span>{member.mobileNo || member.email || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span>{member.collector || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => toggleMemberExpansion(member.memberNumber)}
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors duration-200"
                        >
                          {expandedMembers[member.memberNumber] ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => setCollectorChangeModal({ isOpen: true, memberNumber: member.memberNumber })}
                          className="p-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors duration-200"
                        >
                          <span className="sr-only">Change Collector</span>
                          <UserGroupIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onUpdateMember(member.memberNumber, { ...member, name: member.name + ' (updated)' })}
                          className="p-1 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200 transition-colors duration-200"
                        >
                          <span className="sr-only">Edit</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.memberNumber)}
                          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors duration-200"
                        >
                          <span className="sr-only">Delete</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onRevokeMember(member.memberNumber)}
                          className="p-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200 transition-colors duration-200"
                        >
                          <span className="sr-only">Revoke</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedMembers[member.memberNumber] && (
                    <tr>
                      <td colSpan={6}>
                        <div className="p-4 bg-gray-50">
                          {/* Expanded member details */}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collector Change Modal */}
      <CollectorChangeModal
        isOpen={collectorChangeModal.isOpen}
        onClose={() => setCollectorChangeModal({ isOpen: false, memberNumber: null })}
        onConfirm={(newCollectorId) => {
          if (collectorChangeModal.memberNumber) {
            handleCollectorChange(collectorChangeModal.memberNumber, newCollectorId);
          }
        }}
        collectors={collectors}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!memberToDelete} onClose={() => setMemberToDelete(null)}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium mb-4">Confirm Deletion</Dialog.Title>
            <p>Are you sure you want to delete this member? This action cannot be undone.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => setMemberToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmDeleteMember}
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export { MembersSection };
