export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  date: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string; // Format: "YYYY-MM"
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  // Income categories
  { id: "salary", name: "Salary", type: "income", color: "#22c55e", icon: "Briefcase" },
  { id: "freelance", name: "Freelance", type: "income", color: "#16a34a", icon: "Laptop" },
  { id: "investments", name: "Investments", type: "income", color: "#15803d", icon: "TrendingUp" },
  { id: "gifts", name: "Gifts", type: "income", color: "#86efac", icon: "Gift" },
  { id: "other-income", name: "Other Income", type: "income", color: "#4ade80", icon: "DollarSign" },
  
  // Expense categories
  { id: "food", name: "Food & Dining", type: "expense", color: "#ef4444", icon: "UtensilsCrossed" },
  { id: "transport", name: "Transportation", type: "expense", color: "#f97316", icon: "Car" },
  { id: "entertainment", name: "Entertainment", type: "expense", color: "#8b5cf6", icon: "Gamepad2" },
  { id: "bills", name: "Bills & Utilities", type: "expense", color: "#eab308", icon: "Receipt" },
  { id: "shopping", name: "Shopping", type: "expense", color: "#ec4899", icon: "ShoppingBag" },
  { id: "health", name: "Health & Medical", type: "expense", color: "#06b6d4", icon: "Heart" },
  { id: "education", name: "Education", type: "expense", color: "#3b82f6", icon: "GraduationCap" },
  { id: "travel", name: "Travel", type: "expense", color: "#14b8a6", icon: "Plane" },
  { id: "rent", name: "Rent/Mortgage", type: "expense", color: "#f43f5e", icon: "Home" },
  { id: "other-expense", name: "Other Expense", type: "expense", color: "#6b7280", icon: "MoreHorizontal" },
];

export interface FinanceData {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
}
