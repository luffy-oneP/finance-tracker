"use client";

import { useMemo, useState } from "react";
import { useFinance } from "@/lib/finance-context";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart, BarChart, Bar } from "recharts";
import { formatCurrency, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { PieChart as PieChartIcon, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

const COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#f59e0b", // amber
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#6366f1", // indigo
];

export default function AnalyticsPage() {
  const { transactions, categories, currentMonth, getTotalIncome, getTotalExpenses } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  
  // Get unique months from transactions
  const months = useMemo(() => {
    const uniqueMonths = [...new Set(transactions.map((t) => t.date.slice(0, 7)))];
    return uniqueMonths.sort().reverse();
  }, [transactions]);

  // Monthly spending by category (pie chart data)
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(
      (t) => t.type === "expense" && t.date.startsWith(selectedMonth)
    );
    
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => {
        const category = categories.find((c) => c.name === name);
        return {
          name,
          value,
          color: category?.color || COLORS[Math.floor(Math.random() * COLORS.length)],
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [transactions, selectedMonth, categories]);

  // Monthly trend data
  const trendData = useMemo(() => {
    const last6Months = months.slice(0, 6).reverse();
    return last6Months.map((month) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short" }),
      fullMonth: month,
      income: getTotalIncome(month),
      expenses: getTotalExpenses(month),
      savings: getTotalIncome(month) - getTotalExpenses(month),
    }));
  }, [months, getTotalIncome, getTotalExpenses]);

  const totalIncome = getTotalIncome(selectedMonth);
  const totalExpenses = getTotalExpenses(selectedMonth);
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : "0";

  const stats = [
    {
      label: "Income",
      value: totalIncome,
      icon: ArrowUpRight,
      color: "text-emerald-600",
      bgColor: "from-emerald-500/10 to-teal-500/5",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/50",
    },
    {
      label: "Expenses",
      value: totalExpenses,
      icon: ArrowDownRight,
      color: "text-rose-600",
      bgColor: "from-rose-500/10 to-pink-500/5",
      borderColor: "border-rose-200/50 dark:border-rose-800/50",
    },
    {
      label: "Savings",
      value: savings,
      icon: Wallet,
      color: savings >= 0 ? "text-blue-600" : "text-rose-600",
      bgColor: savings >= 0 ? "from-blue-500/10 to-indigo-500/5" : "from-rose-500/10 to-pink-500/5",
      borderColor: savings >= 0 ? "border-blue-200/50 dark:border-blue-800/50" : "border-rose-200/50 dark:border-rose-800/50",
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      icon: TrendingUp,
      color: parseFloat(savingsRate) >= 20 ? "text-emerald-600" : "text-amber-600",
      bgColor: parseFloat(savingsRate) >= 20 ? "from-emerald-500/10 to-teal-500/5" : "from-amber-500/10 to-orange-500/5",
      borderColor: parseFloat(savingsRate) >= 20 ? "border-emerald-200/50 dark:border-emerald-800/50" : "border-amber-200/50 dark:border-amber-800/50",
    },
  ];

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Insights into your financial habits</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-lg">
          <Calendar className="h-5 w-5 text-slate-400" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer font-medium"
          >
            {months.length > 0 ? (
              months.map((m) => (
                <option key={m} value={m}>
                  {new Date(m + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </option>
              ))
            ) : (
              <option value={currentMonth}>
                {new Date(currentMonth + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </option>
            )}
          </select>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={cn(
              "relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 shadow-lg",
              stat.bgColor,
              stat.borderColor,
              "border backdrop-blur-sm"
            )}
          >
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.color.replace("text-", "bg-").replace("600", "100").replace("dark:", ""))}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
              <p className={cn("text-2xl font-bold", stat.color)}>
                {stat.label === "Savings Rate" ? stat.value : formatCurrency(stat.value as number)}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <PieChartIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Spending by Category</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Where your money goes</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType("pie")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    chartType === "pie"
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  Pie
                </button>
                <button
                  onClick={() => setChartType("bar")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    chartType === "bar"
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  Bar
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {categoryData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "pie" ? (
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            strokeWidth={0}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value) => formatCurrency(Number(value))}
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          color: "white",
                          padding: "12px",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => (
                          <span className="text-slate-600 dark:text-slate-400">{value}</span>
                        )}
                      />
                    </PieChart>
                  ) : (
                    <BarChart data={categoryData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <RechartsTooltip
                        formatter={(value) => formatCurrency(Number(value))}
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          color: "white",
                          padding: "12px",
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]} animationDuration={800}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center">
                  <PieChartIcon className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">No expense data for this month</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Monthly Trend</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Income vs Expenses over time</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {trendData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        color: "white",
                        padding: "12px",
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), ""]}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="url(#incomeGradient)"
                      name="Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#ef4444"
                      strokeWidth={3}
                      fill="url(#expenseGradient)"
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">Add more transactions to see trends</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Top Categories Table */}
      {categoryData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Top Spending Categories</h2>
          </div>
          
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            {categoryData.slice(0, 5).map((cat, index) => {
              const percentage = totalExpenses > 0 ? ((cat.value / totalExpenses) * 100).toFixed(1) : "0";
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400"
                    >
                      {index + 1}
                    </motion.div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-medium text-slate-900 dark:text-white">{cat.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(cat.value)}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{percentage}% of total</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
