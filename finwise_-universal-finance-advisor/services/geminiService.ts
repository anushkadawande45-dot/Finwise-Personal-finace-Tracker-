import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AIAdviceResponse } from "../types";

// Initialize the client. API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (profile: UserProfile): Promise<AIAdviceResponse> => {
  const modelId = "gemini-2.5-flash";

  const totalExpenses = profile.expenses.reduce((sum, item) => sum + item.amount, 0);
  const expenseSummary = profile.expenses.map(e => `${e.category}: ${e.amount}`).join(", ");
  
  const prompt = `
    Role: Expert Financial Advisor for all ages (Kids, Students, Adults, HNIs).
    Task: Analyze the user's finances and provide actionable advice in JSON format.
    
    User Profile:
    - Monthly Income: ${profile.monthlyIncome} ${profile.currency}
    - Total Monthly Expenses: ${totalExpenses} ${profile.currency}
    - Expense Breakdown: ${expenseSummary}
    
    Context:
    - If income is very low (< 2000), treat as a child/student (pocket money context). Focus on saving for small goals.
    - If income is moderate, focus on 50/30/20 rule, emergency funds, and debt management.
    - If income is high (> 200000), focus on tax planning, diverse investments, and wealth creation.
    
    Provide output fitting the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            financialHealthScore: { type: Type.NUMBER, description: "Score from 0 to 100 representing financial health" },
            savingsSuggestion: { type: Type.STRING, description: "Specific advice on how much to save" },
            investmentAdvice: { type: Type.STRING, description: "Investment types suitable for their income level" },
            emergencyFundAnalysis: { type: Type.STRING, description: "Analysis of their emergency fund needs" },
            spendingAlerts: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of warnings about overspending in categories" 
            },
            budgetPlan: {
              type: Type.OBJECT,
              properties: {
                needs: { type: Type.NUMBER, description: "Percentage recommended for Needs" },
                wants: { type: Type.NUMBER, description: "Percentage recommended for Wants" },
                savings: { type: Type.NUMBER, description: "Percentage recommended for Savings" },
              },
              required: ["needs", "wants", "savings"]
            },
            personaAnalysis: { type: Type.STRING, description: "Short label for the user type, e.g. 'Savvy Student', 'High Earner'" }
          },
          required: ["financialHealthScore", "savingsSuggestion", "investmentAdvice", "emergencyFundAnalysis", "spendingAlerts", "budgetPlan", "personaAnalysis"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAdviceResponse;
    }
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("AI Service Error:", error);
    // Return a safe fallback or rethrow to be handled by UI
    throw error;
  }
};