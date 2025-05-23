import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RevenueStream } from './RevenueForm';
import type { Expense } from './ExpenseForm';

interface ProjectionChartProps {
  revenueStreams: RevenueStream[];
  expenses: Expense[];
  months: number;
}

export default function ProjectionChart({ revenueStreams, expenses, months }: ProjectionChartProps) {
  const data = useMemo(() => {
    const monthsArray = Array.from({ length: months }, (_, i) => i);
    
    return monthsArray.map((month) => {
      // Calculate revenue for each stream
      const revenueByStream = revenueStreams.map((stream) => {
        if (stream.growthType === 'fixed') {
          return stream.baseAmount;
        } else {
          return stream.baseAmount * Math.pow(1 + stream.growthRate / 100, month);
        }
      });

      const totalRevenue = revenueByStream.reduce((sum, amount) => sum + amount, 0);

      // Calculate expenses
      const expensesByType = expenses.map((expense) => {
        if (expense.type === 'variable') {
          return (totalRevenue * (expense.variableRate || 0)) / 100;
        } else {
          switch (expense.frequency) {
            case 'monthly':
              return expense.amount;
            case 'quarterly':
              return month % 3 === 0 ? expense.amount : 0;
            case 'annually':
              return month === 11 ? expense.amount : 0;
            default:
              return 0;
          }
        }
      });

      const totalExpenses = expensesByType.reduce((sum, amount) => sum + amount, 0);
      const netCashFlow = totalRevenue - totalExpenses;

      return {
        month: `Month ${month + 1}`,
        revenue: totalRevenue,
        expenses: totalExpenses,
        netCashFlow,
      };
    });
  }, [revenueStreams, expenses, months]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Projections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-1))"
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="hsl(var(--chart-2))"
                name="Expenses"
              />
              <Line
                type="monotone"
                dataKey="netCashFlow"
                stroke="hsl(var(--chart-3))"
                name="Net Cash Flow"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}