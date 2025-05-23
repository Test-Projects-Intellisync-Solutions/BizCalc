import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState<number>(0);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(0);

  const generateChartData = () => {
    const data = [];
    if (pricePerUnit <= 0 || pricePerUnit <= variableCostPerUnit) return [];

    const breakEvenUnits = Math.ceil(fixedCosts / (pricePerUnit - variableCostPerUnit));
    const maxUnits = Math.max(breakEvenUnits * 2, 10);

    for (let units = 0; units <= maxUnits; units += Math.max(1, Math.floor(maxUnits / 10))) {
      const revenue = units * pricePerUnit;
      const totalCosts = fixedCosts + (units * variableCostPerUnit);
      const profit = revenue - totalCosts;

      data.push({
        units,
        revenue,
        totalCosts,
        profit
      });
    }

    return data;
  };

  const calculateBreakEven = () => {
    if (pricePerUnit <= variableCostPerUnit) return 'N/A';
    const breakEvenUnits = fixedCosts / (pricePerUnit - variableCostPerUnit);
    return Math.ceil(breakEvenUnits);
  };

  const breakEvenUnits = calculateBreakEven();
  const breakEvenRevenue = breakEvenUnits === 'N/A' ? 'N/A' : (pricePerUnit * parseInt(breakEvenUnits)).toLocaleString();
  const chartData = generateChartData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Break-Even Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="fixedCosts">Fixed Costs</Label>
              <Input
                id="fixedCosts"
                type="number"
                min="0"
                value={fixedCosts || ''}
                onChange={(e) => setFixedCosts(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price Per Unit</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={pricePerUnit || ''}
                onChange={(e) => setPricePerUnit(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variableCost">Variable Cost Per Unit</Label>
              <Input
                id="variableCost"
                type="number"
                min="0"
                value={variableCostPerUnit || ''}
                onChange={(e) => setVariableCostPerUnit(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          {fixedCosts > 0 && pricePerUnit > 0 && (
            <>
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Break-Even Point (Units)</p>
                      <p className="text-2xl font-bold">
                        {breakEvenUnits}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Break-Even Revenue</p>
                      <p className="text-2xl font-bold">
                        ${breakEvenRevenue}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {chartData.length > 0 && (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="units" label={{ value: 'Units Sold', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <ReferenceLine
                        x={breakEvenUnits}
                        stroke="hsl(var(--primary))"
                        strokeDasharray="3 3"
                        label={{ value: 'Break-Even', position: 'top' }}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" name="Revenue" />
                      <Line type="monotone" dataKey="totalCosts" stroke="hsl(var(--chart-2))" name="Total Costs" />
                      <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-3))" name="Profit" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}

          <Button className="w-full" onClick={() => console.log('Save calculation')}>
            Save Calculation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}