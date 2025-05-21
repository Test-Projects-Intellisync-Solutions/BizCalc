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

### ✅ 1. Create the new directory structure
   - [x] Create `features/` directory for main calculators
   - [x] Create `features/tools/` directory for quick calculators
   - [x] Create subdirectories for each calculator

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
   - [ ] Cash Flow
   - [ ] Profitability
   - [ ] Financial Ratios
   - [ ] Quick Calculators

### ⏳ 3. Update all import paths
   - [ ] Update imports in all moved files
   - [ ] Update any relative paths

### ⏳ 4. Update routing configuration
   - [ ] Update main app routes
   - [ ] Update navigation components

### ⏳ 5. Test all calculators
   - [ ] Test each calculator for functionality
   - [ ] Verify all features work as expected
   - [ ] Test on different screen sizes

## Current Task: Moving Revenue & Expenses Calculator

Now working on moving the Revenue & Expenses calculator components to their new location...

