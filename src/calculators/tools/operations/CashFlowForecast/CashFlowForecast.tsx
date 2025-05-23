import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, MinusCircle } from 'lucide-react';

export interface CashFlowItem {
  id: string;
  name: string;
  category: 'inflow' | 'outflow';
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  notes?: string;
}

export default function CashFlowForecast() {
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
  
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [projectionMonths, setProjectionMonths] = useState<number>(12);

  const handleItemChange = (index: number, field: keyof CashFlowItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'amount' ? Number(value) : value,
    };
    setItems(newItems);
  };

  const addItem = () => {
    const newItem: CashFlowItem = {
      id: Date.now().toString(),
      name: '',
      category: 'outflow',
      amount: 0,
      frequency: 'monthly',
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateProjection = useMemo(() => {
    const projection = [];
    let currentBalance = openingBalance;

    for (let month = 1; month <= projectionMonths; month++) {
      let monthlyInflow = 0;
      let monthlyOutflow = 0;

      items.forEach(item => {
        let amount = 0;
        
        // Apply frequency
        if (item.frequency === 'monthly' || 
            (item.frequency === 'quarterly' && month % 3 === 0) ||
            (item.frequency === 'annually' && month % 12 === 0)) {
          amount = item.amount;
        }

        if (item.category === 'inflow') {
          monthlyInflow += amount;
        } else {
          monthlyOutflow += amount;
        }
      });

      const netCashFlow = monthlyInflow - monthlyOutflow;
      currentBalance += netCashFlow;

      projection.push({
        month,
        inflow: monthlyInflow,
        outflow: monthlyOutflow,
        netCashFlow,
        balance: currentBalance,
      });
    }

    return projection;
  }, [items, openingBalance, projectionMonths]);

  const totalInflow = useMemo(
    () => items
      .filter(item => item.category === 'inflow')
      .reduce((sum, item) => sum + item.amount, 0),
    [items]
  );

  const totalOutflow = useMemo(
    () => items
      .filter(item => item.category === 'outflow')
      .reduce((sum, item) => sum + item.amount, 0),
    [items]
  );

  const netCashFlow = totalInflow - totalOutflow;
  const endBalance = openingBalance + netCashFlow * (projectionMonths / 12);
  
  // Format currency for display
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
          <CardTitle>Cash Flow Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Total Inflow</div>
              <div className="text-2xl font-bold">{formatCurrency(totalInflow)}</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Total Outflow</div>
              <div className="text-2xl font-bold">{formatCurrency(totalOutflow)}</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Net Cash Flow</div>
              <div className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netCashFlow)}
              </div>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="text-sm font-medium text-primary">Projected End Balance</div>
              <div className={`text-2xl font-bold ${endBalance >= openingBalance ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(endBalance)}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="opening-balance">Opening Balance ($)</Label>
              <Input
                id="opening-balance"
                type="number"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projection-months">Projection Period (months)</Label>
              <Select
                value={projectionMonths.toString()}
                onValueChange={(value) => setProjectionMonths(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                  <SelectItem value="36">36 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Cash Flow Items</h3>
              <Button onClick={addItem} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                  <div className="md:col-span-3 space-y-1">
                    <Label>Name</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      placeholder="e.g., Sales, Rent"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <Label>Type</Label>
                    <Select
                      value={item.category}
                      onValueChange={(value: 'inflow' | 'outflow') => 
                        handleItemChange(index, 'category', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inflow">Inflow</SelectItem>
                        <SelectItem value="outflow">Outflow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <Label>Amount ($)</Label>
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <Label>Frequency</Label>
                    <Select
                      value={item.frequency}
                      onValueChange={(value: 'monthly' | 'quarterly' | 'annually') => 
                        handleItemChange(index, 'frequency', value)
                      }
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
                  <div className="md:col-span-2 space-y-1">
                    <Label>Notes</Label>
                    <Input
                      value={item.notes || ''}
                      onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                      placeholder="Optional notes"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <MinusCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Total Inflow</div>
              <div className="text-2xl font-bold text-green-600">
                ${totalInflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Total Outflow</div>
              <div className="text-2xl font-bold text-red-600">
                ${totalOutflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Net Cash Flow</div>
              <div className={`text-2xl font-bold ${
                netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${Math.abs(netCashFlow).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {netCashFlow >= 0 ? ' (Positive)' : ' (Negative)'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Projection ({projectionMonths} months)</h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Inflow</TableHead>
                    <TableHead className="text-right">Outflow</TableHead>
                    <TableHead className="text-right">Net Cash Flow</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calculateProjection.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell className="font-medium">Month {row.month}</TableCell>
                      <TableCell className="text-right">
                        ${row.inflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        ${row.outflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={`text-right ${
                        row.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${Math.abs(row.netCashFlow).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        row.balance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${row.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
