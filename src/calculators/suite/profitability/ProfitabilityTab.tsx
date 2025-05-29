import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingDown, TrendingUp, DollarSign, Target, MessageSquareText } from 'lucide-react';
import GuideCard from '@/components/ui/guide-card';
import { ImportExport } from '@/components/ui/UIComponents/ImportExport';
import ProfitabilityForm from './ProfitabilityForm';
import { businessTypes, type BusinessType } from '../../../data/businessTypes';
import { allFeedbackRules, type FeedbackItem, type CalculatorType } from '../../../data/feedbackRules'; 
import { generateFeedback } from '../../../utils/feedbackUtils'; 
import { FeedbackDrawer } from '../../../components/feedback/FeedbackDrawer'; 
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProfitabilityChart from './ProfitabilityChart';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function ProfitabilityTab() {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isFeedbackDrawerOpen, setIsFeedbackDrawerOpen] = useState(false); 
  const [metrics, setMetrics] = useState({
    revenue: 0,
    cogs: 0,
    operatingExpenses: 0,
    pricePerUnit: 0,
    variableCostPerUnit: 0,
    fixedCosts: 0,
  });
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>(businessTypes[0]?.value || '');
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]); 

  const handleImportData = (data: Record<string, unknown>, importedFeedbackItems?: FeedbackItem[]) => {
    if (data.metrics && typeof data.metrics === 'object') {
      setMetrics(prevMetrics => ({
        ...prevMetrics,
        ...(data.metrics as object)
      }));
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

  const calculateMetrics = () => {
    const grossProfit = metrics.revenue - metrics.cogs;
    const grossMargin = metrics.revenue ? (grossProfit / metrics.revenue) * 100 : 0;
    
    const netProfit = grossProfit - metrics.operatingExpenses;
    const netMargin = metrics.revenue ? (netProfit / metrics.revenue) * 100 : 0;
    
    const contributionMargin = metrics.pricePerUnit - metrics.variableCostPerUnit;
    const contributionMarginRatio = metrics.pricePerUnit ? (contributionMargin / metrics.pricePerUnit) * 100 : 0;
    
    const breakEvenUnits = contributionMargin ? Math.ceil(metrics.fixedCosts / contributionMargin) : 0;
    const breakEvenRevenue = breakEvenUnits * metrics.pricePerUnit;

    return {
      grossProfit,
      grossMargin,
      netProfit,
      netMargin,
      contributionMargin,
      contributionMarginRatio,
      breakEvenUnits,
      breakEvenRevenue,
    };
  };

  const {
    grossProfit,
    grossMargin,
    netProfit,
    netMargin,
    contributionMargin,
    contributionMarginRatio,
    breakEvenUnits,
    breakEvenRevenue,
  } = calculateMetrics();

  const highlightDataPoints = feedbackItems.filter(
    (item) => item.uiTarget?.scope === 'chart'
  );

  const handleGetFeedback = () => {
    const selectedBizTypeData = businessTypes.find(bt => bt.value === selectedBusinessType);
    const calculated = calculateMetrics(); 

    const calculatorData: Record<string, number | string | undefined> = {
      grossMargin: calculated.grossMargin,
      netMargin: calculated.netMargin,
      contributionMarginRatio: calculated.contributionMarginRatio,
      breakEvenUnits: calculated.breakEvenUnits,
      breakEvenRevenue: calculated.breakEvenRevenue,
      revenue: metrics.revenue,
      cogs: metrics.cogs,
      operatingExpenses: metrics.operatingExpenses,
      fixedCosts: metrics.fixedCosts,
      pricePerUnit: metrics.pricePerUnit,
      variableCostPerUnit: metrics.variableCostPerUnit,
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
      'profitability' as CalculatorType,
      allFeedbackRules
    );
    setFeedbackItems(generatedItems);
    setIsFeedbackDrawerOpen(true);
  };

  useEffect(() => {
    const coreProfitabilityComplete = metrics.revenue > 0 && metrics.cogs >= 0 && metrics.operatingExpenses > 0;
    const unitEconomicsComplete = metrics.pricePerUnit > 0 && metrics.variableCostPerUnit >= 0 && metrics.fixedCosts > 0;

    let score = 0;
    if (coreProfitabilityComplete) score++;
    if (unitEconomicsComplete) score++;

    if (score === 0) setCompletionPercentage(0);
    else if (score === 1) setCompletionPercentage(50);
    else setCompletionPercentage(100);
  }, [metrics]);

  const getSummaryCardClassNameForProfitability = (metricName: string, currentFeedbackItems: FeedbackItem[]): string => {
    const relevantFeedback = currentFeedbackItems.find(
      (item) => item.uiTarget?.scope === 'summaryMetric' && item.uiTarget?.identifier === metricName
    );

    if (relevantFeedback) {
      switch (relevantFeedback.severity) {
        case 'critical':
          return 'border-l-4 border-red-500';
        case 'warning':
          return 'border-l-4 border-yellow-500';
        case 'good': // Corrected from 'success'
          return 'border-l-4 border-green-500';
        default:
          return '';
      }
    }
    return '';
  };

  return (
    <>
      <div className="space-y-6 p-4 md:p-6 pb-16">
      <div className="flex justify-end">
        <ImportExport 
          calculatorType="profitability"
          currentData={{ metrics, selectedBusinessType }}
          currentFeedbackItems={feedbackItems}
          onImport={handleImportData}
        />
      </div>
      <GuideCard
        title="Profitability & Break-Even Analysis Guide"
        steps={[
          {
            title: "Enter Revenue Data",
            description: "Input your total revenue and cost of goods sold"
          },
          {
            title: "Add Operating Expenses",
            description: "Include all fixed and variable costs of running your business"
          },
          {
            title: "Set Unit Economics",
            description: "Enter price per unit and costs to calculate break-even point"
          },
          {
            title: "Review Metrics",
            description: "Analyze margins, profitability ratios, and break-even analysis"
          }
        ]}
        interpretations={[
          {
            title: "Gross Margin > 50%",
            description: "Strong product economics, good pricing power"
          },
          {
            title: "Net Margin < 10%",
            description: "Consider cost reduction or pricing strategies"
          },
          {
            title: "Break-Even Point",
            description: "Lower number means less risk and faster path to profitability"
          }
        ]}
      />

      <div className="flex items-center justify-start gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Label htmlFor="businessTypeSelectProfitability">Business Type</Label>
          <Select
            value={selectedBusinessType}
            onValueChange={setSelectedBusinessType}
          >
            <SelectTrigger id="businessTypeSelectProfitability" className="w-[200px]">
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
        {/* Placeholder for other potential global selectors for this tab */}
      </div>

      {/* Progress Bar and Feedback Trigger Section - Commented out during development
      <div className="my-6 px-1">
        <div className="flex items-center gap-2 mb-1">
          <Label htmlFor="profitabilityCompletionProgress" className="text-sm font-medium">Analysis Progress</Label>
          {completionPercentage === 100 && (
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={handleGetFeedback}>
              <MessageSquareText className="h-4 w-4 text-primary" />
              <span className="sr-only">View Feedback</span>
            </Button>
          )}
        </div>
        <Progress id="profitabilityCompletionProgress" value={completionPercentage} className="w-full" />
      </div>
      */}

      <h2 className="text-3xl font-bold">Profitability & Break-Even Analysis</h2>

      {netMargin < 5 && metrics.revenue > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Profit Margin Warning</AlertTitle>
          <AlertDescription>
            Your net profit margin is only {netMargin.toFixed(1)}%. Consider reducing costs or increasing prices to improve profitability.
          </AlertDescription>
        </Alert>
      )}

      <ProfitabilityForm onUpdate={setMetrics} />

      {metrics.pricePerUnit > 0 && metrics.fixedCosts > 0 && (
        <ProfitabilityChart
          fixedCosts={metrics.fixedCosts}
          variableCostPerUnit={metrics.variableCostPerUnit}
          pricePerUnit={metrics.pricePerUnit}
          maxUnits={breakEvenUnits * 2}
          highlightDataPoints={highlightDataPoints} // Pass the derived highlights
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className={getSummaryCardClassNameForProfitability('grossMargin', feedbackItems)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Gross Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {grossMargin.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Gross Profit: ${grossProfit.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className={getSummaryCardClassNameForProfitability('netMargin', feedbackItems)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Net Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${netMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netMargin.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Net Profit: ${netProfit.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className={getSummaryCardClassNameForProfitability('contributionMarginRatio', feedbackItems)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-purple-600" />
              Contribution Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {contributionMarginRatio.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Per Unit: ${contributionMargin.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className={getSummaryCardClassNameForProfitability('breakEvenUnits', feedbackItems)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Break-Even Point
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              {breakEvenUnits.toLocaleString()} units
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Revenue: ${breakEvenRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>

      <FeedbackDrawer
        isOpen={isFeedbackDrawerOpen}
        onClose={() => setIsFeedbackDrawerOpen(false)}
        feedbackItems={feedbackItems}
        calculatorName="Profitability Analysis"
      />
    </>
  );
}