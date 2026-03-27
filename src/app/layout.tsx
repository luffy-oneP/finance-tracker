import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { FinanceProvider } from "@/lib/finance-context";
import { ThemeProvider } from "@/lib/theme-context";
import { Toaster } from "sonner";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Track your income, expenses, and budgets with style",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 min-h-screen`}>
        <ThemeProvider>
          <FinanceProvider>
          <div className="flex min-h-screen">
            <Navigation />
            <main className="flex-1 overflow-auto relative">
              {/* Background effects */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px]" />
              </div>
              
              <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
              },
            }}
          />
          </FinanceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
