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
import { Cell } from 'recharts';

interface HighlightPoint {
  monthIndex: number; // 0-based index of the month
  dataKey: 'balance' | 'inflows' | 'outflows' | 'netCashFlow';
  severity: 'good' | 'warning' | 'critical' | 'info';
}

interface CashFlowChartProps {
  items: CashFlowItem[];
  openingBalance: number;
  months: number;
  highlightDataPoints?: HighlightPoint[];
}

const severityFillColors: Record<HighlightPoint['severity'], string> = {
  good: 'hsl(var(--chart-2))', // Green
  warning: 'hsl(var(--chart-5))', // Yellow/Orange
  critical: 'hsl(var(--chart-3))', // Red
  info: 'hsl(var(--chart-1))', // Blue
};

export default function CashFlowChart({ items, openingBalance, months, highlightDataPoints = [] }: CashFlowChartProps) {
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
                  dot={(props: any) => {
                    const { cx, cy, stroke, index, payload } = props;
                    const highlight = highlightDataPoints.find(
                      (p) => p.monthIndex === index && p.dataKey === 'balance'
                    );
                    const fillColor = highlight ? severityFillColors[highlight.severity] : stroke;
                    if (payload.balance === undefined) return <g />; // Return empty SVG group if balance is undefined
                    return <circle cx={cx} cy={cy} r={5} fill={fillColor} stroke={stroke} strokeWidth={1} />;
                  }}
                  activeDot={{ r: 7 }}
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
                <Bar dataKey="netCashFlow" name="Net Cash Flow">
                  {data.map((entry, index) => {
                    const highlight = highlightDataPoints.find(
                      (p) => p.monthIndex === index && p.dataKey === 'netCashFlow'
                    );
                    let fillColor = highlight ? severityFillColors[highlight.severity] : 'hsl(var(--chart-4))'; // Default color
                    if (!highlight && entry.netCashFlow < 0) {
                      fillColor = 'hsl(var(--chart-3))'; // Default red for negative if not otherwise highlighted
                    }
                    return <Cell key={`cell-${index}`} fill={fillColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}