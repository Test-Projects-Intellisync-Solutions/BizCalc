import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CashFlow {
  id: string;
  name: string;
  type: 'inflow' | 'outflow';
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
}

export default function CashFlowForecast() {
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [months, setMonths] = useState<number>(12);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([
    { id: '1', name: 'Sales', type: 'inflow', amount: 0, frequency: 'monthly' },
    { id: '2', name: 'Expenses', type: 'outflow', amount: 0, frequency: 'monthly' },
  ]);

  const handleCashFlowChange = (id: string, field: keyof CashFlow, value: any) => {
    setCashFlows(flows => 
      flows.map(flow => flow.id === id ? { ...flow, [field]: value } : flow)
    );
  };

  const addCashFlow = (type: 'inflow' | 'outflow') => {
    setCashFlows([
      ...cashFlows,
      { 
        id: Date.now().toString(),
        name: type === 'inflow' ? 'New Income' : 'New Expense',
        type,
        amount: 0,
        frequency: 'monthly'
      }
    ]);
  };

  const removeCashFlow = (id: string) => {
    setCashFlows(flows => flows.filter(flow => flow.id !== id));
  };

  const generateForecastData = () => {
    const data = [];
    let balance = initialBalance;

    for (let month = 1; month <= months; month++) {
      let monthlyInflow = 0;
      let monthlyOutflow = 0;

      cashFlows.forEach(flow => {
        let amount = 0;
        
        switch (flow.frequency) {
          case 'monthly':
            amount = flow.amount;
            break;
          case 'quarterly':
            amount = month % 3 === 0 ? flow.amount : 0;
            break;
          case 'annually':
            amount = month === 12 ? flow.amount : 0;
            break;
        }

        if (flow.type === 'inflow') {
          monthlyInflow += amount;
        } else {
          monthlyOutflow += amount;
        }
      });

      const netFlow = monthlyInflow - monthlyOutflow;
      balance += netFlow;

      data.push({
        month: `Month ${month}`,
        inflow: monthlyInflow,
        outflow: monthlyOutflow,
        netFlow,
        balance
      });
    }

    return data;
  };

  const forecastData = generateForecastData();
  const finalBalance = forecastData[forecastData.length - 1]?.balance || initialBalance;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="initial">Initial Balance</Label>
              <Input
                id="initial"
                type="number"
                min="0"
                value={initialBalance || ''}
                onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Forecast Period</Label>
              <Select value={months.toString()} onValueChange={(value) => setMonths(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Cash Inflows</h3>
              <Button variant="outline" size="sm" onClick={() => addCashFlow('inflow')}>Add Income</Button>
            </div>

            {cashFlows.filter(f => f.type === 'inflow').map(flow => (
              <div key={flow.id} className="grid gap-4 sm:grid-cols-3 items-end p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor={`name-${flow.id}`}>Name</Label>
                  <Input
                    id={`name-${flow.id}`}
                    value={flow.name}
                    onChange={(e) => handleCashFlowChange(flow.id, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`amount-${flow.id}`}>Amount</Label>
                  <Input
                    id={`amount-${flow.id}`}
                    type="number"
                    min="0"
                    value={flow.amount || ''}
                    onChange={(e) => handleCashFlowChange(flow.id, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Label>Frequency</Label>
                    <Select 
                      value={flow.frequency} 
                      onValueChange={(value) => handleCashFlowChange(flow.id, 'frequency', value)}
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
                  <Button 
                    variant="ghost" 
                    className="mt-auto" 
                    onClick={() => removeCashFlow(flow.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Cash Outflows</h3>
              <Button variant="outline" size="sm" onClick={() => addCashFlow('outflow')}>Add Expense</Button>
            </div>

            {cashFlows.filter(f => f.type === 'outflow').map(flow => (
              <div key={flow.id} className="grid gap-4 sm:grid-cols-3 items-end p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor={`name-${flow.id}`}>Name</Label>
                  <Input
                    id={`name-${flow.id}`}
                    value={flow.name}
                    onChange={(e) => handleCashFlowChange(flow.id, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`amount-${flow.id}`}>Amount</Label>
                  <Input
                    id={`amount-${flow.id}`}
                    type="number"
                    min="0"
                    value={flow.amount || ''}
                    onChange={(e) => handleCashFlowChange(flow.id, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Label>Frequency</Label>
                    <Select 
                      value={flow.frequency} 
                      onValueChange={(value) => handleCashFlowChange(flow.id, 'frequency', value)}
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
                  <Button 
                    variant="ghost" 
                    className="mt-auto" 
                    onClick={() => removeCashFlow(flow.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {forecastData.length > 0 && (
            <>
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Ending Balance</p>
                      <p className={`text-2xl font-bold ${finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${finalBalance.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Net Change</p>
                      <p className={`text-2xl font-bold ${finalBalance - initialBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${(finalBalance - initialBalance).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="balance" stroke="hsl(var(--chart-1))" name="Balance" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="inflow" fill="hsl(var(--chart-2))" name="Cash Inflow" />
                      <Bar dataKey="outflow" fill="hsl(var(--chart-3))" name="Cash Outflow" />
                      <Bar dataKey="netFlow" fill="hsl(var(--chart-4))" name="Net Flow" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
          
          <Button className="w-full" onClick={() => console.log('Save forecast')}>
            Save Forecast
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}