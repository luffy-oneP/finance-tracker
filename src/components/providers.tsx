"use client";

import { ThemeProvider } from "@/lib/theme-context";
import { FinanceProvider } from "@/lib/finance-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <FinanceProvider>
        {children}
      </FinanceProvider>
    </ThemeProvider>
  );
}