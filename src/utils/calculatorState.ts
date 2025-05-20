/**
 * Utility functions for serializing and deserializing calculator state
 */

/**
 * Validates that the loaded data matches the expected structure
 */
export function validateCalculatorState<T>(
  data: unknown,
  requiredFields: (keyof T)[]
): data is T {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check if all required fields exist and have values
  return requiredFields.every(field => {
    const fieldName = field as string;
    return fieldName in data && data[fieldName as keyof typeof data] !== undefined;
  });
}

/**
 * Creates a function to handle saving calculator state
 */
export function createSaveHandler<T>(
  getState: () => T,
  calculatorType: string,
  saveToFile: (data: T, calculatorType: string, filename: string, fileHandle?: any) => Promise<{ name: string; fileHandle: any }>,
  onSuccess?: (fileName: string) => void,
  onError?: (error: Error) => void
) {
  return async (customFilename?: string) => {
    try {
      const state = getState();
      const defaultFilename = `${calculatorType.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
      
      const result = await saveToFile(
        state,
        calculatorType,
        customFilename || defaultFilename,
        undefined // Let the saveToFile function handle file handle management
      );
      
      onSuccess?.(result.name);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to save file');
      onError?.(err);
      throw err;
    }
  };
}

/**
 * Creates a function to handle loading calculator state
 */
export function createLoadHandler<T>(
  loadFromFile: <T>() => Promise<{ data: T; fileHandle: any; fileName: string; calculatorType: string }>,
  requiredFields: (keyof T)[], 
  onLoad: (data: T) => void,
  onError?: (error: Error) => void
) {
  return async () => {
    try {
      const result = await loadFromFile<T>();
      
      // Validate the loaded data
      if (!validateCalculatorState<T>(result.data, requiredFields)) {
        throw new Error('Invalid file format: Missing required fields');
      }
      
      onLoad(result.data);
      return result.data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to load file');
      onError?.(err);
      throw err;
    }
  };
}

/**
 * Helper to generate a default filename based on calculator type and current date
 */
export function generateDefaultFilename(calculatorType: string, suffix: string = ''): string {
  const date = new Date().toISOString().split('T')[0];
  const typeName = calculatorType
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Convert camelCase to kebab-case
    .toLowerCase()
    .replace(/\s+/g, '-');
  
  return `${typeName}${suffix ? `-${suffix}` : ''}-${date}`;
}
