import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileText, FilePlus, Save } from 'lucide-react';
import { toast } from 'sonner';
import FileStatusIndicator from '@/components/common/FileStatusIndicator';
import type { FileSystemFileHandle } from '@/types/file-system-access';

// Check if the File System Access API is supported
const isFileSystemAccessSupported = 
  typeof window !== 'undefined' && 
  'showSaveFilePicker' in window && 
  'showOpenFilePicker' in window;

// Define the data structure for the burn rate calculator
export interface BurnRateData {
  availableCapital: number;
  monthlyExpenses: number;
  lastSaved?: string;
}

export default function BurnRate() {
  const [data, setData] = useState<BurnRateData>({
    availableCapital: 0,
    monthlyExpenses: 0
  });
  const [fileName, setFileName] = useState<string>('Untitled.json');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileHandleRef = useRef<FileSystemFileHandle | null>(null);
  
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

  // Save file using File System Access API
  const handleSave = useCallback(async () => {
    if (typeof window === 'undefined' || !window.showSaveFilePicker) {
      toast.error('File System Access API is not supported in your browser.');
      return;
    }

    setIsSaving(true);

    try {
      const fileData = {
        ...data,
        lastSaved: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(fileData, null, 2)], { type: 'application/json' });
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        }],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();

      fileHandleRef.current = fileHandle;
      setFileName(fileHandle.name);
      setLastSaved(new Date());
      toast.success('File saved successfully');
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error saving file:', err);
        toast.error('Failed to save file. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  }, [data, fileName]);

  // Load file using File System Access API
  const handleLoad = useCallback(async (): Promise<BurnRateData | undefined> => {
    if (typeof window === 'undefined' || !window.showOpenFilePicker) {
      toast.error('File System Access API is not supported in your browser.');
      return;
    }

    setIsLoading(true);

    try {
      const fileHandles = await window.showOpenFilePicker({
        multiple: false,
        types: [{
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        }],
      });
      
      const fileHandle = fileHandles[0];
      const file = await fileHandle.getFile();
      const contents = await file.text();
      
      const loadedData = JSON.parse(contents);
      
      // Validate the loaded data
      if (!loadedData || typeof loadedData !== 'object') {
        throw new Error('Invalid file format');
      }

      const validatedData: BurnRateData = {
        availableCapital: Number(loadedData.availableCapital) || 0,
        monthlyExpenses: Number(loadedData.monthlyExpenses) || 0,
      };

      fileHandleRef.current = fileHandle;
      setFileName(file.name);
      setData(validatedData);
      setLastSaved(loadedData.lastSaved ? new Date(loadedData.lastSaved) : new Date());
      toast.success('File loaded successfully');
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error loading file:', err);
        toast.error('Failed to load file. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle file input change for browsers without File System Access API
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      const contents = await file.text();
      const loadedData = JSON.parse(contents);
      
      // Validate the loaded data
      if (!loadedData || typeof loadedData !== 'object') {
        throw new Error('Invalid file format');
      }

      const validatedData: BurnRateData = {
        availableCapital: Number(loadedData.availableCapital) || 0,
        monthlyExpenses: Number(loadedData.monthlyExpenses) || 0,
      };

      setData(validatedData);
      setFileName(file.name);
      setLastSaved(loadedData.lastSaved ? new Date(loadedData.lastSaved) : new Date());
      toast.success('File loaded successfully');
    } catch (err) {
      console.error('Error loading file:', err);
      toast.error('Failed to load file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setData({ availableCapital: 0, monthlyExpenses: 0 });
              setFileName('Untitled.json');
              setLastSaved(null);
              fileHandleRef.current = null;
            }}
            className="gap-2"
          >
            <FilePlus className="h-4 w-4" />
            New
          </Button>
          
          {isFileSystemAccessSupported ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoad}
              className="gap-2"
              disabled={isLoading}
            >
              <FileText className="h-4 w-4" />
              Open
            </Button>
          ) : (
            <>
              <input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="gap-2"
                disabled={isLoading}
              >
                <FileText className="h-4 w-4" />
                Open
              </Button>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <FileStatusIndicator 
            fileName={fileName}
            lastSaved={lastSaved}
            isSaving={isSaving}
            error={null}
          />
          <Button 
            variant="outline"
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className={`h-4 w-4 ${isSaving ? 'animate-pulse' : ''}`} />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Burn Rate Calculator</CardTitle>
          {fileName && (
            <p className="text-sm text-muted-foreground">
              {fileName} • {lastSaved ? `Last saved: ${lastSaved.toLocaleString()}` : 'Not saved yet'}
            </p>
          )}
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
    </div>
  );
}