import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, MessageSquareText } from 'lucide-react';
import GuideCard from '@/components/ui/guide-card';
import { ImportExport } from '@/components/ui/UIComponents/ImportExport';
import RatioForm from './RatioForm';
import RatioCard from './RatioCard';
import { businessTypes, type BusinessType } from '../../../data/businessTypes';
import { allFeedbackRules, type FeedbackItem, type CalculatorType } from '../../../data/feedbackRules'; // Added CalculatorType
import { generateFeedback } from '../../../utils/feedbackUtils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FinancialData } from './types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FeedbackDrawer } from '../../../components/feedback/FeedbackDrawer'; // New FeedbackDrawer import

const initialFinancialData: FinancialData = {
  currentAssets: 0,
  inventory: 0,
  cash: 0,
  currentLiabilities: 0,
  totalAssets: 0,
  totalLiabilities: 0,
  shareholderEquity: 0,
  revenue: 0,
  cogs: 0,
  operatingIncome: 0,
  netIncome: 0,
  ebit: 0,
  interestExpense: 0,
  accountsReceivable: 0,
  previousRevenue: 0,
  previousNetIncome: 0,
};

export default function RatiosTab() {
  const [financialData, setFinancialData] = useState<FinancialData>(initialFinancialData);
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>(businessTypes[0]?.value || '');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isFeedbackDrawerOpen, setIsFeedbackDrawerOpen] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);

  const handleGetFeedback = () => {
    const selectedBizTypeData = businessTypes.find(bt => bt.value === selectedBusinessType);

    const calculatorData: Record<string, number | string | undefined> = {
      currentRatio: allCalculatedRatios.currentRatio,
      quickRatio: allCalculatedRatios.quickRatio,
      cashRatio: allCalculatedRatios.cashRatio,
      grossMargin: allCalculatedRatios.grossMargin,
      operatingMargin: allCalculatedRatios.operatingMargin,
      netMargin: allCalculatedRatios.netMargin,
      roa: allCalculatedRatios.roa,
      roe: allCalculatedRatios.roe,
      debtToEquity: allCalculatedRatios.debtToEquity,
      debtRatio: allCalculatedRatios.debtRatio,
      interestCoverage: allCalculatedRatios.interestCoverage,
      revenueGrowth: allCalculatedRatios.revenueGrowth,
      netIncomeGrowth: allCalculatedRatios.netIncomeGrowth,
    };

    const filteredCalculatorData = Object.entries(calculatorData)
      .filter(([_, value]) => value !== undefined && !isNaN(Number(value))) // Ensure value is defined and a number
      .reduce((obj, [key, value]) => {
        obj[key] = Number(value); // Store as number
        return obj;
      }, {} as Record<string, number | string>)

    const generatedItems = generateFeedback(
      filteredCalculatorData,
      selectedBizTypeData, // generateFeedback handles if this is undefined
      'ratios' as CalculatorType,
      allFeedbackRules
    );
    setFeedbackItems(generatedItems);
    setIsFeedbackDrawerOpen(true);
  };

  // Interface for the results of calculateRatios
  interface RatioCalculationResults {
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
    grossMargin: number;
    operatingMargin: number;
    netMargin: number;
    roa: number;
    roe: number;
    debtToEquity: number;
    debtRatio: number;
    interestCoverage: number;
    revenueGrowth: number;
    netIncomeGrowth: number;
    hasRequiredData: boolean; // Indicates if enough data is present for meaningful ratio calculation
  }

  // Calculate all ratios - memoized for performance
  const allCalculatedRatios = useMemo((): RatioCalculationResults => {
    const { 
      currentAssets, currentLiabilities, inventory, cash, 
      revenue, cogs, operatingIncome, netIncome, 
      totalAssets, shareholderEquity, totalLiabilities, 
      ebit, interestExpense, 
      previousRevenue, previousNetIncome 
    } = financialData;

    const currentRatio = currentLiabilities ? currentAssets / currentLiabilities : 0;
    const quickRatio = currentLiabilities ? (currentAssets - inventory) / currentLiabilities : 0;
    const cashRatio = currentLiabilities ? cash / currentLiabilities : 0;
    const grossMargin = revenue ? (revenue - cogs) / revenue * 100 : 0;
    const operatingMargin = revenue ? operatingIncome / revenue * 100 : 0;
    const netMargin = revenue ? netIncome / revenue * 100 : 0;
    const roa = totalAssets ? netIncome / totalAssets * 100 : 0;
    const roe = shareholderEquity ? netIncome / shareholderEquity * 100 : 0;
    const debtToEquity = shareholderEquity ? totalLiabilities / shareholderEquity : 0;
    const debtRatio = totalAssets ? totalLiabilities / totalAssets : 0;
    const interestCoverage = interestExpense ? ebit / interestExpense : 0;
    const revenueGrowth = previousRevenue ? (revenue - previousRevenue) / previousRevenue * 100 : 0;
    const netIncomeGrowth = previousNetIncome ? (netIncome - previousNetIncome) / previousNetIncome * 100 : 0;

    // Determine if enough key data points are filled for meaningful ratios
    const keyFieldsForRequiredData: (keyof FinancialData)[] = [
      'currentAssets', 'currentLiabilities', 'revenue', 'cogs', 
      'operatingIncome', 'totalAssets', 'totalLiabilities', 'shareholderEquity'
    ];
    const filledRequiredFields = keyFieldsForRequiredData.filter(field => financialData[field] !== 0 && financialData[field] !== undefined).length;
    const hasRequiredData = filledRequiredFields >= keyFieldsForRequiredData.length / 2; // Example: at least half are filled

    return {
      currentRatio, quickRatio, cashRatio, grossMargin, operatingMargin, netMargin,
      roa, roe, debtToEquity, debtRatio, interestCoverage, revenueGrowth, netIncomeGrowth,
      hasRequiredData
    };
  }, [financialData]);

  // Update completion percentage based on filled key fields
  useEffect(() => {
    const keyFieldsForProgress: (keyof FinancialData)[] = [
      'currentAssets', 'currentLiabilities', 'revenue', 'cogs',
      'operatingIncome', 'totalAssets', 'totalLiabilities', 'shareholderEquity'
      // 'inventory', 'cash', 'netIncome', 'ebit', 'interestExpense', 'accountsReceivable', 'previousRevenue', 'previousNetIncome' // Consider adding more if they are truly key for *initial* progress
    ];
    
    const filledFields = keyFieldsForProgress.filter(field => financialData[field] !== 0 && financialData[field] !== undefined).length;

    if (filledFields === 0) {
      setCompletionPercentage(0);
    } else if (filledFields <= 2) {
      setCompletionPercentage(25);
    } else if (filledFields <= 4) {
      setCompletionPercentage(50);
    } else if (filledFields <= 6) {
      setCompletionPercentage(75);
    } else {
      setCompletionPercentage(100);
    }
  }, [financialData]);

  // Handle data import from the ImportExport component
  const handleImportData = useCallback((importedData: unknown) => {
    try {
      // Type assertion for imported data structure
      const parsedData = importedData as { 
        data: Partial<FinancialData>; 
        selectedBusinessType?: string 
      };

      if (parsedData && typeof parsedData.data === 'object') {
        const updatedFinancialData = { ...initialFinancialData, ...financialData }; // Start with current, overlay with initial for safety, then new

        (Object.keys(parsedData.data) as Array<keyof FinancialData>).forEach(key => {
          const value = parsedData.data[key];
          if (typeof value === 'number') {
            updatedFinancialData[key] = value;
          }
        });
        setFinancialData(updatedFinancialData);

        if (typeof parsedData.selectedBusinessType === 'string') {
          setSelectedBusinessType(parsedData.selectedBusinessType);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, [financialData]); 
  
  // Wrapper for ImportExport's onImport prop
  const handleImportWrapper = useCallback((data: Record<string, unknown>) => {
    
    // We need to ensure `handleImportData` receives the nested 'data' and 'selectedBusinessType'.
    return handleImportData(data); 
  }, [handleImportData]);
  // Prepare data for export
  const exportData = useMemo(() => ({
    type: 'ratios' as const,
    data: { ...financialData },
    selectedBusinessType,
    // completionPercentage, // Not typically part of exported raw data, but can be kept if used by import logic
    timestamp: new Date().toISOString(),
    version: '1.0.1' // Updated version
  }), [financialData, selectedBusinessType]);

  // Effect to generate feedback when ratios or business type change
  useEffect(() => {
    if (allCalculatedRatios && allCalculatedRatios.hasRequiredData) {
      const currentBusinessTypeData = businessTypes.find(bt => bt.value === selectedBusinessType);
      if (currentBusinessTypeData) {
        const newFeedback = generateFeedback(
          allCalculatedRatios as any, // Pass all calculated ratios as metrics
          currentBusinessTypeData,
          'ratios',
          allFeedbackRules
        );
        setFeedbackItems(newFeedback);
      }
    } else {
      setFeedbackItems([]); // Clear feedback if not enough data
    }
  }, [allCalculatedRatios, selectedBusinessType]);

  // Determines the status/color for a ratio card
  const getRatioStatus = (ratio: number, type: string): 'good' | 'warning' | 'critical' => {
    if (isNaN(ratio) || !isFinite(ratio)) return 'warning'; // Handle NaN or Infinity

    // More nuanced status logic can be added here based on benchmarks
    if (type === 'margin' || type === 'growth' || type === 'roe' || type === 'roa') {
      return ratio > 15 ? 'good' : ratio >= 0 ? 'warning' : 'critical';
    }
    if (type === 'leverage_lower_better') { // e.g., debtToEquity, debtRatio
      return ratio < 0.5 ? 'good' : ratio < 1.5 ? 'warning' : 'critical';
    }
    if (type === 'coverage_higher_better') { // e.g., interestCoverage
        return ratio > 3 ? 'good' : ratio > 1 ? 'warning' : 'critical';
    }
    if (type === 'liquidity_higher_better') { // e.g., currentRatio, quickRatio, cashRatio
      return ratio > 1.5 ? 'good' : ratio > 0.8 ? 'warning' : 'critical';
    }
    return 'warning';
  };

  return (
    <>
      <div className="space-y-6 p-4 md:p-6 pb-24">
        <ImportExport 
          calculatorType="ratios"
          currentData={{ financialData, selectedBusinessType }} 
          onImport={handleImportData} 
        />
        
        <div className="my-4 flex justify-center">
          <Button onClick={handleGetFeedback} disabled={completionPercentage < 100}>
            <MessageSquareText className="mr-2 h-4 w-4" /> Get Feedback & Insights
          </Button>
        </div>

        <div className="space-y-2 p-4 border rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Calculation Progress</h3>
            <span className={`text-sm font-medium ${completionPercentage === 100 ? 'text-green-600' : 'text-blue-600'}`}>
              {completionPercentage}%
            </span>
          </div>
          <Progress value={completionPercentage} className="w-full mt-2" />
          <p className="text-xs text-muted-foreground">
            Complete key financial data to unlock full ratio analysis and tailored insights. Click the button below to see feedback.
          </p>

          <Button onClick={() => setIsFeedbackDrawerOpen(true)} variant="outline" className="w-full md:w-auto">
            <MessageSquareText className="mr-2 h-4 w-4" /> View Feedback & Insights
          </Button>

          <GuideCard 
            title="Understanding Financial Ratios"
            steps={[
              { title: "Enter Data:", description: "Input your company's financial figures into the form sections below." },
              { title: "Select Business Type:", description: "Choose your business type for tailored benchmarks and feedback." },
              { title: "Review Ratios:", description: "Analyze the calculated ratios across Liquidity, Profitability, Leverage, and Growth categories." },
              { title: "Check Feedback:", description: "Click 'View Feedback & Insights' for contextual advice based on your data and business type." }
            ]}
            interpretations={[
              { title: "Liquidity (e.g., Current Ratio):", description: "Ability to meet short-term debts. Higher is generally better, but too high can be inefficient." },
              { title: "Profitability (e.g., Net Margin):", description: "Efficiency in generating profit. Higher is better." },
              { title: "Leverage (e.g., Debt-to-Equity):", description: "Reliance on debt. Lower is often safer, but depends on industry." },
              { title: "Growth (e.g., Revenue Growth):", description: "Performance over time. Positive growth is desirable." }
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType" className="text-base font-medium">Select Business Type</Label>
          <Select value={selectedBusinessType} onValueChange={setSelectedBusinessType}>
            <SelectTrigger id="businessType" className="w-full md:w-1/2 lg:w-1/3" aria-label="Select your business type">
              <SelectValue placeholder="Select Business Type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <RatioForm data={financialData} onUpdate={setFinancialData} />

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">Financial Ratio Analysis</h2>
        
        {allCalculatedRatios.hasRequiredData && allCalculatedRatios.currentRatio > 0 && allCalculatedRatios.currentRatio < 1 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Liquidity Risk Warning</AlertTitle>
            <AlertDescription>
              Your current ratio is {allCalculatedRatios.currentRatio.toFixed(2)}x, indicating potential liquidity issues. Ensure you can cover short-term liabilities.
            </AlertDescription>
          </Alert>
        )}

        {!allCalculatedRatios.hasRequiredData && completionPercentage < 100 && (
            <Alert variant="default" className="mb-4 bg-blue-50 border-blue-300 text-blue-700">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle>More Data Needed for Full Analysis</AlertTitle>
                <AlertDescription>
                Please fill in all key financial fields to see a complete ratio analysis. Current progress: {completionPercentage}%.
                </AlertDescription>
            </Alert>
        )}

        <Tabs defaultValue="liquidity" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
            <TabsTrigger value="profitability">Profitability</TabsTrigger>
            <TabsTrigger value="leverage">Leverage</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="liquidity" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <RatioCard title="Current Ratio" value={allCalculatedRatios.currentRatio} formula="Current Assets / Current Liabilities" description="Measures short-term liquidity" status={getRatioStatus(allCalculatedRatios.currentRatio, 'liquidity_higher_better')} suffix="x" />
              <RatioCard title="Quick Ratio (Acid Test)" value={allCalculatedRatios.quickRatio} formula="(Current Assets - Inventory) / Current Liabilities" description="More conservative liquidity measure" status={getRatioStatus(allCalculatedRatios.quickRatio, 'liquidity_higher_better')} suffix="x" />
              <RatioCard title="Cash Ratio" value={allCalculatedRatios.cashRatio} formula="Cash / Current Liabilities" description="Most conservative liquidity measure" status={getRatioStatus(allCalculatedRatios.cashRatio, 'liquidity_higher_better')} suffix="x" />
            </div>
          </TabsContent>

          <TabsContent value="profitability" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <RatioCard title="Gross Margin" value={allCalculatedRatios.grossMargin} formula="(Revenue - COGS) / Revenue" description="Revenue retained after direct costs" status={getRatioStatus(allCalculatedRatios.grossMargin, 'margin')} suffix="%" />
              <RatioCard title="Operating Margin" value={allCalculatedRatios.operatingMargin} formula="Operating Income / Revenue" description="Revenue retained after operating costs" status={getRatioStatus(allCalculatedRatios.operatingMargin, 'margin')} suffix="%" />
              <RatioCard title="Net Margin" value={allCalculatedRatios.netMargin} formula="Net Income / Revenue" description="Revenue retained after all costs" status={getRatioStatus(allCalculatedRatios.netMargin, 'margin')} suffix="%" />
              <RatioCard title="Return on Assets (ROA)" value={allCalculatedRatios.roa} formula="Net Income / Total Assets" description="Efficiency of assets in generating earnings" status={getRatioStatus(allCalculatedRatios.roa, 'roa')} suffix="%" />
              <RatioCard title="Return on Equity (ROE)" value={allCalculatedRatios.roe} formula="Net Income / Shareholder Equity" description="Efficiency of equity in generating earnings" status={getRatioStatus(allCalculatedRatios.roe, 'roe')} suffix="%" />
            </div>
          </TabsContent>

          <TabsContent value="leverage" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <RatioCard title="Debt to Equity" value={allCalculatedRatios.debtToEquity} formula="Total Liabilities / Shareholder Equity" description="Proportion of debt to equity financing" status={getRatioStatus(allCalculatedRatios.debtToEquity, 'leverage_lower_better')} suffix="x" />
              <RatioCard title="Debt Ratio" value={allCalculatedRatios.debtRatio} formula="Total Liabilities / Total Assets" description="Proportion of assets financed by debt" status={getRatioStatus(allCalculatedRatios.debtRatio, 'leverage_lower_better')} suffix="x" />
              <RatioCard title="Interest Coverage" value={allCalculatedRatios.interestCoverage} formula="EBIT / Interest Expense" description="Ability to meet interest payments" status={getRatioStatus(allCalculatedRatios.interestCoverage, 'coverage_higher_better')} suffix="x" />
            </div>
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <RatioCard title="Revenue Growth" value={allCalculatedRatios.revenueGrowth} formula="(Current Rev - Prev Rev) / Prev Rev" description="Year-over-year revenue growth" status={getRatioStatus(allCalculatedRatios.revenueGrowth, 'growth')} suffix="%" />
              <RatioCard title="Net Income Growth" value={allCalculatedRatios.netIncomeGrowth} formula="(Current NI - Prev NI) / Prev NI" description="Year-over-year profit growth" status={getRatioStatus(allCalculatedRatios.netIncomeGrowth, 'growth')} suffix="%" />
            </div>
          </TabsContent>
        </Tabs>
      </div> {/* End of main content wrapper div */} 

      <FeedbackDrawer
        isOpen={isFeedbackDrawerOpen}
        onClose={() => setIsFeedbackDrawerOpen(false)}
        feedbackItems={feedbackItems}
        calculatorName="Ratios Analysis"
      />
    </>
  );
}