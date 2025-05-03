import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';
import GuideCard from '@/components/ui/guide-card';
import CashFlowForm, { type CashFlowItem } from './CashFlowForm';
import CashFlowChart from './CashFlowChart';

export default function CashFlowTab() {
  const [items, setItems] = useState<CashFlowItem[]>([]);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [projectionMonths, setProjectionMonths] = useState(12);

  const handleItemsUpdate = (newItems: CashFlowItem[]) => {
    setItems(newItems);
  };

  const calculateMetrics = () => {
    const inflows = items
      .filter((item) => item.category === 'inflow')
      .reduce((sum, item) => sum + item.amount, 0);

    const outflows = items
      .filter((item) => item.category === 'outflow')
      .reduce((sum, item) => sum + item.amount, 0);

    const monthlyNetCashFlow = inflows - outflows;
    const runway = outflows > 0 ? openingBalance / outflows : Infinity;

    return { inflows, outflows, monthlyNetCashFlow, runway };
  };

  const { inflows, outflows, monthlyNetCashFlow, runway } = calculateMetrics();

  return (
    <div className="space-y-6">
      <GuideCard
        title="Cash Flow Management Guide"
        steps={[
          {
            title: "Set Opening Balance",
            description: "Enter your current cash position to start tracking cash flow"
          },
          {
            title: "Add Cash Inflows",
            description: "Input all sources of incoming cash (sales, investments, etc.)"
          },
          {
            title: "Add Cash Outflows",
            description: "Enter all cash payments and expenses"
          },
          {
            title: "Review Projections",
            description: "Analyze your cash position over time and identify potential shortfalls"
          }
        ]}
        interpretations={[
          {
            title: "Positive Net Cash Flow",
            description: "Your business is generating more cash than it's spending - healthy position"
          },
          {
            title: "Negative Net Cash Flow",
            description: "You're spending more than you're earning - action needed to prevent cash shortfall"
          },
          {
            title: "Cash Runway",
            description: "Shows how long your current cash will last at your current burn rate"
          }
        ]}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Cash Flow Management</h2>
        <div className="flex items-center gap-4">
          <Label>Projection Period</Label>
          <Select
            value={projectionMonths.toString()}
            onValueChange={(value) => setProjectionMonths(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Months</SelectItem>
              <SelectItem value="6">6 Months</SelectItem>
              <SelectItem value="12">12 Months</SelectItem>
              <SelectItem value="24">24 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {monthlyNetCashFlow < 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Cash Flow Warning</AlertTitle>
          <AlertDescription>
            Your monthly cash burn rate is ${Math.abs(monthlyNetCashFlow).toLocaleString()}. 
            At this rate, your cash runway is {runway === Infinity ? '∞' : `${runway.toFixed(1)} months`}.
          </AlertDescription>
        </Alert>
      )}

      <CashFlowForm
        onUpdate={handleItemsUpdate}
        openingBalance={openingBalance}
        onOpeningBalanceChange={setOpeningBalance}
      />

      <CashFlowChart
        items={items}
        openingBalance={openingBalance}
        months={projectionMonths}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Monthly Inflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${inflows.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Monthly Outflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              ${outflows.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Monthly Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${monthlyNetCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${monthlyNetCashFlow.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {monthlyNetCashFlow >= 0
                ? 'Positive cash flow - business is generating more than it spends'
                : 'Negative cash flow - business is spending more than it generates'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}