import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Expense, ExpenseCategory } from '../types';
import { CATEGORIES } from '../constants';

interface ChartsProps {
  expenses: Expense[];
  income: number;
}

const COLORS = CATEGORIES.map(c => c.color);

export const ExpensePieChart: React.FC<ChartsProps> = ({ expenses }) => {
  const data = CATEGORIES.map(cat => {
    const total = expenses
      .filter(e => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: cat.label, value: total };
  }).filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        No expenses recorded yet
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORIES.find(c => c.label === entry.name)?.color || '#ccc'} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const IncomeVsExpenseBar: React.FC<ChartsProps> = ({ expenses, income }) => {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const data = [
    { name: 'Income', amount: income },
    { name: 'Expenses', amount: totalExpenses },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
          <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} cursor={{fill: 'transparent'}} />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};