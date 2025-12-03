import React from 'react';
import { UserProfile } from '../types';
import { ExpensePieChart, IncomeVsExpenseBar } from './Charts';
import { CURRENCY_SYMBOL } from '../constants';
import { TrendingUp, Wallet, ArrowDownCircle, Target } from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const totalExpenses = profile.expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = profile.monthlyIncome - totalExpenses;
  const savingsRate = Math.max(0, (balance / profile.monthlyIncome) * 100);

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income Card */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-xl text-green-600">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-gray-500 font-medium text-sm">Income</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {CURRENCY_SYMBOL}{profile.monthlyIncome.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Expenses Card */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-100 rounded-xl text-red-600">
              <ArrowDownCircle className="h-5 w-5" />
            </div>
            <span className="text-gray-500 font-medium text-sm">Expenses</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {CURRENCY_SYMBOL}{totalExpenses.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-gray-500 font-medium text-sm">Balance</span>
          </div>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-gray-800' : 'text-red-500'}`}>
            {CURRENCY_SYMBOL}{balance.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Goal Card */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-xl text-purple-600">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-gray-500 font-medium text-sm">Goal</span>
          </div>
          <p className="text-sm font-semibold text-gray-700 truncate">
            {profile.savingsGoal || "Financial Freedom"}
          </p>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
            <div 
              className="bg-purple-500 h-1.5 rounded-full" 
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Where your money goes</h3>
          <ExpensePieChart expenses={profile.expenses} income={profile.monthlyIncome} />
        </div>

        {/* Comparison */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Income vs Expenses</h3>
          <IncomeVsExpenseBar expenses={profile.expenses} income={profile.monthlyIncome} />
          
          <div className="mt-4 p-4 bg-indigo-50 rounded-2xl">
            <p className="text-indigo-800 text-sm font-medium text-center">
              You have used {Math.round((totalExpenses / profile.monthlyIncome) * 100)}% of your monthly budget.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;