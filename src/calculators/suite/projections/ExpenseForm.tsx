import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, MinusCircle } from 'lucide-react';

export interface Expense {
  id: string;
  name: string;
  type: 'fixed' | 'variable';
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  variableRate?: number;
}

interface ExpenseFormProps {
  onUpdate: (expenses: Expense[]) => void;
}

export default function ExpenseForm({ onUpdate }: ExpenseFormProps) {
  const exampleValues = {
    amount: '2,500',
    variableRate: '10.00'
  };

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      name: 'Operating Expenses',
      type: 'fixed',
      amount: 0,
      frequency: 'monthly',
    },
  ]);

  const handleExpenseChange = (index: number, field: keyof Expense, value: string | number) => {
    const newExpenses = [...expenses];
    newExpenses[index] = {
      ...newExpenses[index],
      [field]: typeof value === 'string' && (field === 'amount' || field === 'variableRate')
        ? (value === '' ? 0 : parseFloat(value) || 0)
        : value,
    };
    setExpenses(newExpenses);
    onUpdate(newExpenses);
  };

  const addExpense = () => {
    setExpenses([
      ...expenses,
      {
        id: Date.now().toString(),
        name: `Expense ${expenses.length + 1}`,
        type: 'fixed',
        amount: 0,
        frequency: 'monthly',
      },
    ]);
  };

  const removeExpense = (index: number) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
    onUpdate(newExpenses);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {expenses.map((expense, index) => (
          <div key={expense.id} className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <Label>Expense Name</Label>
              {expenses.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExpense(index)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Input
              value={expense.name}
              onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
              placeholder="e.g., Rent"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={expense.type}
                  onValueChange={(value) => handleExpenseChange(index, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="variable">Variable (% of Revenue)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={expense.frequency}
                  onValueChange={(value) => handleExpenseChange(index, 'frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {expense.type === 'fixed' ? (
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    min="0"
                    value={expense.amount === 0 ? '' : expense.amount}
                    onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                    placeholder={exampleValues.amount}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Percentage of Revenue</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={expense.variableRate === 0 ? '' : (expense.variableRate || 0)}
                    onChange={(e) => handleExpenseChange(index, 'variableRate', e.target.value)}
                    placeholder={exampleValues.variableRate}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addExpense}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </CardContent>
    </Card>
  );
}