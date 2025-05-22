export interface ProfitabilityMetrics {
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  fixedCosts: number;
}

export interface ProfitabilityTabState {
  metrics: ProfitabilityMetrics;
}

export interface ProfitabilityChartData {
  name: string;
  value: number;
  color: string;
}

export interface ProfitabilityResult {
  grossProfit: number;
  grossMargin: number;
  operatingIncome: number;
  operatingMargin: number;
  netProfit: number;
  netMargin: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
}
