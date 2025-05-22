# BusinessOne Calculator Directory Structure

This document outlines the organization of calculator components in the BusinessOne application, clearly separating main tab calculators from quick calculators.

## Main Calculator Tabs

These are the primary calculator components that appear as main tabs in the application. They are feature-rich and include detailed analysis, charts, and multiple input options.

```
src/
├── features/                    # Main calculator features (tabbed interfaces)
│   ├── startup-costs/           # Start-Up & Costs calculator
│   │   ├── components/          # Reusable sub-components
│   │   │   ├── StartupCostsForm.tsx
│   │   │   └── StartupCostsChart.tsx
│   │   ├── StartupCosts.tsx     # Main component
│   │   └── index.ts             # Public API
│   │
│   ├── revenue-expenses/       # Revenue & Expenses calculator
│   │   ├── components/
│   │   │   ├── RevenueForm.tsx
│   │   │   ├── ExpenseForm.tsx
│   │   │   └── ProjectionChart.tsx
│   │   ├── ProjectionsTab.tsx   # Main component
│   │   └── index.ts
│   │
│   ├── cashflow/              # Cash Flow calculator
│   │   ├── components/
│   │   │   ├── CashFlowForm.tsx
│   │   │   └── CashFlowChart.tsx
│   │   ├── CashFlowTab.tsx      # Main component
│   │   └── index.ts
│   │
│   ├── profitability/         # Profitability calculator
│   │   ├── components/
│   │   │   ├── ProfitabilityForm.tsx
│   │   │   └── ProfitabilityChart.tsx
│   │   ├── ProfitabilityTab.tsx # Main component
│   │   └── index.ts
│   │
│   └── financial-ratios/      # Financial Ratios calculator
│       ├── components/
│       │   ├── RatioCard.tsx
│       │   └── RatioForm.tsx
│       ├── RatiosTab.tsx        # Main component
│       └── index.ts
```

## Quick Calculators

These are simplified calculators designed for quick calculations, typically accessible from a drawer or sidebar. They focus on single-purpose calculations with minimal UI.

```
src/
├── features/
│   └── tools/                   # Quick calculators (simplified versions)
│       ├── break-even/          # Break-Even Calculator
│       │   ├── BreakEvenCalculator.tsx
│       │   └── index.ts
│       │
│       ├── burn-rate/           # Burn Rate Calculator
│       │   ├── BurnRateCalculator.tsx
│       │   └── index.ts
│       │
│       ├── lease-vs-buy/        # Lease vs Buy Calculator
│       │   ├── LeaseVsBuyCalculator.tsx
│       │   └── index.ts
│       │
│       ├── loan/                # Loan Calculator
│       │   ├── LoanCalculator.tsx
│       │   └── index.ts
│       │
│       ├── profit-margin/       # Profit Margin Calculator
│       │   ├── ProfitMarginCalculator.tsx
│       │   └── index.ts
│       │
│       ├── roi/                 # ROI Calculator
│       │   ├── RoiCalculator.tsx
│       │   └── index.ts
│       │
│       ├── salary/              # Salary Calculator
│       │   ├── SalaryCalculator.tsx
│       │   └── index.ts
│       │
│       └── valuation/           # Business Valuation Calculator
│           ├── ValuationCalculator.tsx
│           └── index.ts
```

## Shared Components

Components used across multiple calculators:

```
src/
├── components/
│   ├── common/                # Shared components
│   │   ├── SaveLoadControls.tsx  # Save/Load functionality
│   │   └── FileStatusIndicator.tsx
│   │
│   └── ui/                    # UI components
│       ├── cards/
│       ├── forms/
│       └── ...
```

## Key Differences

| Feature                | Main Tab Calculators         | Quick Calculators        |
|------------------------|------------------------------|--------------------------|
| Location              | Features directory           | Tools directory          |
| Complexity            | High (multiple inputs/views) | Low (focused on one task)|
| State Management      | Complex (custom hooks)       | Simple (local state)     |
| Data Persistence     | Yes (save/load)              | No (temporary)           |
| Visualization        | Charts and tables            | Minimal or none          |
| Navigation           | Main app navigation         | Drawer/modal             |


## Migration Plan

## ✅ Completed Work

### 1. Directory Structure
   - [x] Created `features/` directory for main calculators
   - [x] Created `features/tools/` directory for quick calculators
   - [x] Created subdirectories for each calculator

### 2. Lease vs Buy Calculator
   - [x] Implemented core calculation logic
   - [x] Created responsive UI with tabs for Inputs and Results
   - [x] Added form validation and error handling
   - [x] Implemented results display with data table
   - [x] Added recommendation system based on NPV comparison
   - [x] Ensured mobile responsiveness

## 🚀 Next Steps

### 1. Testing & Refinement
   - [ ] Add unit tests for calculation logic
   - [ ] Implement integration tests for UI components
   - [ ] Add error boundaries for better error handling
   - [ ] Optimize performance for large datasets

