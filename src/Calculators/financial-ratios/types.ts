// Types for Financial Ratios calculator

export interface FinancialMetrics {
  // Liquidity Ratios
  currentAssets: number;
  currentLiabilities: number;
  inventory: number;
  
  // Profitability Ratios
  netIncome: number;
  revenue: number;
  totalAssets: number;
  shareholderEquity: number;
  
  // Leverage Ratios
  totalDebt: number;
  ebitda: number;
  
  // Efficiency Ratios
  cogs: number;
  averageInventory: number;
  accountsReceivable: number;
  accountsPayable: number;
}

export interface FinancialRatios {
  // Liquidity Ratios
  currentRatio: number;
  quickRatio: number;
  
  // Profitability Ratios
  netProfitMargin: number;
  returnOnAssets: number;
  returnOnEquity: number;
  
  // Leverage Ratios
  debtToEquity: number;
  interestCoverage: number;
  
  // Efficiency Ratios
  inventoryTurnover: number;
  daysSalesOutstanding: number;
  daysPayableOutstanding: number;
}

export interface FinancialRatiosState {
  metrics: FinancialMetrics;
  ratios: FinancialRatios;
}

export interface RatioCardProps {
  title: string;
  value: number | string;
  description: string;
  isGood?: boolean;
  format?: 'percent' | 'number' | 'currency' | 'days';
}
