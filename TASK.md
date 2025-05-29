# TASK.md

## Active Tasks

### 2025-05-29: Refactor Feedback System Modularity
*   **Description:** Refactor `src/data/feedbackRules.ts` and `src/utils/feedbackUtils.ts` to improve modularity by splitting rules and potentially utilities into calculator-specific files.
*   **Files Affected:** `src/data/feedbackRules.ts`, `src/utils/feedbackUtils.ts`, new files in `src/data/feedbackRules/`
*   **Sub-tasks:**
    *   [x] Create `src/data/refactorPlan.md`. (Completed 2025-05-29)
    *   [ ] Create new directory: `src/data/feedbackRules/`.
    *   [ ] Create new directory: `src/utils/feedbackUtils/` (if needed).
    *   [ ] **Refactor `src/data/feedbackRules.ts`**:
        *   [ ] Create `src/data/feedbackRules/cashflowFeedbackRules.ts` and migrate rules.
        *   [ ] Create `src/data/feedbackRules/profitabilityFeedbackRules.ts` and migrate rules.
        *   [ ] Create `src/data/feedbackRules/projectionsFeedbackRules.ts` and migrate rules.
        *   [ ] Create `src/data/feedbackRules/ratiosFeedbackRules.ts` and migrate rules.
        *   [ ] Create `src/data/feedbackRules/startupcostFeedbackRules.ts` and migrate rules.
        *   [ ] Create `src/data/feedbackRules/burnRateFeedbackRules.ts` and migrate rules.
        *   [ ] Create `src/data/feedbackRules/genericFeedbackRules.ts` for rules applicable to multiple/all calculators.
        *   [ ] Update `src/data/feedbackRules.ts` to import and consolidate all rule arrays.
    *   [ ] **Refactor `src/utils/feedbackUtils.ts`**:
        *   [ ] Analyze for calculator-specific utilities.
        *   [ ] Split if necessary and update imports/exports. (Analysis suggests likely no split needed for utils).
    *   [ ] Verify type checking and perform functional testing.
    *   [ ] Update `TASK.md` upon completion.