### 2. Additional Features
   - [ ] Add chart visualization for cost comparison
   - [ ] Implement save/load functionality for calculations
   - [ ] Add print/export to PDF functionality
   - [ ] Add tooltips and help text for form fields

### 3. Documentation
   - [ ] Add JSDoc comments to all functions
   - [ ] Create user guide for the calculator
   - [ ] Document calculation methodology

### 4. Future Enhancements
   - [ ] Add support for multiple scenarios
   - [ ] Implement sensitivity analysis
   - [ ] Add currency formatting based on user locale
   - [ ] Create comparison with different financing options

### 🚧 2. Move existing components to their new locations
   - [x] Startup Costs
     - [x] Moved StartupCosts.tsx to features/startup-costs/
     - [x] Created index.ts for public API
     - [x] Moved StartupCostEstimator to features/tools/startup-cost-estimator/
     - [x] Created components directory with modular components:
       - [x] StartupCostsForm.tsx
       - [x] StartupCostsChart.tsx
       - [x] StartupCostsSummary.tsx
   - [x] Revenue & Expenses
     - [x] Moved and refactored ProjectionsTab.tsx to features/revenue-expenses/RevenueExpenses.tsx
     - [x] Created types.ts for shared type definitions
     - [x] Created components directory with modular components:
       - [x] RevenueForm.tsx
       - [x] ExpenseForm.tsx
       - [x] ProjectionChart.tsx
       - [x] ProjectionSummary.tsx
     - [x] Created index.ts for public API
   - [x] Cash Flow
     - [x] Moved and refactored CashFlowTab.tsx to features/cashflow/
     - [x] Created components directory with modular components:
       - [x] CashFlowForm.tsx
       - [x] CashFlowChart.tsx
     - [x] Created index.ts for public API
     - [x] Updated routing in App.tsx
   - [x] Profitability
     - [x] Created basic directory structure
     - [x] Added types.ts with core interfaces
     - [x] Created initial index.ts for public API
     - [x] Created components directory with modular components:
       - [x] ProfitabilityForm.tsx
       - [x] ProfitabilityChart.tsx
   - [x] Financial Ratios
     - [x] Created basic directory structure
     - [x] Added types.ts with core interfaces
     - [x] Created main FinancialRatios component
     - [x] Created components directory with modular components:
       - [x] RatioCard.tsx
       - [x] RatioForm.tsx
     - [x] Created index.ts for public API
     - [x] Added type definitions for financial metrics and ratios
     - [x] Implemented core calculation logic
     - [x] Set up proper TypeScript type imports
   - [x] Quick Calculators
     - [x] Break-Even Calculator
       - [x] Created basic calculator component
       - [x] Added input validation
       - [x] Implemented break-even calculation logic
       - [x] Added responsive UI with Material-UI
     - [x] Burn Rate Calculator
       - [x] Created basic calculator component
       - [x] Added monthly burn rate calculation
       - [x] Implemented runway calculation
       - [x] Added responsive UI with Material-UI
     - [x] Lease vs Buy Calculator
       - [x] Created comprehensive calculator component
       - [x] Implemented lease vs buy financial modeling
       - [x] Added NPV calculation for accurate comparison
       - [x] Included detailed results table and recommendation
     - [x] Loan Calculator
       - [x] Moved to features/tools/loan-calculator/
       - [x] Created index.ts for public API
       - [x] Updated component to use named exports
     - [x] Profit Margin Calculator
       - [x] Moved to features/tools/profit-margin-calculator/
       - [x] Created index.ts for public API
       - [x] Updated component to use named exports
     - [x] ROI Calculator
       - [x] Moved to features/tools/roi-calculator/
       - [x] Created index.ts for public API
       - [x] Updated component to use named exports
     - [x] Salary Calculator
       - [x] Moved to features/tools/salary-calculator/
       - [x] Created index.ts for public API
       - [x] Updated component to use named exports
     - [x] Business Valuation Calculator
       - [x] Moved to features/tools/valuation-calculator/
       - [x] Created index.ts for public API
       - [x] Updated component to use named exports

### ✅ 3. Update all import paths
   - [x] Updated imports in all moved files
   - [x] Updated relative paths to use @/features/tools/ prefix

### ⏳ 4. Update routing configuration
   - [ ] Update main app routes
   - [ ] Update navigation components

### ⏳ 5. Remove all old calculator components
   - [ ] Remove old calculator components
   - [ ] Remove old calculator routes
   - [ ] Remove old calculator navigation components

### ⏳ 6. Test all calculators
   - [ ] Test each calculator for functionality
   - [ ] Verify all features work as expected
   - [ ] Test on different screen sizes

## Current Task: Setting Up Quick Calculators

Now working on implementing the Quick Calculators components and functionality...

