import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SaveLoadControls from '@/components/common/SaveLoadControls';
import type { CostData, CostItem } from '@/features/tools/startup-cost-estimator/StartupCostEstimator';
import { StartupCostsForm } from './components/StartupCostsForm';
import { StartupCostsChart } from './components/StartupCostsChart';
import { StartupCostsSummary } from './components/StartupCostsSummary';

type FileHandleRef = FileSystemFileHandle | null;

const DEFAULT_COST_DATA: CostData = {
  businessType: 'retail',
  items: [
    { id: '1', name: 'Business Registration', amount: 500, category: 'Legal', isOneTime: true },
    { id: '2', name: 'Equipment', amount: 5000, category: 'Equipment', isOneTime: true },
    { id: '3', name: 'Rent Deposit', amount: 3000, category: 'Facilities', isOneTime: true },
    { id: '4', name: 'Initial Inventory', amount: 10000, category: 'Inventory', isOneTime: true },
    { id: '5', name: 'Website', amount: 2000, category: 'Marketing', isOneTime: true },
    { id: '6', name: 'Rent', amount: 1500, category: 'Facilities', isOneTime: false },
    { id: '7', name: 'Utilities', amount: 500, category: 'Facilities', isOneTime: false },
    { id: '8', name: 'Insurance', amount: 300, category: 'Insurance', isOneTime: false },
    { id: '9', name: 'Marketing', amount: 1000, category: 'Marketing', isOneTime: false },
    { id: '10', name: 'Employee Salaries', amount: 5000, category: 'Staffing', isOneTime: false },
  ]
};

