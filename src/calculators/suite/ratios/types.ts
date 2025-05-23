export interface FinancialData {
  currentAssets: number;
  inventory: number;
  cash: number;
  currentLiabilities: number;
  totalAssets: number;
  totalLiabilities: number;
  shareholderEquity: number;
  revenue: number;
  cogs: number;
  operatingIncome: number;
  netIncome: number;
  ebit: number;
  interestExpense: number;
  accountsReceivable: number;
  previousRevenue: number;
  previousNetIncome: number;
}

export interface RatioFormProps {
  data: FinancialData;
  onUpdate: React.Dispatch<React.SetStateAction<FinancialData>>;
}
