import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';

export default function BurnRateCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [cashOnHand, setCashOnHand] = useState<number>(0);

  const calculateRunway = () => {
    if (monthlyExpenses === 0) return Infinity;
    return cashOnHand / monthlyExpenses;
  };

  const runway = calculateRunway();
  const isLowRunway = runway < 6 && monthlyExpenses > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Burn Rate Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <TooltipWrapper content="Total monthly operating expenses including salaries, rent, and other fixed costs">
              <Label htmlFor="expenses">Monthly Expenses</Label>
            </TooltipWrapper>
            <Input
              id="expenses"
              type="number"
              min="0"
              value={monthlyExpenses || ''}
              onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <TooltipWrapper content="Total cash reserves available to cover expenses">
              <Label htmlFor="cash">Cash on Hand</Label>
            </TooltipWrapper>
            <Input
              id="cash"
              type="number"
              min="0"
              value={cashOnHand || ''}
              onChange={(e) => setCashOnHand(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          {isLowRunway && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Low Cash Runway Warning</AlertTitle>
              <AlertDescription>
                Your runway is less than 6 months. Consider reducing expenses or raising additional capital.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">
                  {runway === Infinity ? '∞' : runway.toFixed(1)} months
                </h3>
                <p className="text-sm text-muted-foreground">
                  {runway === Infinity
                    ? 'Enter your monthly expenses to calculate runway'
                    : `At your current burn rate of $${monthlyExpenses.toLocaleString()}/month, 
                       your cash will last approximately ${runway.toFixed(1)} months`}
                </p>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={() => console.log('Save calculation')}>
            Save Calculation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}