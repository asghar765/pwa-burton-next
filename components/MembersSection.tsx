import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Member, Payment, Note, FirebaseUser, NewMember } from '../types';
import { Dialog } from '@headlessui/react';
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { generateMemberNumber } from '../utils/memberUtils';

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
  onAddMember: (member: NewMember) => void;
  onUpdateMember: (id: string, member: Partial<MemberWithPayments>) => void;
  onDeleteMember: (id: string) => void;
  onRevokeMember: (id: string) => void;
  currentUserRole: string;
  onAddPayment: (memberId: string, payment: Omit<Payment, 'id'>) => void;
  onAddNote: (memberId: string, note: string) => void;
  onUpdateUserRole: (userId: string, newRole: string) => void;
}

const MembersSection: React.FC<MembersSectionProps> = React.memo(function MembersSection({
  members,
  searchTerm,
  setSearchTerm,
  expandedMembers,
  setExpandedMembers,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onRevokeMember,
  currentUserRole,
  onAddPayment,
  onAddNote,
  onUpdateUserRole
}) {
  const [firebaseUsers, setFirebaseUsers] = useState<FirebaseUser[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  useEffect(() => {
    const fetchFirebaseUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseUser));
      setFirebaseUsers(usersData);
    };

    fetchFirebaseUsers();
  }, []);

  useEffect(() => {
    console.log('Members updated:', members);
    members.forEach(member => {
      console.log(`Member ${member.id} payments:`, member.payments);
    });
  }, [members]);

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      
      // Update local state
      setFirebaseUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      console.log(`User ${userId} role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role. Please try again.");
    }
  };

  const filteredFirebaseUsers = useMemo(() => {
    return firebaseUsers.filter(user => {
      const search = userSearchTerm.toLowerCase();
      return (
        user.displayName?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.role?.toLowerCase().includes(search)
      );
    });
  }, [firebaseUsers, userSearchTerm]);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });
  const [newPaymentAmounts, setNewPaymentAmounts] = useState<Record<string, string>>({});
  const [newNote, setNewNote] = useState('');
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const membersWithPayments = useMemo(() => {
    console.log('Recalculating membersWithPayments');
    return members.map(member => ({
      ...member,
      payments: member.payments || []
    }));
  }, [members]);

  const filteredMembers = useMemo(() => {
    console.log('Recalculating filteredMembers');
    console.log('All members:', membersWithPayments);
    return membersWithPayments.filter(member => {
      const search = searchTerm.toLowerCase();
      return (
        (member.name && member.name.toLowerCase().includes(search)) ||
        (member.memberNumber && member.memberNumber.toLowerCase().includes(search))
      );
    });
  }, [membersWithPayments, searchTerm]);

  const toggleMemberExpansion = useCallback((memberId: string) => {
    setExpandedMembers(prev => ({ ...prev, [memberId]: !prev[memberId] }));
  }, [setExpandedMembers]);

  const handleAddMember = useCallback(async () => {
    try {
      const memberNumber = generateMemberNumber();
      const newMemberData = { ...newMember, memberNumber, verified: true };
      const membersRef = collection(db, 'members');
      await addDoc(membersRef, newMemberData);
      onAddMember(newMemberData);
      setNewMember({ name: '', email: '', role: '' });
    } catch (error) {
      console.error("Error adding member:", error);
    }
  }, [newMember, onAddMember]);

  const handleAddPayment = useCallback((memberNumber: string) => {
    const amount = parseFloat(newPaymentAmounts[memberNumber] || '0');
    if (!isNaN(amount) && amount > 0) {
      const newPayment = {
        amount: amount,
        date: new Date().toISOString(),
        memberNumber: memberNumber
      };
      console.log('Adding new payment:', newPayment);
      onAddPayment(memberNumber, newPayment);
      console.log('Payment added, updating state');
      setNewPaymentAmounts(prev => {
        const updated = { ...prev, [memberNumber]: '' };
        console.log('Updated newPaymentAmounts:', updated);
        return updated;
      });
      // Force re-render
      setExpandedMembers(prev => ({ ...prev }));
    } else {
      console.log('Invalid payment amount:', amount);
      alert('Please enter a valid payment amount.');
    }
  }, [newPaymentAmounts, onAddPayment, setExpandedMembers]);

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
    <div>
      <h2 className="text-xl font-semibold mb-4">Members</h2>
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
      <div className="mb-4">
        <input
          type="text"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          placeholder="Name"
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="email"
          value={newMember.email}
          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
          placeholder="Email"
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <select
          value={newMember.role}
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
          className="p-2 border border-gray-300 rounded mr-2"
        >
          <option value="">Select Role</option>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleAddMember} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Member
        </button>
      </div>
      <ul className="space-y-4">
        {membersWithPayments.filter(member => {
          const search = searchTerm ? searchTerm.toLowerCase() : '';
          return (
            (member.name && member.name.toLowerCase().includes(search)) ||
            (member.memberNumber && member.memberNumber.toLowerCase().includes(search))
          );
        }).map(member => (
          <li key={member.id || 'temp-' + Math.random()} className="bg-white rounded shadow">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => member.id && toggleMemberExpansion(member.id)}
            >
              <div>
                <h4 className="font-bold">{member.name || 'N/A'}</h4>
                <p>Member No: {member.memberNumber || 'Not assigned'}</p>
              </div>
              {member.id && expandedMembers[member.id] ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
            {member.id && expandedMembers[member.id] && (
              <div className="p-4 border-t border-gray-200">
                <p><strong>Member No:</strong> {member.memberNumber || 'N/A'}</p>
                <p><strong>Name:</strong> {member.name || 'N/A'}</p>
                <p><strong>Email:</strong> {member.email || 'N/A'}</p>
                <p><strong>Role:</strong> {member.role || 'N/A'}</p>
                <p><strong>Address:</strong> {member.address || 'N/A'}</p>
                <p><strong>Collector:</strong> {member.collector || 'N/A'}</p>
                <p><strong>Verified:</strong> {member.verified ? 'Yes' : 'No'}</p>

                {/* Keep existing fields */}
                <p><strong>Full Name:</strong> {member.fullName || 'N/A'}</p>
                <p><strong>Date of Birth:</strong> {member.dateOfBirth || 'N/A'}</p>
                <p><strong>Gender:</strong> {member.gender || 'N/A'}</p>
                <p><strong>Marital Status:</strong> {member.maritalStatus || 'N/A'}</p>
                <p><strong>Membership Info:</strong> {member.membershipInfo || 'N/A'}</p>
                <p><strong>Mobile No:</strong> {member.mobileNo || 'N/A'}</p>
                <p><strong>Next of Kin Name:</strong> {member.nextOfKinName || 'N/A'}</p>
                <p><strong>Next of Kin Address:</strong> {member.nextOfKinAddress || 'N/A'}</p>
                <p><strong>Next of Kin Phone:</strong> {member.nextOfKinPhone || 'N/A'}</p>
                <p><strong>Place of Birth:</strong> {member.placeOfBirth || 'N/A'}</p>
                <p><strong>Post Code:</strong> {member.postCode || 'N/A'}</p>
                <p><strong>Town:</strong> {member.town || 'N/A'}</p>
                <p><strong>Membership Type:</strong> {member.membershipType || 'N/A'}</p>
                <p><strong>Membership Status:</strong> {member.membershipStatus || 'N/A'}</p>
                <p><strong>Membership Start Date:</strong> {member.membershipStartDate || 'N/A'}</p>
                <p><strong>Membership End Date:</strong> {member.membershipEndDate || 'N/A'}</p>
                <p><strong>Last Payment Date:</strong> {member.lastPaymentDate || 'N/A'}</p>
                <p><strong>Total Payments:</strong> {member.totalPayments || 'N/A'}</p>

                <h5 className="font-semibold mt-4">Spouse(s)</h5>
                {member.spouses && member.spouses.length > 0 ? (
                  member.spouses.map((spouse, index) => (
                    <div key={index} className="ml-4">
                      <p><strong>Name:</strong> {spouse.name?.value || 'N/A'}</p>
                      <p><strong>Date of Birth:</strong> {spouse.dateOfBirth?.value || 'N/A'}</p>
                    </div>
                  ))
                ) : (
                  <p className="ml-4">No spouse information available</p>
                )}

                <h5 className="font-semibold mt-4">Dependant(s)</h5>
                {member.dependants && member.dependants.length > 0 ? (
                  member.dependants.map((dependant, index) => (
                    <div key={index} className="ml-4">
                      <p><strong>Name:</strong> {dependant.name || 'N/A'}</p>
                      <p><strong>Date of Birth:</strong> {dependant.dateOfBirth || 'N/A'}</p>
                      <p><strong>Gender:</strong> {dependant.gender || 'N/A'}</p>
                      <p><strong>Category:</strong> {dependant.category || 'N/A'}</p>
                    </div>
                  ))
                ) : (
                  <p className="ml-4">No dependant information available</p>
                )}

                <div className="mt-2">
                  <button onClick={() => onUpdateMember(member.id, { ...member, name: member.name + ' (updated)' })} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteMember(member.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 mr-2">
                    Delete
                  </button>
                  <button onClick={() => onRevokeMember(member.id)} className="px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">
                    Revoke
                  </button>
                </div>

                {/* Payment History */}
                <div className="mt-4">
                  <h5 className="font-semibold">Payment History</h5>
                  {member.payments && member.payments.length > 0 ? (
                    <table className="w-full mt-2">
                      <thead>
                        <tr>
                          <th className="text-left">Date</th>
                          <th className="text-left">Amount</th>
                          <th className="text-left">Member No</th>
                          <th className="text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...member.payments]
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((payment, index) => (
                            <tr key={`${member.memberNumber}-${payment.date}-${index}`}>
                              <td>{new Date(payment.date).toLocaleDateString()}</td>
                              <td>£{typeof payment.amount === 'number' ? payment.amount.toFixed(2) : payment.amount}</td>
                              <td>{member.memberNumber || 'N/A'}</td>
                              <td>
                                {!member.memberNumber ? (
                                  <span className="text-red-500">Missing Member No</span>
                                ) : null}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No payments recorded for this member.</p>
                  )}
                </div>

                {/* Add Payment */}
                <div className="mt-4">
                  <h5 className="font-semibold">Add Payment</h5>
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

                {/* Notes Section (Admin Only) */}
                {currentUserRole === 'admin' && (
                  <div className="mt-4">
                    <h5 className="font-semibold">Admin Notes</h5>
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
                      className="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 mt-2"
                    >
                      Add Note
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Logged Users Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Logged Users</h2>
        <div className="mb-4 flex items-center">
          <input
            type="text"
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
            placeholder="Search logged users"
            className="p-2 border border-gray-300 rounded mr-2 flex-grow"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        {filteredFirebaseUsers.length > 0 ? (
          <ul className="space-y-4">
            {filteredFirebaseUsers.map(user => (
              <li key={user.id} className="bg-white rounded shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {user.photoURL && (
                      <Image src={user.photoURL} alt={user.displayName || 'User'} width={40} height={40} className="rounded-full mr-4" />
                    )}
                    <div>
                      <h4 className="font-bold">{user.displayName || 'N/A'}</h4>
                      <p>Email: {user.email || 'N/A'}</p>
                      <p>Role: {user.role || 'N/A'}</p>
                      <p>Created: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <select
                      value={user.role || ''}
                      onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                      className="p-2 border border-gray-300 rounded"
                    >
                      <option value="">Select Role</option>
                      <option value="member">Member</option>
                      <option value="collector">Collector</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No logged users found.</p>
        )}
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
});

export default MembersSection;
