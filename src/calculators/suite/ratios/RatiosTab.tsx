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
// import { Progress } from '@/components/ui/progress'; // Commented out during development
import { FeedbackDrawer } from '../../../components/feedback/FeedbackDrawer'; // New FeedbackDrawer import

// Helper to determine border class based on feedback
const getRatioCardClassName = (ratioIdentifier: string, currentFeedbackItems: FeedbackItem[]): string => {
  const relevantFeedback = currentFeedbackItems.find(
    (item) => item.uiTarget?.scope === 'summaryMetric' && item.uiTarget?.identifier === ratioIdentifier
  );
  if (relevantFeedback && relevantFeedback.severity !== 'info') {
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

// Helper to determine status for RatioCard text color, ensuring type safety
const getSafeRatioStatusFromFeedback = (
  ratioIdentifier: string,
  currentFeedbackItems: FeedbackItem[]
): 'good' | 'warning' | 'critical' => {
  const relevantFeedback = currentFeedbackItems.find(
    (item) => item.uiTarget?.identifier === ratioIdentifier && item.severity !== 'info'
  );

  if (relevantFeedback) {
    // Because item.severity !== 'info' is part of the find condition,
    // relevantFeedback.severity here is guaranteed to be 'good', 'warning', or 'critical'.
    return relevantFeedback.severity as 'good' | 'warning' | 'critical'; // Explicit cast for robustness
  }
  return 'good'; // Default status if no specific, non-info feedback is found
};

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
    // completionPercentage, // Not typically part of exported raw data, but can be kept if to beused by import logic
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

  return (
    <>
      <div className="space-y-6 p-4 md:p-6 pb-24">
        <ImportExport 
          calculatorType="ratios"
          currentData={{ ...financialData, selectedBusinessType } as Record<string, unknown>} 
          currentFeedbackItems={feedbackItems}
          onImport={(data, importedFeedbackItems?: FeedbackItem[]) => {
            setFinancialData(data as unknown as FinancialData); 
            if (importedFeedbackItems) {
              setFeedbackItems(importedFeedbackItems);
              if (importedFeedbackItems.length > 0) {
                setIsFeedbackDrawerOpen(true);
              }
            }
          }} 
        />
        
       

        {/* Progress indicator section commented out during development
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
        </div>
        */}

         

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
              <RatioCard title="Current Ratio" value={allCalculatedRatios.currentRatio} formula="Current Assets / Current Liabilities" description="Measures short-term liquidity" className={getRatioCardClassName('currentRatio', feedbackItems)} status={getSafeRatioStatusFromFeedback('currentRatio', feedbackItems)} suffix="x" />
              <RatioCard title="Quick Ratio (Acid Test)" value={allCalculatedRatios.quickRatio} formula="(Current Assets - Inventory) / Current Liabilities" description="More conservative liquidity measure" className={getRatioCardClassName('quickRatio', feedbackItems)} status={getSafeRatioStatusFromFeedback('quickRatio', feedbackItems)} suffix="x" />
              <RatioCard title="Cash Ratio" value={allCalculatedRatios.cashRatio} formula="Cash / Current Liabilities" description="Most conservative liquidity measure" className={getRatioCardClassName('cashRatio', feedbackItems)} status={getSafeRatioStatusFromFeedback('cashRatio', feedbackItems)} suffix="x" />
            </div>
          </TabsContent>

          <TabsContent value="profitability" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <RatioCard title="Gross Margin" value={allCalculatedRatios.grossMargin} formula="(Revenue - COGS) / Revenue" description="Revenue retained after direct costs" className={getRatioCardClassName('grossMargin', feedbackItems)} status={getSafeRatioStatusFromFeedback('grossMargin', feedbackItems)} suffix="%" />
              <RatioCard title="Operating Margin" value={allCalculatedRatios.operatingMargin} formula="Operating Income / Revenue" description="Revenue retained after operating costs" className={getRatioCardClassName('operatingMargin', feedbackItems)} status={getSafeRatioStatusFromFeedback('operatingMargin', feedbackItems)} suffix="%" />
              <RatioCard title="Net Margin" value={allCalculatedRatios.netMargin} formula="Net Income / Revenue" description="Revenue retained after all costs" className={getRatioCardClassName('netMargin', feedbackItems)} status={getSafeRatioStatusFromFeedback('netMargin', feedbackItems)} suffix="%" />
              <RatioCard title="Return on Assets (ROA)" value={allCalculatedRatios.roa} formula="Net Income / Total Assets" description="Efficiency of assets in generating earnings" className={getRatioCardClassName('roa', feedbackItems)} status={getSafeRatioStatusFromFeedback('roa', feedbackItems)} suffix="%" />
              <RatioCard title="Return on Equity (ROE)" value={allCalculatedRatios.roe} formula="Net Income / Shareholder Equity" description="Efficiency of equity in generating earnings" className={getRatioCardClassName('roe', feedbackItems)} status={getSafeRatioStatusFromFeedback('roe', feedbackItems)} suffix="%" />
            </div>
          </TabsContent>

          <TabsContent value="leverage" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <RatioCard title="Debt to Equity" value={allCalculatedRatios.debtToEquity} formula="Total Liabilities / Shareholder Equity" description="Proportion of debt to equity financing" className={getRatioCardClassName('debtToEquity', feedbackItems)} status={getSafeRatioStatusFromFeedback('debtToEquity', feedbackItems)} suffix="x" />
              <RatioCard title="Debt Ratio" value={allCalculatedRatios.debtRatio} formula="Total Liabilities / Total Assets" description="Proportion of assets financed by debt" className={getRatioCardClassName('debtRatio', feedbackItems)} status={getSafeRatioStatusFromFeedback('debtRatio', feedbackItems)} suffix="x" />
              <RatioCard title="Interest Coverage" value={allCalculatedRatios.interestCoverage} formula="EBIT / Interest Expense" description="Ability to meet interest payments" className={getRatioCardClassName('interestCoverage', feedbackItems)} status={getSafeRatioStatusFromFeedback('interestCoverage', feedbackItems)} suffix="x" />
            </div>
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <RatioCard title="Revenue Growth" value={allCalculatedRatios.revenueGrowth} formula="(Current Rev - Prev Rev) / Prev Rev" description="Year-over-year revenue growth" className={getRatioCardClassName('revenueGrowth', feedbackItems)} status={getSafeRatioStatusFromFeedback('revenueGrowth', feedbackItems)} suffix="%" />
              <RatioCard title="Net Income Growth" value={allCalculatedRatios.netIncomeGrowth} formula="(Current NI - Prev NI) / Prev NI" description="Year-over-year profit growth" className={getRatioCardClassName('netIncomeGrowth', feedbackItems)} status={getSafeRatioStatusFromFeedback('netIncomeGrowth', feedbackItems)} suffix="%" />
            </div>
          </TabsContent>
        </Tabs>

      <FeedbackDrawer
        isOpen={isFeedbackDrawerOpen}
        onClose={() => setIsFeedbackDrawerOpen(false)}
        feedbackItems={feedbackItems}
        calculatorName="Ratios Analysis"
      />
    </>
  );
}