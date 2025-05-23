import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import GuideCard from '@/components/ui/guide-card';

interface CostCategory {
  name: string;
  amount: number;
}

export default function SimpleStartupCosts() {
  const [costs, setCosts] = useState<CostCategory[]>([
    { name: 'Legal & Professional Fees', amount: 0 },
    { name: 'Equipment & Technology', amount: 0 },
    { name: 'Inventory', amount: 0 },
    { name: 'Marketing & Advertising', amount: 0 },
    { name: 'Licenses & Permits', amount: 0 },
    { name: 'Insurance', amount: 0 },
    { name: 'Working Capital', amount: 0 },
    { name: 'Office Space & Utilities', amount: 0 },
  ]);

  const handleCostChange = (index: number, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (isNaN(numValue)) return;

    const newCosts = [...costs];
    newCosts[index].amount = numValue;
    setCosts(newCosts);
  };

  const calculateTotal = () => {
    return costs.reduce((sum, cost) => sum + cost.amount, 0);
  };

  const handleSave = () => {
    toast.success('Startup costs saved successfully!');
    // TODO: Implement save to Supabase
  };

  return (
    <Card>
      <GuideCard
        title="Startup Costs Calculator Guide"
        steps={[
          {
            title: "Enter Initial Costs",
            description: "Input estimated costs for each category like legal fees, equipment, etc."
          },
          {
            title: "Review Total",
            description: "Check the automatically calculated total startup costs"
          },
          {
            title: "Adjust and Plan",
            description: "Revise estimates and plan your funding needs accordingly"
          }
        ]}
        interpretations={[
          {
            title: "Total < $5,000",
            description: "Lean startup, suitable for service-based or online businesses"
          },
          {
            title: "Total $5,000 - $50,000",
            description: "Typical range for small retail or professional services"
          },
          {
            title: "Total > $50,000",
            description: "Capital-intensive business, may require external funding"
          }
        ]}
      />
      <CardHeader>
        <CardTitle>Startup Cost Calculator</CardTitle>
        <CardDescription>
          Calculate the total capital required to launch your business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {costs.map((cost, index) => (
            <div key={cost.name} className="grid gap-2">
              <Label htmlFor={`cost-${index}`}>{cost.name}</Label>
              <Input
                id={`cost-${index}`}
                type="number"
                min="0"
                value={cost.amount || ''}
                onChange={(e) => handleCostChange(index, e.target.value)}
                placeholder="0.00"
              />
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Total Startup Costs</Label>
              <span className="text-2xl font-bold">
                ${calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Calculations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}