import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import GuideCard from '@/components/ui/guide-card';
import { ImportExport } from '@/components/ui/UIComponents/ImportExport';
import RevenueForm, { type RevenueStream } from './RevenueForm';
import ExpenseForm, { type Expense } from './ExpenseForm';
import ProjectionChart from './ProjectionChart';

export default function ProjectionsTab() {
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [projectionMonths, setProjectionMonths] = useState(12);

  const handleImportData = (data: Record<string, unknown>) => {
    if (data.revenueStreams && Array.isArray(data.revenueStreams)) {
      setRevenueStreams(data.revenueStreams as RevenueStream[]);
    }
    if (data.expenses && Array.isArray(data.expenses)) {
      setExpenses(data.expenses as Expense[]);
    }
    if (data.projectionMonths && typeof data.projectionMonths === 'number') {
      setProjectionMonths(data.projectionMonths);
    }
  };

  const handleRevenueUpdate = (streams: RevenueStream[]) => {
    setRevenueStreams(streams);
  };

  const handleExpenseUpdate = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
  };

  const calculateTotals = () => {
    const totalRevenue = revenueStreams.reduce((sum, stream) => sum + stream.baseAmount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.type === 'fixed' ? expense.amount : 0), 0);
    const netCashFlow = totalRevenue - totalExpenses;

    return { totalRevenue, totalExpenses, netCashFlow };
  };

  const { totalRevenue, totalExpenses, netCashFlow } = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ImportExport 
          calculatorType="projections"
          currentData={{ revenueStreams, expenses, projectionMonths }}
          onImport={handleImportData}
        />
      </div>
      <GuideCard
        title="Revenue & Expense Projections Guide"
        steps={[
          {
            title: "Add Revenue Streams",
            description: "Enter each source of revenue and its expected growth pattern"
          },
          {
            title: "Input Expenses",
            description: "Add fixed and variable costs that your business will incur"
          },
          {
            title: "Set Projection Period",
            description: "Choose how far into the future you want to project (3-24 months)"
          },
          {
            title: "Analyze Trends",
            description: "Review the projected financial performance and adjust assumptions"
          }
        ]}
        interpretations={[
          {
            title: "Revenue Growth",
            description: "Upward trend indicates business expansion, flat or declining needs attention"
          },
          {
            title: "Expense Patterns",
            description: "Watch for expense growth outpacing revenue growth - may indicate scaling issues"
          },
          {
            title: "Net Cash Flow",
            description: "Positive and growing indicates healthy business model, negative suggests need for changes"
          }
        ]}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Revenue & Expense Projections</h2>
        <div className="flex items-center gap-4">
          <Label>Projection Period</Label>
          <Select
            value={projectionMonths.toString()}
            onValueChange={(value) => setProjectionMonths(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
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

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueForm onUpdate={handleRevenueUpdate} />
        <ExpenseForm onUpdate={handleExpenseUpdate} />
      </div>

      <ProjectionChart
        revenueStreams={revenueStreams}
        expenses={expenses}
        months={projectionMonths}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netCashFlow.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}