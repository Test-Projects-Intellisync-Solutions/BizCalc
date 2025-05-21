import type { RevenueStream } from '@/components/revenueExpensesTab/RevenueForm';
import type { Expense } from '@/components/revenueExpensesTab/ExpenseForm';

export interface ProjectionData {
  revenues: RevenueStream[];
  expenses: Expense[];
}
