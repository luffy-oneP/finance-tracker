"use client";

import { useState } from "react";
import { useFinance } from "@/lib/finance-context";
import { Download, Upload, Trash2, AlertTriangle, CheckCircle, Database, Shield, Info } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SettingsPage() {
  const { exportData, importData, transactions, budgets } = useFinance();
  const [isDragging, setIsDragging] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        importData(jsonData);
        toast.success("Data imported successfully!");
      } catch {
        toast.error("Invalid file format. Please upload a valid JSON backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      processFile(file);
    } else {
      toast.error("Please drop a valid JSON file");
    }
  };

  const handleClearData = () => {
    if (
      confirm(
        "⚠️ WARNING: This will permanently delete ALL your transactions and budgets. This action cannot be undone. Are you sure?"
      )
    ) {
      localStorage.removeItem("finance-tracker-data");
      toast.success("All data cleared! Refreshing...");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const stats = [
    { label: "Total Transactions", value: transactions.length, icon: Database, color: "from-blue-500 to-indigo-600" },
    { label: "Active Budgets", value: budgets.length, icon: Shield, color: "from-purple-500 to-pink-600" },
    { label: "Data Size", value: `${(exportData().length / 1024).toFixed(2)} KB`, icon: Info, color: "from-emerald-500 to-teal-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your data and preferences</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Data Management</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Export */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Export Data</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Download a backup of all your transactions and budgets</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
            >
              <Download className="h-5 w-5" />
              Export JSON
            </motion.button>
          </div>

          <div className="border-t border-slate-200/50 dark:border-slate-700/50" />

          {/* Import with drag and drop */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Import Data</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Restore from a previous backup file</p>
              </div>
            </div>
            
            <motion.div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              animate={{
                scale: isDragging ? 1.02 : 1,
                borderColor: isDragging ? "rgba(59, 130, 246, 0.5)" : "rgba(226, 232, 240, 0.5)",
              }}
              className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center transition-colors cursor-pointer hover:border-blue-400 dark:hover:border-blue-600"
            >
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <motion.div
                animate={{ y: isDragging ? -5 : 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  Drop your backup file here, or click to browse
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Supports JSON files only
                </p>
              </motion.div>
            </motion.div>
          </div>

          <div className="border-t border-slate-200/50 dark:border-slate-700/50" />

          {/* Clear Data */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-rose-600 dark:text-rose-400">Clear All Data</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Permanently delete all transactions and budgets</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClearData}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all"
            >
              <Trash2 className="h-5 w-5" />
              Clear Data
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-blue-200/20 dark:border-blue-800/20 p-6"
      >
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">About Finance Tracker</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          A modern, feature-rich budget management application built with Next.js, React, and Tailwind CSS.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "Track income and expenses",
            "Set and monitor budgets",
            "Visual analytics with charts",
            "Export/import your data",
            "Local storage - data stays private",
            "Modern, responsive design",
          ].map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
            >
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              {feature}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
