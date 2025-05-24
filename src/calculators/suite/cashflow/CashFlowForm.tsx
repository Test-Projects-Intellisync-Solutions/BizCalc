import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, MinusCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';

export interface CashFlowItem {
  id: string;
  name: string;
  category: 'inflow' | 'outflow';
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  notes?: string;
}

interface CashFlowFormProps {
  onUpdate: (items: CashFlowItem[]) => void;
  openingBalance: number;
  onOpeningBalanceChange: (balance: number) => void;
}

export default function CashFlowForm({ onUpdate, openingBalance, onOpeningBalanceChange }: CashFlowFormProps) {
  const exampleValues = {
    openingBalance: '10,000',
    amount: '2,500'
  };
  const [items, setItems] = useState<CashFlowItem[]>([
    {
      id: '1',
      name: 'Sales Revenue',
      category: 'inflow',
      amount: 0,
      frequency: 'monthly',
    },
    {
      id: '2',
      name: 'Operating Expenses',
      category: 'outflow',
      amount: 0,
      frequency: 'monthly',
    },
  ]);

  const handleItemChange = (index: number, field: keyof CashFlowItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: typeof value === 'string' && field === 'amount'
        ? (value === '' ? 0 : parseFloat(value) || 0)
        : value,
    };
    setItems(newItems);
    onUpdate(newItems);
  };
  
  const handleOpeningBalanceChange = (value: string) => {
    onOpeningBalanceChange(value === '' ? 0 : parseFloat(value) || 0);
  };

  const addItem = (category: 'inflow' | 'outflow') => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: `${category === 'inflow' ? 'Income' : 'Expense'} ${items.length + 1}`,
        category,
        amount: 0,
        frequency: 'monthly',
      },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onUpdate(newItems);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
          <CardTitle>Opening Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Starting Cash Position</Label>
              <Tooltip>
                <TooltipTrigger type="button">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The amount of cash available at the start of your projection period.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              min="0"
              value={openingBalance === 0 ? '' : openingBalance}
              onChange={(e) => handleOpeningBalanceChange(e.target.value)}
              placeholder={exampleValues.openingBalance}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Cash Inflows */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Inflows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {items
              .filter((item) => item.category === 'inflow')
              .map((item, index) => (
                <div key={item.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label>Income Source</Label>
                      <Tooltip>
                        <TooltipTrigger type="button">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>E.g., Product Sales, Service Revenue, Investments</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(items.indexOf(item))}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>

                  <Input
                    value={item.name}
                    onChange={(e) => handleItemChange(items.indexOf(item), 'name', e.target.value)}
                    placeholder="e.g., Sales Revenue"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        min="0"
                        value={item.amount === 0 ? '' : item.amount}
                        onChange={(e) => handleItemChange(items.indexOf(item), 'amount', parseFloat(e.target.value) || 0)}
                        placeholder={exampleValues.amount}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select
                        value={item.frequency}
                        onValueChange={(value) => handleItemChange(items.indexOf(item), 'frequency', value)}
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
                  </div>

                  <div className="space-y-2">
                    <Label>Notes (Optional)</Label>
                    <Textarea
                      value={item.notes}
                      onChange={(e) => handleItemChange(items.indexOf(item), 'notes', e.target.value)}
                      placeholder="Add any relevant notes..."
                    />
                  </div>
                </div>
              ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => addItem('inflow')}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Income Source
            </Button>
          </CardContent>
        </Card>

        {/* Cash Outflows */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Outflows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {items
              .filter((item) => item.category === 'outflow')
              .map((item, index) => (
                <div key={item.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label>Expense Name</Label>
                      <Tooltip>
                        <TooltipTrigger type="button">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>E.g., Rent, Salaries, Utilities, Supplies</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(items.indexOf(item))}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>

                  <Input
                    value={item.name}
                    onChange={(e) => handleItemChange(items.indexOf(item), 'name', e.target.value)}
                    placeholder="e.g., Office Rent"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        min="0"
                        value={item.amount === 0 ? '' : item.amount}
                        onChange={(e) => handleItemChange(items.indexOf(item), 'amount', parseFloat(e.target.value) || 0)}
                        placeholder={exampleValues.amount}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select
                        value={item.frequency}
                        onValueChange={(value) => handleItemChange(items.indexOf(item), 'frequency', value)}
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
                  </div>

                  <div className="space-y-2">
                    <Label>Notes (Optional)</Label>
                    <Textarea
                      value={item.notes}
                      onChange={(e) => handleItemChange(items.indexOf(item), 'notes', e.target.value)}
                      placeholder="Add any relevant notes..."
                    />
                  </div>
                </div>
              ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => addItem('outflow')}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>
    </TooltipProvider>
  );
}