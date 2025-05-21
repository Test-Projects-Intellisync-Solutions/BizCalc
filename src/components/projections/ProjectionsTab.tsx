import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import GuideCard from '@/components/ui/guide-card';
import RevenueForm, { type RevenueStream } from './RevenueForm';
import ExpenseForm, { type Expense } from './ExpenseForm';
import ProjectionChart from './ProjectionChart';
import SaveLoadControls from '@/components/common/SaveLoadControls';
import { useToast } from '@/lib/toast';
import type { FileSystemFileHandle } from '@/types/file-system-access';
import type { ProjectionData } from '@/types/projections';

export default function ProjectionsTab() {
  const toast = useToast();
  const { success, error: showError } = toast;
  const fileHandleRef = useRef<FileSystemFileHandle | null>(null);

  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [projectionMonths, setProjectionMonths] = useState(12);
  const [fileName, setFileName] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleRevenueUpdate = (streams: RevenueStream[]) => {
    setRevenueStreams(streams);
  };

  const handleExpenseUpdate = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
  };

  const calculateTotals = () => {
    const totalRevenue = revenueStreams.reduce((sum, stream) => sum + stream.baseAmount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.type === 'fixed' ? expense.amount : 0), 0);
    const netCashFlow = totalRevenue - totalExpenses;

    return { totalRevenue, totalExpenses, netCashFlow };
  };

  const { totalRevenue, totalExpenses, netCashFlow } = calculateTotals();

  const handleNewFile = useCallback(() => {
    setFileName('Untitled.json');
    setLastSaved(null);
    fileHandleRef.current = null;
    setRevenueStreams([]);
    setExpenses([]);
    success('New file created');
  }, [success]);

  const handleSave = useCallback(async () => {
    if (!window?.showSaveFilePicker) {
      showError('Error', 'File System Access API is not supported in your browser.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const projectionData: ProjectionData = {
        revenues: revenueStreams,
        expenses: expenses
      };
      const jsonString = JSON.stringify(projectionData, null, 2);
      let fileHandle = fileHandleRef.current;

      if (!fileHandle) {
        try {
          fileHandle = await window.showSaveFilePicker({
            suggestedName: 'projections.json',
            types: [{
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] },
            }],
          }) as FileSystemFileHandle;
          fileHandleRef.current = fileHandle;
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') return;
          throw err;
        }
      }

      const writable = await fileHandle.createWritable();
      await writable.write(jsonString);
      await writable.close();

      setFileName(fileHandle.name);
      setLastSaved(new Date());
      success('File saved successfully');
    } catch (err) {
      console.error('Error saving file:', err);
      const error = err instanceof Error ? err : new Error('Failed to save file');
      setError(error);
      showError('Error', error.message);
    } finally {
      setIsSaving(false);
    }
  }, [revenueStreams, expenses, showError, success]);

  const handleLoad = useCallback(async () => {
    if (!window?.showOpenFilePicker) {
      showError('Error', 'File System Access API is not supported in your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        }],
      });
      const file = await fileHandle.getFile();
      const text = await file.text();
      const loadedData = JSON.parse(text) as ProjectionData;

      // Validate the loaded data structure
      if (!loadedData.revenues || !loadedData.expenses || 
          !Array.isArray(loadedData.revenues) || !Array.isArray(loadedData.expenses)) {
        throw new Error('Invalid file format');
      }

      setRevenueStreams(loadedData.revenues);
      setExpenses(loadedData.expenses);
      fileHandleRef.current = fileHandle;
      setFileName(file.name);
      setLastSaved(new Date());
      success('File loaded successfully');
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error opening file:', err);
        const error = new Error('Failed to open file');
        setError(error);
        showError('Error', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [showError, success]);

  return (
    <div className="space-y-6">
      <SaveLoadControls
        onNew={handleNewFile}
        onSave={handleSave}
        onLoad={handleLoad}
        isSaving={isSaving}
        isLoading={isLoading}
        lastSaved={lastSaved}
        fileName={fileName}
      />
      <GuideCard
        title="Revenue & Expense Projections Guide"
        steps={[
          {
            title: "Add Revenue Streams",
            description: "Enter each source of revenue and its expected growth pattern"
          },
          {
            title: "Input Expenses",
            description: "Add fixed and variable costs that your business will incur"
          },
          {
            title: "Set Projection Period",
            description: "Choose how far into the future you want to project (3-24 months)"
          },
          {
            title: "Analyze Trends",
            description: "Review the projected financial performance and adjust assumptions"
          }
        ]}
        interpretations={[
          {
            title: "Revenue Growth",
            description: "Upward trend indicates business expansion, flat or declining needs attention"
          },
          {
            title: "Expense Patterns",
            description: "Watch for expense growth outpacing revenue growth - may indicate scaling issues"
          },
          {
            title: "Net Cash Flow",
            description: "Positive and growing indicates healthy business model, negative suggests need for changes"
          }
        ]}
      />
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

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueForm onUpdate={handleRevenueUpdate} />
        <ExpenseForm onUpdate={handleExpenseUpdate} />
      </div>

      <ProjectionChart
        revenueStreams={revenueStreams}
        expenses={expenses}
        months={projectionMonths}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netCashFlow.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-2">{error.message}</div>
      )}
    </div>
  );
}