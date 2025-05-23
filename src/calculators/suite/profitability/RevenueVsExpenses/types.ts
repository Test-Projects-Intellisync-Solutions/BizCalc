export type FrequencyType = 'monthly' | 'quarterly' | 'annually';

export interface FinancialItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: FrequencyType;
  type: 'revenue' | 'expense';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategorySummary {
  name: string;
  total: number;
  percentage: number;
  count: number;
}

export interface FinancialSummary {
  total: number;
  byCategory: CategorySummary[];
  items: FinancialItem[];
}

export const frequencyMultipliers = {
  monthly: 1,
  quarterly: 1/3, // For monthly display
  annually: 1/12, // For monthly display
} as const;

export const frequencyLabels = {
  monthly: 'per month',
  quarterly: 'quarterly',
  annually: 'annually',
} as const;
