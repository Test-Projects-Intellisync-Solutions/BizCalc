import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';

interface RevenueItem {
  id: string;
  name: string;
  amount: number;
  description?: string;
}

interface ExpenseItem extends RevenueItem {}

export default function RevenueVsExpensesCalculator() {
  // Predefined revenue categories with descriptions
  const initialRevenues: RevenueItem[] = [
    { 
      id: 'rev-1', 
      name: 'Product Sales', 
      amount: 0,
      description: 'Revenue from selling physical or digital products'
    },
    { 
      id: 'rev-2', 
      name: 'Service Revenue', 
      amount: 0,
      description: 'Income from providing services to customers'
    },
    { 
      id: 'rev-3', 
      name: 'Subscription Income', 
      amount: 0,
      description: 'Recurring revenue from subscription-based services'
    },
    { 
      id: 'rev-4', 
      name: 'Other Income', 
      amount: 0,
      description: 'Any other sources of revenue not listed above'
    },
  ];

  // Predefined expense categories with descriptions
  const initialExpenses: ExpenseItem[] = [
    { 
      id: 'exp-1', 
      name: 'Salaries & Wages', 
      amount: 0,
      description: 'Employee compensation including salaries, wages, and benefits'
    },
    { 
      id: 'exp-2', 
      name: 'Rent & Utilities', 
      amount: 0,
      description: 'Office space rent, electricity, water, internet, and other utilities'
    },
    { 
      id: 'exp-3', 
      name: 'Marketing', 
      amount: 0,
      description: 'Advertising, promotions, and other marketing expenses'
    },
    { 
      id: 'exp-4', 
      name: 'Supplies', 
      amount: 0,
      description: 'Office supplies, materials, and other consumables'
    },
    { 
      id: 'exp-5', 
      name: 'Insurance', 
      amount: 0,
      description: 'Business insurance policies and coverage'
    },
    { 
      id: 'exp-6', 
      name: 'Other Expenses', 
      amount: 0,
      description: 'Any other business expenses not listed above'
    },
  ];

  const [revenues, setRevenues] = useState<RevenueItem[]>(initialRevenues);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);

  // Calculate totals
  const totalRevenue = revenues.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const netIncome = totalRevenue - totalExpenses;

  // Handle input changes
  const handleRevenueChange = (id: string, value: string) => {
    setRevenues(revenues.map(item => 
      item.id === id ? { ...item, amount: parseFloat(value) || 0 } : item
    ));
  };

  const handleExpenseChange = (id: string, value: string) => {
    setExpenses(expenses.map(item => 
      item.id === id ? { ...item, amount: parseFloat(value) || 0 } : item
    ));
  };

  // Reset all values
  const handleReset = () => {
    setRevenues(initialRevenues.map(item => ({ ...item, amount: 0 })));
    setExpenses(initialExpenses.map(item => ({ ...item, amount: 0 })));
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Revenue vs Expenses Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  Revenue
                </h3>
                <span className="font-medium">{formatCurrency(totalRevenue)}</span>
              </div>
              
              <div className="space-y-3">
                {revenues.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <TooltipWrapper content={item.description || 'No description available'}>
                        <Label htmlFor={item.id} className="min-w-[120px] flex items-center gap-1">
                          {item.name}
                        </Label>
                      </TooltipWrapper>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <Input
                          id={item.id}
                          type="number"
                          min="0"
                          value={item.amount || ''}
                          onChange={(e) => handleRevenueChange(item.id, e.target.value)}
                          placeholder="0.00"
                          className="pl-7"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expenses Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-5 w-5" />
                  Expenses
                </h3>
                <span className="font-medium">{formatCurrency(totalExpenses)}</span>
              </div>
              
              <div className="space-y-3">
                {expenses.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <TooltipWrapper content={item.description || 'No description available'}>
                        <Label htmlFor={item.id} className="min-w-[120px] flex items-center gap-1">
                          {item.name}
                        </Label>
                      </TooltipWrapper>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <Input
                          id={item.id}
                          type="number"
                          min="0"
                          value={item.amount || ''}
                          onChange={(e) => handleExpenseChange(item.id, e.target.value)}
                          placeholder="0.00"
                          className="pl-7"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">Total Revenue</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-700">Total Expenses</p>
                <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className={`p-4 rounded-lg ${
                netIncome >= 0 ? 'bg-blue-50' : 'bg-amber-50'
              }`}>
                <p className="text-sm">Net {netIncome >= 0 ? 'Income' : 'Loss'}</p>
                <p className={`text-2xl font-bold ${
                  netIncome >= 0 ? 'text-blue-700' : 'text-amber-700'
                }`}>
                  {formatCurrency(Math.abs(netIncome))}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
