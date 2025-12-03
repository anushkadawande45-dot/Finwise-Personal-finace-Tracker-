import { ExpenseCategory } from "./types";
import { Home, Coffee, Bus, Zap, BookOpen, Film, ShoppingBag, Activity, TrendingUp, HelpCircle } from "lucide-react";

export const CURRENCY_SYMBOL = '₹';

export const CATEGORIES: { id: ExpenseCategory; label: string; icon: any; color: string }[] = [
  { id: 'Housing', label: 'Rent/Housing', icon: Home, color: '#ef4444' }, // red-500
  { id: 'Food', label: 'Food & Dining', icon: Coffee, color: '#f97316' }, // orange-500
  { id: 'Transport', label: 'Transport', icon: Bus, color: '#eab308' }, // yellow-500
  { id: 'Utilities', label: 'Bills & Utils', icon: Zap, color: '#84cc16' }, // lime-500
  { id: 'Education', label: 'Education', icon: BookOpen, color: '#10b981' }, // emerald-500
  { id: 'Entertainment', label: 'Fun & Outings', icon: Film, color: '#06b6d4' }, // cyan-500
  { id: 'Shopping', label: 'Shopping', icon: ShoppingBag, color: '#3b82f6' }, // blue-500
  { id: 'Health', label: 'Health', icon: Activity, color: '#a855f7' }, // purple-500
  { id: 'Investments', label: 'Investments', icon: TrendingUp, color: '#d946ef' }, // fuchsia-500
  { id: 'Miscellaneous', label: 'Misc', icon: HelpCircle, color: '#64748b' }, // slate-500
];

export const MOCK_ADVICE_FALLBACK: any = {
  financialHealthScore: 75,
  savingsSuggestion: "Try to save at least 20% of your income.",
  investmentAdvice: "Consider low-risk mutual funds or recurring deposits.",
  emergencyFundAnalysis: "You should aim for 3 months of expenses.",
  spendingAlerts: ["Your food spending is a bit high this month."],
  budgetPlan: { needs: 50, wants: 30, savings: 20 },
  personaAnalysis: "Balanced Saver"
};