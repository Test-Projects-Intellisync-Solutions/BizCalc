import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CashFlowItem } from './CashFlowForm';

interface CashFlowChartProps {
  items: CashFlowItem[];
  openingBalance: number;
  months: number;
}

export default function CashFlowChart({ items, openingBalance, months }: CashFlowChartProps) {
  const data = useMemo(() => {
    const monthsArray = Array.from({ length: months }, (_, i) => i);
    let runningBalance = openingBalance;
    
    return monthsArray.map((month) => {
      const inflows = items
        .filter((item) => item.category === 'inflow')
        .reduce((sum, item) => {
          switch (item.frequency) {
            case 'monthly':
              return sum + item.amount;
            case 'quarterly':
              return sum + (month % 3 === 0 ? item.amount : 0);
            case 'annually':
              return sum + (month === 11 ? item.amount : 0);
            default:
              return sum;
          }
        }, 0);

      const outflows = items
        .filter((item) => item.category === 'outflow')
        .reduce((sum, item) => {
          switch (item.frequency) {
            case 'monthly':
              return sum + item.amount;
            case 'quarterly':
              return sum + (month % 3 === 0 ? item.amount : 0);
            case 'annually':
              return sum + (month === 11 ? item.amount : 0);
            default:
              return sum;
          }
        }, 0);

      const netCashFlow = inflows - outflows;
      runningBalance += netCashFlow;

      return {
        month: `Month ${month + 1}`,
        inflows,
        outflows,
        netCashFlow,
        balance: runningBalance,
      };
    });
  }, [items, openingBalance, months]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Cash Balance Over Time</CardTitle>
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
                <ReferenceLine y={0} stroke="#666" />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="hsl(var(--chart-1))"
                  name="Cash Balance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Cash Flows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceLine y={0} stroke="#666" />
                <Bar dataKey="inflows" fill="hsl(var(--chart-2))" name="Cash Inflows" />
                <Bar dataKey="outflows" fill="hsl(var(--chart-3))" name="Cash Outflows" />
                <Bar dataKey="netCashFlow" fill="hsl(var(--chart-4))" name="Net Cash Flow" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}