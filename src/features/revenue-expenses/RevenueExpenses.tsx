import { useState, useCallback, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/lib/toast';
import { RevenueForm } from './components/RevenueForm';
import { ExpenseForm } from './components/ExpenseForm';
import { ProjectionChart } from './components/ProjectionChart';
import { ProjectionSummary } from './components/ProjectionSummary';
import { RevenueStream, Expense, ProjectionData, ProjectionSummary as ProjectionSummaryType } from './types';

interface RevenueExpensesProps {
  onSave?: (data: ProjectionData) => void;
  onLoad?: () => Promise<ProjectionData | null>;
  onNew?: () => void;
  className?: string;
}

export function RevenueExpenses({ onSave, onLoad, onNew, className = '' }: RevenueExpensesProps) {
  const { success, error: showError } = useToast();
  
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([
    {
      id: 'revenue1',
      name: 'Primary Revenue',
      baseAmount: 0,
      growthType: 'fixed',
      growthRate: 0,
    },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      name: 'Operating Expenses',
      type: 'fixed',
      amount: 0,
      frequency: 'monthly',
    },
  ]);

  const [projectionMonths, setProjectionMonths] = useState(12);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Calculate summary values
  const summary = useMemo<ProjectionSummaryType>(() => {
    const totalRevenue = revenueStreams.reduce((sum, stream) => sum + stream.baseAmount, 0);
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + (expense.type === 'fixed' ? expense.amount : 0),
      0
    );
    const netCashFlow = totalRevenue - totalExpenses;

    return { totalRevenue, totalExpenses, netCashFlow };
  }, [revenueStreams, expenses]);

  // Handle save/load operations if callbacks are provided
  const handleSave = useCallback(async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      await onSave({ revenues: revenueStreams, expenses });
      success('Projection saved successfully');
    } catch (err) {
      console.error('Error saving projection:', err);
      const error = err instanceof Error ? err : new Error('Failed to save projection');
      setError(error);
      showError('Error', error.message);
    } finally {
      setIsSaving(false);
    }
  }, [onSave, revenueStreams, expenses, success, showError]);

  const handleLoad = useCallback(async () => {
    if (!onLoad) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await onLoad();
      if (data) {
        setRevenueStreams(data.revenues);
        setExpenses(data.expenses);
        success('Projection loaded successfully');
      }
    } catch (err) {
      console.error('Error loading projection:', err);
      const error = err instanceof Error ? err : new Error('Failed to load projection');
      setError(error);
      showError('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [onLoad, success, showError]);

  const handleNew = useCallback(() => {
    if (onNew) {
      onNew();
    } else {
      setRevenueStreams([
        {
          id: '1',
          name: 'Primary Revenue',
          baseAmount: 0,
          growthType: 'fixed',
          growthRate: 0,
        },
      ]);
      setExpenses([
        {
          id: '1',
          name: 'Operating Expenses',
          type: 'fixed',
          amount: 0,
          frequency: 'monthly',
        },
      ]);
      success('New projection created');
    }
  }, [onNew, success]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Save/Load Controls */}
      {(onSave || onLoad || onNew) && (
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="space-x-2">
            {onNew && (
              <button
                onClick={handleNew}
                disabled={isSaving || isLoading}
                className="px-4 py-2 text-sm font-medium rounded-md bg-background hover:bg-background/90 disabled:opacity-50"
              >
                New
              </button>
            )}
            {onLoad && (
              <button
                onClick={handleLoad}
                disabled={isSaving || isLoading}
                className="px-4 py-2 text-sm font-medium rounded-md bg-background hover:bg-background/90 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Load'}
              </button>
            )}
          </div>
          {onSave && (
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      )}

      {/* Projection Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Revenue & Expense Projections</h2>
        <div className="flex items-center gap-4">
          <Label>Projection Period</Label>
          <Select
            value={projectionMonths.toString()}
            onValueChange={(value) => setProjectionMonths(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
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

      {/* Summary Cards */}
      <ProjectionSummary summary={summary} />

      {/* Revenue and Expense Forms */}
      <div className="grid gap-6 md:grid-cols-2">
        <RevenueForm 
          onUpdate={setRevenueStreams} 
          initialStreams={revenueStreams} 
        />
        <ExpenseForm 
          onUpdate={setExpenses} 
          initialExpenses={expenses} 
        />
      </div>

      {/* Projection Chart */}
      <ProjectionChart 
        revenueStreams={revenueStreams} 
        expenses={expenses} 
        months={projectionMonths} 
      />

      {/* Error Display */}
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md">
          <p className="font-medium">Error</p>
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
}

export default RevenueExpenses;
