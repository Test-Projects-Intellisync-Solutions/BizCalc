export interface RevenueStream {
  id: string;
  name: string;
  baseAmount: number;
  growthType: 'fixed' | 'percentage';
  growthRate: number;
}

export interface Expense {
  id: string;
  name: string;
  type: 'fixed' | 'variable';
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  variableRate?: number;
}

export interface ProjectionData {
  revenues: RevenueStream[];
  expenses: Expense[];
}

export interface ProjectionSummary {
  totalRevenue: number;
  totalExpenses: number;
  netCashFlow: number;
}
