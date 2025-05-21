import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfitabilityChartProps {
  fixedCosts: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
  maxUnits: number;
}

export default function ProfitabilityChart({
  fixedCosts,
  variableCostPerUnit,
  pricePerUnit,
  maxUnits,
}: ProfitabilityChartProps) {
  const data = Array.from({ length: maxUnits + 1 }, (_, units) => {
    const revenue = units * pricePerUnit;
    const totalCosts = fixedCosts + (units * variableCostPerUnit);
    const profit = revenue - totalCosts;

    return {
      units,
      revenue,
      totalCosts,
      profit,
    };
  });

  const breakEvenPoint = Math.ceil(fixedCosts / (pricePerUnit - variableCostPerUnit));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Break-Even Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="units"
                label={{ value: 'Units Sold', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend />
              <ReferenceLine
                x={breakEvenPoint}
                stroke="hsl(var(--primary))"
                strokeDasharray="3 3"
                label={{ value: 'Break-Even Point', position: 'top' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-1))"
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="totalCosts"
                stroke="hsl(var(--chart-2))"
                name="Total Costs"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="hsl(var(--chart-3))"
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}