import React, { useState } from 'react';
import { ArrowRight, Wallet, User, Target } from 'lucide-react';
import { UserProfile } from '../types';
import { CURRENCY_SYMBOL } from '../constants';

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [goal, setGoal] = useState('');

  const handleNext = () => {
    if (step === 3) {
      onComplete({
        name,
        monthlyIncome: parseFloat(income) || 0,
        savingsGoal: goal,
        expenses: [],
        currency: 'INR'
      });
    } else {
      setStep(step + 1);
    }
  };

  const isStepValid = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return income.length > 0 && !isNaN(parseFloat(income));
    return true; // Goal is optional
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 transition-all">
        <div className="mb-8">
          <div className="h-2 w-full bg-gray-100 rounded-full mb-6">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {step === 1 && "Welcome to FinWise!"}
            {step === 2 && "Let's talk money."}
            {step === 3 && "Any big dreams?"}
          </h1>
          <p className="text-gray-500">
            {step === 1 && "Let's get your personal finance assistant set up. What should we call you?"}
            {step === 2 && "To give you the best advice, we need to know your monthly earnings or pocket money."}
            {step === 3 && "Is there something specific you are saving for? (Optional)"}
          </p>
        </div>

        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-lg"
                  placeholder="e.g. Alex"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Monthly Income / Allowance</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">{CURRENCY_SYMBOL}</span>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-lg"
                  placeholder="0.00"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Don't worry, this stays on your device.</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Savings Goal</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-lg"
                  placeholder="e.g. New Laptop, Bike, House"
                  autoFocus
                />
              </div>
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 font-semibold text-lg transition-all ${
              isStepValid() 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transform hover:-translate-y-0.5' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>{step === 3 ? "Get Started" : "Next"}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;