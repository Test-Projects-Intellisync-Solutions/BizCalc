import React from 'react';
import { Button } from '../button';
import { Download, Upload } from 'lucide-react';

// Suite (Comprehensive Calculators)
type SuiteCalculatorType =
  | 'cashflow'           // Comprehensive cash flow analysis
  | 'profitability'      // In-depth profitability analysis
  | 'projections'        // Financial projections
  | 'ratios'             // Financial ratios
  | 'startupCostEstimator'; // Comprehensive startup cost calculator

// Tools (Simplified Calculators)
type ToolCalculatorType =
  | 'breakEven'        // Break-even analysis
  | 'burnRate'         // Burn rate calculator
  | 'cashFlowForecast' // Simplified cash flow forecasting
  | 'leaseVsBuy'       // Lease vs. buy analysis
  | 'loan'             // Loan calculator
  | 'profitMargin'     // Profit margin calculator
  | 'roi'              // Return on investment
  | 'salary'           // Salary calculations
  | 'simpleStartupCost'  // Simplified startup cost calculator (moved to tools)
  | 'valuation';       // Business valuation

type CalculatorType = SuiteCalculatorType | ToolCalculatorType;

type ExportData = {
  type: CalculatorType;
  data: Record<string, unknown>;
  timestamp: string;
  version: string;
};

interface ImportExportProps {
  /**
   * The type of calculator. Use SuiteCalculatorType for comprehensive calculators
   * and ToolCalculatorType for simplified tools.
   */
  calculatorType: CalculatorType;
  currentData: Record<string, unknown>;
  onImport?: (data: Record<string, unknown>) => void;
  className?: string;
}

/**
 * A component for importing and exporting calculator data.
 * Supports both comprehensive suite calculators and simplified tools.
 */
export const ImportExport: React.FC<ImportExportProps> = ({
  calculatorType,
  currentData,
  onImport,
  className = '',
}) => {
  const handleExport = () => {
    const exportData: ExportData = {
      type: calculatorType,
      data: currentData,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileName = `${calculatorType}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const importedData: ExportData = JSON.parse(result);
        
        // Validate the imported data
        if (importedData.type !== calculatorType) {
          alert(`This file is for ${importedData.type} calculator, but you're in ${calculatorType} calculator`);
          return;
        }
        
        if (onImport) {
          onImport(importedData.data);
        }
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Invalid file format. Please import a valid JSON file.');
      }
    };
    
    reader.readAsText(file);
    // Reset the input value to allow re-importing the same file
    event.target.value = '';
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleExport}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
      
      <input
        type="file"
        id="import-file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => document.getElementById('import-file')?.click()}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Import
      </Button>
    </div>
  );
};
