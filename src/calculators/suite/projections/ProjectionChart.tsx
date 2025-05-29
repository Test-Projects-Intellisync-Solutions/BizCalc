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
  DotProps,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RevenueStream } from './RevenueForm';
import type { Expense } from './ExpenseForm';

export interface HighlightPoint {
  monthIndex: number; // 0-indexed month
  dataKey: 'revenue' | 'expenses' | 'netCashFlow';
  severity: 'good' | 'warning' | 'critical' | 'info';
}

interface ProjectionChartProps {
  revenueStreams: RevenueStream[];
  expenses: Expense[];
  months: number;
  highlightDataPoints?: HighlightPoint[];
}

const severityColors: Record<string, string> = {
  info: 'hsl(var(--chart-4))', // Example: blue
  good: 'hsl(var(--chart-1))', // Example: green (using existing revenue color)
  warning: 'hsl(var(--chart-5))',// Example: yellow/amber
  critical: 'hsl(var(--chart-2))', // Example: red (using existing expenses color)
};

interface CustomDotProps extends DotProps {
  payload?: { month: string; [key: string]: any }; // payload might be undefined based on Recharts DotProps
  dataKey?: string;
  highlightPoints?: HighlightPoint[];
  monthIndex?: number; // monthIndex from the mapping
}

const CustomizedDot: React.FC<CustomDotProps> = (props) => {
  const { cx, cy, stroke, payload, dataKey, highlightPoints, monthIndex } = props;

  if (cx === undefined || cy === undefined || monthIndex === undefined || !dataKey || !payload) {
    return null; 
  }

  const highlight = highlightPoints?.find(
    (p) => p.monthIndex === monthIndex && p.dataKey === dataKey
  );

  if (highlight) {
    return <circle cx={cx} cy={cy} r={5} fill={severityColors[highlight.severity] || stroke} stroke={stroke} strokeWidth={1} />;
  }
  // Render default dot if not highlighted or if it's an active dot (Recharts handles activeDot separately)
  // Default Recharts dot is r=3, fill=stroke
  return <circle cx={cx} cy={cy} r={3} fill={stroke} />;
};

export default function ProjectionChart({ revenueStreams, expenses, months, highlightDataPoints }: ProjectionChartProps) {
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
                dot={(props) => <CustomizedDot {...props} highlightPoints={highlightDataPoints} dataKey="revenue" monthIndex={data.findIndex(d => d.month === props.payload?.month)} />} 
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="hsl(var(--chart-2))"
                name="Expenses"
                dot={(props) => <CustomizedDot {...props} highlightPoints={highlightDataPoints} dataKey="expenses" monthIndex={data.findIndex(d => d.month === props.payload?.month)} />}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="netCashFlow"
                stroke="hsl(var(--chart-3))"
                name="Net Cash Flow"
                dot={(props) => <CustomizedDot {...props} highlightPoints={highlightDataPoints} dataKey="netCashFlow" monthIndex={data.findIndex(d => d.month === props.payload?.month)} />}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}