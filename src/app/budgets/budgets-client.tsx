"use client";

import { useState } from "react";
import { useFinance } from "@/lib/finance-context";
import { Plus, AlertTriangle, Target, Trash2, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function BudgetsPage() {
  const { categories, budgets, addBudget, deleteBudget, getBudgetProgress, currentMonth } = useFinance();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
  });

  const expenseCategories = categories.filter((c) => c.type === "expense");
  
  // Get budgets for current month
  const currentBudgets = budgets.filter((b) => b.month === currentMonth);
  
  // Calculate overall stats
  const totalBudgeted = currentBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = currentBudgets.reduce((sum, b) => {
    const progress = getBudgetProgress(b.category, currentMonth);
    return sum + progress.spent;
  }, 0);
  const overallPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Check if budget already exists for this category
    const existingBudget = currentBudgets.find(b => b.category === formData.category);
    if (existingBudget) {
      toast.error("A budget already exists for this category");
      return;
    }

    addBudget({
      category: formData.category,
      amount,
      month: currentMonth,
    });
    
    toast.success("Budget set successfully!");
    setFormData({ category: "", amount: "" });
    setIsAddDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this budget?")) {
      deleteBudget(id);
      toast.success("Budget deleted!");
    }
  };

  const currentMonthName = new Date(currentMonth + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Budgets</h1>
          <p className="text-slate-500 dark:text-slate-400">Set and track your monthly spending limits</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddDialogOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 font-medium"
        >
          <Plus className="h-5 w-5" />
          Add Budget
        </motion.button>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {/* Total Budgeted */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm p-6 shadow-lg"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <Wallet className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Budgeted</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalBudgeted)}</p>
            </div>
          </div>
        </motion.div>

        {/* Total Spent */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/5 border border-rose-200/50 dark:border-rose-800/50 backdrop-blur-sm p-6 shadow-lg"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30"
            >
              <TrendingUp className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Spent</p>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </motion.div>

        {/* Budget Status */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm p-6 shadow-lg"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                overallPercentage > 100
                  ? "bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/30"
                  : overallPercentage > 80
                  ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30"
                  : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30"
              )}
            >
              <PiggyBank className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Budget Used</p>
              <p className={cn(
                "text-2xl font-bold",
                overallPercentage > 100 ? "text-rose-600" : overallPercentage > 80 ? "text-amber-600" : "text-emerald-600 dark:text-emerald-400"
              )}>
                {Math.round(overallPercentage)}%
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Overall Progress Bar */}
      {totalBudgeted > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{currentMonthName} Progress</span>
            <span className={cn(
              "text-sm font-bold",
              overallPercentage > 100 ? "text-rose-600" : overallPercentage > 80 ? "text-amber-600" : "text-emerald-600"
            )}>
              {overallPercentage > 100 ? "Over Budget" : overallPercentage > 80 ? "Near Limit" : "On Track"}
            </span>
          </div>
          <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(overallPercentage, 100)}%` }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "h-full rounded-full relative",
                overallPercentage > 100
                  ? "bg-gradient-to-r from-rose-500 to-pink-600"
                  : overallPercentage > 80
                  ? "bg-gradient-to-r from-amber-500 to-orange-600"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600"
              )}
            >
              {overallPercentage > 100 && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-white/30"
                />
              )}
            </motion.div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
            {overallPercentage > 100
              ? `${formatCurrency(totalSpent - totalBudgeted)} over budget`
              : `${formatCurrency(totalBudgeted - totalSpent)} remaining`}
          </p>
        </motion.div>
      )}

      {/* Budget Progress List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Category Budgets</h2>
        </div>
        
        <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
          {currentBudgets.length > 0 ? (
            currentBudgets.map((budget, index) => {
              const progress = getBudgetProgress(budget.category, currentMonth);
              const percentage = Math.min((progress.spent / budget.amount) * 100, 100);
              const isOverBudget = progress.spent > budget.amount;
              const isNearLimit = percentage >= 80 && !isOverBudget;

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900 dark:text-white text-lg">
                        {budget.category}
                      </span>
                      {isOverBudget && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-full text-xs font-medium"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          Over Budget
                        </motion.span>
                      )}
                      {isNearLimit && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium"
                        >
                          Near Limit
                        </motion.span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        <span className={cn(
                          "font-bold text-lg",
                          isOverBudget ? "text-rose-600" : "text-slate-900 dark:text-white"
                        )}>
                          {formatCurrency(progress.spent)}
                        </span>
                        <span className="text-slate-400 mx-2">/</span>
                        {formatCurrency(budget.amount)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(budget.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        "h-full rounded-full relative",
                        isOverBudget
                          ? "bg-gradient-to-r from-rose-500 to-pink-600"
                          : isNearLimit
                          ? "bg-gradient-to-r from-amber-500 to-orange-600"
                          : "bg-gradient-to-r from-emerald-500 to-teal-600"
                      )}
                    >
                      {isOverBudget && (
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute inset-0 bg-white/30"
                        />
                      )}
                    </motion.div>
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {isOverBudget
                      ? `${formatCurrency(progress.spent - budget.amount)} over budget`
                      : `${formatCurrency(budget.amount - progress.spent)} remaining`}
                  </p>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center">
                <Target className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">No budgets set for this month</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                Add budgets to track your spending limits
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Available Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Available Categories</h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-3">
            {expenseCategories
              .filter((cat) => !currentBudgets.some((b) => b.category === cat.name))
              .map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFormData({ ...formData, category: cat.name });
                    setIsAddDialogOpen(true);
                  }}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </motion.button>
              ))}
          </div>
          
          {expenseCategories.filter((cat) =>
            !currentBudgets.some((b) => b.category === cat.name)
          ).length === 0 && (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">
              All categories have budgets set! 🎉
            </p>
          )}
        </div>
      </motion.div>

      {/* Add Budget Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">Set Budget</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Set a monthly spending limit for a category
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              >
                <option value="">Select a category</option>
                {expenseCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Monthly Limit
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <DialogFooter className="gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddDialogOpen(false)}
                className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
              >
                Set Budget
              </motion.button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
