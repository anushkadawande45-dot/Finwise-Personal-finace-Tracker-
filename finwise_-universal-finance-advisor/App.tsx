import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, Expense } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ExpenseManager from './components/ExpenseManager';
import Advisor from './components/Advisor';
import { LayoutDashboard, Receipt, Sparkles, LogOut, Menu, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  // --- State ---
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [view, setView] = useState<ViewState>('onboarding');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Effects ---
  // Load from local storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('finwise_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setView('dashboard');
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (profile) {
      localStorage.setItem('finwise_profile', JSON.stringify(profile));
    }
  }, [profile]);

  // --- Handlers ---
  const handleOnboardingComplete = (data: Partial<UserProfile>) => {
    setProfile(data as UserProfile);
    setView('dashboard');
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    if (!profile) return;
    const newExpense: Expense = { ...expenseData, id: uuidv4() };
    setProfile({
      ...profile,
      expenses: [...profile.expenses, newExpense]
    });
  };

  const handleDeleteExpense = (id: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      expenses: profile.expenses.filter(e => e.id !== id)
    });
  };

  const handleLogout = () => {
    if (confirm("Are you sure? This will delete your data from this device.")) {
      localStorage.removeItem('finwise_profile');
      setProfile(null);
      setView('onboarding');
      setIsMobileMenuOpen(false);
    }
  };

  const NavItem = ({ id, label, icon: Icon }: { id: ViewState, label: string, icon: any }) => (
    <button
      onClick={() => {
        setView(id);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl w-full transition-all ${
        view === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  // --- Render ---

  if (!profile || view === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 p-6 z-20">
        <div className="flex items-center space-x-2 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">FinWise</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem id="dashboard" label="Overview" icon={LayoutDashboard} />
          <NavItem id="expenses" label="Expenses" icon={Receipt} />
          <NavItem id="advisor" label="AI Advisor" icon={Sparkles} />
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="px-4 py-3 mb-2">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Signed in as</p>
            <p className="font-semibold text-gray-800 truncate">{profile.name}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Reset Data</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="font-bold text-gray-800">FinWise</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-20 px-6 space-y-4">
          <NavItem id="dashboard" label="Overview" icon={LayoutDashboard} />
          <NavItem id="expenses" label="Expenses" icon={Receipt} />
          <NavItem id="advisor" label="AI Advisor" icon={Sparkles} />
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full mt-8"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Reset Data</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 overflow-y-auto h-screen scroll-smooth">
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
          
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {view === 'dashboard' && 'Dashboard'}
                {view === 'expenses' && 'Manage Expenses'}
                {view === 'advisor' && 'AI Financial Advisor'}
              </h1>
              <p className="text-gray-500 mt-1">
                {view === 'dashboard' && `Welcome back, ${profile.name}.`}
                {view === 'expenses' && 'Track every penny, save every pound.'}
                {view === 'advisor' && 'Personalized guidance just for you.'}
              </p>
            </div>
          </header>

          <div className="transition-all duration-300 ease-in-out">
            {view === 'dashboard' && <Dashboard profile={profile} />}
            {view === 'expenses' && (
              <ExpenseManager 
                expenses={profile.expenses} 
                onAddExpense={handleAddExpense} 
                onDeleteExpense={handleDeleteExpense} 
              />
            )}
            {view === 'advisor' && <Advisor profile={profile} />}
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default App;