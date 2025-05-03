import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function RoiCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number>(0);
  const [returnAmount, setReturnAmount] = useState<number>(0);
  const [timeframe, setTimeframe] = useState<number>(1);

  const calculateROI = () => {
    if (initialInvestment === 0) return 0;
    const roi = ((returnAmount - initialInvestment) / initialInvestment) * 100;
    const annualizedROI = ((1 + roi / 100) ** (1 / timeframe) - 1) * 100;
    return {
      roi,
      annualizedROI: timeframe > 1 ? annualizedROI : roi,
    };
  };

  const results = calculateROI();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ROI Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="investment">Initial Investment</Label>
            <Input
              id="investment"
              type="number"
              min="0"
              value={initialInvestment || ''}
              onChange={(e) => setInitialInvestment(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="return">Total Return</Label>
            <Input
              id="return"
              type="number"
              min="0"
              value={returnAmount || ''}
              onChange={(e) => setReturnAmount(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeframe">Investment Period (Years)</Label>
            <Input
              id="timeframe"
              type="number"
              min="0.1"
              step="0.1"
              value={timeframe || ''}
              onChange={(e) => setTimeframe(parseFloat(e.target.value) || 1)}
              placeholder="1"
            />
          </div>

          {initialInvestment > 0 && (
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total ROI</p>
                    <p className="text-2xl font-bold">
                      {results.roi.toFixed(2)}%
                    </p>
                  </div>
                  {timeframe > 1 && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Annualized ROI</p>
                      <p className="text-2xl font-bold">
                        {results.annualizedROI.toFixed(2)}%
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Button className="w-full" onClick={() => console.log('Save ROI calculation')}>
            Save Calculation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}