import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import GuideCard from '@/components/ui/guide-card';
import { ImportExport } from '@/components/ui/UIComponents/ImportExport';
import RevenueForm, { type RevenueStream } from './RevenueForm';
import { businessTypes, type BusinessType } from '../../../data/businessTypes';
import ExpenseForm, { type Expense } from './ExpenseForm';
import ProjectionChart, { type HighlightPoint } from './ProjectionChart';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { allFeedbackRules, type FeedbackItem, type CalculatorType } from '../../../data/feedbackRules'; 
import { generateFeedback } from '../../../utils/feedbackUtils'; 
import { FeedbackDrawer } from '../../../components/feedback/FeedbackDrawer'; 
import { MessageSquareText } from 'lucide-react';

const getSummaryCardClassNameForProjections = (metricName: string, currentFeedbackItems: FeedbackItem[]): string => {
  const relevantFeedback = currentFeedbackItems.find(
    (item) => item.uiTarget?.scope === 'summaryMetric' && item.uiTarget?.identifier === metricName
  );

  if (relevantFeedback) {
    switch (relevantFeedback.severity) {
      case 'critical':
        return 'border-l-4 border-red-500';
      case 'warning':
        return 'border-l-4 border-yellow-500';
      case 'good':
        return 'border-l-4 border-green-500';
      default:
        return '';
    }
  }
  return '';
};

