"use client";

import { ThemeProvider } from "@/lib/theme-context";
import { FinanceProvider } from "@/lib/finance-context";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <FinanceProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white'
            }
          }}
        />
      </FinanceProvider>
    </ThemeProvider>
  );
}