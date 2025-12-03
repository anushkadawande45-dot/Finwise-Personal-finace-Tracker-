import React, { useEffect, useState } from 'react';
import { UserProfile, AIAdviceResponse } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { Sparkles, AlertTriangle, PiggyBank, TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AdvisorProps {
  profile: UserProfile;
}

const Advisor: React.FC<AdvisorProps> = ({ profile }) => {
  const [advice, setAdvice] = useState<AIAdviceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFinancialAdvice(profile);
      setAdvice(data);
    } catch (err) {
      setError("Couldn't connect to the financial brain right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we haven't already, or if it's been a while (optional logic, omitting for simplicity)
    if (!advice) {
      fetchAdvice();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600 h-6 w-6" />
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Analyzing your finances...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <div className="p-4 bg-red-50 rounded-full">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-gray-800 font-medium">{error}</p>
        <button 
          onClick={fetchAdvice}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!advice) return null;

  const budgetData = [
    { name: 'Needs', value: advice.budgetPlan.needs, color: '#10b981' }, // green
    { name: 'Wants', value: advice.budgetPlan.wants, color: '#f59e0b' }, // amber
    { name: 'Savings', value: advice.budgetPlan.savings, color: '#6366f1' }, // indigo
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-indigo-800 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-indigo-800 text-indigo-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {advice.personaAnalysis}
                </span>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold">
                  Health Score: {advice.financialHealthScore}/100
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Smart Insights</h2>
              <p className="text-indigo-200 max-w-lg">
                Based on your {profile.currency} {profile.monthlyIncome.toLocaleString()} income, here is your tailored financial roadmap.
              </p>
            </div>
            <button 
              onClick={fetchAdvice}
              className="p-3 bg-indigo-800 rounded-xl hover:bg-indigo-700 transition-colors text-indigo-200"
              title="Refresh Analysis"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Savings Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
              <PiggyBank className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-800">Savings Plan</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed flex-grow">
            {advice.savingsSuggestion}
          </p>
        </div>

        {/* Investments Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-800">Growth Strategy</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed flex-grow">
            {advice.investmentAdvice}
          </p>
        </div>

        {/* Emergency Fund Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-800">Safety Net</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed flex-grow">
            {advice.emergencyFundAnalysis}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Allocation */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Recommended Monthly Split</h3>
          <div className="flex flex-col sm:flex-row items-center">
            <div className="h-48 w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-gray-400">PLAN</span>
              </div>
            </div>
            <div className="mt-6 sm:mt-0 sm:ml-8 space-y-4 flex-1">
              {budgetData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Attention Needed</h3>
          {advice.spendingAlerts.length > 0 ? (
            <div className="space-y-4">
              {advice.spendingAlerts.map((alert, idx) => (
                <div key={idx} className="flex items-start space-x-3 bg-red-50 p-4 rounded-xl border border-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{alert}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <ShieldCheck className="h-12 w-12 mb-2 text-green-200" />
              <p>Everything looks good!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Advisor;