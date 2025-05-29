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

  const handleImportData = (data: Record<string, unknown>, importedFeedbackItems?: FeedbackItem[]) => {
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
    if (importedFeedbackItems) {
      setFeedbackItems(importedFeedbackItems);
      if (importedFeedbackItems.length > 0) {
        setIsFeedbackDrawerOpen(true);
      }
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

  const chartHighlights = React.useMemo(() => {
    return feedbackItems
      .filter(
        (item) =>
          item.uiTarget?.scope === 'chart' &&
          item.uiTarget.identifier && 
          typeof item.uiTarget.details?.monthIndex === 'number' &&
          typeof item.uiTarget.details?.dataKey === 'string'
      )
      .map((item) => ({
        monthIndex: item.uiTarget!.details!.monthIndex as number,
        dataKey: item.uiTarget!.details!.dataKey as 'balance' | 'inflows' | 'outflows' | 'netCashFlow',
        severity: item.severity,
      }));
  }, [feedbackItems]);

  const handleGetFeedback = () => {
    const selectedBizTypeData = businessTypes.find(bt => bt.value === selectedBusinessType);
    const businessTypeSpecificData = selectedBizTypeData?.benchmarks || {};

    let allGeneratedFeedback: FeedbackItem[] = [];

    // Calculate detailed monthly data first to get total expenses for averages and other metrics
    let runningBalance = openingBalance;
    let totalOverallExpenses = 0;
    const monthlyDataForCalculations = Array.from({ length: projectionMonths }, (_, monthIndex) => {
      let monthInflows = 0;
      let monthOutflows = 0;
      items.forEach(item => {
        const itemAmount = item.amount || 0;
        const itemStartMonth = item.startMonth === undefined ? 1 : item.startMonth; // Default to 1 if not set
        const currentProcessingMonth = monthIndex + 1; // 1-indexed month

        if (item.category === 'inflow') {
          if (item.frequency === 'monthly') monthInflows += itemAmount;
          else if (item.frequency === 'quarterly' && (currentProcessingMonth - itemStartMonth + 1) % 3 === 1 && currentProcessingMonth >= itemStartMonth) monthInflows += itemAmount;
          else if (item.frequency === 'annually' && (currentProcessingMonth - itemStartMonth + 1) % 12 === 1 && currentProcessingMonth >= itemStartMonth) monthInflows += itemAmount;
        } else {
          if (item.frequency === 'monthly') monthOutflows += itemAmount;
          else if (item.frequency === 'quarterly' && (currentProcessingMonth - itemStartMonth + 1) % 3 === 1 && currentProcessingMonth >= itemStartMonth) monthOutflows += itemAmount;
          else if (item.frequency === 'annually' && (currentProcessingMonth - itemStartMonth + 1) % 12 === 1 && currentProcessingMonth >= itemStartMonth) monthOutflows += itemAmount;
        }
      });
      totalOverallExpenses += monthOutflows;
      const currentMonthNetCashFlow = monthInflows - monthOutflows;
      runningBalance += currentMonthNetCashFlow;
      return {
        monthIndex, // 0-indexed
        month: monthIndex + 1, // 1-indexed for messages
        currentMonthInflows: monthInflows,
        currentMonthOutflows: monthOutflows,
        currentMonthNetCashFlow,
        currentMonthEndingBalance: runningBalance,
      };
    });

    const averageMonthlyOverallExpenses = projectionMonths > 0 ? totalOverallExpenses / projectionMonths : 0;
    const halfAverageMonthlyOverallExpenses = averageMonthlyOverallExpenses / 2;
    const finalEndingBalance = monthlyDataForCalculations.length > 0 ? monthlyDataForCalculations[monthlyDataForCalculations.length - 1].currentMonthEndingBalance : openingBalance;
    const totalNetCashFlowOverall = monthlyDataForCalculations.reduce((sum, month) => sum + month.currentMonthNetCashFlow, 0);
    const averageNetCashFlowOverall = projectionMonths > 0 ? totalNetCashFlowOverall / projectionMonths : 0;

    // Prepare data for overall feedback rules
    const overallCalculatorData = {
      openingBalance,
      projectionMonths,
      completionPercentage,
      endingBalance: finalEndingBalance,
      averageNetCashFlow: averageNetCashFlowOverall,
      totalInflows: monthlyDataForCalculations.reduce((sum, m) => sum + m.currentMonthInflows, 0),
      totalOutflows: totalOverallExpenses,
      averageMonthlyOverallExpenses,
      halfAverageMonthlyOverallExpenses,
      ...businessTypeSpecificData,
    };

    const overallFeedback = generateFeedback(
      overallCalculatorData,
      selectedBizTypeData,
      'cashflow' as CalculatorType,
      allFeedbackRules
    );
    allGeneratedFeedback = allGeneratedFeedback.concat(overallFeedback);

    // Generate feedback for each month using pre-calculated monthlyDataForCalculations
    monthlyDataForCalculations.forEach(monthDetail => {
      const monthCalculatorData = {
        ...monthDetail, // Contains month, monthIndex, currentMonthInflows, etc.
        openingBalance, 
        projectionMonths, 
        completionPercentage,
        averageMonthlyOverallExpenses, // For context in monthly rules
        halfAverageMonthlyOverallExpenses, // For context in monthly rules
        ...businessTypeSpecificData,
      };

      const monthFeedbackItems = generateFeedback(
        monthCalculatorData,
        selectedBizTypeData,
        'cashflow' as CalculatorType,
        allFeedbackRules
      );

      // Add monthIndex to uiTarget.details for chart highlighting
      const processedMonthFeedback = monthFeedbackItems.map(fbItem => {
        if (
          fbItem.uiTarget &&
          fbItem.uiTarget.scope === 'chart' &&
          fbItem.uiTarget.identifier === 'cashFlowChart' &&
          fbItem.uiTarget.details && typeof fbItem.uiTarget.details.dataKey === 'string'
        ) {
          return {
            ...fbItem,
            uiTarget: {
              ...fbItem.uiTarget,
              details: {
                ...fbItem.uiTarget.details,
                monthIndex: monthDetail.monthIndex, // Ensure 0-indexed monthIndex is attached
              },
            },
          };
        }
        return fbItem;
      });
      allGeneratedFeedback = allGeneratedFeedback.concat(processedMonthFeedback);
    });

    // Deduplicate and sort feedback
    const finalFeedbackMap = new Map<string, FeedbackItem>();
    allGeneratedFeedback.forEach(item => {
      const key = `${item.title}-${item.message}-${item.severity}-${item.uiTarget?.details?.monthIndex ?? 'overall'}`;
      if (!finalFeedbackMap.has(key)) {
        finalFeedbackMap.set(key, item);
      }
    });
    const finalFeedback = Array.from(finalFeedbackMap.values()).sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, good: 2, info: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

    setFeedbackItems(finalFeedback);
    if (finalFeedback.length > 0) {
      setIsFeedbackDrawerOpen(true);
    }
  };

  const getSummaryCardClassNameForCashFlow = (identifier: string, currentFeedbackItems: FeedbackItem[]): string => {
    const relevantFeedback = currentFeedbackItems.filter(
      (item) =>
        item.uiTarget?.scope === 'summaryMetric' &&
        item.uiTarget?.identifier === identifier
    );

    if (relevantFeedback.length === 0) {
      return '';
    }

    let highestSeverity: FeedbackItem['severity'] = 'info';
    if (relevantFeedback.some((item) => item.severity === 'critical')) {
      highestSeverity = 'critical';
    } else if (relevantFeedback.some((item) => item.severity === 'warning')) {
      highestSeverity = 'warning';
    } else if (relevantFeedback.some((item) => item.severity === 'good')) {
      highestSeverity = 'good';
    }

    switch (highestSeverity) {
      case 'critical':
        return 'border-l-4 border-red-500';
      case 'warning':
        return 'border-l-4 border-yellow-500';
      case 'good':
        return 'border-l-4 border-green-500';
      case 'info':
        return 'border-l-4 border-blue-500';
      default:
        return '';
    }
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
          currentData={{ items, openingBalance, projectionMonths, selectedBusinessType }}
          currentFeedbackItems={feedbackItems} // Added currentFeedbackItems
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
        highlightDataPoints={chartHighlights}
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

        <Card className={getSummaryCardClassNameForCashFlow('netCashFlow', feedbackItems)}>
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