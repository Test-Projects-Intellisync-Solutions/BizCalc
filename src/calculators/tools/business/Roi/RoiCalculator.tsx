import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';

export default function RoiCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number>(0);
  const [returnAmount, setReturnAmount] = useState<number>(0);
  const [timeframe, setTimeframe] = useState<number>(1);

  interface RoiResult {
    roi: number;
    annualizedROI: number;
  }

  const calculateROI = (): RoiResult | null => {
    if (initialInvestment === 0) return null;
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
            <TooltipWrapper content="The initial amount of money invested in the project or business">
              <Label htmlFor="investment">Initial Investment</Label>
            </TooltipWrapper>
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
            <TooltipWrapper content="The total amount of money returned from the investment">
              <Label htmlFor="return">Total Return</Label>
            </TooltipWrapper>
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
            <TooltipWrapper content="The number of years over which the return is calculated">
              <Label htmlFor="timeframe">Timeframe (Years)</Label>
            </TooltipWrapper>
            <TooltipWrapper content="Enter the timeframe in years">
              <Input
                id="timeframe"
                type="number"
                min="1"
                value={timeframe}
                onChange={(e) => setTimeframe(parseInt(e.target.value) || 1)}
                placeholder="1"
              />
            </TooltipWrapper>
          </div>

          {initialInvestment > 0 && (
            <Card className="bg-muted">
              <CardContent className="pt-6">
                {results ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="text-center">
                      <TooltipWrapper content="Return on Investment: (Gain from Investment - Cost of Investment) / Cost of Investment">
                        <div>
                          <p className="text-sm text-muted-foreground">ROI</p>
                          <p className="text-2xl font-bold">{results.roi.toFixed(2)}%</p>
                        </div>
                      </TooltipWrapper>
                    </div>
                    {timeframe > 1 && (
                      <div className="text-center">
                        <TooltipWrapper content="Annualized ROI accounts for the time period of the investment, showing the average annual return">
                          <div>
                            <p className="text-sm text-muted-foreground">Annualized ROI</p>
                            <p className="text-2xl font-bold">{results.annualizedROI.toFixed(2)}%</p>
                          </div>
                        </TooltipWrapper>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    Enter valid values to calculate ROI
                  </p>
                )}
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