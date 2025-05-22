import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';
import SaveLoadControls from '@/components/common/SaveLoadControls';
import { useCalculatorSaveLoad } from '@/hooks/useCalculatorSaveLoad';
import CashFlowForm from './components/CashFlowForm';
import CashFlowChart from './components/CashFlowChart';
import type { CashFlowItem, CashFlowTabState, CashFlowSummary, CashFlowChartData } from './types';

export default function CashFlowTab() {
  const [items, setItems] = useState<CashFlowItem[]>([]);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [projectionMonths, setProjectionMonths] = useState(12);

  const {
    isSaving,
    isLoading,
    error,
    lastSaved,
    fileName,
    handleSave,
    handleLoad,
    clearError
  } = useCalculatorSaveLoad<CashFlowTabState>({
    calculatorType: 'cashflow',
    onLoad: (data) => {
      setItems(data.items || []);
      setOpeningBalance(data.openingBalance || 0);
      setProjectionMonths(data.projectionMonths || 12);
    },
  });

  // Handler for 'New' button
  const handleNew = () => {
    setItems([]);
    setOpeningBalance(0);
    setProjectionMonths(12);
  };

  const handleItemsUpdate = useCallback((newItems: CashFlowItem[]) => {
    setItems(newItems);
  }, []);

  // Prepare chart data
  const chartData = useMemo<CashFlowChartData[]>(() => {
    const months = Array.from({ length: projectionMonths }, (_, i) => i + 1);
    let runningBalance = openingBalance;
    let cumulativeInflows = 0;
    let cumulativeOutflows = 0;

    return months.map(month => {
      let monthlyInflow = 0;
      let monthlyOutflow = 0;

      // Calculate cash flows for this month
      items.forEach(item => {
        // Check if this item applies to the current month
        const monthsSinceStart = month - 1; // 0-based
        if (monthsSinceStart < (item.startMonth || 0)) return;
        if (item.endMonth !== undefined && monthsSinceStart > item.endMonth) return;

        // Calculate amount based on frequency
        let monthlyAmount = 0;
        if (item.frequency === 'monthly') {
          monthlyAmount = item.amount;
        } else if (item.frequency === 'quarterly' && monthsSinceStart % 3 === 0) {
          monthlyAmount = item.amount / 3; // Split quarterly amount over 3 months
        } else if (item.frequency === 'annually' && monthsSinceStart % 12 === 0) {
          monthlyAmount = item.amount / 12; // Split annual amount over 12 months
        }

        if (item.type === 'inflow') {
          monthlyInflow += monthlyAmount;
        } else {
          monthlyOutflow += monthlyAmount;
        }
      });

      const netCashFlow = monthlyInflow - monthlyOutflow;
      runningBalance += netCashFlow;
      cumulativeInflows += monthlyInflow;
      cumulativeOutflows += monthlyOutflow;

      return {
        month,
        balance: parseFloat(runningBalance.toFixed(2)),
        inflows: parseFloat(monthlyInflow.toFixed(2)),
        outflows: parseFloat(monthlyOutflow.toFixed(2)),
        cumulativeInflows: parseFloat(cumulativeInflows.toFixed(2)),
        cumulativeOutflows: parseFloat(cumulativeOutflows.toFixed(2)),
        runningBalance: parseFloat(runningBalance.toFixed(2)),
        isNegative: runningBalance < 0
      };
    });
  }, [items, openingBalance, projectionMonths]);

  // Calculate summary metrics
  const summary = useMemo<CashFlowSummary>(() => {
    const monthlyInflows = items
      .filter(item => item.type === 'inflow')
      .map(item => {
        let multiplier = 1;
        if (item.frequency === 'quarterly') multiplier = 1/4; // Per month
        if (item.frequency === 'annually') multiplier = 1/12; // Per month
        return item.amount * multiplier;
      });

    const monthlyOutflows = items
      .filter(item => item.type === 'outflow')
      .map(item => {
        let multiplier = 1;
        if (item.frequency === 'quarterly') multiplier = 1/4; // Per month
        if (item.frequency === 'annually') multiplier = 1/12; // Per month
        return item.amount * multiplier;
      });

    const totalMonthlyInflow = monthlyInflows.reduce((sum, amount) => sum + amount, 0);
    const totalMonthlyOutflow = monthlyOutflows.reduce((sum, amount) => sum + amount, 0);
    const netMonthlyCashFlow = totalMonthlyInflow - totalMonthlyOutflow;
    
    // Calculate running balance for the projection period
    let runningBalance = openingBalance;
    let minBalance = runningBalance;
    let maxBalance = runningBalance;
    let monthsNegative = 0;
    let monthsPositive = 0;

    for (let i = 0; i < projectionMonths; i++) {
      runningBalance += netMonthlyCashFlow;
      minBalance = Math.min(minBalance, runningBalance);
      maxBalance = Math.max(maxBalance, runningBalance);
      
      if (runningBalance < 0) {
        monthsNegative++;
      } else {
        monthsPositive++;
      }
    }

    const burnRate = Math.max(0, -netMonthlyCashFlow);
    const monthsOfRunway = burnRate > 0 ? Math.max(0, openingBalance) / burnRate : Infinity;

    return {
      totalInflows: totalMonthlyInflow * projectionMonths,
      totalOutflows: totalMonthlyOutflow * projectionMonths,
      netCashFlow: netMonthlyCashFlow * projectionMonths,
      endingBalance: runningBalance,
      minBalance,
      maxBalance,
      avgMonthlyInflow: totalMonthlyInflow,
      avgMonthlyOutflow: totalMonthlyOutflow,
      burnRate,
      monthsOfRunway: isFinite(monthsOfRunway) ? monthsOfRunway : 0,
      monthsNegativeBalance: monthsNegative,
      monthsPositiveBalance: monthsPositive
    };
  }, [items, openingBalance, projectionMonths]);

  // Prepare data for saving
  const saveData = useCallback((): CashFlowTabState => ({
    items,
    openingBalance,
    projectionMonths,
  }), [items, openingBalance, projectionMonths]);
  
  const handleSaveClick = useCallback(() => {
    return handleSave(saveData());
  }, [handleSave, saveData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cash Flow Calculator</h1>
          <p className="text-muted-foreground">
            Project your business's cash inflows and outflows over time
          </p>
        </div>
        <SaveLoadControls
          isSaving={isSaving}
          isLoading={isLoading}
          onSave={handleSaveClick}
          onLoad={handleLoad}
          onNew={handleNew}
          lastSaved={lastSaved}
          fileName={fileName}
        />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error?.message || String(error)}</AlertDescription>
          <button 
            onClick={clearError}
            className="ml-auto text-sm font-medium hover:underline"
          >
            Dismiss
          </button>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="projection-months">Projection Period (Months)</Label>
                  <Select
                    value={projectionMonths.toString()}
                    onValueChange={(value) => setProjectionMonths(Number(value))}
                  >
                    <SelectTrigger id="projection-months" className="mt-1">
                      <SelectValue placeholder="Select months" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                      <SelectItem value="24">24 Months</SelectItem>
                      <SelectItem value="36">36 Months</SelectItem>
                      <SelectItem value="60">60 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <CashFlowForm
            onUpdate={handleItemsUpdate}
            openingBalance={openingBalance}
            onOpeningBalanceChange={setOpeningBalance}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Cash Flow Summary</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Inflows</p>
                  <p className="text-xl font-semibold text-green-600">
                    {summary.totalInflows.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Outflows</p>
                  <p className="text-xl font-semibold text-red-600">
                    {summary.totalOutflows.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Net Monthly Cash Flow</p>
                  <div className="flex items-center">
                    {summary.netCashFlow >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600 mr-1" />
                    )}
                    <p
                      className={`text-xl font-semibold ${
                        summary.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {summary.netCashFlow.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                {chartData.length > 0 && (
                  <div className="mt-6">
                    <CashFlowChart data={chartData} />
                  </div>
                )}
                {summary.netCashFlow < 0 && (
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">Monthly Burn Rate</p>
                    <p className="text-lg font-semibold">
                      {summary.burnRate.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {summary.monthsOfRunway === Infinity
                        ? 'Infinite runway with positive cash flow'
                        : `Approx. ${Math.round(summary.monthsOfRunway * 10) / 10} months of runway`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Include all sources of income and expenses, even if they're not monthly.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Update your cash flow projection regularly to reflect changes in your business.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Aim to maintain at least 3-6 months of operating expenses in cash.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
