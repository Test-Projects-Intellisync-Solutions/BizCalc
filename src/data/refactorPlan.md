# Refactoring Plan: feedbackRules.ts and feedbackUtils.ts

## 1. Goal

To improve modularity and maintainability of the feedback system by splitting `feedbackRules.ts` and potentially `feedbackUtils.ts` into smaller, calculator-specific files. This will make it easier to manage and update feedback logic for individual calculators.

## 2. Affected Files and Directories

*   **Existing Files to Modify:**
    *   `src/data/feedbackRules.ts`
    *   `src/utils/feedbackUtils.ts`
*   **New Directories to Create:**
    *   `src/data/feedbackRules/` (for calculator-specific rule files)
    *   `src/utils/feedbackUtils/` (for calculator-specific utility functions, if identified)
*   **New Files to Create (Examples):**
    *   `src/data/feedbackRules/cashflowFeedbackRules.ts`
    *   `src/data/feedbackRules/profitabilityFeedbackRules.ts`
    *   ... (for projections, ratios, startupcost)
    *   `src/utils/feedbackUtils/cashflowFeedbackUtils.ts` (if applicable)
    *   ... (if applicable for other calculators)

## 3. Refactoring Steps

### Phase 1: Setup & Planning
1.  **Create `refactorPlan.md`**: This document. (Completed)
2.  **Create new directories**:
    *   `src/data/feedbackRules/`
    *   `src/utils/feedbackUtils/` (if deemed necessary after inspecting `feedbackUtils.ts`)
3.  **Update `TASK.md`**: Add a new task entry for this refactoring effort.

### Phase 2: Refactor `src/data/feedbackRules.ts`
For each calculator (`cashflow`, `profitability`, `projections`, `ratios`, `startupcost`):
1.  **Create Calculator-Specific Rule File**:
    *   Create a new file, e.g., `src/data/feedbackRules/cashflowFeedbackRules.ts`.
2.  **Migrate Rules**:
    *   Identify all `FeedbackRule` objects in the main `src/data/feedbackRules.ts` that pertain to the specific calculator (e.g., by checking the `calculatorType` property or naming conventions of rule IDs).
    *   Move these `FeedbackRule` definitions into the newly created calculator-specific file.
    *   Export an array of these rules from the new file (e.g., `export const cashflowFeedbackRules: FeedbackRule[] = [...];`).
3.  **Import & Consolidate in Main `feedbackRules.ts`**:
    *   In `src/data/feedbackRules.ts`, remove the rule definitions that were moved.
    *   Import the exported rule arrays from each new calculator-specific file.
    *   Aggregate these imported arrays into the main `allFeedbackRules` array (or equivalent master list).
    *   Ensure all shared types (`FeedbackRule`, `FeedbackItem`, `CalculatorType`, `FeedbackSeverity`, `FeedbackImpact`, etc.) remain exported from `src/data/feedbackRules.ts` or are moved to a dedicated types file and re-exported if they are used across the application.

### Phase 3: Refactor `src/utils/feedbackUtils.ts`
1.  **Analyze `src/utils/feedbackUtils.ts`**:
    *   Carefully review the functions within `src/utils/feedbackUtils.ts`.
    *   Identify any functions that are exclusively used for a single calculator's feedback logic or operate on data structures unique to one calculator.
2.  **If Calculator-Specific Utilities Exist**:
    *   For each calculator with specific utility functions:
        *   Create a new file, e.g., `src/utils/feedbackUtils/cashflowFeedbackUtils.ts`.
        *   Move the identified calculator-specific utility functions into this new file.
        *   Export these functions.
    *   Update the main `src/utils/feedbackUtils.ts`:
        *   If these functions were previously exported from `src/utils/feedbackUtils.ts` and are used elsewhere, import and re-export them.
        *   If they are internal helpers, update the main feedback generation functions in `src/utils/feedbackUtils.ts` to import them from their new locations.
3.  **If No Calculator-Specific Utilities**:
    *   If all functions in `src/utils/feedbackUtils.ts` are generic and applicable to multiple calculators, no file splitting will be necessary for this part. The file will remain as is, containing shared feedback utility functions.
    *   However, import paths within `feedbackUtils.ts` might need updates if types it depends on (from `feedbackRules.ts`) are restructured.

### Phase 4: Verification and Cleanup
1.  **Type Checking**: Ensure the entire project compiles without TypeScript errors.
2.  **Functional Testing**:
    *   Thoroughly test each calculator.
    *   Verify that contextual feedback is generated correctly for various inputs and business types.
    *   Confirm that all feedback rules are being applied as expected.
3.  **Code Review**: Review changes for clarity, correctness, and adherence to project conventions.
4.  **Update `TASK.md`**: Mark the refactoring task and its sub-tasks as completed.

## 4. Considerations

*   **Shared Types**: Decide on a consistent location for shared types like `FeedbackRule`, `FeedbackItem`, `CalculatorType`. They could remain in `src/data/feedbackRules.ts` and be re-exported, or moved to a dedicated `src/types/feedbackTypes.ts` or similar. For now, assume they remain accessible via `src/data/feedbackRules.ts`.
*   **Import Paths**: Diligently update all import paths in affected files.

