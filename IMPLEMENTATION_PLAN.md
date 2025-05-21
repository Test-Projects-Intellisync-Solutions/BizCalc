# Implementation Plan: Local File Save/Load for BusinessOne Calculators

## Phase 1: Core Infrastructure Setup

### 1. Create Shared Utilities
- [ ] Create `src/utils/fileOperations.ts` with:
  - File type definitions
  - Common save/load functions
  - Error handling
  - Browser compatibility checks

### 2. Implement Base Save/Load Hooks
- [ ] Create `src/hooks/useCalculatorSaveLoad.ts` with:
  - `useCalculatorSaveLoad` custom hook
  - File handling logic
  - State management for save/load status

## Phase 2: Calculator Integration

---

## Canonical Save/Load UI Components (Styling & Usage)

**These components must be used everywhere save/load controls or file status indicators are needed. Do not modify their styling or structure.**

### SaveLoadControls.tsx
```tsx
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Save, FolderOpen } from 'lucide-react';

interface SaveLoadControlsProps<T> {
  onSave: () => Promise<void>;
  onLoad: () => Promise<T | undefined>;
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
  className?: string;
}

const SaveLoadControls = <T,>({
  onSave,
  onLoad,
  isSaving,
  isLoading,
  lastSaved,
  className = ''
}: SaveLoadControlsProps<T>) => {
  const formatLastSaved = (date: Date | null): string => {
    if (!date) return 'Never saved';
    return `Last saved: ${date.toLocaleString()}`;
  };

  return (
    <div className={`save-load-controls ${className}`}>
      <ButtonGroup variant="outline" size="sm" className="mr-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSave}
              disabled={isSaving || isLoading}
              size="sm"
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save to file</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onLoad}
              disabled={isSaving || isLoading}
              size="sm"
              className="flex items-center gap-1"
            >
              <FolderOpen className="h-4 w-4" />
              <span>{isLoading ? 'Loading...' : 'Load'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Load from file</p>
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
      <span className="text-xs text-gray-500">
        {formatLastSaved(lastSaved)}
      </span>
    </div>
  );
};

export default SaveLoadControls;
```

### FileStatusIndicator.tsx
```tsx
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, AlertCircle, Clock, Save } from 'lucide-react';

interface FileStatusIndicatorProps {
  fileName: string | null;
  lastSaved: Date | null;
  isSaving: boolean;
  error: Error | null;
  className?: string;
}

const FileStatusIndicator: React.FC<FileStatusIndicatorProps> = ({
  fileName,
  lastSaved,
  isSaving,
  error,
  className = ''
}) => {
  const formatLastSaved = (date: Date | null): string => {
    if (!date) return 'Not saved yet';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`inline-flex items-center gap-3 rounded-md bg-muted/40 px-3 py-1.5 text-sm ${className}`}>
      {isSaving ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
          <span>Saving...</span>
        </div>
      ) : error ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Error saving</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{error.message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : lastSaved ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Saved {formatLastSaved(lastSaved)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Last saved: {lastSaved.toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>No file loaded</span>
        </div>
      )}

      {fileName && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="text-muted-foreground/50">•</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex max-w-[200px] items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                  <Save className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
                  <span className="truncate">{fileName}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{fileName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default FileStatusIndicator;
```

---

### 1. Update StartupCostEstimator
- [ ] Add save/load buttons to UI
- [ ] Implement state serialization/deserialization
- [ ] Add error handling and user feedback

### 2. Create Reusable Components
- [ ] `SaveLoadControls.tsx` - Standardized save/load buttons
- [ ] `FileStatusIndicator.tsx` - Shows save status/last modified time

## Phase 3: Export Features

### 1. PDF Export
- [ ] Add `jspdf` and `html2canvas` to project
- [ ] Create PDF template for calculator results
- [ ] Implement PDF generation function

### 2. CSV Export
- [ ] Add CSV generation for data-heavy calculators
- [ ] Include relevant metadata

## Phase 4: Testing & Refinement

### 1. Cross-Browser Testing
- [ ] Test in Chrome, Firefox, Safari, Edge
- [ ] Implement fallbacks for unsupported browsers

### 2. User Experience
- [ ] Add loading states
- [ ] Implement error boundaries
- [ ] Add success/error toasts

## Phase 5: Documentation & Rollout

### 1. Create User Guide
- [ ] Add "How to Save/Load" section to docs
- [ ] Create tooltips for save/load buttons

### 2. Implementation in Other Calculators
- [ ] Apply same pattern to other calculator components
- [ ] Ensure consistent UX across all tools

## Technical Implementation Details

