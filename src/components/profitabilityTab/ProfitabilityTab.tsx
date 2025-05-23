import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingDown, TrendingUp, DollarSign, Target } from 'lucide-react';
import GuideCard from '@/components/ui/guide-card';
import ProfitabilityForm from './ProfitabilityForm';
import ProfitabilityChart from './ProfitabilityChart';
import SaveLoadControls from '@/components/common/SaveLoadControls';
import { useCalculatorSaveLoad } from '@/hooks/useCalculatorSaveLoad';

interface ProfitabilityTabState {
  metrics: {
    revenue: number;
    cogs: number;
    operatingExpenses: number;
    pricePerUnit: number;
    variableCostPerUnit: number;
    fixedCosts: number;
  };
}

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
    handleLoad
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

  // Handler for 'New' button
  const handleNew = () => {
    setMetrics({
      revenue: 0,
      cogs: 0,
      operatingExpenses: 0,
      pricePerUnit: 0,
      variableCostPerUnit: 0,
      fixedCosts: 0,
    });
    // If useCalculatorSaveLoad exposes a way to clear fileName/lastSaved, call it here
    // Otherwise, these will reset on next save/load
  };
 
  const saveState = useCallback(() => {
    const state: ProfitabilityTabState = {
      metrics
    };
    return handleSave(state);
  }, [metrics, handleSave]);

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

  const metricsData = calculateMetrics();
  const {
    grossProfit,
    grossMargin,
    netProfit,
    netMargin,
    contributionMargin,
    contributionMarginRatio,
    breakEvenUnits,
    breakEvenRevenue,
  } = metricsData;

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center gap-x-4 mb-4">
        <SaveLoadControls
          onNew={handleNew}
          onSave={saveState}
          onLoad={handleLoad}
          isSaving={isSaving}
          isLoading={isLoading}
          lastSaved={lastSaved}
          fileName={fileName}
        />
        <h2 className="text-2xl font-bold">Profitability Analysis</h2>
      </div>
      <GuideCard
        title="Profitability & Break-Even Analysis Guide"
        steps={[
          {
            title: "Enter Revenue",
            description: "Input your total revenue to calculate profitability"
          },
          {
            title: "Add Costs",
            description: "Enter COGS and operating expenses for accurate margins"
          },
          {
            title: "Price Analysis",
            description: "Set price per unit and variable costs for break-even analysis"
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
      <ProfitabilityForm
        onUpdate={setMetrics}
      />
      {netMargin < 5 && metrics.revenue > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Profit Margin Warning</AlertTitle>
          <AlertDescription>
            Your net profit margin is only {netMargin.toFixed(1)}%. Consider reducing costs or increasing prices to improve profitability.
          </AlertDescription>
        </Alert>
      )}
      {metrics.pricePerUnit > 0 && metrics.fixedCosts > 0 && (
        <ProfitabilityChart
          fixedCosts={metrics.fixedCosts}
          variableCostPerUnit={metrics.variableCostPerUnit}
          pricePerUnit={metrics.pricePerUnit}
          maxUnits={breakEvenUnits * 2}
        />
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
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
        <Card>
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
        <Card>
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
        
        <Card>
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

        <Card>
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

        <Card>
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

        <Card>
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
  );
}