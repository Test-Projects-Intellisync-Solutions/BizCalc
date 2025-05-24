import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface ProfitabilityFormProps {
  onUpdate: (data: {
    revenue: number;
    cogs: number;
    operatingExpenses: number;
    pricePerUnit: number;
    variableCostPerUnit: number;
    fixedCosts: number;
  }) => void;
}

export default function ProfitabilityForm({ onUpdate }: ProfitabilityFormProps) {
  const [formData, setFormData] = useState({
    revenue: 0,
    cogs: 0,
    operatingExpenses: 0,
    pricePerUnit: 0,
    variableCostPerUnit: 0,
    fixedCosts: 0,
  });
  
  const exampleValues = {
    revenue: '50,000',
    cogs: '20,000',
    operatingExpenses: '10,000',
    pricePerUnit: '49.99',
    variableCostPerUnit: '15.50',
    fixedCosts: '5,000'
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    // Allow empty string or valid numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const numValue = value === '' ? 0 : parseFloat(value);
      const newData = { ...formData, [field]: numValue };
      setFormData(newData);
      onUpdate(newData);
    }
  };

  return (
    <TooltipProvider>
      <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Gross Profit Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Total Revenue</Label>
              <Tooltip>
                <TooltipTrigger type="button">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The total income generated from sales before any expenses are deducted.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              min="0"
              value={formData.revenue === 0 ? '' : formData.revenue}
              onChange={(e) => handleChange('revenue', e.target.value)}
              placeholder={exampleValues.revenue}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Cost of Goods Sold (COGS)</Label>
              <Tooltip>
                <TooltipTrigger type="button">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The direct costs of producing the goods sold by a company, including materials and labor.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              min="0"
              value={formData.cogs === 0 ? '' : formData.cogs}
              onChange={(e) => handleChange('cogs', e.target.value)}
              placeholder={exampleValues.cogs}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Operating Expenses</Label>
              <Tooltip>
                <TooltipTrigger type="button">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Costs required to run the business that are not directly tied to production, such as rent, utilities, and salaries.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              min="0"
              value={formData.operatingExpenses === 0 ? '' : formData.operatingExpenses}
              onChange={(e) => handleChange('operatingExpenses', e.target.value)}
              placeholder={exampleValues.operatingExpenses}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Break-Even Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Price per Unit</Label>
              <Tooltip>
                <TooltipTrigger type="button">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The selling price for each individual unit of your product or service.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              min="0"
              value={formData.pricePerUnit === 0 ? '' : formData.pricePerUnit}
              onChange={(e) => handleChange('pricePerUnit', e.target.value)}
              placeholder={exampleValues.pricePerUnit}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Variable Cost per Unit</Label>
              <Tooltip>
                <TooltipTrigger type="button">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Costs that vary directly with the number of units produced, such as raw materials and direct labor.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              min="0"
              value={formData.variableCostPerUnit === 0 ? '' : formData.variableCostPerUnit}
              onChange={(e) => handleChange('variableCostPerUnit', e.target.value)}
              placeholder={exampleValues.variableCostPerUnit}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Fixed Costs</Label>
              <Tooltip>
                <TooltipTrigger type="button">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Expenses that remain constant regardless of production volume, such as rent, insurance, and salaries.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              min="0"
              value={formData.fixedCosts === 0 ? '' : formData.fixedCosts}
              onChange={(e) => handleChange('fixedCosts', e.target.value)}
              placeholder={exampleValues.fixedCosts}
            />
          </div>
        </CardContent>
      </Card>
      </div>
    </TooltipProvider>
  );
}