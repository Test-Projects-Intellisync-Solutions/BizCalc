import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingDown, TrendingUp, MessageSquareText } from 'lucide-react';
import GuideCard from '@/components/ui/guide-card';
import { ImportExport } from '@/components/ui/UIComponents/ImportExport';
import CashFlowForm, { type CashFlowItem } from './CashFlowForm';
import { businessTypes, type BusinessType } from '../../../data/businessTypes';
import { allFeedbackRules, type FeedbackItem, type CalculatorType } from '../../../data/feedbackRules'; 
import { generateFeedback } from '../../../utils/feedbackUtils'; 
import { FeedbackDrawer } from '../../../components/feedback/FeedbackDrawer'; 
import CashFlowChart from './CashFlowChart';
import { Progress } from '@/components/ui/progress';

export default function CashFlowTab() {
  const [items, setItems] = useState<CashFlowItem[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isFeedbackDrawerOpen, setIsFeedbackDrawerOpen] = useState(false); 
  const [openingBalance, setOpeningBalance] = useState(0);
  const [projectionMonths, setProjectionMonths] = useState(12);
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>(businessTypes[0]?.value || '');
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]); 

  const handleImportData = (data: Record<string, unknown>) => {
    if (data.items && Array.isArray(data.items)) {
      setItems(data.items as CashFlowItem[]);
    }
    if (data.openingBalance && typeof data.openingBalance === 'number') {
      setOpeningBalance(data.openingBalance);
    }
    if (data.projectionMonths && typeof data.projectionMonths === 'number') {
      setProjectionMonths(data.projectionMonths);
    }
    if (data.selectedBusinessType && typeof data.selectedBusinessType === 'string') {
      setSelectedBusinessType(data.selectedBusinessType);
    }
  };

  const handleItemsUpdate = (newItems: CashFlowItem[]) => {
    setItems(newItems);
  };

  const calculateMetrics = () => {
    const inflows = items
      .filter((item) => item.category === 'inflow')
      .reduce((sum, item) => sum + item.amount, 0);

    const outflows = items
      .filter((item) => item.category === 'outflow')
      .reduce((sum, item) => sum + item.amount, 0);

    const monthlyNetCashFlow = inflows - outflows;
    const runway = outflows > 0 ? openingBalance / outflows : Infinity;

    return { inflows, outflows, monthlyNetCashFlow, runway };
  };

  const { inflows, outflows, monthlyNetCashFlow, runway } = calculateMetrics();

  const handleGetFeedback = () => {
    const selectedBizTypeData = businessTypes.find(bt => bt.value === selectedBusinessType);
    
    const calculatedMetrics = calculateMetrics(); 

    const calculatorData: Record<string, number | string | undefined> = {
      monthlyNetCashFlow: calculatedMetrics.monthlyNetCashFlow,
      cashRunwayMonths: calculatedMetrics.runway === Infinity ? 999 : calculatedMetrics.runway, 
      totalInflows: calculatedMetrics.inflows,
      totalOutflows: calculatedMetrics.outflows,
      openingBalance: openingBalance,
      // Add other relevant metrics from 'items' if needed for specific rules, e.g., specific inflow/outflow categories
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
      'cashflow' as CalculatorType,
      allFeedbackRules
    );
    setFeedbackItems(generatedItems);
    setIsFeedbackDrawerOpen(true);
  };

  useEffect(() => {
    const hasOpeningBalance = openingBalance > 0;
    const hasInflows = items.some(item => item.category === 'inflow' && item.amount > 0);
    const hasOutflows = items.some(item => item.category === 'outflow' && item.amount > 0);

    let score = 0;
    if (hasOpeningBalance) score++;
    if (hasInflows) score++;
    if (hasOutflows) score++;

    if (score === 0) setCompletionPercentage(0);
    else if (score === 1) setCompletionPercentage(33);
    else if (score === 2) setCompletionPercentage(66);
    else setCompletionPercentage(100);
  }, [items, openingBalance]);

  return (
    <>
      <div className="space-y-6 p-4 md:p-6 pb-16">
      <div className="flex justify-end">
        <ImportExport 
          calculatorType="cashflow"
          currentData={{ items, openingBalance, projectionMonths, selectedBusinessType, completionPercentage }}
          onImport={handleImportData}
        />
      </div>
      <GuideCard
        title="Cash Flow Management Guide"
        steps={[
          {
            title: "Set Opening Balance",
            description: "Enter your current cash position to start tracking cash flow"
          },
          {
            title: "Add Cash Inflows",
            description: "Input all sources of incoming cash (sales, investments, etc.)"
          },
          {
            title: "Add Cash Outflows",
            description: "Enter all cash payments and expenses"
          },
          {
            title: "Review Projections",
            description: "Analyze your cash position over time and identify potential shortfalls"
          }
        ]}
        interpretations={[
          {
            title: "Positive Net Cash Flow",
            description: "Your business is generating more cash than it's spending - healthy position"
          },
          {
            title: "Negative Net Cash Flow",
            description: "You're spending more than you're earning - action needed to prevent cash shortfall"
          },
          {
            title: "Cash Runway",
            description: "Shows how long your current cash will last at your current burn rate"
          }
        ]}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Cash Flow Management</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label htmlFor="businessTypeSelect">Business Type</Label>
            <Select
              value={selectedBusinessType}
              onValueChange={setSelectedBusinessType}
            >
              <SelectTrigger id="businessTypeSelect" className="w-[200px]">
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
            <Label htmlFor="projectionPeriodSelect">Projection Period</Label>
            <Select
              value={projectionMonths.toString()}
              onValueChange={(value) => setProjectionMonths(parseInt(value))}
            >
              <SelectTrigger id="projectionPeriodSelect" className="w-[180px]">
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

      {/* Progress Bar and Feedback Trigger Section */}
      <div className="my-6 px-1"> {/* Adjusted padding to align with other elements */}
        <div className="flex items-center gap-2 mb-1">
          <Label htmlFor="cashflowCompletionProgress" className="text-sm font-medium">Setup Progress</Label>
          {completionPercentage === 100 && (
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={handleGetFeedback}>
              <MessageSquareText className="h-4 w-4 text-primary" />
              <span className="sr-only">View Feedback</span>
            </Button>
          )}
        </div>
        <Progress id="cashflowCompletionProgress" value={completionPercentage} className="w-full" />
      </div>

      {monthlyNetCashFlow < 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Cash Flow Warning</AlertTitle>
          <AlertDescription>
            Your monthly cash burn rate is ${Math.abs(monthlyNetCashFlow).toLocaleString()}. 
            At this rate, your cash runway is {runway === Infinity ? '∞' : `${runway.toFixed(1)} months`}.
          </AlertDescription>
        </Alert>
      )}

      <CashFlowForm
        onUpdate={handleItemsUpdate}
        openingBalance={openingBalance}
        onOpeningBalanceChange={setOpeningBalance}
      />

      <CashFlowChart
        items={items}
        openingBalance={openingBalance}
        months={projectionMonths}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Monthly Inflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${inflows.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Monthly Outflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              ${outflows.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Monthly Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${monthlyNetCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${monthlyNetCashFlow.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {monthlyNetCashFlow >= 0
                ? 'Positive cash flow - business is generating more than it spends'
                : 'Negative cash flow - business is spending more than it generates'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>

      <FeedbackDrawer
        isOpen={isFeedbackDrawerOpen}
        onClose={() => setIsFeedbackDrawerOpen(false)}
        feedbackItems={feedbackItems}
        calculatorName="Cash Flow Analysis"
      />
    </>
  );
}