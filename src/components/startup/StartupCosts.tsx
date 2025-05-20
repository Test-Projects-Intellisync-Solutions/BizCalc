import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/lib/toast';
import StartupCostEstimator from '@/components/tools/calculators/StartupCostEstimator';
import FileStatusIndicator from '@/components/common/FileStatusIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, FileText, FilePlus } from 'lucide-react';

type FileHandleRef = FileSystemFileHandle | null;

interface CostData {
  businessType: string;
  items: Array<{
    id: string;
    name: string;
    amount: number;
    category: string;
    isOneTime: boolean;
  }>;
}

export default function StartupCosts() {
  const toast = useToast();
  const [fileName, setFileName] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fileHandleRef = useRef<FileHandleRef>(null);
  const { success, error: showError } = toast;

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
    // Reset the file input if it exists
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
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
      // Get the current data from the StartupCostEstimator
      // In a real implementation, you would get this from your state or ref
      const data: CostData = {
        businessType: 'retail', // Default or get from state
        items: [], // Get actual items from your component state
      };

      const jsonString = JSON.stringify(data, null, 2);
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
  }, [isFileSystemAccessSupported, toast]);

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
      
      // Validate the file contents
      const data = JSON.parse(contents) as CostData;
      
      // In a real implementation, you would validate the data structure here
      // and update your component state with the loaded data
      
      // Update UI state
      fileHandleRef.current = fileHandle;
      setFileName(file.name);
      setLastSaved(new Date());
      
      toast.success('Success', 'File loaded successfully');
      
      return data;
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error opening file:', err);
        const error = new Error('Failed to open file');
        setError(error);
        showError('Error', error.message);
      }
      return null;
    }
  }, [isFileSystemAccessSupported, toast]);

  // Fallback for browsers that don't support the File System Access API
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const contents = await file.text();
      const data = JSON.parse(contents) as CostData;
      
      // In a real implementation, you would validate the data structure here
      // and update your component state with the loaded data
      
      // Update UI state
      setFileName(file.name);
      setLastSaved(new Date());
      
      toast.success('Success', 'File loaded successfully');
      
      return data;
    } catch (err) {
      console.error('Error reading file:', err);
      const error = new Error('Failed to read file');
      setError(error);
      showError('Error', error.message);
      return null;
    }
  }, [success, showError]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewFile}
            className="gap-2"
          >
            <FilePlus className="h-4 w-4" />
            New
          </Button>
          
          {isFileSystemAccessSupported ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenFile}
              className="gap-2"
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
            error={error}
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
          <CardTitle>Startup Cost Estimator</CardTitle>
          {fileName && (
            <p className="text-sm text-muted-foreground">
              {fileName} • {lastSaved ? `Last saved: ${lastSaved.toLocaleString()}` : 'Not saved yet'}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <StartupCostEstimator />
        </CardContent>
      </Card>
    </div>
  );
}