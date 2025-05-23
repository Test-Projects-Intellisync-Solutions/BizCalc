import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

export default function ProfitMarginCalculator() {
  const [revenue, setRevenue] = useState<number>(0);
  const [cogs, setCogs] = useState<number>(0);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(0);
  const [otherExpenses, setOtherExpenses] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(25);

  const calculateMargins = () => {
    const grossProfit = revenue - cogs;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    
    const operatingProfit = grossProfit - operatingExpenses;
    const operatingMargin = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
    
    const pretaxProfit = operatingProfit - otherExpenses;
    const pretaxMargin = revenue > 0 ? (pretaxProfit / revenue) * 100 : 0;
    
    const taxes = pretaxProfit > 0 ? pretaxProfit * (taxRate / 100) : 0;
    const netProfit = pretaxProfit - taxes;
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    
    return {
      grossProfit,
      grossMargin,
      operatingProfit,
      operatingMargin,
      pretaxProfit,
      pretaxMargin,
      taxes,
      netProfit,
      netMargin,
    };
  };

  const getMarginStatus = (margin: number) => {
    if (margin >= 20) return 'text-green-600';
    if (margin >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const margins = calculateMargins();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profit Margin Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="revenue">Revenue</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Total sales revenue before any costs or expenses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="revenue"
                type="number"
                min="0"
                value={revenue || ''}
                onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="cogs">Cost of Goods Sold (COGS)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Direct costs attributable to producing goods or services</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="cogs"
                type="number"
                min="0"
                value={cogs || ''}
                onChange={(e) => setCogs(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="operatingExpenses">Operating Expenses</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Day-to-day expenses like rent, utilities, wages, marketing, etc.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="operatingExpenses"
                type="number"
                min="0"
                value={operatingExpenses || ''}
                onChange={(e) => setOperatingExpenses(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="otherExpenses">Other Expenses</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Interest, depreciation, and non-operating expenses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="otherExpenses"
                type="number"
                min="0"
                value={otherExpenses || ''}
                onChange={(e) => setOtherExpenses(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Effective income tax rate for your business</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                value={taxRate || ''}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                placeholder="25"
              />
            </div>
          </div>

          {revenue > 0 && (
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Gross Profit</p>
                      <p className="text-2xl font-bold">${margins.grossProfit.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gross Margin</p>
                      <p className={`text-2xl font-bold ${getMarginStatus(margins.grossMargin)}`}>
                        {margins.grossMargin.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Operating Profit</p>
                      <p className="text-2xl font-bold">${margins.operatingProfit.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Operating Margin</p>
                      <p className={`text-2xl font-bold ${getMarginStatus(margins.operatingMargin)}`}>
                        {margins.operatingMargin.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Net Profit</p>
                      <p className="text-2xl font-bold">${margins.netProfit.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Net Margin</p>
                      <p className={`text-2xl font-bold ${getMarginStatus(margins.netMargin)}`}>
                        {margins.netMargin.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button className="w-full" onClick={() => console.log('Save calculation')}>
            Save Calculation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}