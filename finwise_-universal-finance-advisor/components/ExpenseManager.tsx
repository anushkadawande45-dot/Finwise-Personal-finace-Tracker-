import React, { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';
import { CATEGORIES, CURRENCY_SYMBOL } from '../constants';

interface ExpenseManagerProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

const ExpenseManager: React.FC<ExpenseManagerProps> = ({ expenses, onAddExpense, onDeleteExpense }) => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !name) return;

    onAddExpense({
      name,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
      isRecurring
    });

    setAmount('');
    setName('');
    setCategory('Food');
    setIsRecurring(false);
  };

  return (
    <div className="space-y-8">
      {/* Add Expense Form */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Plus className="h-6 w-6 mr-2 text-indigo-500" />
          Add Expense
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">What was it?</label>
              <input
                type="text"
                placeholder="e.g. Lunch, Bus Ticket"
                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{CURRENCY_SYMBOL}</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-8 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 transition-all"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 rounded-xl text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all border ${
                    category === cat.id
                      ? `bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200`
                      : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <cat.icon className={`h-4 w-4 ${category === cat.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
              />
              <span className="text-sm text-gray-600">Monthly Recurring?</span>
            </label>
            <button
              type="submit"
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all transform active:scale-95"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>

      {/* Expense List */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
        {expenses.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>No expenses added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.slice().reverse().map((expense) => {
              const CategoryIcon = CATEGORIES.find(c => c.id === expense.category)?.icon || Plus;
              return (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-500">
                      <CategoryIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{expense.name}</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span>{expense.category}</span>
                        {expense.isRecurring && (
                          <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">RECURRING</span>
                        )}
                        <span>• {new Date(expense.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-gray-800 text-lg">
                      {CURRENCY_SYMBOL}{expense.amount.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseManager;