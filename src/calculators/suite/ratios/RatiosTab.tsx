import { useState, useCallback, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import GuideCard from '@/components/ui/guide-card';
import { ImportExport } from '@/components/ui/UIComponents/ImportExport';
import RatioForm from './RatioForm';
import RatioCard from './RatioCard';
import { FinancialData } from './types';

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

  // Handle data import from the ImportExport component
  const handleImportData = useCallback((data: unknown) => {
    try {
      const parsedData = data as Partial<FinancialData>;
      const updatedData = { ...financialData };
      
      // Only update fields that exist in the imported data and are numbers
      (Object.keys(parsedData) as Array<keyof FinancialData>).forEach(key => {
        const value = parsedData[key];
        if (typeof value === 'number') {
          updatedData[key] = value;
        }
      });
      
      setFinancialData(updatedData);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, [financialData]);
  
  // Handle import from the ImportExport component
  const handleImportWrapper = useCallback((data: Record<string, unknown>) => {
    return handleImportData(data);
  }, [handleImportData]);

  // Prepare data for export - ensure it matches the ExportData type expected by ImportExport
  const exportData = useMemo(() => ({
    type: 'ratios' as const,
    data: { ...financialData },
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }), [financialData]);

  const calculateRatios = () => {
    // Liquidity Ratios
    const currentRatio = financialData.currentLiabilities ? 
      financialData.currentAssets / financialData.currentLiabilities : 0;
    
    const quickRatio = financialData.currentLiabilities ?
      (financialData.currentAssets - financialData.inventory) / financialData.currentLiabilities : 0;
    
    const cashRatio = financialData.currentLiabilities ?
      financialData.cash / financialData.currentLiabilities : 0;

    // Profitability Ratios
    const grossMargin = financialData.revenue ?
      ((financialData.revenue - financialData.cogs) / financialData.revenue) * 100 : 0;
    
    const operatingMargin = financialData.revenue ?
      (financialData.operatingIncome / financialData.revenue) * 100 : 0;
    
    const netMargin = financialData.revenue ?
      (financialData.netIncome / financialData.revenue) * 100 : 0;
    
    const roa = financialData.totalAssets ?
      (financialData.netIncome / financialData.totalAssets) * 100 : 0;
    
    const roe = financialData.shareholderEquity ?
      (financialData.netIncome / financialData.shareholderEquity) * 100 : 0;

    // Leverage Ratios
    const debtToEquity = financialData.shareholderEquity ?
      financialData.totalLiabilities / financialData.shareholderEquity : 0;
    
    const debtRatio = financialData.totalAssets ?
      financialData.totalLiabilities / financialData.totalAssets : 0;
    
    const interestCoverage = financialData.interestExpense ?
      financialData.ebit / financialData.interestExpense : 0;

    // Growth Ratios
    const revenueGrowth = financialData.previousRevenue ?
      ((financialData.revenue - financialData.previousRevenue) / financialData.previousRevenue) * 100 : 0;
    
    const netIncomeGrowth = financialData.previousNetIncome ?
      ((financialData.netIncome - financialData.previousNetIncome) / financialData.previousNetIncome) * 100 : 0;

    return {
      currentRatio,
      quickRatio,
      cashRatio,
      grossMargin,
      operatingMargin,
      netMargin,
      roa,
      roe,
      debtToEquity,
      debtRatio,
      interestCoverage,
      revenueGrowth,
      netIncomeGrowth,
    };
  };

  const ratios = calculateRatios();

  const getRatioStatus = (ratio: number, type: string) => {
    switch (type) {
      case 'currentRatio':
        return ratio >= 2 ? 'good' : ratio >= 1 ? 'warning' : 'critical';
      case 'quickRatio':
        return ratio >= 1 ? 'good' : ratio >= 0.5 ? 'warning' : 'critical';
      case 'margin':
        return ratio >= 15 ? 'good' : ratio >= 5 ? 'warning' : 'critical';
      case 'growth':
        return ratio >= 10 ? 'good' : ratio >= 0 ? 'warning' : 'critical';
      case 'leverage':
        return ratio <= 1 ? 'good' : ratio <= 2 ? 'warning' : 'critical';
      default:
        return 'warning';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ImportExport 
          calculatorType="ratios"
          currentData={exportData}
          onImport={handleImportWrapper}
        />
      </div>
      <GuideCard
        title="Financial Ratios Analysis Guide"
        steps={[
          {
            title: "Input Financial Data",
            description: "Enter your balance sheet and income statement figures"
          },
          {
            title: "Select Ratio Category",
            description: "Choose between Liquidity, Profitability, Leverage, or Growth ratios"
          },
          {
            title: "Review Results",
            description: "Analyze each ratio's value and status indicator"
          },
          {
            title: "Compare Benchmarks",
            description: "Check how your ratios compare to industry standards"
          }
        ]}
        interpretations={[
          {
            title: "Green Status",
            description: "Ratio is within healthy range for your industry"
          },
          {
            title: "Yellow Status",
            description: "Ratio needs attention but isn't critical"
          },
          {
            title: "Red Status",
            description: "Immediate action required to improve this metric"
          }
        ]}
      />
      <h2 className="text-3xl font-bold">Financial Ratio Analysis</h2>

      {ratios.currentRatio < 1 && financialData.currentLiabilities > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Liquidity Risk Warning</AlertTitle>
          <AlertDescription>
            Your current ratio is below 1.0, indicating potential difficulty meeting short-term obligations.
          </AlertDescription>
        </Alert>
      )}

      <RatioForm data={financialData} onUpdate={setFinancialData} />

      <Tabs defaultValue="liquidity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="leverage">Leverage</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="liquidity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RatioCard
              title="Current Ratio"
              value={ratios.currentRatio}
              formula="Current Assets / Current Liabilities"
              description="Measures ability to pay short-term obligations"
              status={getRatioStatus(ratios.currentRatio, 'currentRatio')}
              suffix="x"
            />
            <RatioCard
              title="Quick Ratio"
              value={ratios.quickRatio}
              formula="(Current Assets - Inventory) / Current Liabilities"
              description="Measures immediate ability to pay short-term obligations"
              status={getRatioStatus(ratios.quickRatio, 'quickRatio')}
              suffix="x"
            />
            <RatioCard
              title="Cash Ratio"
              value={ratios.cashRatio}
              formula="Cash / Current Liabilities"
              description="Most conservative liquidity measure"
              status={getRatioStatus(ratios.cashRatio, 'quickRatio')}
              suffix="x"
            />
          </div>
        </TabsContent>

        <TabsContent value="profitability" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RatioCard
              title="Gross Margin"
              value={ratios.grossMargin}
              formula="(Revenue - COGS) / Revenue"
              description="Percentage of revenue retained after direct costs"
              status={getRatioStatus(ratios.grossMargin, 'margin')}
              suffix="%"
            />
            <RatioCard
              title="Operating Margin"
              value={ratios.operatingMargin}
              formula="Operating Income / Revenue"
              description="Percentage of revenue retained after operating costs"
              status={getRatioStatus(ratios.operatingMargin, 'margin')}
              suffix="%"
            />
            <RatioCard
              title="Net Margin"
              value={ratios.netMargin}
              formula="Net Income / Revenue"
              description="Percentage of revenue retained after all costs"
              status={getRatioStatus(ratios.netMargin, 'margin')}
              suffix="%"
            />
            <RatioCard
              title="Return on Assets"
              value={ratios.roa}
              formula="Net Income / Total Assets"
              description="How efficiently assets generate earnings"
              status={getRatioStatus(ratios.roa, 'margin')}
              suffix="%"
            />
            <RatioCard
              title="Return on Equity"
              value={ratios.roe}
              formula="Net Income / Shareholder Equity"
              description="How efficiently equity generates earnings"
              status={getRatioStatus(ratios.roe, 'margin')}
              suffix="%"
            />
          </div>
        </TabsContent>

        <TabsContent value="leverage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RatioCard
              title="Debt to Equity"
              value={ratios.debtToEquity}
              formula="Total Liabilities / Shareholder Equity"
              description="Proportion of debt to equity financing"
              status={getRatioStatus(ratios.debtToEquity, 'leverage')}
              suffix="x"
            />
            <RatioCard
              title="Debt Ratio"
              value={ratios.debtRatio}
              formula="Total Liabilities / Total Assets"
              description="Proportion of assets financed by debt"
              status={getRatioStatus(ratios.debtRatio, 'leverage')}
              suffix="x"
            />
            <RatioCard
              title="Interest Coverage"
              value={ratios.interestCoverage}
              formula="EBIT / Interest Expense"
              description="Ability to meet interest payments"
              status={getRatioStatus(1/ratios.interestCoverage, 'leverage')}
              suffix="x"
            />
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <RatioCard
              title="Revenue Growth"
              value={ratios.revenueGrowth}
              formula="(Current Revenue - Previous Revenue) / Previous Revenue"
              description="Year-over-year revenue growth rate"
              status={getRatioStatus(ratios.revenueGrowth, 'growth')}
              suffix="%"
            />
            <RatioCard
              title="Net Income Growth"
              value={ratios.netIncomeGrowth}
              formula="(Current Net Income - Previous Net Income) / Previous Net Income"
              description="Year-over-year profit growth rate"
              status={getRatioStatus(ratios.netIncomeGrowth, 'growth')}
              suffix="%"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}