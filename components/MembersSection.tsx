import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Member, Payment, Note } from '../types';
import { Dialog } from '@headlessui/react';
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface MemberWithPayments extends Member {
  payments: Payment[];
}

interface MembersSectionProps {
  members: MemberWithPayments[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  expandedMembers: Record<string, boolean>;
  setExpandedMembers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onAddMember: (member: Omit<MemberWithPayments, 'id'>) => void;
  onUpdateMember: (id: string, member: Partial<MemberWithPayments>) => void;
  onDeleteMember: (id: string) => void;
  currentUserRole: string;
  onAddPayment: (memberId: string, payment: Omit<Payment, 'id'>) => void;
  onAddNote: (memberId: string, note: string) => void;
}

const MembersSection: React.FC<MembersSectionProps> = ({
  members,
  searchTerm,
  setSearchTerm,
  expandedMembers,
  setExpandedMembers,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  currentUserRole,
  onAddPayment,
  onAddNote
}) => {
  useEffect(() => {
    console.log('Members updated:', members);
    members.forEach(member => {
      console.log(`Member ${member.id} payments:`, member.payments);
    });
  }, [members]);
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

  const handleAddMember = useCallback(() => {
    onAddMember({ ...newMember, memberNumber: '', verified: true });
    setNewMember({ name: '', email: '', role: '' });
  }, [newMember, onAddMember]);

  const handleAddPayment = useCallback((memberId: string) => {
    const amount = parseFloat(newPaymentAmounts[memberId] || '0');
    if (!isNaN(amount) && amount > 0) {
      const newPayment = {
        amount: amount,
        date: new Date().toISOString(),
        memberId: memberId
      };
      console.log('Adding new payment:', newPayment);
      onAddPayment(memberId, newPayment);
      console.log('Payment added, updating state');
      setNewPaymentAmounts(prev => {
        const updated = { ...prev, [memberId]: '' };
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
                <p>Member No: {member.memberNumber || 'N/A'}</p>
              </div>
              {member.id && expandedMembers[member.id] ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
            {member.id && expandedMembers[member.id] && (
              <div className="p-4 border-t border-gray-200">
                <p>Email: {member.email || 'N/A'}</p>
                <p>Role: {member.role || 'N/A'}</p>
                <div className="mt-2">
                  <button onClick={() => onUpdateMember(member.id, { ...member, name: member.name + ' (updated)' })} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteMember(member.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 mr-2">
                    Delete
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
                        </tr>
                      </thead>
                      <tbody>
                        {[...member.payments]
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((payment, index) => (
                            <tr key={payment.id || `payment-${index}`}>
                              <td>{new Date(payment.date).toLocaleDateString()}</td>
                              <td>£{typeof payment.amount === 'number' ? payment.amount.toFixed(2) : payment.amount}</td>
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
                      value={newPaymentAmounts[member.id] || ''}
                      onChange={(e) => setNewPaymentAmounts(prev => ({ ...prev, [member.id]: e.target.value }))}
                      placeholder="Amount"
                      className="p-2 border border-gray-300 rounded mr-2 flex-grow"
                      step="0.01"
                      min="0"
                    />
                    <button
                      onClick={() => handleAddPayment(member.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      disabled={!newPaymentAmounts[member.id] || parseFloat(newPaymentAmounts[member.id]) <= 0}
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
                      {member.notes?.map((note: Note, index: number) => (
                        <li key={index}>
                          <span className="font-medium">{new Date(note.date).toLocaleDateString()}: </span>
                          {note.content}
                        </li>
                      ))}
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

export default MembersSection;
