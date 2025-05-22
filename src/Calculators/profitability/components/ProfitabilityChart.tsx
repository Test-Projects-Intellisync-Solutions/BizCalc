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
  maxUnits = 1000,
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
                label={{ value: 'Units Sold', position: 'insideBottomRight', offset: -5 }} 
              />
              <YAxis 
                label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} 
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString()}`}
                labelFormatter={(units) => `${units} units`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Total Revenue" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="totalCosts" 
                name="Total Costs" 
                stroke="#82ca9d" 
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                name="Profit" 
                stroke="#ff7300" 
                strokeDasharray="5 5"
              />
              {breakEvenPoint > 0 && breakEvenPoint <= maxUnits && (
                <ReferenceLine 
                  x={breakEvenPoint} 
                  stroke="red" 
                  label={{ 
                    value: `Break-even: ${breakEvenPoint} units`, 
                    position: 'top',
                    fill: 'red',
                    fontSize: 12
                  }} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {breakEvenPoint > 0 && breakEvenPoint <= maxUnits && (
          <p className="mt-4 text-sm text-muted-foreground">
            Break-even point: {breakEvenPoint} units (${(breakEvenPoint * pricePerUnit).toLocaleString()})
          </p>
        )}
      </CardContent>
    </Card>
  );
}
