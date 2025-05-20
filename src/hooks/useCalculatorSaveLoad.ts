import { useState, useCallback } from 'react';
import { 
  saveToFile, 
  loadFromFile, 
  generateDefaultFilename,
  type FileHandler
} from '../utils/fileOperations'; 

interface UseCalculatorSaveLoadOptions<T> {
  calculatorType: string;
  onLoad?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseCalculatorSaveLoadReturn<T> {
  isSaving: boolean;
  isLoading: boolean;
  error: Error | null;
  lastSaved: Date | null;
  fileName: string | null;
  handleSave: (data: T, customFilename?: string) => Promise<void>;
  handleLoad: () => Promise<T | undefined>;
  clearError: () => void;
}

/**
 * A custom hook that provides save and load functionality for calculator components
 * @param options Configuration options including calculator type and callbacks
 * @returns An object containing save/load handlers and state
 */
export function useCalculatorSaveLoad<T>({
  calculatorType,
  onLoad,
  onError,
}: UseCalculatorSaveLoadOptions<T>): UseCalculatorSaveLoadReturn<T> {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileHandler, setFileHandler] = useState<FileHandler | null>(null);

  const handleError = useCallback(
    (err: unknown) => {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      console.error('File operation error:', error);
      setError(error);
      onError?.(error);
      return error;
    },
    [onError]
  );

  /**
   * Saves the current calculator state to a file
   */
  const handleSave = useCallback(
    async (data: T, customFilename?: string) => {
      setIsSaving(true);
      setError(null);

      try {
        const defaultFilename = generateDefaultFilename(calculatorType);
        
        // Use the existing file handle if available
        const currentHandle = fileHandler?.fileHandle || undefined;
        
        const result = await saveToFile(
          data,
          calculatorType,
          customFilename || defaultFilename,
          currentHandle
        );

        setLastSaved(new Date());
        setFileName(result.name);
        
        // Update the file handler with the new handle
        setFileHandler({
          fileHandle: result.fileHandle,
          name: result.name
        });
      } catch (err) {
        handleError(err);
      } finally {
        setIsSaving(false);
      }
    },
    [calculatorType, fileHandler, handleError]
  );

  /**
   * Loads calculator state from a file
   */
  const handleLoad = useCallback(async (): Promise<T | undefined> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loadFromFile<T>();
      
      // Update the file handler with the loaded file info
      setFileHandler({
        fileHandle: result.fileHandle,
        name: result.fileName
      });
      
      setFileName(result.fileName);
      setLastSaved(new Date());
      
      // Call the onLoad callback with the loaded data if provided
      if (onLoad) {
        onLoad(result.data);
      }
      
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load file');
      if (error.message !== 'The user aborted a request') {
        handleError(error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, onLoad]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSaving,
    isLoading,
    error,
    lastSaved,
    fileName,
    handleSave,
    handleLoad,
    clearError,
  };
}

export default useCalculatorSaveLoad;