export default function StartupCosts() {
  const toast = useToast();
  const [fileName, setFileName] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [costData, setCostData] = useState<CostData>(DEFAULT_COST_DATA);
  const costDataRef = useRef<CostData>(costData);
  const fileHandleRef = useRef<FileHandleRef>(null);
  const { success, error: showError } = toast;
  const [error, setError] = useState<Error | null>(null);

  // Keep the ref in sync with state
  useEffect(() => {
    costDataRef.current = costData;
  }, [costData]);

  // Check if the File System Access API is supported
  const isFileSystemAccessSupported =
    typeof window !== 'undefined' &&
    'showSaveFilePicker' in window &&
    'showOpenFilePicker' in window;

  // Create a new file
  const handleNewFile = useCallback(() => {
    setFileName('Untitled.json');
    setLastSaved(null);
    fileHandleRef.current = null;
    setCostData(DEFAULT_COST_DATA);
    success('New file created');
  }, [success]);

  // Update cost data when it changes
  const handleDataChange = useCallback((newData: CostData) => {
    setCostData((prevData: CostData) => {
      // Preserve the business type if it's not being updated
      const updatedData = {
        ...newData,
        businessType: newData.businessType || (prevData?.businessType || 'retail')
      };
      return updatedData as CostData;
    });
    // Update last saved time when data changes
    setLastSaved(new Date());
  }, []);

  // Save file using File System Access API
  const handleSave = useCallback(async () => {
    if (!isFileSystemAccessSupported) {
      showError('Error', 'File System Access API is not supported in your browser.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Use the ref to ensure we have the latest data
      const currentData = costDataRef.current;
      const jsonString = JSON.stringify(currentData, null, 2);
      let fileHandle = fileHandleRef.current;

      // If we don't have a file handle, show the file picker
      if (!fileHandle && window.showSaveFilePicker) {
        try {
          fileHandle = await window.showSaveFilePicker({
            suggestedName: 'startup-costs.json',
            types: [{
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] },
            }],
          }) as unknown as FileSystemFileHandle; // Type assertion for File System Access API
          fileHandleRef.current = fileHandle;
        } catch (err) {
          // User cancelled the save dialog
          if (err instanceof Error && err.name === 'AbortError') {
            return;
          }
          throw err;
        }
      } else if (!fileHandle) {
        throw new Error('File System Access API not supported');
      }

      // Write the file
      const writable = await fileHandle.createWritable();
      await writable.write(jsonString);
      await writable.close();

      // Update UI state
      setFileName(fileHandle.name);
      const currentTime = new Date();
      setLastSaved(currentTime);

      success('File saved successfully');
    } catch (err) {
      console.error('Error saving file:', err);
      const error = err instanceof Error ? err : new Error('Failed to save file');
      setError(error);
      showError('Error', error.message);
    } finally {
      setIsSaving(false);
    }
  }, [isFileSystemAccessSupported, showError, success]);

  // Open an existing file
  const handleOpenFile = useCallback(async () => {
    if (!isFileSystemAccessSupported) {
      showError('Error', 'File System Access API is not supported in your browser.');
      return;
    }

    if (!window.showOpenFilePicker) {
      throw new Error('File System Access API not supported');
    }

    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        }],
        multiple: false,
      }) as unknown as FileSystemFileHandle[]; // Type assertion for File System Access API
      
      const file = await fileHandle.getFile();
      const contents = await file.text();
      
      // Parse and validate the file contents
      const data = JSON.parse(contents) as CostData;
      
      // Validate the loaded data
      if (!data || typeof data !== 'object' || !Array.isArray(data.items)) {
        throw new Error('Invalid file format: missing or invalid items array');
      }
      
      // Ensure all required fields are present
      const oneTimeTotal = data.items
        .filter((item: { isOneTime: boolean; amount: number }) => item.isOneTime)
        .reduce((sum: number, item: { amount: number }) => sum + item.amount, 0);

      const monthlyTotal = data.items
        .filter((item: { isOneTime: boolean }) => !item.isOneTime)
        .reduce((sum: number, item: { amount: number }) => sum + item.amount, 0);

      const annualTotal = monthlyTotal * 12;

      const validatedData: CostData = {
        businessType: data.businessType || 'retail',
        items: data.items.map(item => ({
          id: item.id || Date.now().toString(),
          name: item.name || 'Unnamed Item',
          amount: typeof item.amount === 'number' ? item.amount : 0,
          category: item.category || 'Other',
          isOneTime: !!item.isOneTime
        }))
      };
      
      // Update state with the loaded data
      setCostData(validatedData);
      fileHandleRef.current = fileHandle;
      setFileName(file.name);
      setLastSaved(new Date());
      success('File loaded successfully');
      return validatedData;
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error opening file:', err);
        const error = new Error('Failed to open file');
        setError(error);
        showError('Error', error.message);
      }
      return null;
    }
  }, [isFileSystemAccessSupported, showError, success]);

  // Calculate totals for the summary and chart
  const oneTimeCosts = costData.items
    .filter(item => item.isOneTime)
    .reduce((total, item) => total + item.amount, 0);
    
  const monthlyCosts = costData.items
    .filter(item => !item.isOneTime)
    .reduce((total, item) => total + item.amount, 0);
    
  const sixMonthOperating = monthlyCosts * 6;
  const totalStartupCosts = oneTimeCosts + sixMonthOperating;
  
  // Prepare category data for the chart
  const categories = [...new Set(costData.items.map(item => item.category))];
  const categoryData = categories.map(category => ({
    name: category,
    value: costData.items
      .filter(item => item.category === category)
      .reduce((total, item) => item.isOneTime 
        ? total + item.amount 
        : total + (item.amount * 6), 0)
  })).sort((a, b) => b.value - a.value);

  // Handle adding a new item
  const handleAddItem = useCallback(() => {
    const newItem = {
      id: Date.now().toString(),
      name: 'New Item',
      amount: 0,
      category: 'Other',
      isOneTime: true
    };
    
    const updatedItems = [...costData.items, newItem];
    handleDataChange({ ...costData, items: updatedItems });
  }, [costData, handleDataChange]);

  // Handle removing an item
  const handleRemoveItem = useCallback((id: string) => {
    const updatedItems = costData.items.filter(item => item.id !== id);
    handleDataChange({ ...costData, items: updatedItems });
  }, [costData, handleDataChange]);

  // Handle item field changes
  const handleItemChange = useCallback((id: string, field: keyof CostItem, value: any) => {
    const updatedItems = costData.items.map(item => 
      item.id === id 
        ? { ...item, [field]: field === 'amount' ? parseFloat(value) || 0 : value }
        : item
    );
    handleDataChange({ ...costData, items: updatedItems });
  }, [costData, handleDataChange]);

  // Apply a business template
  const handleTemplateApply = useCallback((type: string) => {
    // The actual template logic is now in the StartupCostEstimator component
    // This just forwards the event to update the business type
    handleDataChange({ ...costData, businessType: type });
  }, [costData, handleDataChange]);

  return (
    <div className="space-y-4">
      <SaveLoadControls
        onNew={handleNewFile}
        onSave={handleSave}
        onLoad={handleOpenFile}
        isSaving={isSaving}
        isLoading={false}
        lastSaved={lastSaved}
        fileName={fileName}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Startup Cost Estimator</CardTitle>
          {fileName && (
            <p className="text-sm text-muted-foreground">
              {fileName} • {lastSaved ? `Last saved: ${lastSaved.toLocaleString()}` : 'Not saved yet'}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <StartupCostsForm
            businessType={costData.businessType}
            items={costData.items}
            onBusinessTypeChange={(type) => handleDataChange({ ...costData, businessType: type })}
            onItemChange={handleItemChange}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onTemplateApply={handleTemplateApply}
          />
          
          <StartupCostsSummary 
            oneTimeCosts={oneTimeCosts}
            sixMonthOperating={sixMonthOperating}
            totalStartupCosts={totalStartupCosts}
          />
          
          <StartupCostsChart 
            oneTimeCosts={oneTimeCosts}
            sixMonthOperating={sixMonthOperating}
            categoryData={categoryData}
          />
        </CardContent>
      </Card>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}