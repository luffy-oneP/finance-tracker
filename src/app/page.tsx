"use client";

import { useFinance } from "@/lib/finance-context";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const TIPS = [
  "Track expenses daily to build better habits",
  "Set a budget for each category you spend on",
  "Review your analytics weekly to spot trends",
  "Save at least 20% of your income each month",
  "Use the export feature to backup your data",
];

export default function Dashboard() {
  const {
    getBalance,
    getTotalIncome,
    getTotalExpenses,
    currentMonth,
    getTransactionsByMonth,
  } = useFinance();

  const balance = getBalance();
  const monthlyIncome = getTotalIncome(currentMonth);
  const monthlyExpenses = getTotalExpenses(currentMonth);
  const monthlyTransactions = getTransactionsByMonth(currentMonth).slice(0, 5);

  // Use useMemo to avoid recalculating on every render
  const randomTip = useMemo(() => {
    // Use date-based seed for consistent tip during the day
    const daySeed = new Date().getDate() + new Date().getMonth() * 31;
    return TIPS[daySeed % TIPS.length];
  }, []);

  const stats = [
    {
      name: "Total Balance",
      value: balance,
      icon: Wallet,
      trend: balance >= 0 ? "positive" : "negative" as const,
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      bgGradient: "from-blue-500/10 to-indigo-500/5",
    },
    {
      name: "Monthly Income",
      value: monthlyIncome,
      icon: TrendingUp,
      trend: "positive" as const,
      gradient: "from-emerald-500 via-emerald-600 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-500/5",
    },
    {
      name: "Monthly Expenses",
      value: monthlyExpenses,
      icon: TrendingDown,
      trend: "negative" as const,
      gradient: "from-rose-500 via-rose-600 to-pink-600",
      bgGradient: "from-rose-500/10 to-pink-500/5",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-20 md:pb-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
          Welcome back! Here&apos;s your financial overview.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div key={stat.name} variants={itemVariants}>
            <div className={`relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.bgGradient} border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm p-4 md:p-6 shadow-lg shadow-slate-200/20 dark:shadow-slate-950/20 active:scale-[0.98] transition-transform`}>
              {/* Background decoration */}
              <div className={`absolute -top-6 -right-6 md:-top-10 md:-right-10 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`} />
              
              <div className="relative flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{stat.name}</p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className={`text-xl md:text-3xl font-bold mt-1 md:mt-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent truncate`}
                  >
                    {stat.value >= 0 ? "+" : ""}
                    {formatCurrency(stat.value)}
                  </motion.p>
                </div>
                <motion.div
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg flex-shrink-0 ml-3`}
                >
                  <stat.icon className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </motion.div>
              </div>

              {/* Mini trend indicator */}
              <div className="mt-3 md:mt-4 flex items-center gap-2">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {stat.trend === "positive" ? (
                    <ArrowUpRight className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 md:h-4 md:w-4 text-rose-500" />
                  )}
                </motion.div>
                <span className={`text-xs md:text-sm ${stat.trend === "positive" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {stat.trend === "positive" ? "Positive" : "Needs attention"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/20 dark:shadow-slate-950/20"
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white">Recent Transactions</h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Your latest activity</p>
          </div>
          <Link
            href="/transactions"
            className="group flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg md:rounded-xl text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 transition-all duration-300"
          >
            <span className="hidden sm:inline">View all</span>
            <span className="sm:hidden">All</span>
            <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
          {monthlyTransactions.length > 0 ? (
            monthlyTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                className="p-3 md:p-4 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      transaction.type === "income"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                        : "bg-gradient-to-br from-rose-500 to-pink-600"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm md:text-base truncate">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-0.5 md:mt-1 flex-wrap">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-[10px] md:text-xs font-medium">
                        {transaction.category}
                      </span>
                      <span className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500">
                        {new Date(transaction.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p
                    className={`text-base md:text-lg font-bold ${
                      transaction.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-8 md:p-12 text-center"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl md:rounded-2xl flex items-center justify-center">
                <Wallet className="h-6 w-6 md:h-8 md:w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">No transactions this month</p>
              <Link
                href="/transactions"
                className="mt-2 md:mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Add your first transaction
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4"
      >
        {[
          { name: "Add", fullName: "Transaction", href: "/transactions", color: "from-blue-500 to-indigo-600", icon: ArrowUpRight },
          { name: "Set", fullName: "Budget", href: "/budgets", color: "from-purple-500 to-pink-600", icon: TrendingUp },
          { name: "View", fullName: "Analytics", href: "/analytics", color: "from-emerald-500 to-teal-600", icon: ArrowRight },
          { name: "Open", fullName: "Settings", href: "/settings", color: "from-orange-500 to-amber-600", icon: ArrowRight },
        ].map((action, index) => (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
          >
            <Link href={action.href}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${action.color} p-3 md:p-4 text-white shadow-lg active:opacity-90`}
              >
                <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-14 h-14 md:w-20 md:h-20 bg-white/20 rounded-full blur-xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm md:text-base">{action.name}</span>
                    <action.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <span className="text-[10px] md:text-xs opacity-80">{action.fullName}</span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Financial Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileTap={{ scale: 0.99 }}
        className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/20 dark:border-blue-800/20 p-4 md:p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative flex items-start gap-3 md:gap-4">
          <div
            className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0"
          >
            <span className="text-lg md:text-2xl">💡</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm md:text-lg">Financial Tip</h3>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5 md:mt-1 text-xs md:text-sm">{randomTip}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
