import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

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

  const handleChange = (field: keyof typeof formData, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    const newData = { ...formData, [field]: numValue };
    setFormData(newData);
    onUpdate(newData);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Gross Profit Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Total Revenue</Label>
            <Input
              type="number"
              min="0"
              value={formData.revenue || ''}
              onChange={(e) => handleChange('revenue', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Cost of Goods Sold (COGS)</Label>
            <Input
              type="number"
              min="0"
              value={formData.cogs || ''}
              onChange={(e) => handleChange('cogs', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Operating Expenses</Label>
            <Input
              type="number"
              min="0"
              value={formData.operatingExpenses || ''}
              onChange={(e) => handleChange('operatingExpenses', e.target.value)}
              placeholder="0.00"
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
            <Label>Price per Unit</Label>
            <Input
              type="number"
              min="0"
              value={formData.pricePerUnit || ''}
              onChange={(e) => handleChange('pricePerUnit', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Variable Cost per Unit</Label>
            <Input
              type="number"
              min="0"
              value={formData.variableCostPerUnit || ''}
              onChange={(e) => handleChange('variableCostPerUnit', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Fixed Costs</Label>
            <Input
              type="number"
              min="0"
              value={formData.fixedCosts || ''}
              onChange={(e) => handleChange('fixedCosts', e.target.value)}
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}