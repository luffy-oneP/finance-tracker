# 💰 Finance Tracker

A modern, feature-rich budget management application built with Next.js 14, TypeScript, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan)

## ✨ Features

### Dashboard
- **Overview Stats**: Total balance, monthly income, and expenses at a glance
- **Recent Transactions**: Quick view of your latest activity
- **Financial Tips**: Helpful tips to improve your financial habits

### Transaction Management
- **Add/Edit/Delete**: Full CRUD operations for transactions
- **Categories**: Pre-defined categories for both income and expenses
- **Filtering**: Search and filter by type (income/expense)
- **Date Tracking**: Each transaction has a date for accurate tracking

### Budget Management
- **Monthly Budgets**: Set spending limits per category
- **Progress Tracking**: Visual progress bars showing budget usage
- **Alerts**: Warning indicators when approaching budget limits
- **Remaining Calculation**: See how much you have left in each category

### Analytics & Reports
- **Spending by Category**: Pie chart visualization
- **Monthly Trends**: Line chart showing income vs expenses over time
- **Summary Cards**: Income, expenses, savings, and savings rate
- **Top Categories**: Detailed breakdown of highest spending areas

### Data Management
- **Local Storage**: All data saved locally in your browser
- **Export**: Download your data as JSON backup
- **Import**: Restore from a previous backup
- **Clear Data**: Option to reset all data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
finance-tracker/
├── src/
│   ├── app/
│   │   ├── analytics/        # Analytics page with charts
│   │   ├── budgets/          # Budget management page
│   │   ├── settings/         # Data management settings
│   │   ├── transactions/     # Transaction CRUD page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Dashboard homepage
│   ├── components/
│   │   ├── navigation.tsx    # Sidebar navigation
│   │   └── ui/               # Reusable UI components
│   ├── lib/
│   │   ├── finance-context.tsx  # React Context for state management
│   │   └── utils.ts          # Utility functions
│   └── types/
│       └── index.ts          # TypeScript type definitions
├── public/                   # Static assets
├── tailwind.config.ts
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icons
- **Charts**: [Recharts](https://recharts.org/) - Composable charting library
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Headless UI primitives
- **State**: React Context + useReducer for global state

## 🎯 Usage Guide

### Adding a Transaction
1. Click "Transactions" in the sidebar
2. Click "Add Transaction" button
3. Select type (Income/Expense)
4. Enter amount and description
5. Choose a category
6. Select date and save

### Setting a Budget
1. Click "Budgets" in the sidebar
2. Click "Add Budget" button
3. Select a category
4. Enter monthly spending limit
5. View progress bars to track usage

### Viewing Analytics
1. Click "Analytics" in the sidebar
2. Select month from dropdown
3. View pie chart for spending breakdown
4. Check trend chart for monthly patterns
5. See top spending categories

### Backup Your Data
1. Click "Settings" in the sidebar
2. Click "Export JSON" button
3. Save the file to your computer

### Restore from Backup
1. Click "Settings" in the sidebar
2. Click "Import JSON"
3. Select your backup file
4. Data will be restored

## 🎨 Customization

### Adding New Categories

Edit `src/types/index.ts` to add new categories:

```typescript
export const DEFAULT_CATEGORIES: Category[] = [
  // Add your custom categories here
  { id: "custom", name: "Custom Category", type: "expense", color: "#ff0000", icon: "Star" },
  // ...
];
```

### Changing Colors

Category colors can be customized in the `DEFAULT_CATEGORIES` array using hex color codes.

## 🔒 Privacy

- **100% Client-Side**: All data is stored in your browser's localStorage
- **No Cloud**: Your financial data never leaves your device
- **Private**: No accounts, no tracking, no analytics

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

- Data is stored in localStorage - clearing browser data will delete your records
- Charts may take a moment to render on first load

## 📧 Support

If you have any questions or issues, please open an issue on GitHub.

---

Built with ❤️ using Next.js
