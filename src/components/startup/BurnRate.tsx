import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/lib/toast';
import SaveLoadControls from '@/components/common/SaveLoadControls';
import type { FileSystemFileHandle } from '@/types/file-system-access';

// Define the data structure for the burn rate calculator
export interface BurnRateData {
  availableCapital: number;
  monthlyExpenses: number;
  lastSaved?: string;
}

export default function BurnRate() {
  const toast = useToast();
  const [data, setData] = useState<BurnRateData>({
    availableCapital: 0,
    monthlyExpenses: 0
  });
  const [fileName, setFileName] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const fileHandleRef = useRef<FileSystemFileHandle | null>(null);
  const { success, error: showError } = toast;
  
  const { availableCapital, monthlyExpenses } = data;

  const handleCapitalChange = (value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (isNaN(numValue)) return;
    setData(prev => ({ ...prev, availableCapital: numValue }));
  };

  const handleExpensesChange = (value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (isNaN(numValue)) return;
    setData(prev => ({ ...prev, monthlyExpenses: numValue }));
  };

  const calculateRunway = () => {
    if (monthlyExpenses === 0) return '∞';
    const months = availableCapital / monthlyExpenses;
    return months.toFixed(1);
  };

  // Create a new file
  const handleNewFile = useCallback(() => {
    setFileName('Untitled.json');
    setLastSaved(null);
    fileHandleRef.current = null;
    setData({
      availableCapital: 0,
      monthlyExpenses: 0
    });
    success('New file created');
  }, [success]);

  // Save file using File System Access API
  const handleSave = useCallback(async () => {
    if (!window?.showSaveFilePicker) {
      showError('Error', 'File System Access API is not supported in your browser.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const jsonString = JSON.stringify(data, null, 2);
      let fileHandle = fileHandleRef.current;

      if (!fileHandle) {
        try {
          fileHandle = await window.showSaveFilePicker({
            suggestedName: 'burn-rate.json',
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
  }, [data, showError, success]);

  // Load file using File System Access API
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
        multiple: false,
      }) as unknown as FileSystemFileHandle[];
      
      const file = await fileHandle.getFile();
      const contents = await file.text();
      
      // Parse and validate the file contents
      const loadedData = JSON.parse(contents) as BurnRateData;
      
      // Validate the loaded data
      if (!loadedData || typeof loadedData !== 'object') {
        throw new Error('Invalid file format');
      }
      
      if (typeof loadedData.availableCapital !== 'number' || 
          typeof loadedData.monthlyExpenses !== 'number') {
        throw new Error('Invalid data format: missing or invalid numeric fields');
      }
      
      // Update state with the loaded data
      setData(loadedData);
      fileHandleRef.current = fileHandle;
      setFileName(file.name);
      setLastSaved(new Date());
      success('File loaded successfully');
      return loadedData;
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error opening file:', err);
        const error = new Error('Failed to open file');
        setError(error);
        showError('Error', error.message);
      }
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [showError, success]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const runway = monthlyExpenses > 0 ? availableCapital / monthlyExpenses : 0;
  const isLowRunway = runway < 6 && monthlyExpenses > 0;
  const runwayDate = monthlyExpenses > 0 
    ? new Date(Date.now() + (availableCapital / monthlyExpenses) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    : '';

  return (
    <div className="space-y-4">
      <SaveLoadControls
        onNew={handleNewFile}
        onSave={handleSave}
        onLoad={handleLoad}
        isSaving={isSaving}
        isLoading={isLoading}
        lastSaved={lastSaved}
        fileName={fileName}
      />
      <Card>
        <CardHeader>
          <CardTitle>Burn Rate Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="block">Available Capital</Label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-muted-foreground">$</span>
                <Input
                  id="capital"
                  type="number"
                  min="0"
                  value={availableCapital || ''}
                  onChange={(e) => handleCapitalChange(e.target.value)}
                  placeholder="0"
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="block">Monthly Expenses</Label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-muted-foreground">$</span>
                <Input
                  id="expenses"
                  type="number"
                  min="0"
                  value={monthlyExpenses || ''}
                  onChange={(e) => handleExpensesChange(e.target.value)}
                  placeholder="0"
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Runway Analysis</h3>
            
            {isLowRunway && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Your runway is less than 6 months. Consider reducing expenses or securing additional funding.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Monthly Burn Rate</p>
                <p className="text-xl font-semibold mt-1">
                  {formatCurrency(monthlyExpenses)}
                </p>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Available Capital</p>
                <p className="text-xl font-semibold mt-1">
                  {formatCurrency(availableCapital)}
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/10 p-4 rounded-lg md:col-span-2">
                <p className="text-sm font-medium text-primary">Runway</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {monthlyExpenses > 0 ? calculateRunway() : '∞'} months
                </p>
                {monthlyExpenses > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Will last until {runwayDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {error && (
        <div className="text-red-500 text-sm mt-2">{error.message}</div>
      )}
    </div>
  );
}