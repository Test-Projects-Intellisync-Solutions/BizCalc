import type { RevenueStream } from '@/components/projections/RevenueForm';
import type { Expense } from '@/components/projections/ExpenseForm';

export interface ProjectionData {
  revenues: RevenueStream[];
  expenses: Expense[];
}
