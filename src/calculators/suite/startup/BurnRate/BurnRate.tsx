import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { businessTypes, BusinessType } from '../../../../data/businessTypes';
import { toast } from 'sonner';
import GuideCard from '@/components/ui/guide-card';
import { ImportExport } from '@/components/ui/UIComponents/ImportExport';
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress'; // Commented out during development
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { MessageSquareText } from 'lucide-react';

export default function BurnRate() {
  const [availableCapital, setAvailableCapital] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);
    const [isFeedbackDrawerOpen, setIsFeedbackDrawerOpen] = useState(false);
    const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(
    businessTypes.length > 0 ? businessTypes[0] : null
  );

  // Prepare calculator data for import/export
  const calculatorData = {
    availableCapital,
    monthlyExpenses,
    selectedBusinessType: selectedBusinessType?.value ?? '',
  };

  // Handle data import
  const handleImport = (data: Record<string, unknown>) => {
    try {
      if (typeof data.availableCapital === 'number') {
        setAvailableCapital(data.availableCapital);
      }
      if (typeof data.monthlyExpenses === 'number') {
        setMonthlyExpenses(data.monthlyExpenses);
      }
      if (typeof data.selectedBusinessType === 'string') {
        const businessTypeObj = businessTypes.find(bt => bt.value === data.selectedBusinessType);
        if (businessTypeObj) {
          setSelectedBusinessType(businessTypeObj);
        } else {
          toast.warning(`Imported business type "${data.selectedBusinessType}" is not recognized. Resetting.`);
          setSelectedBusinessType(businessTypes.length > 0 ? businessTypes[0] : null);
        }
      } else if (data.selectedBusinessType !== undefined && data.selectedBusinessType !== null) {
        // Handle cases where selectedBusinessType might be an object but not a recognized one, or other invalid format
        toast.warning('Imported business type data is in an unexpected format. Resetting.');
        setSelectedBusinessType(businessTypes.length > 0 ? businessTypes[0] : null);
      }
      toast.success('Data imported successfully!');
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Failed to import data');
    }
  };

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

  useEffect(() => {
    const capitalFilled = availableCapital > 0;
    const expensesFilled = monthlyExpenses > 0;
    let percentage = 0;
    if (capitalFilled && expensesFilled) {
      percentage = 100;
    } else if (capitalFilled || expensesFilled) {
      percentage = 50;
    }
    setCompletionPercentage(percentage);
  }, [availableCapital, monthlyExpenses]);


  return (
    <Drawer open={isFeedbackDrawerOpen} onOpenChange={setIsFeedbackDrawerOpen}>
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
                <div className="flex justify-between items-center">
          <CardTitle>Burn Rate Calculator</CardTitle>
          {completionPercentage === 100 && (
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon">
                <MessageSquareText className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
          )}
        </div>
        <CardDescription>
          Calculate how long your available capital will last based on monthly expenses.
          Fill in both fields to see your runway and get feedback.
        </CardDescription>
        {/* Progress indicator commented out during development
        <div className="mt-4">
          <Progress value={completionPercentage} className="w-full" />
        </div>
        */}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Select
              value={selectedBusinessType?.value || ''}
              onValueChange={(valueString) => {
                const typeObj = businessTypes.find(bt => bt.value === valueString);
                setSelectedBusinessType(typeObj || null);
              }}
            >
              <SelectTrigger id="businessType">
                <SelectValue placeholder="Select Business Type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="mt-4">
            <ImportExport
              calculatorType="burnRate"
              currentData={calculatorData}
              onImport={handleImport}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Burn Rate & Runway Feedback</DrawerTitle>
          <DrawerDescription>
            Contextual insights for your burn rate.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p>Detailed feedback based on your capital and expenses will appear here.</p>
          {/* Placeholder for actual feedback content */}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Card>
    </Drawer>
  );
}