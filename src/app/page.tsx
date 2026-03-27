"use client";

import { useFinance } from "@/lib/finance-context";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/animations";

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

export default function Dashboard() {
  const {
    getBalance,
    getTotalIncome,
    getTotalExpenses,
    currentMonth,
    getTransactionsByMonth,
    transactions,
  } = useFinance();

  const balance = getBalance();
  const monthlyIncome = getTotalIncome(currentMonth);
  const monthlyExpenses = getTotalExpenses(currentMonth);
  const monthlyTransactions = getTransactionsByMonth(currentMonth).slice(0, 5);

  const stats = [
    {
      name: "Total Balance",
      value: balance,
      icon: Wallet,
      trend: balance >= 0 ? "positive" : "negative",
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      bgGradient: "from-blue-500/10 to-indigo-500/5",
    },
    {
      name: "Monthly Income",
      value: monthlyIncome,
      icon: TrendingUp,
      trend: "positive",
      gradient: "from-emerald-500 via-emerald-600 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-500/5",
    },
    {
      name: "Monthly Expenses",
      value: monthlyExpenses,
      icon: TrendingDown,
      trend: "negative",
      gradient: "from-rose-500 via-rose-600 to-pink-600",
      bgGradient: "from-rose-500/10 to-pink-500/5",
    },
  ];

  const tips = [
    "Track expenses daily to build better habits",
    "Set a budget for each category you spend on",
    "Review your analytics weekly to spot trends",
    "Save at least 20% of your income each month",
    "Use the export feature to backup your data",
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Welcome back! Here&apos;s your financial overview.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div key={stat.name} variants={itemVariants}>
            <HoverCard>
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm p-6 shadow-lg shadow-slate-200/20 dark:shadow-slate-950/20`}>
                {/* Background decoration */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`} />
                
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                    <motion.p
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className={`text-3xl font-bold mt-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      {stat.value >= 0 ? "+" : ""}
                      {formatCurrency(stat.value)}
                    </motion.p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="h-7 w-7 text-white" />
                  </motion.div>
                </div>

                {/* Mini trend indicator */}
                <div className="mt-4 flex items-center gap-2">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {stat.trend === "positive" ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-rose-500" />
                    )}
                  </motion.div>
                  <span className={`text-sm ${stat.trend === "positive" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {stat.trend === "positive" ? "Positive" : "Needs attention"}
                  </span>
                </div>
              </div>
            </HoverCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/20 dark:shadow-slate-950/20"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Transactions</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your latest activity</p>
          </div>
          <Link
            href="/transactions"
            className="group flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-all duration-300"
          >
            View all
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
                className="p-4 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.type === "income"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                        : "bg-gradient-to-br from-rose-500 to-pink-600"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-6 w-6 text-white" />
                    ) : (
                      <ArrowDownRight className="h-6 w-6 text-white" />
                    )}
                  </motion.div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium">
                        {transaction.category}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(transaction.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
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
              className="p-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center">
                <Wallet className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">No transactions this month</p>
              <Link
                href="/transactions"
                className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { name: "Add Transaction", href: "/transactions", color: "from-blue-500 to-indigo-600", icon: ArrowUpRight },
          { name: "Set Budget", href: "/budgets", color: "from-purple-500 to-pink-600", icon: TrendingUp },
          { name: "View Analytics", href: "/analytics", color: "from-emerald-500 to-teal-600", icon: ArrowRight },
          { name: "Settings", href: "/settings", color: "from-orange-500 to-amber-600", icon: ArrowRight },
        ].map((action, index) => (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
          >
            <Link href={action.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${action.color} p-4 text-white shadow-lg`}
              >
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
                <div className="relative flex items-center justify-between">
                  <span className="font-semibold">{action.name}</span>
                  <action.icon className="h-5 w-5" />
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
        whileHover={{ scale: 1.01 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/20 dark:border-blue-800/20 p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <span className="text-2xl">💡</span>
          </motion.div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Financial Tip</h3>
            <p className="text-slate-600 dark:text-slate-300 mt-1">{randomTip}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
