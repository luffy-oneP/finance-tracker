"use client";

import { useState } from "react";
import { useFinance } from "@/lib/finance-context";
import { ArrowUpRight, ArrowDownRight, Plus, Search, Filter, Trash2, Edit2, X } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function TransactionsPage() {
  const { transactions, categories, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    type: "expense" as "income" | "expense",
    date: new Date().toISOString().split("T")[0],
  });

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description || !formData.category) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (editingTransaction) {
      updateTransaction(editingTransaction, {
        amount,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        date: formData.date,
      });
      toast.success("Transaction updated successfully!");
      setEditingTransaction(null);
    } else {
      addTransaction({
        amount,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        date: formData.date,
      });
      toast.success("Transaction added successfully!");
    }
    
    setFormData({
      amount: "",
      description: "",
      category: "",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (transaction: typeof transactions[0]) => {
    setFormData({
      amount: transaction.amount.toString(),
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
    });
    setEditingTransaction(transaction.id);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
      toast.success("Transaction deleted!");
    }
  };

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Mobile FAB for adding transaction
  const MobileAddButton = () => (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        setEditingTransaction(null);
        setFormData({
          amount: "",
          description: "",
          category: "",
          type: "expense",
          date: new Date().toISOString().split("T")[0],
        });
        setIsAddDialogOpen(true);
      }}
      className="md:hidden fixed right-4 bottom-24 z-40 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/40"
      aria-label="Add transaction"
    >
      <Plus className="h-6 w-6 text-white" />
    </motion.button>
  );

  return (
    <div className="space-y-4 md:space-y-6 pb-24 md:pb-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">Manage your income and expenses</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingTransaction(null);
            setFormData({
              amount: "",
              description: "",
              category: "",
              type: "expense",
              date: new Date().toISOString().split("T")[0],
            });
            setIsAddDialogOpen(true);
          }}
          className="hidden md:inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-medium text-sm md:text-base"
        >
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
          Add Transaction
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-3 gap-2 md:gap-4"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400">Income</p>
          <p className="text-sm md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 truncate">
            +{formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400">Expense</p>
          <p className="text-sm md:text-2xl font-bold text-rose-600 dark:text-rose-400 truncate">
            -{formatCurrency(totalExpense)}
          </p>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400">Balance</p>
          <p className={`text-sm md:text-2xl font-bold truncate ${totalIncome - totalExpense >= 0 ? "text-blue-600 dark:text-blue-400" : "text-rose-600 dark:text-rose-400"}`}>
            {totalIncome - totalExpense >= 0 ? "+" : ""}{formatCurrency(totalIncome - totalExpense)}
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-2 md:gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 md:pl-12 pr-4 py-2.5 md:py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
          />
        </div>
        
        {/* Mobile filter button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 text-sm font-medium"
        >
          <Filter className="h-4 w-4" />
          {filterType === "all" ? "All" : filterType === "income" ? "Income" : "Expense"}
        </motion.button>

        {/* Desktop filter */}
        <div className="hidden sm:flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
          <Filter className="h-5 w-5 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as "all" | "income" | "expense")}
            className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>

        {/* Mobile filter options */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden flex gap-2"
            >
              {(["all", "income", "expense"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFilterType(type);
                    setShowMobileFilters(false);
                  }}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors",
                    filterType === type
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl md:rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden"
      >
        <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.03 }}
                className="p-3 md:p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      transaction.type === "income"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                        : "bg-gradient-to-br from-rose-500 to-pink-600"
                    )}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm md:text-base truncate">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-[10px] md:text-xs font-medium">
                        {transaction.category}
                      </span>
                      <span className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                  <p
                    className={cn(
                      "text-base md:text-lg font-bold",
                      transaction.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  
                  {/* Mobile swipe hint - show on mobile */}
                  <div className="flex md:hidden items-center gap-1">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(transaction)}
                      className="p-2 text-slate-400 hover:text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>

                  {/* Desktop hover actions */}
                  <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(transaction)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 md:p-12 text-center"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl md:rounded-2xl flex items-center justify-center">
                <Search className="h-6 w-6 md:h-8 md:w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">No transactions found</p>
              <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 mt-1">
                {searchTerm ? "Try adjusting your search" : "Add your first transaction to get started"}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Mobile FAB */}
      <MobileAddButton />

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg max-w-[95vw] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-4 md:p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              {editingTransaction ? "Update your transaction details below" : "Enter the details of your new transaction"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Type Selection */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Transaction Type
              </label>
              <div className="flex gap-2 md:gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, type: "income", category: "" })}
                  className={cn(
                    "flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-xl font-medium transition-all text-sm",
                    formData.type === "income"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <div className="flex items-center justify-center gap-1.5 md:gap-2">
                    <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" />
                    Income
                  </div>
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
                  className={cn(
                    "flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-xl font-medium transition-all text-sm",
                    formData.type === "expense"
                      ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <div className="flex items-center justify-center gap-1.5 md:gap-2">
                    <ArrowDownRight className="h-4 w-4 md:h-5 md:w-5" />
                    Expense
                  </div>
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 md:mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-6 md:pl-8 pr-3 md:pr-4 py-2.5 md:py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 md:mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 md:mb-2">
                Description
              </label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                placeholder="e.g., Grocery shopping"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 md:mb-2">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              >
                <option value="">Select a category</option>
                {(formData.type === "income" ? incomeCategories : expenseCategories).map(
                  (cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <DialogFooter className="gap-2 md:gap-3 mt-4">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-sm font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all text-sm"
              >
                {editingTransaction ? "Update" : "Add"}
              </motion.button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
