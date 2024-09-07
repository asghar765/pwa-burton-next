import React, { useState } from 'react';
import { Expense } from '../types';

interface ExpenseModalProps {
  onClose: () => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'userId'>) => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ onClose, onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleAddExpense = () => {
    onAddExpense({
      description,
      amount: parseFloat(amount),
      date: new Date(date).toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Expense</h3>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex justify-end">
          <button onClick={handleAddExpense} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">
            Add Expense
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;