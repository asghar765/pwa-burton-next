import React, { useState, useMemo } from 'react';
import { Payment, Expense } from '../types';

interface FinanceSectionProps {
  accountBalance?: number;
  payments: Payment[];
  expenses: Expense[];
  onAddExpense?: (amount: number, description: string) => Promise<void>;
  currencySymbol: string;
  userRole: string | null;
}

const FinanceSection: React.FC<FinanceSectionProps> = ({
  accountBalance,
  payments,
  expenses,
  onAddExpense,
  currencySymbol,
  userRole,
}) => {
  const totalPayments = useMemo(() => payments.reduce((sum, payment) => {
    const amount = typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0), [payments]);

  const totalExpenses = useMemo(() => expenses.reduce((sum, expense) => {
    const amount = typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0), [expenses]);

  const calculatedBalance = useMemo(() => {
    const balance = totalPayments - totalExpenses;
    return isNaN(balance) ? 0 : balance;
  }, [totalPayments, totalExpenses]);
  const [newExpenseAmount, setNewExpenseAmount] = useState<string>('');
  const [newExpenseDescription, setNewExpenseDescription] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expenseSearchTerm, setExpenseSearchTerm] = useState<string>('');

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
    return payments
      .filter(payment => 
        (payment.memberNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.memberId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(payment.date).toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatAmount(payment.amount).includes(searchTerm))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [payments, searchTerm]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(expense => 
        formatDate(expense.date).toLowerCase().includes(expenseSearchTerm.toLowerCase()) ||
        expense.description.toLowerCase().includes(expenseSearchTerm.toLowerCase()) ||
        formatAmount(expense.amount).includes(expenseSearchTerm)
      )
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
  }, [expenses, expenseSearchTerm]);


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Finance Section</h2>
      
      {userRole === 'admin' && (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Account Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold mb-2">Payments Received</p>
              <p className="text-2xl font-bold text-green-600">{currencySymbol}{formatAmount(totalPayments)}</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">Expenses</p>
              <p className="text-2xl font-bold text-red-600">{currencySymbol}{formatAmount(totalExpenses)}</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">Balance</p>
              <p className="text-2xl font-bold text-blue-600">{currencySymbol}{formatAmount(calculatedBalance)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">
          {userRole === 'admin' ? 'All Payments' : 'Your Payment History'}
        </h3>
        {userRole === 'admin' && (
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by member number or ID"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        )}
        <div className="h-60 overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #EDF2F7' }}>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Date</th>
                {userRole === 'admin' && <th className="text-left">Member No</th>}
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b">
                  <td>{formatDate(payment.date)}</td>
                  {userRole === 'admin' && <td>{payment.memberNumber || payment.memberId || 'N/A'}</td>}
                  <td className="text-right font-semibold">{currencySymbol}{formatAmount(payment.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayments.length > 0 && (
          <p className="text-center text-gray-500 mt-2">Scroll to see all payments</p>
        )}
        {filteredPayments.length === 0 && (
          <p className="text-center text-gray-500 my-4">No payments found matching your search.</p>
        )}
      </div>

      {userRole === 'admin' && (
        <>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Expenses</h3>
            <div className="mb-4">
              <input
                type="text"
                value={expenseSearchTerm}
                onChange={(e) => setExpenseSearchTerm(e.target.value)}
                placeholder="Search expenses by date, description, or amount"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="h-60 overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #EDF2F7' }}>
              <ul className="space-y-2">
                {filteredExpenses.map((expense) => (
                  <li key={expense.id} className="flex justify-between items-center">
                    <span>{formatDate(expense.date)} - {expense.description}</span>
                    <span className="font-semibold">{currencySymbol}{formatAmount(expense.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
            {filteredExpenses.length > 0 && (
              <p className="text-center text-gray-500 mt-2">Scroll to see all expenses</p>
            )}
            {filteredExpenses.length === 0 && (
              <p className="text-center text-gray-500 my-4">No expenses found matching your search.</p>
            )}
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
        </>
      )}
    </div>
  );
};

export default FinanceSection;
