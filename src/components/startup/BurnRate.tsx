import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import GuideCard from '@/components/ui/guide-card';

export default function BurnRate() {
  const [availableCapital, setAvailableCapital] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);

  const handleCapitalChange = (value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (isNaN(numValue)) return;
    setAvailableCapital(numValue);
  };

  const handleExpensesChange = (value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (isNaN(numValue)) return;
    setMonthlyExpenses(numValue);
  };

  const calculateRunway = () => {
    if (monthlyExpenses === 0) return '∞';
    const months = availableCapital / monthlyExpenses;
    return months.toFixed(1);
  };

  const handleSave = () => {
    toast.success('Burn rate calculations saved!');
    // TODO: Implement save to Supabase
  };

  return (
    <Card>
      <GuideCard
        title="Burn Rate Calculator Guide"
        steps={[
          {
            title: "Enter Available Capital",
            description: "Input your total available cash or funding"
          },
          {
            title: "Add Monthly Expenses",
            description: "Enter your total monthly operating costs"
          },
          {
            title: "Review Runway",
            description: "Check how many months your capital will last"
          }
        ]}
        interpretations={[
          {
            title: "Runway < 6 months",
            description: "Critical - immediate action needed to extend runway"
          },
          {
            title: "Runway 6-12 months",
            description: "Plan fundraising or revenue growth strategies"
          },
          {
            title: "Runway > 12 months",
            description: "Healthy position, focus on growth and optimization"
          }
        ]}
      />
      <CardHeader>
        <CardTitle>Burn Rate Calculator</CardTitle>
        <CardDescription>
          Calculate how long your available capital will last based on monthly expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="capital">Available Capital</Label>
            <Input
              id="capital"
              type="number"
              min="0"
              value={availableCapital || ''}
              onChange={(e) => handleCapitalChange(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expenses">Monthly Expenses</Label>
            <Input
              id="expenses"
              type="number"
              min="0"
              value={monthlyExpenses || ''}
              onChange={(e) => handleExpensesChange(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Runway (Months)</Label>
              <span className="text-2xl font-bold">{calculateRunway()}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {monthlyExpenses > 0
                ? `At your current burn rate, your capital will last approximately ${calculateRunway()} months.`
                : 'Enter your monthly expenses to calculate runway.'}
            </p>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Calculations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}