### 2025-05-29: Enhance Calculator Suite UI/UX and Contextual Feedback
*   **Description:** Improve features, UI, and UX of all calculators in `src/calculators/suite`. Add valuable contextual feedback specific to the user's Business Type for each calculator. Implement high-value visual cues for positive feedback and opportunities.
*   **Affected Calculators:**
    *   `cashflow`
    *   `profitability`
    *   `projections`
    *   `ratios`
    *   `burnRate`
    *   [x] Update `StartupCostTab.tsx` to use `src/data/businessTypes.ts`.
    *   [x] Reconcile business type list in `businessTypes.ts` (expanded to include all previous options) and update `applyTemplate` in `StartupCostTab.tsx` with placeholder cases for new types.
    *   [x] Add Business Type selector to `CashFlowTab.tsx` using `src/data/businessTypes.ts`.
    *   [x] Add Business Type selector to other calculators (`profitability`, `projections`, `ratios`) using `src/data/businessTypes.ts`.
    *   [x] Add Business Type selector to `BurnRate.tsx` using `src/data/businessTypes.ts`.
    *   **Phase 2: UI/UX Enhancement & Contextual Feedback (New)**
        *   [ ] **Phase 2.1: UI for Contextual Feedback - Drawer & Progress Interaction (New)**
            *   [x] **Task 1: Add/Implement Drawer Component:**
                *   [x] Investigate/choose a Drawer component (e.g., from Shadcn/ui, another library, or custom).
                *   [x] Add the selected Drawer component to `@/components/ui/` (User confirmed: Shadcn/ui Drawer added).
            *   [ ] **Task 2: Define Calculator "Completion" & Enhance Progress Interaction:**
                *   [x] For each calculator, define criteria for 100% completion (e.g., required fields filled, non-zero inputs).
                *   [x] Implement state (e.g., `isComplete` or `completionPercentage`) in `StartupCostTab.tsx`, `CashFlowTab.tsx`, `ProfitabilityTab.tsx`, `ProjectionsTab.tsx` & `BurnRate.tsx`.
                *   [x] Ensure Progress bar shows 100% when complete in `StartupCostTab.tsx`, `CashFlowTab.tsx`, `ProfitabilityTab.tsx`, `ProjectionsTab.tsx` & `BurnRate.tsx`.
                *   [x] Add a clickable element (icon button) to open the feedback drawer when complete in `StartupCostTab.tsx`, `CashFlowTab.tsx`, `ProfitabilityTab.tsx`, `ProjectionsTab.tsx` & `BurnRate.tsx`.
                *   [x] Implement state for drawer visibility in `StartupCostTab.tsx`, `CashFlowTab.tsx`, `ProfitabilityTab.tsx`, `ProjectionsTab.tsx` & `BurnRate.tsx`.
            *   [x] **Task 3: Initial Drawer Integration & Display:**
                *   [x] Pass placeholder feedback content to the Drawer in one calculator tab as an initial test.
                *   [x] Ensure the Drawer opens and closes correctly with the trigger mechanism.
        *   [ ] **Phase 2.2: Contextual Feedback System Development (was UI/UX Design & Prototyping):**
            *   [ ] Review each calculator for general layout improvements and enhanced interactivity (ongoing).
            *   [ ] Confirm contextual feedback will be displayed in the new Drawer.
            *   [ ] Consider overall user flow and consistency across calculators with the new Drawer mechanism.
        *   [x] **Phase 2.3: Contextual Feedback Logic & Data (was Contextual Feedback System Development):**
            *   [x] **Task 1: Define Feedback Data Structure:**
                *   [x] Finalize data structure for feedback rules (e.g., in `src/data/feedbackRules.ts` or similar) linking `Business Type`, `calculatorType`, specific metrics/conditions, thresholds, and feedback messages (text, severity, etc.).
            *   [x] **Task 2: Implement Core Feedback Generation Logic:**
                *   [x] Create `src/utils/feedbackUtils.ts` (or similar).
                *   [x] Implement a core function that takes calculator-specific data, `selectedBusinessType`, and potentially `calculatorType` to filter and return relevant `FeedbackItem[]` based on the defined rules.
                *   [x] Refined `generateFeedback` in `src/utils/feedbackUtils.ts` to include custom logic for `rule-startup-category-dominance`, allowing dynamic feedback generation for dominant cost categories in `StartupCostTab.tsx`. (2025-05-29)
            *   [x] **Task 3: Integrate Feedback Generation into Calculators:**
                *   [x] In each calculator, call the feedback generation logic when relevant data changes or upon completion. *(Covered by Phase 2.1 Task 2 & 3)*
                *   [x] Pass the generated `FeedbackItem[]` to the Drawer component. *(Covered by Phase 2.1 Task 2 & 3)*
            *   **Note:** Initial set of contextual feedback rules implemented in `feedbackRules.ts` for `cashflow`, `profitability`, `projections`, `ratios`, and `startupcost` calculators. Further refinements and business-type specific rules may be added.
        *   [ ] **Phase 2.4: Visual Cues & Refinements (was Visual Cues Implementation):**
            *   [x] **Identify key metrics/areas in each calculator and within the feedback drawer that would benefit from visual cues.**
                *   **Done:** Implemented display of `FeedbackItem.relevantMetrics` within the `FeedbackDrawer`. Numeric values in `relevantMetrics` are now color-coded based on feedback severity (e.g., green for 'good', red for 'critical').
                *   **Identified for Future:** Potential for visual cues (e.g., input field border colors, icons next to metrics) directly within individual calculator UIs, based on active feedback. This would be a separate implementation task.
            *   [x] **Design and implement color-coding schemes (e.g., for feedback severity in the drawer).**
                *   **Note:** Addressed by existing `FeedbackDrawer.tsx` implementation (`severityColors` for card theming).
            *   [x] **Select or create icons for feedback items or to enhance the trigger element.**
                *   **Note:** Icons for feedback items addressed by `FeedbackDrawer.tsx` (`severityIcons`). Trigger element icons handled in Phase 2.1.
            *   [x] **Explore dynamic chart highlighting or annotations based on feedback (if applicable).**
            *   [x] **Implemented visual cues for summary figures (One-Time, 6-Month Operating, Total Startup Costs) in `StartupCostTab.tsx` based on feedback severity.** (2025-05-29)
                *   **Done:** Implemented infrastructure for highlighting individual data points (e.g., monthly net cash flow) on the `ProjectionChart` in `ProjectionsTab.tsx`. This involves:
                    *   `ProjectionChart.tsx` now accepts `highlightDataPoints` prop and uses a custom dot renderer to color-code specific data points based on feedback severity.
                    *   `ProjectionsTab.tsx` derives `highlightDataPoints` from `feedbackItems` (currently expecting details in `item.relevantMetrics.chartHighlightDetails: { monthIndex, dataKey }`).
                *   **Note:** Full activation of this feature requires feedback rules in `feedbackRules.ts` for the 'projections' calculator to be updated to provide the specific `monthIndex` and `dataKey` for the data points they refer to. Other chart highlighting techniques (e.g., reference lines, custom tooltips) can be explored further if needed.
            *   [x] **Task 4: Integrate Feedback into Import/Export:**
                *   [x] **Update `ExportData` type in `ImportExport.tsx` to include `contextualFeedback` (e.g., `FeedbackItem[]`).**
                    *   **Done:** Added `feedbackItems?: FeedbackItem[]` to `ExportData` type in `src/components/ui/UIComponents/ImportExport.tsx`.
                *   [x] **Modify `handleExport` to include this data.**
                    *   **Done:** `ImportExportProps` updated with `currentFeedbackItems?: FeedbackItem[]`. `handleExport` in `ImportExport.tsx` now includes `currentFeedbackItems` in the exported JSON.
                *   [x] **Modify `handleImport` to potentially read and utilize this data.**
                    *   **Done:** `onImport` prop in `ImportExportProps` changed to `(data: Record<string, unknown>, feedbackItems?: FeedbackItem[]) => void`. `handleImport` in `ImportExport.tsx` now passes `importedData.feedbackItems`.
                    *   **Done (ProjectionsTab Example):** `ProjectionsTab.tsx` updated to pass its `feedbackItems` to `ImportExport` and its `handleImportData` now accepts and sets imported feedback, opening the drawer if feedback is present.
                    *   **Done:** `RatiosTab.tsx` updated.
                    *   **Done:** `ProfitabilityTab.tsx` updated.
                    *   **Done:** `StartupCostTab.tsx` (as `startupCosts`) updated.
                    *   **Done:** `CashflowTab.tsx` updated.
        *   [ ] **Integrate into Calculators:**
            *   [x] Update `StartupCostTab.tsx` with UI/UX improvements (visual cues for summary figures, category costs, and cost items based on feedback), and enhanced feedback system (category dominance rule). (Partially complete, ongoing for other general UI/UX if needed)
            *   [~] Update `CashFlowTab.tsx` with UI/UX improvements, feedback system, and visual cues. (Partially complete: Summary card visual cues confirmed. `CashFlowChart.tsx` enhanced for `highlightDataPoints` and default negative value coloring; `CashFlowTab.tsx` passes derived highlights. Further general UI/UX review if needed.)
            *   [x] Update `ProfitabilityTab.tsx` with UI/UX improvements, feedback system, and visual cues. (Completed: Summary card visual cues implemented. ProfitabilityChart.tsx enhanced for break-even line highlighting based on feedback; ProfitabilityTab.tsx passes derived highlights.)
                *   **ProfitabilityTab:** Implement full chart highlighting (break-even line done, profit line highlighting done).
                *   **Details:** Modified `ProfitabilityChart.tsx` to dynamically color `revenueLine`, `totalCostsLine`, and `profitLine` based on `FeedbackItem` severity via the `highlightDataPoints` prop.
                *   **Details:** Added new feedback rules to `feedbackRules.ts` (`rule-profitability-cmr-critical`, `rule-profitability-cmr-warning`, `rule-profitability-cmr-good`) to target `profitLine` based on `contributionMarginRatio`.
            *   [~] Update `ProjectionsTab.tsx` with UI/UX improvements, feedback system, and visual cues. (Partially complete: Summary card visual cues implemented. `ProjectionChart.tsx` uses `highlightDataPoints` passed from `ProjectionsTab.tsx` which are derived from `feedbackItems`. Further general UI/UX review if needed.)
            *   [x] Update `RatiosTab.tsx` with UI/UX improvements, feedback system, and visual cues. (Completed 2025-05-29)
                *   Resolved type errors for `RatioCard` status prop, implemented dynamic border styling based on feedback severity, and cleaned up related helper functions (`getSafeRatioStatusFromFeedback`, removed old `getRatioStatus`).
