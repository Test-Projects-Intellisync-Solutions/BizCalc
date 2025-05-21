/**
 * File operations for saving and loading calculator states
 * Provides a unified interface for file operations with browser compatibility fallbacks
 */

// Types for our saved files
export interface CalculatorSaveData<T = unknown> {
  version: string;
  calculatorType: string;
  lastSaved: string;
  data: T;
}

// Type that's compatible with both our needs and FileSystemFileHandle
export type FileHandle = {
  readonly name: string;
  getFile: () => Promise<File>;
  createWritable?: () => Promise<{
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
  }>;
  // Additional properties to match FileSystemFileHandle
  isSameEntry?: (other: any) => boolean;
  kind?: 'file' | 'directory';
};

export type FileHandler = {
  fileHandle: FileHandle | null;
  name: string;
};



// Supported file extensions
export const CALCULATOR_FILE_EXTENSION = '.bizcalc';

/**
 * Checks if the File System Access API is available in the current browser
 */
export const isFileSystemAccessAPISupported = () => {
  return 'showSaveFilePicker' in window && 'showOpenFilePicker' in window;
};

/**
 * Saves data to a file using the File System Access API with fallback
 * @param data The data to save
 * @param filename Suggested filename (without extension)
 * @param fileHandle Optional file handle for overwriting existing files
 */
export const saveToFile = async <T>(
  data: T,
  calculatorType: string,
  filename: string,
  fileHandle?: FileHandle | null
): Promise<FileHandler> => {
  const saveData: CalculatorSaveData<T> = {
    version: '1.0',
    calculatorType,
    lastSaved: new Date().toISOString(),
    data,
  };

  const blob = new Blob([JSON.stringify(saveData, null, 2)], {
    type: 'application/json',
  });

  try {
    if (isFileSystemAccessAPISupported() && !fileHandle) {
      // Use File System Access API for better UX in supported browsers
      const handle = await window.showSaveFilePicker?.({
        suggestedName: `${filename}${CALCULATOR_FILE_EXTENSION}`,
        types: [
          {
            description: 'BusinessOne Calculator',
            accept: { 'application/json': [CALCULATOR_FILE_EXTENSION] },
          },
        ],
      });
      
      if (!handle) {
        throw new Error('File save was cancelled');
      }

      if (handle.createWritable) {
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        // Fallback for browsers with limited File System Access API
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = handle.name;
        a.click();
        URL.revokeObjectURL(url);
      }

      return { fileHandle: handle, name: handle.name };
    } else if (fileHandle?.createWritable) {
      // Overwrite existing file
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      return { fileHandle, name: fileHandle.name };
    } else {
      // Fallback for browsers without File System Access API
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const downloadName = `${filename}${CALCULATOR_FILE_EXTENSION}`;
      a.download = downloadName;
      a.click();
      URL.revokeObjectURL(url);
      return { name: downloadName, fileHandle: null };
    }
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file');
  }
};

/**
 * Loads data from a file
 */
export const loadFromFile = async <T>(): Promise<{
  data: T;
  fileHandle: FileHandle | null;
  fileName: string;
  calculatorType: string;
}> => {
  try {
    if (isFileSystemAccessAPISupported()) {
      // Use File System Access API if available
      const handles = await window.showOpenFilePicker?.({
        types: [
          {
            description: 'BusinessOne Calculator',
            accept: { 'application/json': [CALCULATOR_FILE_EXTENSION] },
          },
        ],
        multiple: false,
      }) || [];
      
      if (handles.length === 0) {
        throw new Error('No file selected');
      }
      
      const handle = handles[0];
      const file = await handle.getFile();
      const content = await file.text();
      
      try {
        const parsedContent = JSON.parse(content);
        validateSaveData(parsedContent);
        
        // Type assertion after validation
        const result = parsedContent as CalculatorSaveData<T>;

        return {
          data: result.data,
          fileHandle: handle,
          fileName: file.name,
          calculatorType: result.calculatorType,
        };
      } catch (err) {
        throw new Error('Invalid file format');
      }
    } else {
      // Fallback for browsers without File System Access API
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = CALCULATOR_FILE_EXTENSION;

        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return reject(new Error('No file selected'));

          try {
            const content = await file.text();
            const parsedContent = JSON.parse(content);
            validateSaveData(parsedContent);
            
            // Type assertion after validation
            const result = parsedContent as CalculatorSaveData<T>;

            resolve({
              data: result.data,
              fileHandle: null,
              fileName: file.name,
              calculatorType: result.calculatorType,
            });
          } catch (error) {
            reject(error instanceof Error ? error : new Error('Failed to load file'));
          }
        };

        input.click();
      });
    }
  } catch (error) {
    console.error('Error loading file:', error);
    throw new Error('Failed to load file');
  }
};

/**
 * Validates the structure of the loaded save data
 */
function validateSaveData<T>(data: unknown): asserts data is CalculatorSaveData<T> {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid file format: expected an object');
  }
  
  const saveData = data as Record<string, unknown>;
  
  if (!saveData.version || !saveData.calculatorType || !saveData.lastSaved || !saveData.data) {
    throw new Error('Invalid save file: missing required fields');
  }
  
  if (typeof saveData.version !== 'string' || typeof saveData.calculatorType !== 'string') {
    throw new Error('Invalid save file: version and calculatorType must be strings');
  }

};

/**
 * Generates a default filename based on calculator type and current date
 */
export const generateDefaultFilename = (calculatorType: string): string => {
  const date = new Date().toISOString().split('T')[0];
  const typeName = calculatorType
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Convert camelCase to kebab-case
    .toLowerCase();
  return `${typeName}-${date}`;
};
