"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Transaction, Budget, Category, FinanceData, DEFAULT_CATEGORIES } from "@/types";

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, "id">) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getTransactionsByMonth: (month: string) => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getBudgetProgress: (categoryId: string, month: string) => { spent: number; budget: number; percentage: number };
  getTotalIncome: (month?: string) => number;
  getTotalExpenses: (month?: string) => number;
  getBalance: () => number;
  exportData: () => string;
  importData: (jsonData: string) => void;
  currentMonth: string;
}

const STORAGE_KEY = "finance-tracker-data";

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [currentMonth] = useState(getCurrentMonth());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data: FinanceData = JSON.parse(stored);
          setTransactions(data.transactions || []);
          setBudgets(data.budgets || []);
          if (data.categories?.length) {
            setCategories(data.categories);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      const data: FinanceData = { transactions, budgets, categories };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [transactions, budgets, categories, isLoaded]);

  const addTransaction = useCallback((transaction: Omit<Transaction, "id" | "createdAt">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addBudget = useCallback((budget: Omit<Budget, "id">) => {
    const newBudget: Budget = {
      ...budget,
      id: generateId(),
    };
    setBudgets((prev) => [...prev, newBudget]);
  }, []);

  const updateBudget = useCallback((id: string, updates: Partial<Budget>) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const getTransactionsByMonth = useCallback((month: string) => {
    return transactions.filter((t) => t.date.startsWith(month));
  }, [transactions]);

  const getTransactionsByCategory = useCallback((categoryId: string) => {
    return transactions.filter((t) => t.category === categoryId);
  }, [transactions]);

  const getBudgetProgress = useCallback((categoryId: string, month: string) => {
    const budget = budgets.find((b) => b.category === categoryId && b.month === month);
    const spent = transactions
      .filter((t) => t.category === categoryId && t.type === "expense" && t.date.startsWith(month))
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      spent,
      budget: budget?.amount || 0,
      percentage: budget?.amount ? Math.min((spent / budget.amount) * 100, 100) : 0,
    };
  }, [transactions, budgets]);

  const getTotalIncome = useCallback((month?: string) => {
    const filtered = month ? transactions.filter((t) => t.date.startsWith(month)) : transactions;
    return filtered
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const getTotalExpenses = useCallback((month?: string) => {
    const filtered = month ? transactions.filter((t) => t.date.startsWith(month)) : transactions;
    return filtered
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const getBalance = useCallback(() => {
    const income = getTotalIncome();
    const expenses = getTotalExpenses();
    return income - expenses;
  }, [getTotalIncome, getTotalExpenses]);

  const exportData = useCallback(() => {
    const data: FinanceData = { transactions, budgets, categories };
    return JSON.stringify(data, null, 2);
  }, [transactions, budgets, categories]);

  const importData = useCallback((jsonData: string) => {
    try {
      const data: FinanceData = JSON.parse(jsonData);
      if (data.transactions) setTransactions(data.transactions);
      if (data.budgets) setBudgets(data.budgets);
      if (data.categories) setCategories(data.categories);
    } catch (error) {
      console.error("Failed to import data:", error);
      throw new Error("Invalid data format");
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        categories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        getTransactionsByMonth,
        getTransactionsByCategory,
        getBudgetProgress,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
        exportData,
        importData,
        currentMonth,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
