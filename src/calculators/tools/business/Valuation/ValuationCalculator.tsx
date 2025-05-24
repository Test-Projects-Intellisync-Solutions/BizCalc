import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';

export default function ValuationCalculator() {
  const [ebitda, setEbitda] = useState<number>(0);
  const [multiple, setMultiple] = useState<number>(5);
  const [growthRate, setGrowthRate] = useState<number>(0);

  const calculateValuation = () => {
    const baseValuation = ebitda * multiple;
    const growthAdjustment = baseValuation * (growthRate / 100);
    return {
      base: baseValuation,
      adjusted: baseValuation + growthAdjustment,
    };
  };

  const valuation = calculateValuation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Valuation Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <TooltipWrapper content="Earnings Before Interest, Taxes, Depreciation, and Amortization - A measure of a company's operating performance">
              <Label htmlFor="ebitda">Annual EBITDA</Label>
            </TooltipWrapper>
            <Input
              id="ebitda"
              type="number"
              min="0"
              value={ebitda || ''}
              onChange={(e) => setEbitda(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <TooltipWrapper content="Valuation multiple based on industry standards (typically 3x-10x EBITDA)">
              <Label htmlFor="multiple">Industry Multiple</Label>
            </TooltipWrapper>
            <Input
              id="multiple"
              type="number"
              min="1"
              step="0.1"
              value={multiple || ''}
              onChange={(e) => setMultiple(parseFloat(e.target.value) || 5)}
              placeholder="5.0"
            />
          </div>

          <div className="space-y-2">
            <TooltipWrapper content="Expected annual growth rate percentage to adjust the valuation">
              <Label htmlFor="growth">Expected Growth Rate (%)</Label>
            </TooltipWrapper>
            <TooltipWrapper content="Enter the expected annual growth rate percentage">
              <Input
                id="growth"
                type="number"
                min="-100"
                max="100"
                value={growthRate || ''}
                onChange={(e) => setGrowthRate(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </TooltipWrapper>
          </div>

          {ebitda > 0 && (
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="text-center">
                    <TooltipWrapper content="Base valuation calculated as EBITDA × Industry Multiple">
                      <div>
                        <p className="text-sm text-muted-foreground">Base Valuation</p>
                        <p className="text-2xl font-bold">
                          ${valuation.base.toLocaleString()}
                        </p>
                      </div>
                    </TooltipWrapper>
                  </div>
                  <div className="text-center">
                    <TooltipWrapper content="Growth-adjusted valuation calculated as Base Valuation + (Base Valuation × Growth Rate)">
                      <div>
                        <p className="text-sm text-muted-foreground">Growth-Adjusted Valuation</p>
                        <p className="text-2xl font-bold">
                          ${valuation.adjusted.toLocaleString()}
                        </p>
                      </div>
                    </TooltipWrapper>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button className="w-full" onClick={() => console.log('Save valuation')}>
            Save Valuation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}