*   **Discovered During Work:**
    *   `PLANNING.md` and `TASK.md` were not present and have been created.
    *   `src/data` directory was created for `businessTypes.ts`.
    *   Noted discrepancy: The `businessTypes.ts` list was initially different from the full list previously hardcoded in `StartupCostTab`'s `Select` component. This has been reconciled: `businessTypes.ts` is now comprehensive, and `StartupCostTab.tsx` uses this shared list. The `applyTemplate` function has placeholder cases for the newly added types.
    *   Resolved JSX lint errors in `RatiosTab.tsx` (IDs: 8dc01901, 47d94d73, 823ded5d, 91117d0a, b3ae98a3, ef275dd7, cac9a522, 08af6dd0) related to unclosed tags after integrating Progress bar and Drawer components.

## Completed Tasks

### 2025-05-29: Performance Optimization & Code Splitting
*   **Description:** Implemented code-splitting and build optimizations to improve application performance.
*   **Changes Made:**
    *   [x] Added React.lazy and Suspense for lazy loading of calculator components
    *   [x] Implemented code-splitting for tools in `ToolsPage.tsx`
    * [x] Added loading states with visual feedback during component loading
    * [x] Configured Vite build optimizations with manual chunking
    * [x] Grouped vendor dependencies into logical chunks (React, UI components, charts, etc.)
    * [x] Increased chunk size warning limit to 1000KB
*   **Impact:**
    * Reduced initial bundle size
    * Faster page load times
    * Improved perceived performance with loading states
    * Better caching through optimized chunking strategy
