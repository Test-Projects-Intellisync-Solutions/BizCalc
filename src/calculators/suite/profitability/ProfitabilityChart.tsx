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
import { type FeedbackItem } from '../../../data/feedbackRules';

interface ProfitabilityChartProps {
  fixedCosts: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
  maxUnits: number;
  highlightDataPoints?: FeedbackItem[];
}

export default function ProfitabilityChart({
  fixedCosts,
  variableCostPerUnit,
  pricePerUnit,
  maxUnits,
  highlightDataPoints = [],
}: ProfitabilityChartProps) {
  const getLineStrokeColor = (lineIdentifier: string, defaultColor: string): string => {
    const feedback = highlightDataPoints.find(
      item => item.uiTarget?.scope === 'chart' && item.uiTarget?.identifier === lineIdentifier
    );
    if (feedback) {
      switch (feedback.severity) {
        case 'critical': return 'hsl(var(--destructive))';
        case 'warning': return 'hsl(var(--warning))';
        case 'good': return 'hsl(var(--success))';
        default: return defaultColor;
      }
    }
    return defaultColor;
  };

  const revenueLineColor = getLineStrokeColor('revenueLine', 'hsl(var(--chart-1))');
  const totalCostsLineColor = getLineStrokeColor('totalCostsLine', 'hsl(var(--chart-2))');
  const profitLineColor = getLineStrokeColor('profitLine', 'hsl(var(--chart-3))');

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

  const breakEvenHighlight = highlightDataPoints.find(
    item => item.uiTarget?.scope === 'chart' && item.uiTarget?.identifier === 'breakEvenPointLine'
  ); // Keep existing breakEvenPointLine specific logic separate for clarity

  let breakEvenLineColor = 'hsl(var(--primary))';
  if (breakEvenHighlight) {
    switch (breakEvenHighlight.severity) {
      case 'critical':
        breakEvenLineColor = 'hsl(var(--destructive))';
        break; 
      case 'warning':
        breakEvenLineColor = 'hsl(var(--warning))';
        break;
      case 'good':
        breakEvenLineColor = 'hsl(var(--success))';
        break;
    }
  }

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
                stroke={breakEvenLineColor}
                strokeDasharray="3 3"
                label={{ value: 'Break-Even Point', position: 'top' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={revenueLineColor}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="totalCosts"
                stroke={totalCostsLineColor}
                name="Total Costs"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke={profitLineColor}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}