export type ExpenseCategory = 
  | 'Housing' 
  | 'Food' 
  | 'Transport' 
  | 'Utilities' 
  | 'Education' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Health' 
  | 'Investments'
  | 'Miscellaneous';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  isRecurring: boolean;
}

export interface UserProfile {
  name: string;
  monthlyIncome: number;
  currency: string;
  expenses: Expense[];
  savingsGoal?: string;
}

export interface AIAdviceResponse {
  financialHealthScore: number;
  savingsSuggestion: string;
  investmentAdvice: string;
  emergencyFundAnalysis: string;
  spendingAlerts: string[];
  budgetPlan: {
    needs: number;
    wants: number;
    savings: number;
  };
  personaAnalysis: string; // e.g., "Student Saver", "High Net Worth Individual"
}

export type ViewState = 'onboarding' | 'dashboard' | 'expenses' | 'advisor';