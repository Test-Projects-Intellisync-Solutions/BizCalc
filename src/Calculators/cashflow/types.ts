export interface CashFlowItem {
  id: string;
  name: string;
  amount: number;
  type: 'inflow' | 'outflow';
  frequency: 'one-time' | 'monthly' | 'quarterly' | 'annually';
  startMonth: number;
  endMonth?: number;
  category?: string;
  notes?: string;
}

export interface CashFlowTabState {
  items: CashFlowItem[];
  openingBalance: number;
  projectionMonths: number;
}

export interface CashFlowChartData {
  month: number;
  balance: number;
  inflows: number;
  outflows: number;
  cumulativeInflows: number;
  cumulativeOutflows: number;
  runningBalance: number;
  isNegative: boolean;
}

export interface CashFlowSummary {
  totalInflows: number;
  totalOutflows: number;
  netCashFlow: number;
  endingBalance: number;
  minBalance: number;
  maxBalance: number;
  avgMonthlyInflow: number;
  avgMonthlyOutflow: number;
  burnRate: number;
  monthsOfRunway: number;
  monthsNegativeBalance: number;
  monthsPositiveBalance: number;
}