export default function ProjectionsTab() {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isFeedbackDrawerOpen, setIsFeedbackDrawerOpen] = useState(false); 
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [projectionMonths, setProjectionMonths] = useState(12);
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>(businessTypes[0]?.value || '');
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [chartHighlightPoints, setChartHighlightPoints] = useState<HighlightPoint[]>([]); 

  useEffect(() => {
    const newHighlightPoints = feedbackItems
      .filter(
        (item): item is FeedbackItem & { uiTarget: { scope: 'chart'; identifier: string; details: { monthIndex: number } } } =>
          item.uiTarget?.scope === 'chart' &&
          typeof item.uiTarget.identifier === 'string' &&
          item.uiTarget.details !== undefined && 
          typeof item.uiTarget.details.monthIndex === 'number'
      )
      .map((item): HighlightPoint | null => {
        const dataKey = item.uiTarget.identifier as HighlightPoint['dataKey'];
        if (['revenue', 'expenses', 'netCashFlow'].includes(dataKey)) {
          return {
            monthIndex: item.uiTarget.details.monthIndex,
            dataKey,
            severity: item.severity,
          };
        }
        return null;
      })
      .filter((point): point is HighlightPoint => point !== null);

    setChartHighlightPoints(newHighlightPoints);
  }, [feedbackItems]);

  const handleImportData = (data: Record<string, unknown>, importedFeedbackItems?: FeedbackItem[]) => {
    if (data.revenueStreams && Array.isArray(data.revenueStreams)) {
      setRevenueStreams(data.revenueStreams as RevenueStream[]);
    }
    if (data.expenses && Array.isArray(data.expenses)) {
      setExpenses(data.expenses as Expense[]);
    }
    if (data.projectionMonths && typeof data.projectionMonths === 'number') {
      setProjectionMonths(data.projectionMonths);
    }
    if (data.selectedBusinessType && typeof data.selectedBusinessType === 'string') {
      setSelectedBusinessType(data.selectedBusinessType);
    }
    if (importedFeedbackItems) {
      setFeedbackItems(importedFeedbackItems);
      if (importedFeedbackItems.length > 0) {
        setIsFeedbackDrawerOpen(true);
      }
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

  const handleGetFeedback = () => {
    const selectedBizTypeData = businessTypes.find(bt => bt.value === selectedBusinessType);
    const calculated = calculateTotals(); 

    const calculatorData: Record<string, number | string | undefined> = {
      totalRevenue: calculated.totalRevenue,
      totalExpenses: calculated.totalExpenses,
      netCashFlow: calculated.netCashFlow,
      projectionMonths,
      numberOfRevenueStreams: revenueStreams.length,
      numberOfExpenseCategories: expenses.length,
      expenseToRevenueRatio: calculated.totalRevenue > 0 ? (calculated.totalExpenses / calculated.totalRevenue) * 100 : undefined, // as percentage
      // Potentially add average revenue per stream, average expense amount etc.
      // Example: averageRevenuePerStream: revenueStreams.length > 0 ? calculated.totalRevenue / revenueStreams.length : 0,
    };

    const filteredCalculatorData = Object.entries(calculatorData)
      .filter(([_, value]) => value !== undefined && !isNaN(Number(value)))
      .reduce((obj, [key, value]) => {
        obj[key] = Number(value);
        return obj;
      }, {} as Record<string, number | string>);

    const generatedItems = generateFeedback(
      filteredCalculatorData,
      selectedBizTypeData,
      'projections' as CalculatorType,
      allFeedbackRules
    );
    setFeedbackItems(generatedItems);
    if (generatedItems.length > 0) {
      setIsFeedbackDrawerOpen(true);
    }
  };

  useEffect(() => {
    const newHighlightPoints: HighlightPoint[] = [];
    feedbackItems.forEach(item => {
      // Hypothetical check: if relevantMetrics contains specific chart highlight details
      // This structure would need to be populated by the feedback rule definition or generation logic
      if (item.relevantMetrics?.chartHighlightDetails) {
        const details = item.relevantMetrics.chartHighlightDetails as any;
        if (typeof details.monthIndex === 'number' && 
            typeof details.dataKey === 'string' && 
            ['revenue', 'expenses', 'netCashFlow'].includes(details.dataKey)) {
          newHighlightPoints.push({
            monthIndex: details.monthIndex, // Expects 0-indexed month
            dataKey: details.dataKey as 'revenue' | 'expenses' | 'netCashFlow',
            severity: item.severity,
          });
        }
      }
      // Alternative: Parse item.id or another field if rules are structured that way
      // Example: if an item.id is 'rule-proj-low-ncf-month-2', parse it to get monthIndex=1, dataKey='netCashFlow'
      // This would be more complex and rule-dependent.
    });
    setChartHighlightPoints(newHighlightPoints);
  }, [feedbackItems]);

  useEffect(() => {
    const hasRevenue = revenueStreams.some(stream => stream.baseAmount > 0);
    const hasExpenses = expenses.some(expense => expense.amount > 0);

    if (hasRevenue && hasExpenses) {
      setCompletionPercentage(100);
    } else if (hasRevenue || hasExpenses) {
      setCompletionPercentage(50);
    } else {
      setCompletionPercentage(0);
    }
  }, [revenueStreams, expenses]);

  return (
    <>
      <div className="space-y-6 p-4 md:p-6 pb-16">
      <div className="flex justify-end">
        <ImportExport 
          calculatorType="projections"
          currentData={{ revenueStreams, expenses, projectionMonths, selectedBusinessType }}
          currentFeedbackItems={feedbackItems}
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-bold">Revenue & Expense Projections</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label htmlFor="businessTypeSelectProjections">Business Type</Label>
            <Select
              value={selectedBusinessType}
              onValueChange={setSelectedBusinessType}
            >
              <SelectTrigger id="businessTypeSelectProjections" className="w-[200px]">
                <SelectValue placeholder="Select Business Type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type: BusinessType) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="projectionPeriodSelectProjections">Projection Period</Label>
            <Select
              value={projectionMonths.toString()}
              onValueChange={(value) => setProjectionMonths(parseInt(value))}
            >
              <SelectTrigger id="projectionPeriodSelectProjections" className="w-[180px]">
                <SelectValue placeholder="Select Period" />
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
      </div>

      {/* Progress Bar and Feedback Trigger Section - Commented out during development
      <div className="my-6 px-1">
        <div className="flex items-center gap-2 mb-1">
          <Label htmlFor="projectionsCompletionProgress" className="text-sm font-medium">Projections Setup Progress</Label>
          {completionPercentage === 100 && (
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={handleGetFeedback}>
              <MessageSquareText className="h-4 w-4 text-primary" />
              <span className="sr-only">View Feedback</span>
            </Button>
          )}
        </div>
        <Progress id="projectionsCompletionProgress" value={completionPercentage} className="w-full" />
      </div>
      */}

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueForm onUpdate={handleRevenueUpdate} />
        <ExpenseForm onUpdate={handleExpenseUpdate} />
      </div>

      <ProjectionChart
        revenueStreams={revenueStreams}
        expenses={expenses}
        months={projectionMonths}
        highlightDataPoints={chartHighlightPoints}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className={getSummaryCardClassNameForProjections('totalRevenue', feedbackItems)}>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className={getSummaryCardClassNameForProjections('totalExpenses', feedbackItems)}>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className={getSummaryCardClassNameForProjections('netCashFlow', feedbackItems)}>
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

      <FeedbackDrawer
        isOpen={isFeedbackDrawerOpen}
        onClose={() => setIsFeedbackDrawerOpen(false)}
        feedbackItems={feedbackItems}
        calculatorName="Financial Projections"
      />
    </>
  );
}