import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingDown, TrendingUp, DollarSign, Target } from 'lucide-react';
import SaveLoadControls from '@/components/common/SaveLoadControls';
import { useCalculatorSaveLoad } from '@/hooks/useCalculatorSaveLoad';
import ProfitabilityForm from './components/ProfitabilityForm';
import ProfitabilityChart from './components/ProfitabilityChart';
import type { ProfitabilityTabState, ProfitabilityResult } from './types';

export default function ProfitabilityTab() {
  const [metrics, setMetrics] = useState({
    revenue: 0,
    cogs: 0,
    operatingExpenses: 0,
    pricePerUnit: 0,
    variableCostPerUnit: 0,
    fixedCosts: 0,
  });

  const {
    isSaving,
    isLoading,
    lastSaved,
    fileName,
    handleSave,
    handleLoad,
    error,
    clearError,
  } = useCalculatorSaveLoad<ProfitabilityTabState>({
    calculatorType: 'profitability',
    onLoad: (data) => {
      setMetrics(data.metrics || {
        revenue: 0,
        cogs: 0,
        operatingExpenses: 0,
        pricePerUnit: 0,
        variableCostPerUnit: 0,
        fixedCosts: 0,
      });
    }
  });

  const calculateMetrics = useCallback((metricsData: typeof metrics): ProfitabilityResult => {
    const {
      revenue,
      cogs,
      operatingExpenses,
      pricePerUnit,
      variableCostPerUnit,
      fixedCosts,
    } = metricsData;

    const grossProfit = revenue - cogs;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const operatingIncome = grossProfit - operatingExpenses;
    const operatingMargin = revenue > 0 ? (operatingIncome / revenue) * 100 : 0;
    const netProfit = operatingIncome - fixedCosts;
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    
    const contributionMargin = pricePerUnit - variableCostPerUnit;
    const contributionMarginRatio = pricePerUnit > 0 ? (contributionMargin / pricePerUnit) * 100 : 0;
    
    const breakEvenUnits = contributionMargin > 0 
      ? Math.ceil(fixedCosts / contributionMargin) 
      : 0;
    
    const breakEvenRevenue = breakEvenUnits * pricePerUnit;

    return {
      grossProfit,
      grossMargin,
      operatingIncome,
      operatingMargin,
      netProfit,
      netMargin,
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      contributionMarginRatio,
    };
  }, []);

  const results = useMemo(() => calculateMetrics(metrics), [metrics, calculateMetrics]);

  const handleSaveClick = useCallback(async () => {
    await handleSave({ metrics });
  }, [handleSave, metrics]);

  const handleLoadClick = useCallback(async () => {
    await handleLoad();
  }, [handleLoad]);

  const handleNew = useCallback(() => {
    setMetrics({
      revenue: 0,
      cogs: 0,
      operatingExpenses: 0,
      pricePerUnit: 0,
      variableCostPerUnit: 0,
      fixedCosts: 0,
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Profitability Calculator</h2>
        <SaveLoadControls
          isSaving={isSaving}
          isLoading={isLoading}
          onSave={handleSaveClick}
          onLoad={handleLoadClick}
          onNew={handleNew}
          lastSaved={lastSaved}
          fileName={fileName}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message || String(error)}</AlertDescription>
          <button 
            onClick={clearError}
            className="ml-auto text-sm font-medium hover:underline"
          >
            Dismiss
          </button>
        </Alert>
      )}

      <ProfitabilityForm 
        onUpdate={setMetrics} 
        initialData={metrics} 
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profitability Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Gross Profit</p>
                <p className="text-2xl font-bold">
                  ${results.grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className={`text-sm ${results.grossMargin >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {results.grossMargin.toFixed(1)}% Margin
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Operating Income</p>
                <p className="text-2xl font-bold">
                  ${results.operatingIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className={`text-sm ${results.operatingMargin >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {results.operatingMargin.toFixed(1)}% Margin
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">
                  ${results.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className={`text-sm ${results.netMargin >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {results.netMargin.toFixed(1)}% Margin
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Break-Even Units</p>
                <p className="text-2xl font-bold">
                  {results.breakEvenUnits.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  ${results.breakEvenRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contribution Margin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Contribution Margin per Unit</p>
                <p className="text-2xl font-bold">
                  ${results.contributionMargin.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contribution Margin Ratio</p>
                <p className="text-2xl font-bold">
                  {results.contributionMarginRatio.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Break-Even Analysis</p>
              <p className="text-sm">
                You need to sell <span className="font-medium">{results.breakEvenUnits.toLocaleString()} units</span> at 
                ${metrics.pricePerUnit.toFixed(2)} each to break even.
              </p>
              <p className="text-sm mt-2">
                This generates <span className="font-medium">${results.breakEvenRevenue.toLocaleString()}</span> in revenue.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProfitabilityChart
        fixedCosts={metrics.fixedCosts}
        variableCostPerUnit={metrics.variableCostPerUnit}
        pricePerUnit={metrics.pricePerUnit}
        maxUnits={Math.max(1000, results.breakEvenUnits * 1.5)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Profitability Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.netMargin > 0 ? (
            <Alert>
              <TrendingUp className="h-4 w-4 text-green-500" />
              <AlertTitle>Healthy Profitability</AlertTitle>
              <AlertDescription>
                Your business is profitable with a net margin of {results.netMargin.toFixed(1)}%. 
                Consider reinvesting profits for growth or increasing operational efficiency.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <TrendingDown className="h-4 w-4" />
              <AlertTitle>Negative Profitability</AlertTitle>
              <AlertDescription>
                Your business is currently operating at a loss. Consider increasing prices, 
                reducing costs, or increasing sales volume to reach profitability.
              </AlertDescription>
            </Alert>
          )}

          {results.contributionMargin > 0 ? (
            <Alert>
              <DollarSign className="h-4 w-4 text-blue-500" />
              <AlertTitle>Positive Contribution Margin</AlertTitle>
              <AlertDescription>
                Each additional unit sold contributes ${results.contributionMargin.toFixed(2)} 
                towards covering fixed costs and profit.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <DollarSign className="h-4 w-4" />
              <AlertTitle>Negative Contribution Margin</AlertTitle>
              <AlertDescription>
                Each additional unit sold is losing money. Consider increasing prices or 
                reducing variable costs to achieve a positive contribution margin.
              </AlertDescription>
            </Alert>
          )}

          {results.breakEvenUnits > 0 && (
            <Alert>
              <Target className="h-4 w-4 text-purple-500" />
              <AlertTitle>Break-Even Analysis</AlertTitle>
              <AlertDescription>
                You need to sell {results.breakEvenUnits.toLocaleString()} units to cover all costs. 
                After this point, each additional unit sold contributes directly to profit.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
