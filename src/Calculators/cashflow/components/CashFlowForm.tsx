import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import type { CashFlowItem } from '../types';

interface CashFlowFormProps {
  onUpdate: (items: CashFlowItem[]) => void;
  openingBalance: number;
  onOpeningBalanceChange: (balance: number) => void;
}

export default function CashFlowForm({ onUpdate, openingBalance, onOpeningBalanceChange }: CashFlowFormProps) {
  const [items, setItems] = useState<CashFlowItem[]>([
    {
      id: 'SalesRevenue',
      name: 'Sales Revenue',
      type: 'inflow',
      amount: 0,
      frequency: 'monthly',
      startMonth: 0,
      category: 'revenue'
    },
    {
      id: 'OtherIncome',
      name: 'Other Income',
      type: 'inflow',
      amount: 0,
      frequency: 'monthly',
      startMonth: 0,
      category: 'other'
    },
  ]);

  const updateItem = (index: number, field: keyof CashFlowItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { 
      ...updatedItems[index], 
      [field]: field === 'amount' ? Number(value) : value 
    };
    setItems(updatedItems);
    onUpdate(updatedItems);
  };

  const addItem = () => {
    const newItem: CashFlowItem = {
      id: `item-${Date.now()}`,
      name: '',
      type: 'inflow',
      amount: 0,
      frequency: 'monthly',
      startMonth: 0,
      category: 'other',
      notes: '',
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onUpdate(updatedItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onUpdate(newItems);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cash Flow Projection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="openingBalance">Opening Balance ($)</Label>
              <Input
                id="openingBalance"
                type="number"
                value={openingBalance}
                onChange={(e) => onOpeningBalanceChange(Number(e.target.value))}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Cash Flow Items</h3>
              <Button size="sm" onClick={addItem}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MinusCircle className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`name-${item.id}`}>Name</Label>
                    <Input
                      id={`name-${item.id}`}
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      placeholder="e.g., Sales, Rent, Utilities"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`type-${item.id}`}>Type</Label>
                    <Select
                      value={item.type}
                      onValueChange={(value) =>
                        updateItem(index, 'type', value as 'inflow' | 'outflow')
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inflow">Inflow</SelectItem>
                        <SelectItem value="outflow">Outflow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`amount-${item.id}`}>Amount ($)</Label>
                    <Input
                      id={`amount-${item.id}`}
                      type="number"
                      value={item.amount}
                      onChange={(e) => updateItem(index, 'amount', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`frequency-${item.id}`}>Frequency</Label>
                    <Select
                      value={item.frequency}
                      onValueChange={(value) =>
                        updateItem(
                          index,
                          'frequency',
                          value
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor={`notes-${item.id}`}>Notes (Optional)</Label>
                    <Textarea
                      id={`notes-${item.id}`}
                      value={item.notes || ''}
                      onChange={(e) => updateItem(index, 'notes', e.target.value)}
                      placeholder="Add any additional notes"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
