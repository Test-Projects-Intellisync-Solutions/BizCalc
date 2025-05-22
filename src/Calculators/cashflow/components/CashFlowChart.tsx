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
import type { CashFlowChartData } from '../types';

interface CashFlowChartProps {
  data: CashFlowChartData[];
}

export default function CashFlowChart({ data }: CashFlowChartProps) {
  // Format data for the charts
  const chartData = useMemo(() => {
    return data.map(item => ({
      name: `Month ${item.month}`,
      ...item
    }));
  }, [data]);

  // Calculate chart domain for consistent scaling
  const { minValue, maxValue } = useMemo(() => {
    if (data.length === 0) return { minValue: 0, maxValue: 0 };
    
    const values = data.flatMap(item => [
      item.balance,
      item.inflows,
      item.outflows,
      item.cumulativeInflows,
      item.cumulativeOutflows
    ].filter(Boolean) as number[]);
    
    return {
      minValue: Math.min(...values),
      maxValue: Math.max(...values)
    };
  }, [data]);

  // Custom tooltip formatter
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom tick formatter
  const formatTick = (value: number) => {
    if (value === 0) return '0';
    if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };
    
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Add cash flow items to see the projection
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Balance Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Balance Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={formatTick}
                domain={[minValue * 1.1, maxValue * 1.1]}
                width={80}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Month ${label.split(' ')[1]}`}
              />
              <Legend />
              <ReferenceLine y={0} stroke="#888" />
              <Line
                type="monotone"
                dataKey="balance"
                name="Balance"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="cumulativeInflows"
                name="Cumulative Inflows"
                stroke="#10b981"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="cumulativeOutflows"
                name="Cumulative Outflows"
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Inflows/Outflows Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Cash Flow</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={formatTick}
                width={80}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Month ${label.split(' ')[1]}`}
              />
              <Legend />
              <Bar dataKey="inflows" name="Inflows" fill="#10b981" />
              <Bar dataKey="outflows" name="Outflows" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
