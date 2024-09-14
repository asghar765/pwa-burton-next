import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Member, Payment, Note, FirebaseUser, NewMember, Collector } from '../types';
import { Dialog } from '@headlessui/react';
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { generateMemberNumber } from '../utils/memberUtils';
import { useInView } from 'react-intersection-observer';

interface MemberWithPayments extends Member {
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
  onAddNote: (memberId: string, note: string) => void;
  onUpdateUserRole: (userId: string, newRole: string) => void;
  onLoadMore: () => void;
}

export interface CollectorsSectionProps {
  collectors: Collector[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  expandedCollectors: Record<string, boolean>;
  setExpandedCollectors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const CollectorsSection: React.FC<CollectorsSectionProps> = ({
  collectors,
  searchTerm,
  setSearchTerm,
  expandedCollectors,
  setExpandedCollectors,
}) => {
  const filteredCollectors = useMemo(() => {
    return collectors.filter(collector => {
      const search = searchTerm.toLowerCase();
      return (
        (collector.name && collector.name.toLowerCase().includes(search)) ||
        (collector.id && collector.id.toLowerCase().includes(search))
      );
    });
  }, [collectors, searchTerm]);

  const toggleCollectorExpansion = useCallback((collectorId: string) => {
    setExpandedCollectors(prev => ({ ...prev, [collectorId]: !prev[collectorId] }));
  }, [setExpandedCollectors]);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Collectors</h2>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by member ID or name"
          className="p-2 border border-gray-300 rounded mr-2 flex-grow"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="mb-4">
        <p>Showing {collectors.length} collectors</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 bg-gray-200">
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
            {filteredCollectors.map(collector => (
              <React.Fragment key={collector.id}>
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium">{collector.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{collector.id || 'Not assigned'}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{collector.email || 'N/A'}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{collector.contactNumber || 'N/A'}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{collector.address || 'N/A'}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => toggleCollectorExpansion(collector.id)}
                        className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors duration-200"
                      >
                        {expandedCollectors[collector.id] ? (
                          <ChevronUpIcon className="h-5 w-5" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedCollectors[collector.id] && (
                  <tr>
                    <td colSpan={6}>
                      <div className="p-4 bg-gray-50">
                        <h4 className="font-semibold mb-2">Assigned Members</h4>
                        {collector.members && collector.members.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {collector.members.map((member, index) => (
                              <li key={index}>{member.name} (ID: {member.id})</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No members assigned to this collector.</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div ref={ref} className="h-10" />
    </div>
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
  const [ref, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      onLoadMore();
    }
  }, [inView, onLoadMore]);
  const [firebaseUsers, setFirebaseUsers] = useState<FirebaseUser[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [newPaymentAmounts, setNewPaymentAmounts] = useState<Record<string, string>>({});
  const [newNote, setNewNote] = useState('');
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const search = searchTerm.toLowerCase();
      return (
        (member.fullName && member.fullName.toLowerCase().includes(search)) ||
        (member.memberNumber && member.memberNumber.toLowerCase().includes(search)) ||
        (member.name && member.name.toLowerCase().includes(search))
      );
    });
  }, [members, searchTerm]);

  const toggleMemberExpansion = useCallback((memberId: string) => {
    setExpandedMembers(prev => ({ ...prev, [memberId]: !prev[memberId] }));
  }, [setExpandedMembers]);

  const handleAddPayment = useCallback((memberNumber: string) => {
    const amount = parseFloat(newPaymentAmounts[memberNumber] || '0');
    if (!isNaN(amount) && amount > 0) {
      const newPayment = {
        amount: amount,
        date: new Date().toISOString(),
        memberNumber: memberNumber,
        memberId: memberNumber
      };
      onAddPayment(memberNumber, newPayment);
      setNewPaymentAmounts(prev => ({ ...prev, [memberNumber]: '' }));
    } else {
      alert('Please enter a valid payment amount.');
    }
  }, [newPaymentAmounts, onAddPayment]);

  const handleDeleteMember = useCallback((id: string) => {
    setMemberToDelete(id);
  }, []);

  const confirmDeleteMember = useCallback(() => {
    if (memberToDelete) {
      onDeleteMember(memberToDelete);
      setMemberToDelete(null);
    }
  }, [memberToDelete, onDeleteMember]);

  return (
    <div className="container mx-auto px-4">
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
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 bg-gray-200">
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
              <React.Fragment key={member.id}>
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium">{member.fullName || member.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{member.memberNumber || 'Not assigned'}</span>
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
                        onClick={() => toggleMemberExpansion(member.id)}
                        className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors duration-200"
                      >
                        {expandedMembers[member.id] ? (
                          <ChevronUpIcon className="h-5 w-5" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => onUpdateMember(member.id, { ...member, name: member.name + ' (updated)' })}
                        className="p-1 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200 transition-colors duration-200"
                      >
                        <span className="sr-only">Edit</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors duration-200"
                      >
                        <span className="sr-only">Delete</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onRevokeMember(member.id)}
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
                {expandedMembers[member.id] && (
                  <tr>
                    <td colSpan={6}>
                      <div className="p-4 bg-gray-50">
                        <h4 className="font-semibold mb-2">Member Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p><strong>Full Name:</strong> {member.fullName || 'N/A'}</p>
                            <p><strong>Date of Birth:</strong> {member.dateOfBirth || 'N/A'}</p>
                            <p><strong>Gender:</strong> {member.gender || 'N/A'}</p>
                            <p><strong>Marital Status:</strong> {member.maritalStatus || 'N/A'}</p>
                          </div>
                          <div>
                            <p><strong>Membership Type:</strong> {member.membershipType || 'N/A'}</p>
                            <p><strong>Membership Status:</strong> {member.membershipStatus || 'N/A'}</p>
                            <p><strong>Membership Start Date:</strong> {member.membershipStartDate || 'N/A'}</p>
                            <p><strong>Membership End Date:</strong> {member.membershipEndDate || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold mt-4 mb-2">Payment History</h4>
                        {member.payments && member.payments.length > 0 ? (
                          <table className="min-w-full">
                            <thead>
                              <tr className="bg-gray-200">
                                <th className="py-2 px-4 text-left">Date</th>
                                <th className="py-2 px-4 text-left">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {member.payments.map((payment, index) => (
                                <tr key={index} className="border-b">
                                  <td className="py-2 px-4">{new Date(payment.date).toLocaleDateString()}</td>
                                  <td className="py-2 px-4">£{payment.amount.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>No payments recorded for this member.</p>
                        )}

                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Add Payment</h4>
                          <div className="flex items-center">
                            <input
                              type="number"
                              value={newPaymentAmounts[member.memberNumber || ''] || ''}
                              onChange={(e) => setNewPaymentAmounts(prev => ({ ...prev, [member.memberNumber || '']: e.target.value }))}
                              placeholder="Amount"
                              className="p-2 border border-gray-300 rounded mr-2 flex-grow"
                              step="0.01"
                              min="0"
                            />
                            <button
                              onClick={() => handleAddPayment(member.memberNumber || '')}
                              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                              disabled={!newPaymentAmounts[member.memberNumber || ''] || parseFloat(newPaymentAmounts[member.memberNumber || '']) <= 0 || !member.memberNumber}
                            >
                              Add Payment
                            </button>
                          </div>
                        </div>

                        {currentUserRole === 'admin' && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Admin Notes</h4>
                            <ul className="list-disc list-inside">
                              {member.notes && member.notes.length > 0 ? (
                                member.notes.map((note: Note, index: number) => (
                                  <li key={index}>
                                    <span className="font-medium">{new Date(note.date).toLocaleDateString()}: </span>
                                    {note.content}
                                  </li>
                                ))
                              ) : (
                                <li>No notes available</li>
                              )}
                            </ul>
                            <textarea
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              placeholder="Add a note"
                              className="p-2 border border-gray-300 rounded w-full mt-2"
                            />
                            <button
                              onClick={() => {
                                if (newNote.trim()) {
                                  onAddNote(member.id, newNote);
                                  setNewNote('');
                                } else {
                                  alert('Please enter a note before adding.');
                                }
                              }}
                              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mt-2"
                            >
                              Add Note
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

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

export { MembersSection, CollectorsSection };
