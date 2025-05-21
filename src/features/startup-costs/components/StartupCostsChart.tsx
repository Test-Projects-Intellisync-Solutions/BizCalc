import { Card, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface StartupCostsChartProps {
  oneTimeCosts: number;
  sixMonthOperating: number;
  categoryData: ChartData[];
}

export function StartupCostsChart({ 
  oneTimeCosts, 
  sixMonthOperating, 
  categoryData 
}: StartupCostsChartProps) {
  const chartData = [
    { name: 'One-Time Costs', value: oneTimeCosts },
    { name: '6-Month Operating', value: sixMonthOperating },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-4">
        <CardTitle className="text-lg mb-4">Cost Breakdown</CardTitle>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Legend />
              <Bar dataKey="value" name="Cost" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <CardTitle className="text-lg mb-4">Costs by Category</CardTitle>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Legend />
              <Bar dataKey="value" name="Cost by Category" fill="hsl(var(--chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