### File Structure
```
src/
  components/
    common/
      SaveLoadControls.tsx
      FileStatusIndicator.tsx
  hooks/
    useCalculatorSaveLoad.ts
  utils/
    fileOperations.ts
    exportUtils.ts
```

### Dependencies to Add
```bash
npm install jspdf html2canvas file-saver
```

## Progress Tracking

### Completed Tasks
- [x] Created implementation plan document
- [x] Created `src/utils/fileOperations.ts` with core file handling logic
- [x] Created `src/hooks/useCalculatorSaveLoad.ts` with custom hook for save/load functionality
- [x] Created reusable UI components:
  - [x] `SaveLoadControls.tsx` - Standardized save/load buttons
  - [x] `FileStatusIndicator.tsx` - Shows save status and file info
- [x] Created `calculatorState.ts` with utility functions for state management
- [x] Successfully implemented and tested the pattern in:
  - [x] `BurnRate.tsx` (Startup section)
  - [x] `BurnRateCalculator.tsx` (Tools section)
  - [x] `StartupCostEstimator.tsx` (Pilot implementation)

### In Progress
- [ ] Update remaining calculators with the new save/load pattern

### Tools Needing Save/Load Implementation

#### Main Interface Tools
These tools are part of the main interface and should include Save/Load functionality:

**Startup Section**
- [x] `BurnRate.tsx` - Implemented
- [ ] `StartupCosts.tsx` - Partially implemented, needs final review

**Tools Section**
- [x] `BurnRateCalculator.tsx` - Implemented
- [x] `StartupCostEstimator.tsx` - Implemented
- [x] `CashFlowTab.tsx` - Implemented save/load functionality with error handling and UI integration
- [ ] `ProfitabilityTab.tsx` - In progress
- [x] `ProjectionsTab.tsx` - Implemented unified save/load functionality for both revenue and expense data
- [ ] `RatiosTab.tsx` - Needs implementation

**Revenue & Expenses**
- [x] Combined revenue and expense projections into a unified save/load system in `ProjectionsTab.tsx`
- [x] Created `ProjectionData` type for combined data structure
- [x] Implemented error handling and validation for projection data

**Financial Analysis**
- [ ] `BreakEvenAnalysis.tsx` - Needs implementation
- [ ] `FinancialForecast.tsx` - Needs implementation

#### Drawer Tools (Excluded)
These tools are in the drawer and should NOT include Save/Load controls:
- `BreakEvenCalculator.tsx`
- `CashFlowForecast.tsx`
- `LeaseVsBuyCalculator.tsx`
- `LoanCalculator.tsx`
- `ProfitMarginCalculator.tsx`
- `RoiCalculator.tsx`
- `SalaryCalculator.tsx`
- `ValuationCalculator.tsx`

### Implementation Scope
Only the following tools require the Save/Load pattern:
1. Tools in the main interface that need persistent state
2. Tools where users need to save and load their work
3. Tools that handle complex calculations or data entry

Drawer tools are simpler, single-purpose calculators that don't require state persistence.

### Implementation Pattern
Each calculator should follow this pattern:
1. Import required components and hooks:
   ```tsx
   import SaveLoadControls from '@/components/common/SaveLoadControls';
   import FileStatusIndicator from '@/components/common/FileStatusIndicator';
   import { useCalculatorSaveLoad } from '@/hooks/useCalculatorSaveLoad';
   ```

2. Set up state management for the calculator's data

3. Implement the save/load handlers using the custom hook

4. Add the UI components in the header section:
   ```tsx
   <div className="flex justify-between items-center mb-4">
     <h2>Calculator Title</h2>
     <div className="flex items-center gap-2">
       <SaveLoadControls 
         onSave={handleSave}
         onLoad={handleLoad}
         isSaving={isSaving}
         isLoading={isLoading}
       />
       <FileStatusIndicator 
         fileName={fileName}
         lastSaved={lastSaved}
         isSaving={isSaving}
       />
     </div>
   </div>
   ```

### Next Steps
1. Complete the implementation in the remaining calculators
2. Add comprehensive tests for each calculator
3. Update documentation with the new patterns
4. Create a style guide for future calculator development
5. Consider adding automated tests for the save/load functionality
6. Consider applying the unified save/load pattern to other related components (like CashFlow + Profitability)
7. Roll out to other calculators in batches:
   - Batch 1: Loan, ROI, and Valuation Calculators
   - Batch 2: BreakEven and ProfitMargin Calculators
   - Batch 3: BurnRate, LeaseVsBuy, and Salary Calculators

---
### Recent Updates
- 2025-05-21: Implemented unified save/load functionality in ProjectionsTab.tsx
  - Combined revenue and expense data saving
  - Added validation for loaded data
  - Improved UX by eliminating need for separate saves

Last Updated: 2025-05-21
