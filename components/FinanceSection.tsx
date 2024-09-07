import React, { useState, useMemo } from 'react';
import { Payment, Expense } from '../types';

interface FinanceSectionProps {
  accountBalance: number;
  payments: Payment[];
  expenses: Expense[];
  onAddExpense: (amount: number, description: string) => Promise<void>;
  currencySymbol: string;
}

const FinanceSection: React.FC<FinanceSectionProps> = ({
  accountBalance,
  payments,
  expenses,
  onAddExpense,
  currencySymbol,
}) => {
  const [newExpenseAmount, setNewExpenseAmount] = useState<string>('');
  const [newExpenseDescription, setNewExpenseDescription] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newExpenseAmount);
    if (!isNaN(amount) && newExpenseDescription) {
      onAddExpense(amount, newExpenseDescription);
      setNewExpenseAmount('');
      setNewExpenseDescription('');
    }
  };

  const formatDate = (date: Date | string | number): string => {
    if (date instanceof Date) {
      return date.toLocaleDateString('en-GB');
    }
    if (typeof date === 'string') {
      try {
        const parsedDate = JSON.parse(date);
        if (parsedDate && parsedDate.date) {
          return new Date(parsedDate.date).toLocaleDateString('en-GB');
        }
      } catch (e) {
        // If JSON parsing fails, continue with normal date parsing
      }
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? 'Invalid Date' : parsedDate.toLocaleDateString('en-GB');
    }
    if (typeof date === 'number') {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? 'Invalid Date' : parsedDate.toLocaleDateString('en-GB');
    }
    return 'Invalid Date';
  };

  const formatAmount = (amount: number | string): string => {
    if (typeof amount === 'string') {
      try {
        const parsedAmount = JSON.parse(amount);
        if (parsedAmount && parsedAmount.amount) {
          amount = parseFloat(parsedAmount.amount);
        }
      } catch (e) {
        // If JSON parsing fails, continue with normal parsing
      }
    }
    const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(parsedAmount) ? '0.00' : parsedAmount.toFixed(2);
  };

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => 
      payment.memberNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.memberId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [payments, searchTerm]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Finance Section</h2>
      
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Account Balance</h3>
        <p className="text-2xl font-bold">{currencySymbol}{formatAmount(accountBalance)}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Payments</h3>
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by member number or ID"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <ul className="space-y-2">
          {filteredPayments.map((payment) => (
            <li key={payment.id} className="flex justify-between items-center">
              <span>{formatDate(payment.date)} - Member No: {payment.memberNumber || payment.memberId || 'N/A'}</span>
              <span className="font-semibold">{currencySymbol}{formatAmount(payment.amount)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Recent Expenses</h3>
        <ul className="space-y-2">
          {expenses.slice(0, 5).map((expense) => (
            <li key={expense.id} className="flex justify-between items-center">
              <span>{formatDate(expense.date)} - {expense.description}</span>
              <span className="font-semibold">{currencySymbol}{formatAmount(expense.amount)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Add New Expense</h3>
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label htmlFor="expenseAmount" className="block mb-1">Amount</label>
            <input
              type="number"
              id="expenseAmount"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="expenseDescription" className="block mb-1">Description</label>
            <input
              type="text"
              id="expenseDescription"
              value={newExpenseDescription}
              onChange={(e) => setNewExpenseDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinanceSection;
